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

function transformString( string, whiteSpaceReplacement ) {
    if ( typeof whiteSpaceReplacement === 'undefined' ) {
        whiteSpaceReplacement = '-';
    }
    return string.replace( /\s+/g, whiteSpaceReplacement ).toLowerCase();
}
