/* jshint node:true */
/* global describe:true, it:true, expect:true */
'use strict';

var ejsHelpers  = require( '../../src/js/ejs-helpers.js' );

describe( 'formatAuthors()', function() {
    it( 'one author (no transformation)', function() {
        expect( ejsHelpers.formatAuthors( [ 'Author 1' ] ) ).toBe( 'Author 1' );
    });

    it( 'two authors (& separated)', function() {
        expect( ejsHelpers.formatAuthors( [ 'Author 1', 'Author 2', ] ) ).toBe( 'Author 1 & Author 2' );
    });

    it( 'three authors (, and & separated)', function() {
        expect( ejsHelpers.formatAuthors( [ 'Author 1', 'Author 2', 'Author 3' ] ) )
            .toBe( 'Author 1, Author 2 & Author 3' );
    });

    it( 'four authors (, and & separated)', function() {
        expect( ejsHelpers.formatAuthors( [ 'Author 1', 'Author 2', 'Author 3', 'Author 4', ] ) )
            .toBe( 'Author 1, Author 2, Author 3 & Author 4' );
    });
});

describe( 'formatSeriesEpisode()', function() {
    it( 'book has no season', function() {
        expect( ejsHelpers.formatSeriesEpisode( { series: { name: 'TNG Doppelhelix' }, episode: '1', season: null } ) )
            .toBe( 'TNG Doppelhelix #1' );
    });

    it( 'book has season', function() {
        expect( ejsHelpers.formatSeriesEpisode( { series: { name: 'Deep Space Nine' }, episode: '1', season: '8' } ) )
            .toBe( 'Deep Space Nine - 8x01' );
    });
});

describe( 'getBookLinks()', function() {
    it( 'empty array for books without links', function() {
        var book = {};
        expect( ejsHelpers.getBookLinks( book ) ).toEqual( [] );

        book = { publisher: 'Cross Cult', publisherUrl: null, amazonUrl: null, audibleUrl: null, goodreadsUrl: null };
        expect( ejsHelpers.getBookLinks( book ) ).toEqual( [] );
    });

    it( 'book with publisher link', function() {
        var book = { publisher: 'Cross Cult', publisherUrl: 'http://www.cross-cult.de/' };
        expect( ejsHelpers.getBookLinks( book ) ).toEqual( [
            {
                url:          'http://www.cross-cult.de/',
                type:         'publisher',
                cssClassName: 'icon_crosscult',
                caption:      'Cross Cult',
                captionLang:  'en',
                hrefLang:     'de',
            }
        ] );
    });

    it( 'book with publisher and Amazon link', function() {
        var book = {
            publisher: 'Cross Cult',
            publisherUrl: 'http://www.cross-cult.de/',
            amazonUrl: 'http://www.amazon.de/'
        };
        expect( ejsHelpers.getBookLinks( book ) ).toEqual( [
            {
                url:          'http://www.cross-cult.de/',
                type:         'publisher',
                cssClassName: 'icon_crosscult',
                caption:      'Cross Cult',
                captionLang:  'en',
                hrefLang:     'de',
            },
            {
                url:          'http://www.amazon.de/',
                type:         'amazon',
                cssClassName: 'icon_amazon',
                caption:      'Amazon',
                captionLang:  'en',
                hrefLang:     'de',
            },
        ] );
    });

    it( 'book with publisher, Amazon- and Audible-link', function() {
        var book = {
            publisher:    'Cross Cult',
            publisherUrl: 'http://www.cross-cult.de/',
            amazonUrl:    'http://www.amazon.de/',
            audibleUrl:   'http://www.audible.de/'
        };
        expect( ejsHelpers.getBookLinks( book ) ).toEqual( [
            {
                url:          'http://www.cross-cult.de/',
                type:         'publisher',
                cssClassName: 'icon_crosscult',
                caption:      'Cross Cult',
                captionLang:  'en',
                hrefLang:     'de',
            },
            {
                url:          'http://www.amazon.de/',
                type:         'amazon',
                cssClassName: 'icon_amazon',
                caption:      'Amazon',
                captionLang:  'en',
                hrefLang:     'de',
            },
            {
                url:          'http://www.audible.de/',
                type:         'audible',
                cssClassName: 'icon_audible',
                caption:      'Audible',
                captionLang:  'en',
                hrefLang:     'de',
            },
        ] );
    });

    it( 'book with publisher, Amazon-, Audible- and Goodreads-link', function() {
        var book = {
            publisher:    'Cross Cult',
            publisherUrl: 'http://www.cross-cult.de/',
            amazonUrl:    'http://www.amazon.de/',
            audibleUrl:   'http://www.audible.de/',
            goodreadsUrl: 'http://www.goodreads.com/',
        };
        expect( ejsHelpers.getBookLinks( book ) ).toEqual( [
            {
                url:          'http://www.cross-cult.de/',
                type:         'publisher',
                cssClassName: 'icon_crosscult',
                caption:      'Cross Cult',
                captionLang:  'en',
                hrefLang:     'de',
            },
            {
                url:          'http://www.amazon.de/',
                type:         'amazon',
                cssClassName: 'icon_amazon',
                caption:      'Amazon',
                captionLang:  'en',
                hrefLang:     'de',
            },
            {
                url:          'http://www.audible.de/',
                type:         'audible',
                cssClassName: 'icon_audible',
                caption:      'Audible',
                captionLang:  'en',
                hrefLang:     'de',
            },
            {
                url:          'http://www.goodreads.com/',
                type:         'goodreads',
                cssClassName: 'icon_goodreads',
                caption:      'Goodreads',
                captionLang:  'en',
                hrefLang:     'en',
            },
        ] );
    });
});

describe( 'getSeries()', function() {
    var exampleBooks = [
        { series: { name: 'TNG Doppelhelix' } },
        { series: { name: 'Deep Space Nine' } },
        { series: { name: 'TNG Doppelhelix' } },
    ];

    it( 'delivers unique series', function() {
        var series = ejsHelpers.getSeries( exampleBooks );
        expect( series.length ).toBe( 2 );
    });

    it( 'delivers series in alphabetical order', function() {
        var series = ejsHelpers.getSeries( exampleBooks );
        expect( series.length ).toBe( 2 );
        expect( series[0].name ).toBe( 'Deep Space Nine' );
        expect( series[1].name ).toBe( 'TNG Doppelhelix' );
    });

    it( 'delivers series with IDs', function() {
        var series = ejsHelpers.getSeries( exampleBooks );
        expect( typeof series[0].id ).toBe( 'string' );
    });

    it( 'delivers series with correct counts', function() {
        var series = ejsHelpers.getSeries( exampleBooks );
        expect( series.length ).toBe( 2 );
        expect( series[0].count ).toBe( 1 );
        expect( series[1].count ).toBe( 2 );
    });
});


describe( 'transformString()', function() {
    it( 'transforms well', function() {
        expect( ejsHelpers.transformString( 'Deep Space Nine' ) ).toBe( 'deep-space-nine' );
    });

    it( 'transforms well with custom whitespace replacement', function() {
        expect( ejsHelpers.transformString( 'Deep Space Nine', '+' ) ).toBe( 'deep+space+nine' );
    });
});

describe( 'transformDataFilesToBooks()', function() {
    var testDataFromDataFiles = {
        Order:          require( '../../src/books/test/_order.json' ),
        deepSpaceNine:  require( '../../src/books/test/deep_space_nine.json' ),
        filmromane:     require( '../../src/books/test/filmromane.json' ),
        tngDoppelhelix: require( '../../src/books/test/tng_doppelhelix.json' ),
    };

    it( 'should return an array of books', function() {
        var books = ejsHelpers.transformDataFilesToBooks( testDataFromDataFiles );
        expect( books instanceof Array    ).toBe( true );
        expect( typeof books[0].title     ).toBe( 'string' );
        expect( typeof books[0].publisher ).toBe( 'string' );
    });

    it( 'should insert the series into books', function() {
        var books = ejsHelpers.transformDataFilesToBooks( testDataFromDataFiles );
        expect( typeof books[0].series.name ).toBe( 'string' );
    });

    it( 'should consider order array', function() {
        // create a copy of the test files
        var changedTestDataFromDataFiles = JSON.parse( JSON.stringify( testDataFromDataFiles ) );

        // switch first two books
        var tmp = changedTestDataFromDataFiles.Order[0];
        changedTestDataFromDataFiles.Order[0] = changedTestDataFromDataFiles.Order[1];
        changedTestDataFromDataFiles.Order[1] = tmp;

        // run and compare
        var books = ejsHelpers.transformDataFilesToBooks( changedTestDataFromDataFiles );
        expect( books[0].id === testDataFromDataFiles[1] );
        expect( books[1].id === testDataFromDataFiles[0] );
    } );
});

describe( 'formatPlotTimes()', function() {
    var abbrClass = 'is-abbreviation-simple';
    describe( 'primary plot time', function() {
        it( 'should return a primary point in time with a year and no month', function() {
            var plotTime = ejsHelpers.formatPlotTimes(
                { plotTimes: [ { type: 'point', year: 2100, month: null, day: null, isPrimary: true } ] }
            );
            expect( plotTime.primary.dateTime ).toBe( '2100' );
            expect( plotTime.primary.html     ).toBe( '2100' );
            expect( plotTime.primary.value    ).toBe( '2100' );
        });

        it( 'should return a primary point in time with a year and a month', function() {
            var plotTime = ejsHelpers.formatPlotTimes(
                { plotTimes: [ { type: 'point', year: 2100, month: 1, day: null, isPrimary: true } ] }
            );
            expect( plotTime.primary.dateTime ).toBe( '2100-01' );
            expect( plotTime.primary.html     ).toBe( '<abbr title="Januar" class="' + abbrClass + '">Jan.</abbr> 2100' );
            expect( plotTime.primary.value    ).toBe( 'Jan. 2100' );
        });

        it( 'should return a primary point in time with a year, a month and a day in "all"', function() {
            var plotTime = ejsHelpers.formatPlotTimes(
                { plotTimes: [ { type: 'point', year: 2100, month: 1, day: 2, isPrimary: true } ] }
            );
            expect( plotTime.primary.dateTime ).toBe( '2100-01' );
            expect( plotTime.primary.html     ).toBe( '<abbr title="Januar" class="' + abbrClass + '">Jan.</abbr> 2100' );
            expect( plotTime.primary.value    ).toBe( 'Jan. 2100' );
        });

        it( 'should return a primary point in time for ranges with a year and no month', function() {
            var plotTime = ejsHelpers.formatPlotTimes(
                { plotTimes: [ {
                    type:      'range',
                    isPrimary: true,
                    start:     { year: 2100, month: null, day: null, },
                    end:       { year: 2101, month: null, day: null, },
                } ] }
            );
            expect( plotTime.primary.dateTime ).toBe( '2100' );
            expect( plotTime.primary.html     ).toBe( '2100' );
            expect( plotTime.primary.value    ).toBe( '2100' );
        });

        it( 'should return a primary point in time for ranges with a year and a month', function() {
            var plotTime = ejsHelpers.formatPlotTimes(
                { plotTimes: [ {
                    type:      'range',
                    isPrimary: true,
                    start:     { year: 2100, month: 1, day: null, },
                    end:       { year: 2100, month: 2, day: null, },
                } ] }
            );
            expect( plotTime.primary.dateTime ).toBe( '2100-01' );
            expect( plotTime.primary.html     ).toBe( '<abbr title="Januar" class="' + abbrClass + '">Jan.</abbr> 2100' );
            expect( plotTime.primary.value    ).toBe( 'Jan. 2100' );
        });

        it( 'should return a primary point in time for ranges with a year, a month and a day in "all"', function() {
            var plotTime = ejsHelpers.formatPlotTimes(
                { plotTimes: [ {
                    type:      'range',
                    isPrimary: true,
                    start:     { year: 2100, month: 1, day: 1, },
                    end:       { year: 2100, month: 2, day: 2, },
                } ] }
            );
            expect( plotTime.primary.dateTime ).toBe( '2100-01' );
            expect( plotTime.primary.html     ).toBe( '<abbr title="Januar" class="' + abbrClass + '">Jan.</abbr> 2100' );
            expect( plotTime.primary.value    ).toBe( 'Jan. 2100' );
        });

        it( 'should not abbreviate Mai', function() {
            var plotTime = ejsHelpers.formatPlotTimes(
                { plotTimes: [
                    {
                        type:      'point',
                        year:      2100,
                        month:     5,
                        day:       null,
                        isPrimary: true,
                    },
                ] }
            );

            expect( plotTime.primary.dateTime ).toBe( '2100-05' );
            expect( plotTime.primary.html     ).toBe( 'Mai 2100' );
            expect( plotTime.primary.value    ).toBe( 'Mai 2100' );
        });
    });

    describe( 'all plot times', function() {
        it( 'should return a primary point in time with a year and no month', function() {
            var plotTime = ejsHelpers.formatPlotTimes(
                { plotTimes: [ { type: 'point', year: 2100, month: null, day: null, isPrimary: true } ] }
            );
            expect( plotTime.all.length ).toBe( 1 );
            expect( plotTime.all[0].type   ).toBe( 'point' );
            expect( plotTime.all[0].value  ).toBe( '2100' );
        });

        it( 'should return a primary point in time with a year and a month', function() {
            var plotTime = ejsHelpers.formatPlotTimes(
                { plotTimes: [ { type: 'point', year: 2100, month: 1, day: null, isPrimary: true } ] }
            );
            expect( plotTime.all.length ).toBe( 1 );
            expect( plotTime.all[0].type   ).toBe( 'point' );
            expect( plotTime.all[0].value  ).toBe( 'Januar 2100' );
        });

        it( 'should return a primary point in time with a year, a month and a day', function() {
            var plotTime = ejsHelpers.formatPlotTimes(
                { plotTimes: [ { type: 'point', year: 2100, month: 1, day: 2, isPrimary: true } ] }
            );
            expect( plotTime.all.length ).toBe( 1 );
            expect( plotTime.all[0].type   ).toBe( 'point' );
            expect( plotTime.all[0].value  ).toBe( '02. Januar 2100' );
        });

        it( 'should return a range with a year only', function() {
            var plotTime = ejsHelpers.formatPlotTimes(
                { plotTimes: [ {
                    type:      'range',
                    isPrimary: true,
                    start: {
                        year:  2100,
                        month: null,
                        day:   null,
                    },
                    end: {
                        year:  2101,
                        month: null,
                        day:   null,
                    }
                } ] }
            );
            expect( plotTime.all.length ).toBe( 1 );
            expect( plotTime.all[0].type   ).toBe( 'range' );
            expect( plotTime.all[0].value  ).toBe( '2100 - 2101' );
        });

        it( 'should return a range with a year and a month (different months, same year)', function() {
            var plotTime = ejsHelpers.formatPlotTimes(
                { plotTimes: [ {
                    type:      'range',
                    isPrimary: true,
                    start: {
                        year:  2100,
                        month: 1,
                        day:   null,
                    },
                    end: {
                        year:  2100,
                        month: 2,
                        day:   null,
                    }
                } ] }
            );
            expect( plotTime.all.length ).toBe( 1 );
            expect( plotTime.all[0].type   ).toBe( 'range' );
            expect( plotTime.all[0].value  ).toBe( 'Januar - Februar 2100' );
        });

        it( 'should return a range with a year and a month (different months, different years)', function() {
            var plotTime = ejsHelpers.formatPlotTimes(
                { plotTimes: [ {
                    type:      'range',
                    isPrimary: true,
                    start: {
                        year:  2100,
                        month: 1,
                        day:   null,
                    },
                    end: {
                        year:  2101,
                        month: 2,
                        day:   null,
                    }
                } ] }
            );
            expect( plotTime.all.length ).toBe( 1 );
            expect( plotTime.all[0].type   ).toBe( 'range' );
            expect( plotTime.all[0].value  ).toBe( 'Januar 2100 - Februar 2101' );
        });

        it( 'should return a range with a year, a month and days (different months, same year)', function() {
            var plotTime = ejsHelpers.formatPlotTimes(
                { plotTimes: [ {
                    type:      'range',
                    isPrimary: true,
                    start: {
                        year:  2100,
                        month: 1,
                        day:   1,
                    },
                    end: {
                        year:  2100,
                        month: 2,
                        day:   2,
                    }
                } ] }
            );
            expect( plotTime.all.length ).toBe( 1 );
            expect( plotTime.all[0].type   ).toBe( 'range' );
            expect( plotTime.all[0].value  ).toBe( '01. Januar - 02. Februar 2100' );
        });

        it( 'should return a range with a year, a month and days (same month, same year)', function() {
            var plotTime = ejsHelpers.formatPlotTimes(
                { plotTimes: [ {
                    type:      'range',
                    isPrimary: true,
                    start: {
                        year:  2100,
                        month: 1,
                        day:   1,
                    },
                    end: {
                        year:  2100,
                        month: 1,
                        day:   2,
                    }
                } ] }
            );
            expect( plotTime.all.length ).toBe( 1 );
            expect( plotTime.all[0].type   ).toBe( 'range' );
            expect( plotTime.all[0].value  ).toBe( '01. - 02. Januar 2100' );
        });

        it( 'should return a range with a year, a month and days (same month, different year)', function() {
            var plotTime = ejsHelpers.formatPlotTimes(
                { plotTimes: [ {
                    type:      'range',
                    isPrimary: true,
                    start: {
                        year:  2100,
                        month: 1,
                        day:   1,
                    },
                    end: {
                        year:  2101,
                        month: 1,
                        day:   1,
                    }
                } ] }
            );
            expect( plotTime.all.length ).toBe( 1 );
            expect( plotTime.all[0].type   ).toBe( 'range' );
            expect( plotTime.all[0].value  ).toBe( '01. Januar 2100 - 01. Januar 2101' );
        });

        it( 'should return a range with a year, a month and days (different month, different year)', function() {
            var plotTime = ejsHelpers.formatPlotTimes(
                { plotTimes: [ {
                    type:      'range',
                    isPrimary: true,
                    start: {
                        year:  2100,
                        month: 1,
                        day:   1,
                    },
                    end: {
                        year:  2101,
                        month: 2,
                        day:   1,
                    }
                } ] }
            );
            expect( plotTime.all.length ).toBe( 1 );
            expect( plotTime.all[0].type   ).toBe( 'range' );
            expect( plotTime.all[0].value  ).toBe( '01. Januar 2100 - 01. Februar 2101' );
        });

        it( 'should return multiple times correctly (marking the primary one, too)', function() {
            var plotTime = ejsHelpers.formatPlotTimes(
                { plotTimes: [
                    {
                        type:      'range',
                        isPrimary: true,
                        start: {
                            year:  2100,
                            month: 1,
                            day:   1,
                        },
                        end: {
                            year:  2101,
                            month: 2,
                            day:   1,
                        }
                    },
                    {
                        type:  'point',
                        year:  2102,
                        month: 4,
                        day:   null,
                    },
                ] }
            );

            expect( plotTime.all.length ).toBe( 2 );
            expect( plotTime.all[0].type   ).toBe( 'range' );
            expect( plotTime.all[0].value  ).toBe( '01. Januar 2100 - 01. Februar 2101 (*)' );
            expect( plotTime.all[1].type   ).toBe( 'point' );
            expect( plotTime.all[1].value  ).toBe( 'April 2102' );
        });

        it( 'should sort multiple times correctly', function() {
            var plotTime = ejsHelpers.formatPlotTimes(
                { plotTimes: [
                    {
                        type:      'point',
                        year:      2102,
                        month:     4,
                        day:       null,
                        isPrimary: true,
                    },
                    {
                        type:  'point',
                        year:  2100,
                        month: 2,
                        day:   null,
                    },
                    {
                        type:  'point',
                        year:  2100,
                        month: null,
                        day:   null,
                    },
                    {
                        type:  'point',
                        year:  2101,
                        month: 6,
                        day:   10,
                    },
                    {
                        type: 'range',
                        start: {
                            year:  2101,
                            month: 7,
                            day:   16,
                        },
                        end: {
                            year:  2101,
                            month: 7,
                            day:   19,
                        }
                    }
                ] }
            );

            expect( plotTime.all.length ).toBe( 5 );
            expect( plotTime.all[0].value ).toBe( '2100' );
            expect( plotTime.all[1].value ).toBe( 'Februar 2100' );
            expect( plotTime.all[2].value ).toBe( '10. Juni 2101' );
            expect( plotTime.all[3].value ).toBe( '16. - 19. Juli 2101' );
            expect( plotTime.all[4].value ).toBe( 'April 2102 (*)' );
        });
    });
});
