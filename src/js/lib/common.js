/* jshint node:true */
'use strict';

module.exports = {
    getBookId:       getBookId,
    transformString: transformString,
};

function getBookId( book, series ) {
    var bookId = series.name;
    if ( book.season ) {
        bookId += ' ' + book.season + 'x' + book.episode;
    }
    else if ( book.episode ) {
        bookId += ' ' + book.episode;
    }
    bookId = transformString( bookId );

    return bookId;
}

function transformString( string, whiteSpaceReplacement, doReplaceUmlauts ) {
    if ( typeof whiteSpaceReplacement === 'undefined' ) {
        whiteSpaceReplacement = '-';
    }

    if ( typeof doReplaceUmlauts === 'undefined' ) {
        doReplaceUmlauts = false;
    }

    string = string.toLowerCase();
    string = string.replace( /\s+/g, whiteSpaceReplacement );

    if ( doReplaceUmlauts ) {
        string = string.replace( /ä/g, 'ae' );
        string = string.replace( /ü/g, 'ae' );
        string = string.replace( /ö/g, 'oe' );
        string = string.replace( /ß/g, 'ss' );
    }

    return string;
}
