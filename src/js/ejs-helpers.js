'use strict';

module.exports = {
    getSeries:       getSeries,
    transformString: transformString,
};

var _ = require( 'lodash-node' );

function getSeries( books ) {
    var seriesNames = _.uniq(
        books.map( function( book ) { return book.series } )
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
        var booksForThisSeries = books.filter( function( book ) { return book.series === seriesName });
        series.push({
            id:    transformString( seriesName ),
            name:  seriesName,
            count: booksForThisSeries.length,
        });
    });

    return series;
}

function transformString( string ) {
    return string.replace( /\s+/g, '-' ).toLowerCase();
}
