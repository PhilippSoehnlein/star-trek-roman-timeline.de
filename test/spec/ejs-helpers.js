var ejsHelpers  = require('../../src/js/ejs-helpers.js');

describe( 'formatAuthors()', function() {
    it( 'one author (no transformation)', function() {
        expect( ejsHelpers.formatAuthors( [ 'Author 1' ] ) ).toBe( 'Author 1' );
    });

    it( 'two authors (& separated)', function() {
        expect( ejsHelpers.formatAuthors( [ 'Author 1', 'Author 2', ] ) ).toBe( 'Author 1 & Author 2' );
    });

    it( 'three authors (, and & separated)', function() {
        expect( ejsHelpers.formatAuthors( [ 'Author 1', 'Author 2', 'Author 3' ] ) ).toBe( 'Author 1, Author 2 & Author 3' );
    });

    it( 'four authors (, and & separated)', function() {
        expect( ejsHelpers.formatAuthors( [ 'Author 1', 'Author 2', 'Author 3', 'Author 4', ] ) ).toBe( 'Author 1, Author 2, Author 3 & Author 4' );
    });
});

describe( 'formatSeriesEpisode()', function() {
    it( 'book has no season', function() {
        expect( ejsHelpers.formatSeriesEpisode( { series: 'TNG Doppelhelix', episode: '1', season: null } ) ).toBe( 'TNG Doppelhelix #1' );
    });

    it( 'book has season', function() {
        expect( ejsHelpers.formatSeriesEpisode( { series: 'Deep Space Nine', episode: '1', season: '8' } ) ).toBe( 'Deep Space Nine - 8x1' );
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
});
