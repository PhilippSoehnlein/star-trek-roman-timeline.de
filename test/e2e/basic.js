/* jshint node:true */
/* global describe:true, expect:true, browser:true, element:true, by:true, $:true, protractor:true, it:true, xit:true, beforeEach:true */
describe( 'Basic tests', function() {
    'use strict';

    beforeEach( function() {
        browser.get( 'http://localhost:8001/' );
    } );

    it( 'loads the right page', function() {
        expect( browser.getTitle() ).toEqual( 'Star Trek Roman-Timeline' );
    } );
} );
