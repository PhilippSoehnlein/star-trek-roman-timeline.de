/* jshint node:true */
'use strict';

module.exports = {
    formatAuthors:       formatAuthors,
    formatSeriesEpisode: formatSeriesEpisode,
    getBookLinks:        getBookLinks,
    getSeries:           getSeries,
    transformString:     transformString,
};

var _ = require( 'lodash-node' );

function formatAuthors( authors ) {
    var lastAuthor;
    if ( authors.length > 1 ) {
        lastAuthor = authors.pop();
    }

    var authorString = authors.join(', ');
    if ( lastAuthor ) {
        authorString += ' & ' + lastAuthor;
    }

    return authorString;
}

function formatSeriesEpisode( book ) {
    if ( book.season ) {
        return book.series + ' - ' + book.season + 'x' + book.episode;
    }
    else {
        return book.series + ' #' + book.episode;
    }
}

function getBookLinks( book ) {
    var links = [];

    ['publisher', 'amazon', 'audible', 'goodreads'].forEach( function( linkType ) {
        var url = book[ linkType + 'Url' ];
        if ( url ) {
            links.push({
                url:          url,
                caption:      linkType === 'publisher' ? book.publisher : _ucFirst( linkType ),
                captionLang:  'en',
                type:         linkType,
                cssClassName: 'icon_' + transformString( linkType === 'publisher' ? book.publisher : linkType, '' ),
                hrefLang:     linkType === 'goodreads' ? 'en' : 'de',
            });
        }
    });

    return links;
}

function getSeries( books ) {
    var seriesNames = _.uniq(
        books.map( function( book ) { return book.series; } )
    );
    seriesNames.sort( function( a, b ) {
        a = a.toLowerCase();
        b = b.toLowerCase();
        if ( a > b ) {
            return 1;
        }
        else if( b < a ) {
            return -1;
        }
        else {
            return 0;
        }
    });

    var series = [];
    seriesNames.forEach( function( seriesName ) {
        var booksForThisSeries = books.filter( function( book ) { return book.series === seriesName; });
        series.push({
            id:    transformString( seriesName ),
            name:  seriesName,
            count: booksForThisSeries.length,
        });
    });

    return series;
}

function transformString( string, whiteSpaceReplacement ) {
    if ( typeof whiteSpaceReplacement === 'undefined' ) {
        whiteSpaceReplacement = '-';
    }
    return string.replace( /\s+/g, whiteSpaceReplacement ).toLowerCase();
}

function _ucFirst( string ) {
    return string.charAt( 0 ).toUpperCase() + string.substr( 1 );
}
