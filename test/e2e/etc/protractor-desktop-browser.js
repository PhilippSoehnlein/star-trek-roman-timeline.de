exports.config = {
    onPrepare: function() {
        browser.ignoreSynchronization = true; // this is no Angular page (see http://ng-learn.org/2014/02/Protractor_Testing_With_Angular_And_Non_Angular_Sites/)

        global.chai = require( 'chai' );
        chai.use( require( 'chai-as-promised' ) );
        global.expect = chai.expect;

        global.canBrowserResizeWindow = true;
    },

    framework: 'mocha',
    mochaOpts: {
        reporter: 'spec',
        slow:     3000,
        timeout:  10000
    }
};
