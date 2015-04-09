/* jshint node:true */
/* global describe:true, expect:true, browser:true, element:true, by:true, $:true, protractor:true, it:true, xit:true, beforeEach:true */
describe( 'Piwik opt-out iframe', function() {
    'use strict';

    beforeEach( function() {
        browser.get( 'http://' + global.testHost + '/impressum.html' );
    } );

    it( 'should not address user formally', function () {
        browser.driver.switchTo().frame( 'piwik' );
        expect( $( 'body' ).getText() ).not.toMatch( /\bSie\b/i );
    } );
} );
