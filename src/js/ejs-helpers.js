/* jshint node:true */
'use strict';

var sprintf = require( 'sprintf-js' ).sprintf;
var common  = require( './lib/common.js' );

module.exports = {
    formatAuthors:             formatAuthors,
    formatPlotTimes:           formatPlotTimes,
    formatSeriesEpisode:       formatSeriesEpisode,
    getBookLinks:              getBookLinks,
    getSeries:                 getSeries,
    transformDataFilesToBooks: transformDataFilesToBooks,
    transformString:           common.transformString,
};

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
    var seriesEpisode = book.series.name;
    if ( book.season ) {
        seriesEpisode += ' - ' + book.season + 'x' + sprintf( '%02d', book.episode );
    }
    else if ( book.episode ) {
        seriesEpisode += ' #' + book.episode;
    }

    return seriesEpisode;
}

function getBookLinks( book ) {
    var links = [];

    ['publisher', 'amazon', 'audible', 'goodreads'].forEach( function( linkType ) {
        var url = book[ linkType + 'Url' ];
        if ( url ) {
            var cssClassName = common.transformString( linkType === 'publisher' ? book.publisher : linkType, '' );
            links.push({
                url:          url,
                caption:      linkType === 'publisher' ? book.publisher : _ucFirst( linkType ),
                captionLang:  'en',
                type:         linkType,
                cssClassName: 'icon_' + cssClassName,
                hrefLang:     linkType === 'goodreads' ? 'en' : 'de',
            });
        }
    });

    return links;
}

function getSeries( books ) {
    var seriesDataFor = {};
    books.forEach( function( book ) {
        if ( !seriesDataFor[ book.series.name ] ) {
            seriesDataFor[ book.series.name ] = book.series;
        }
    } );

    var series = Object.keys( seriesDataFor ).map( function( key ) {
        return seriesDataFor[ key ];
    });

    series.sort( function( a, b ) {
        a = a.name.toLowerCase();
        b = b.name.toLowerCase();
        if ( a > b ) {
            return 1;
        }
        else if( a < b ) {
            return -1;
        }
        else {
            return 0;
        }
    });

    series = series.map( function( seriesData ) {
        seriesData.id = common.transformString( seriesData.name );

        var booksForThisSeries = books.filter( function( book ) { return book.series.name === seriesData.name; });
        seriesData.count = booksForThisSeries.length;

        return seriesData;
    });



    return series;
}

function transformDataFilesToBooks( data ) {
    var books = [];

    Object.keys( data ).forEach( function( fileName ) {
        if ( fileName === 'Order' ) {
            return;
        }

        var series = data[ fileName ];

        series.books
            .map( function( book ) {
                book.series = { name: series.name };
                book.id     = common.getBookId( book, series );
                return book;
            } )
            .forEach( function( book ) { books.push( book ); } )
        ;
    } );

    if ( data.Order.length !== books.length ) {
        throw new Error( 'The amount of books (' + data.Order.length + ') in the order file '+
                         'doesn\'t match with the number of books in the data files (' + books.length + ')!' );
    }

    var sortedBooks = [];
    data.Order.forEach( function( bookId ) {
        var errorMessage;
        var booksWithThatId = books.filter( function ( book ) { return book.id === bookId; } );
        if ( booksWithThatId.length === 0 ) {
            errorMessage = 'No book with ID "' + bookId + '" found!';
        }
        else if ( booksWithThatId.length > 1 ) {
            errorMessage = booksWithThatId.length + ' books with ID "' + bookId + '" found!';
        }

        if ( errorMessage ) {
            console.error( errorMessage );
            throw new Error( errorMessage );
        }
        else {
            sortedBooks.push( booksWithThatId[0] );
        }
    } );

    return sortedBooks;
}

function formatPlotTimes( book ) {
    var primaryTime = book.plotTimes.filter( function( time ) { return time.isPrimary; } )[0];
    var allTimes    = book.plotTimes;

    if ( typeof primaryTime !== 'object' ) {
        console.error( 'No primary plot time found for book "' + book.title + '".' );
        return;
    }

    var formattedPlotTimes = {
        primary: _formatPrimaryPlotTime( primaryTime ),
        all:     _formatAllPlotTimes( allTimes ),
    };

    return formattedPlotTimes;
}

function _formatPrimaryPlotTime( plotTime ) {
    var time = plotTime.type === 'range' ? plotTime.start : plotTime;

    var value    = ( time.month ? _toGermanMonth( time.month, 'abbreviation' ) + ' ' : '' ) +
                   _toGermanYear( time.year );
    var html     = ( time.month ? _toGermanMonth( time.month, 'fullHtml'     ) + ' ' : '' ) +
                   _toGermanYear( time.year, 'fullHtml' );
    var dateTime = time.year + ( time.month ? '-' + sprintf( '%02d', time.month ) : '' );

    return {
        value:    value,
        html:     html,
        dateTime: dateTime,
    };
}

function _formatAllPlotTimes( allTimes ) {
    allTimes = allTimes
        .sort( function( a, b ) {
            if ( a.type === 'range' ) {
                a = a.start;
            }

            if ( b.type === 'range' ) {
                b = b.start;
            }

            var aSortValue = a.year + sprintf( '%02d', a.month || 1 ) + sprintf( '%02d', a.day || 1 );
            var bSortValue = b.year + sprintf( '%02d', b.month || 1 ) + sprintf( '%02d', b.day || 1 );
            if ( aSortValue < bSortValue ) {
                return -1;
            }
            else if ( aSortValue > bSortValue ) {
                return 1;
            }

            return 0;
        })
        .map( function( time ) {
            var timeStr;

            if ( time.type === 'range' ) {
                var fromStr = '';
                var toStr   = '';

                if ( time.start.day ) {
                    fromStr += sprintf( '%02d. ', time.start.day );
                }

                if ( time.end.day ) {
                    toStr += sprintf( '%02d. ', time.end.day );
                }

                if ( time.start.month &&
                     (
                        ( time.start.year === time.end.year && time.start.month !== time.end.month ) ||
                        ( time.start.year !== time.end.year )
                    )
                ) {
                    fromStr += _toGermanMonth( time.start.month, 'name' ) + ' ';
                }

                if ( time.end.month ) {
                    toStr += _toGermanMonth( time.end.month, 'name' ) + ' ';
                }

                if ( time.start.year !== time.end.year ) {
                    fromStr += _toGermanYear( time.start.year ) + ' ';
                }

                toStr += _toGermanYear( time.end.year );

                timeStr = fromStr + '- ' + toStr;
            }
            else {
                var germanYear = _toGermanYear( time.year );
                if ( time.day && time.month && time.year ) {
                    timeStr = sprintf( '%02d. ', time.day ) +
                              _toGermanMonth( time.month, 'name' ) + ' ' +
                              germanYear;
                }
                else if ( time.month ) {
                    timeStr = _toGermanMonth( time.month, 'name' ) + ' ' + germanYear;
                }
                else {
                    timeStr = germanYear + ''; // + '' = force string
                }
            }

            if ( time.isPrimary && allTimes.length > 1 ) {
                timeStr += ' (*)';
            }

            return {
                value: timeStr,
                type:  time.type,
            };
        })
    ;

    return allTimes;
}

function _toGermanMonth( monthNumber, mode ) {
    var germanMonths = [
        { name: 'Januar',    abbreviation: 'Jan.' },
        { name: 'Februar',   abbreviation: 'Feb.' },
        { name: 'März',      abbreviation: 'Mär.' },
        { name: 'April',     abbreviation: 'Apr.' },
        { name: 'Mai',       abbreviation: 'Mai' },
        { name: 'Juni',      abbreviation: 'Jun.' },
        { name: 'Juli',      abbreviation: 'Jul.' },
        { name: 'August',    abbreviation: 'Aug.' },
        { name: 'September', abbreviation: 'Sep.' },
        { name: 'Oktober',   abbreviation: 'Okt.' },
        { name: 'November',  abbreviation: 'Nov.' },
        { name: 'Dezember',  abbreviation: 'Dez.' },
    ];

    var month = germanMonths[monthNumber - 1];
    if ( mode === 'fullHtml' ) {
        if ( month.name !== month.abbreviation ) {
            return '<abbr title="' + month.name + '" class="is-abbreviation-simple">' + month.abbreviation + '</abbr>';
        }
        else {
            return month.name;
        }
    }
    else if ( mode === 'abbreviation' ) {
        return month.abbreviation;
    }
    else {
        return month.name;
    }
}

function _toGermanYear( year, mode ) {
    var germanYear;
    if ( year < 0 ) {
        germanYear = Math.abs( year ) + ' ' +
                    ( mode === 'fullHtml' ? '<abbr title="vor Christi Geburt">v. Chr.</abbr>' : 'v. Chr.' );
    }
    else {
        germanYear = year;
    }

    return germanYear;
}

function _ucFirst( string ) {
    return string.charAt( 0 ).toUpperCase() + string.substr( 1 );
}
