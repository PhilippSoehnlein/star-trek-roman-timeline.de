exports.config = {
    seleniumAddress: 'http://localhost:4723/wd/hub', // appium runs on a different port

    capabilities: {
        browserName:      'safari',
        platformName:     'iOS',
        platformVersion:  '8.2',
        deviceName:       'iPhone 4s',
        'appium-version': '1.0',
    },

    onPrepare: function() {
        browser.ignoreSynchronization = true; // this is no Angular page (see http://ng-learn.org/2014/02/Protractor_Testing_With_Angular_And_Non_Angular_Sites/)

        global.canBrowserResizeWindow = false;

        // Set hostname, used for all get requests.
        // For the XCode Simulator I'm not cuting the TLD away, because it's needed to connect from the iOS safari to the host.
        global.testHost = require( 'os' ).hostname() + ':8001';

        // from http://angular.github.io/protractor/#/browser-setup#setting-up-protractor-with-appium-ios-safari
        var wd = require('wd'),
            protractor = require('protractor'),
            wdBridge = require('wd-bridge')(protractor, wd);
        wdBridge.initFromProtractor(exports.config);
    }
};
