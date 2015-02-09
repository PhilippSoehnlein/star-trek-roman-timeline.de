/* jshint node:true */
/* global describe:true, it:true, expect:true */
'use strict';

var ejsHelpers  = require('../../src/js/ejs-helpers.js');

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
        expect( ejsHelpers.formatSeriesEpisode( { series: 'TNG Doppelhelix', episode: '1', season: null } ) )
            .toBe( 'TNG Doppelhelix #1' );
    });

    it( 'book has season', function() {
        expect( ejsHelpers.formatSeriesEpisode( { series: 'Deep Space Nine', episode: '1', season: '8' } ) )
            .toBe( 'Deep Space Nine - 8x1' );
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
        { series: 'TNG Doppelhelix' },
        { series: 'Deep Space Nine' },
        { series: 'TNG Doppelhelix' },
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
