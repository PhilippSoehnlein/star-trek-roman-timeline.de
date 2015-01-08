exports.config = {
    onPrepare: function() {
         browser.ignoreSynchronization = true; // this is no Angular page (see http://ng-learn.org/2014/02/Protractor_Testing_With_Angular_And_Non_Angular_Sites/)
    }
};
