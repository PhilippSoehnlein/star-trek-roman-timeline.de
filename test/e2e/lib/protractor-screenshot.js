/* jshint node:true */
/* global browser:true, protractor:true, jasmine:true */
'use strict';

// This provides a take() method which stores a screenshot of the current page in a certain folder.
// Loosely based on https://github.com/angular/protractor/issues/114 and
// https://github.com/eggheadio/egghead-angularjs-protractor-screenshots

var fs      = require( 'fs' );
var sprintf = require( 'sprintf-js' ).sprintf;

var screenshotCounter    = 0;
var screenshotBaseDir    = 'test/e2e/screenshots/';
var currentScreenshotDir;

exports.take = function() {
    var deferred = protractor.promise.defer();

    screenshotCounter++;

    getCurrentScreenshotDir().then(
        function( screenshotDir ) {
            return browser.takeScreenshot().then(
                function( base64png ) {
                    var fileName = sprintf( '%03d', screenshotCounter) + ' - ' +
                                   jasmine.getEnv().currentSpec.description + '.png';
                    var stream   = fs.createWriteStream( screenshotDir + fileName );
                    stream.write( new Buffer( base64png, 'base64' ) );
                    stream.end();

                    deferred.fulfill();
                }
            );
        },
        function( err ) {
            console.error( 'Error while taking screenshot:' + err );
            deferred.reject( err );
        }
    );

    return deferred.promise;
};

function getCurrentScreenshotDir() {
    var deferred = protractor.promise.defer();

    if ( !currentScreenshotDir ) {
        currentScreenshotDir = screenshotBaseDir + new Date().toISOString().replace( 'T', '_' ).replace( /:/g, '-' );
        browser.getCapabilities().then(
            function (capabilities) {
                currentScreenshotDir += ' - ' + capabilities.caps_.browserName + '/';
                fs.mkdirSync( currentScreenshotDir );
                deferred.fulfill( currentScreenshotDir );
            },
            function( err ) {
                deferred.reject( err );
            }
        );
    }
    else {
        deferred.fulfill( currentScreenshotDir );
    }

    return deferred.promise;
}
