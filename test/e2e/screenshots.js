/* jshint node:true */
/* global describe:true, expect:true, browser:true, element:true, by:true, $:true, protractor:true, it:true, xit:true, beforeEach:true */

var screenshot = require( './lib/protractor-screenshot.js' );

describe( 'Taking screenshots', function() {
    'use strict';

    it( 'should take screenshot from index page', function() {
        browser.get( 'http://localhost:8001/' );
        screenshot.take();
    } );

    it( 'should take screenshot from imprint page', function() {
        browser.get( 'http://localhost:8001/impressum.html' );
        screenshot.take();
    } );
} );
