var ejsHelpers  = require('../../src/js/ejs-helpers.js');

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
        expect( series ).toEqual( [ 'Deep Space Nine', 'TNG Doppelhelix' ] );
    });
});
