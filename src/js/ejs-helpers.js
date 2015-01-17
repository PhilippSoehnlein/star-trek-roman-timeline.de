'use strict';

module.exports = {
    getSeries: getSeries,
};

var _ = require( 'lodash-node' );

function getSeries( books ) {
    var series = _.uniq(
            books.map( function( book ) { return book.series } )
        ).sort( function( a, b ) {
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
    return series;
}
