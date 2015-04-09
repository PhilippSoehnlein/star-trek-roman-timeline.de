exports.config = {
    onPrepare: function() {
        browser.ignoreSynchronization = true; // this is no Angular page (see http://ng-learn.org/2014/02/Protractor_Testing_With_Angular_And_Non_Angular_Sites/)

        global.canBrowserResizeWindow = true;

        // set hostname, used for all get requests.
        // Replacing everything after the first point to get rid of locally assigned domain names (like Mac OS's
        // computername.local).
        global.testHost = require( 'os' ).hostname().replace(/\..*$/, '') + ':8001';
    }
};
