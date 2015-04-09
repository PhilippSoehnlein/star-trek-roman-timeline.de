/* jshint node:true */
/* global describe:true, expect:true, browser:true, element:true, by:true, $:true, protractor:true, it:true, xit:true, beforeEach:true */

var screenshot = require( './lib/protractor-screenshot.js' );

describe( 'Taking screenshots', function() {
    'use strict';

    it( 'should take screenshot from index page', function() {
        browser.get( 'http://' + global.testHost + '/' );
        screenshot.take();
    } );

    it( 'should take screenshot from imprint page', function() {
        browser.get( 'http://' + global.testHost + '/impressum.html' );
        screenshot.take();
    } );

    it( 'should take screenshot from filter', function() {
        browser.get( 'http://' + global.testHost + '/#serienauswahl' );
        browser.driver.executeScript( 'window.scrollTo( 0, 0 )' );
        browser.driver.sleep( 1000 ); // wait for animation to finish
        screenshot.take();
    } );
} );
