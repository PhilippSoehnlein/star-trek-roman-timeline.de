#!/usr/bin/env node

/* jshint node:true */
'use strict';

var fs         = require( 'fs' );
var pathHelper = require( 'path' );
var http       = require( 'http' );
var Q          = require( 'q' );
var tempHelper = require( 'tmp' );
var lwip       = require( 'lwip' );
var common     = require( '../src/js/lib/common.js' );

/* Init stuff */
var options = getOptions();
validateOptions( options );
var tempFolder = createTempFolder();

/* Read data files */
var books      = getBooks( options[ 'book-data-path' ] );
//books = [ books[0] ]; // testing only
//books = [ books[0], books[1] ]; // testing only

/* download and resize */
var promises = [];
books.forEach( function( book ) {
    var promise = downloadCover( book ).then( resizeImage );
    promises.push( promise );
} );

/* final report */
Q.allSettled( promises ).done(
    function( results ) {
        var fulfilledPromises = results.filter( function( result ) { return result.state === 'fulfilled'; } );
        var rejectedPromises  = results.filter( function( result ) { return result.state === 'rejected';  } );
        if ( rejectedPromises.length > 0 ) {
            if ( options.verbose ) {
                console.error(
                    'There were ' + rejectedPromises.length + ' errors' + ( options.verbose > 1 ? ':' : '.' )
                );
                if ( options.verbose > 1 ) {
                    console.error(
                        rejectedPromises
                            .map( function( result ) { return '\t' + result.reason; } )
                            .join( '\n' )
                    );
                }
            }
            process.exit( 1 );
        }
        else {
            if ( options.verbose ) {
                console.log( 'Done (' + fulfilledPromises.length +' covers downloaded and resized)' );
            }
            process.exit( 0 );
        }
    }
);


/*
    Here be functions
*/
function getOptions() {
    var basePath   = pathHelper.dirname( process.argv[1] );
    var scriptName = pathHelper.basename( process.argv[1] );

    return require( 'node-getopt-long' ).options(
        [
            [ 'verbose|v+',         'verbose output (can be added multiple times)' ],
            [ 'dryrun|n',           'dry run' ],
            [ 'book-data-path|b=s', 'path to where the book data files are' ],
            [ 'output-path|o=s',    'path to where the covers should be saved to' ],
            [ 'target-width|w=n',   'width in pixels of the resized images' ],
        ],
        {
            name: scriptName,
            defaults: {
                verbose:          0,
                dryrun:           false,
                'book-data-path': pathHelper.join( basePath, '..', 'src', 'books', 'live' ),
                'output-path':    pathHelper.join( basePath, '..', 'src', 'img',   'book-covers' ),
                'target-width':   60,
            }
        }
    );
}

function validateOptions( options ) {
    // validate book-data-path
    try {
        if ( !fs.statSync( options[ 'book-data-path' ] ).isDirectory() ) {
            console.error( 'The book data path ' + options[ 'book-data-path' ] + ' is not a directory.' );
            process.exit( 1 );
        }
    }
    catch ( e ) {
        if ( e.code === 'ENOENT' ) {
            console.error( 'The book data path ' + options[ 'book-data-path' ] + ' does not exist.' );
        }
        process.exit( 1 );
    }

    // validate output-path
    try {
        if ( !fs.statSync( options[ 'output-path' ] ).isDirectory() ) {
            console.error( 'The output path ' + options[ 'output-path' ] + ' is not a directory.' );
            process.exit( 1 );
        }
    }
    catch ( e ) {
        if ( e.code === 'ENOENT' ) {
            console.error( 'The output path ' + options[ 'output-path' ] + ' does not exist.' );
        }
        process.exit( 1 );
    }
}

function createTempFolder() {
    var tempFolder = tempHelper.dirSync();
    if ( options.verbose > 1 ) {
        console.log( 'Temp files will go into ' + tempFolder.name + '/.' );
    }

    return tempFolder.name;
}

function getBooks( bookPath ) {
    var books = [];

    var jsonFiles = fs.readdirSync( bookPath ).filter( function( pathEntry ) {
        return pathEntry.match( /^[^_].+\.json$/ ) ? true : false;
    } );


    jsonFiles.forEach( function( fileName ) {
        var bookSeries = require( pathHelper.join( bookPath, fileName ) );
        bookSeries.books.forEach( function( book ) {
            var finalImageFileNamePrefix = common.getBookId( book, bookSeries );

            books.push( {
                finalImageFileNamePrefix: finalImageFileNamePrefix,
                coverUrl:                 book.coverUrl,
            } );
        } );
    } );

    return books;
}

function downloadCover( book ) {
    var deferred = Q.defer();

    var onResponse = function( response ) {
        if ( options.verbose > 1 ) {
            console.log( 'Got response with status code ' + response.statusCode +
                         ' for ressource ' + response.req.path + '.' );
        }

        if ( response.statusCode !== 200 ) {
            deferred.reject(
                new Error( 'Couldn\'t download book cover from ' + book.coverUrl +
                           ', http status code was ' + response.statusCode + '.'
                )
            );
        }

        var pathToTempFile = pathHelper.join( tempFolder, book.finalImageFileNamePrefix + '.jpg' );
        var tempFile       = fs.createWriteStream( pathToTempFile );

        response.pipe( tempFile );
        tempFile.on( 'finish', function() {
            if ( options.verbose > 1 ) {
                console.log( 'Wrote downloaded file to ' + pathToTempFile + '.' );
            }

            tempFile.close( function() {
                deferred.resolve( {
                    sourceFile:       pathToTempFile,
                    targetPath:       options['output-path'],
                    targetFilePrefix: book.finalImageFileNamePrefix,
                    targetWidth:      options['target-width'],
                } );
            } );
        } );
    };

    var onError = function( e ) {
        deferred.reject(
            new Error( 'Couldn\'t download book cover from ' + book.coverUrl + '. Error was: ' + e.message )
        );
    };

    if ( options.verbose > 1 ) {
        console.log( 'Requesting ' + book.coverUrl + '…' );
    }
    http.get( book.coverUrl )
        .on( 'response', onResponse )
        .on( 'error', onError )
    ;

    return deferred.promise;
}

function resizeImage( argObj ) {
    var sourceFile       = argObj.sourceFile;
    var targetPath       = argObj.targetPath;
    var targetFilePrefix = argObj.targetFilePrefix;
    var targetWidth      = argObj.targetWidth;

    var deferred = Q.defer();
    lwip.open( sourceFile, function( err, image ) {
        if ( err ) {
            deferred.reject( err );
            return;
        }

        var scale          = ( targetWidth / ( image.width() / 100 ) ) / 100 ;
        var targetFilePath = pathHelper.join( targetPath, targetFilePrefix + '.jpg' );
        if ( options.dryrun ) {
            targetFilePath = '/dev/null';
        }

        try {
            image
                .batch()
                .scale( scale )
                .writeFile(
                    targetFilePath,
                    'jpg', // maybe it's wiser to download PNGs and let grunt create the optimized versions?
                    { quality: 60 },
                    function( err ) {
                        if ( err ) {
                            deferred.reject( err );
                        }
                        else {
                            if ( options.verbose > 1 ) {
                                console.log(
                                    'Resized image written to ' +
                                    targetFilePath + ( options.dryrun ? ' (because of dryrun)' : '' ) +
                                    '.'
                                );
                            }
                            deferred.resolve();
                        }
                    }
                )
            ;
        }
        catch( e ) {
             deferred.reject( 'Couldn\'t resize image '+ targetFilePath +'. Error message was: ' + e.message );
        }
    });

    return deferred.promise;
}
