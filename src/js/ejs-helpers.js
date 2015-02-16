/* jshint node:true */
'use strict';

module.exports = {
    formatAuthors:       formatAuthors,
    formatSeriesEpisode: formatSeriesEpisode,
    getBookLinks:        getBookLinks,
    getSeries:           getSeries,
    transformString:     transformString,
    formatPlotTimes:     formatPlotTimes,
};

var _       = require( 'lodash-node' );
var sprintf = require( 'sprintf-js' ).sprintf;

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
    // TODO: DS9 books should be formated as 8x09 e.g., because DS9 series has 10 books.
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

function formatPlotTimes( book ) {
    var primaryTime = book.plotTimes.filter( function( time ) { return  time.isPrimary; } )[0];
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

    var value    = ( time.month ? _toGermanMonth( time.month, 'abbreviation' ) + ' ' : '' ) + time.year;
    var html     = ( time.month ? _toGermanMonth( time.month, 'fullHtml'     ) + ' ' : '' ) + time.year;
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
                    toStr += sprintf( '%02d. ', time.end.day);
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
                    fromStr += time.start.year + ' ';
                }

                toStr += time.end.year;

                timeStr = fromStr + '- ' + toStr;
            }
            else {
                if ( time.day && time.month && time.year ) {
                    timeStr = sprintf( '%02d. ', time.day ) +
                              _toGermanMonth( time.month, 'name' ) + ' ' +
                              time.year;
                }
                else if ( time.month ) {
                    timeStr = _toGermanMonth( time.month, 'name' ) + ' ' + time.year;
                }
                else {
                    timeStr = time.year + ''; // + '' = force string
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

function _ucFirst( string ) {
    return string.charAt( 0 ).toUpperCase() + string.substr( 1 );
}
