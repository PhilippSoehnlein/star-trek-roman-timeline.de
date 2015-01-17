var ejsHelpers  = require('../../src/js/ejs-helpers.js');

describe( 'transformString()', function() {
    it( 'transforms well', function() {
        expect( ejsHelpers.transformString( 'Deep Space Nine' ) ).toBe( 'deep-space-nine' );
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
});
