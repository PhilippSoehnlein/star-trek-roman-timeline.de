/* jshint node:true */
/* global describe:true, expect:true, browser:true, element:true, by:true, $:true, protractor:true, it:true, xit:true, beforeEach:true */
describe( 'Index page', function() {
    'use strict';

    beforeEach( function() {
        browser.get( 'http://' + global.testHost + '/' );
    } );

    it( 'should jump directly to book if requested', function() {
        browser.get( 'http://' + global.testHost + '/#filmromane-1' );
        browser.driver.executeScript( 'return window.pageYOffset;' ).then( function ( scrollY ) {
            expect( scrollY ).toBeGreaterThan( 0 );
        });
    } );
} );
