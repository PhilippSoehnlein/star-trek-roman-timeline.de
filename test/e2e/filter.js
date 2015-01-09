describe( 'Filter Functionality', function() {
    var filterForm = null;
    var filterFormTriggerButton = null;
    var filterFormSubmitButton = null;

    beforeEach( function() {
        browser.get('http://localhost:8001/');

        filterForm = element( by.id( 'serienauswahl' ) );
        filterFormTriggerButton = element( by.className( '_is_filter_trigger' ) );
        filterFormSubmitButton = element( by.className( '_is_filter_submit_button' ) );
    });

    var tests = [
        {
            title: 'filterForm is not visible initially',
            needsWindowResize: false,
            testFunction: function() {
                expect( filterForm.isDisplayed() ).toBe( false );
            },
        },
        {
            title: 'clicking the trigger opens the filterForm and changes the URL',
            needsWindowResize: false,
            testFunction: function() {
                var start_url;
                browser.driver.getCurrentUrl()
                    .then( function(url) { start_url = url; })
                    .then( function() {
                        filterFormTriggerButton.click();
                        expect( filterForm.isDisplayed() ).toBe( true );
                        browser.driver.getCurrentUrl().then( function(url) { expect(url).not.toBe( start_url ) } );
                    })
                ;
            },
        },
        {
            title: 'clicking the trigger button again closes the filterForm and resets the URL',
            needsWindowResize: true,
            testFunction: function() {
                // make sure we run in "desktop" mode
                browser.driver.manage().window().setSize( 1024, 600 );

                var start_url;
                browser.driver.getCurrentUrl()
                    .then( function(url) { start_url = url; })
                    .then( function() {
                            filterFormTriggerButton.click();
                            filterFormTriggerButton.click();
                            expect( filterForm.isDisplayed() ).toBe( false );
                            browser.driver.getCurrentUrl().then( function(url) { expect(url).toBe( start_url ) } );
                        })
                ;
            },
        },
        {
            title: 'the open filter doesn\'t show the filter button on large screens',
            needsWindowResize: true,
            testFunction: function() {
                // make sure we run in "desktop" mode
                browser.driver.manage().window().setSize( 1024, 600 );

                filterFormTriggerButton.click();
                expect( filterFormSubmitButton.isDisplayed() ).toBe( false );
            }
        },
//        {
//            title: '',
//            needsWindowResize: false,
//            testFunction: function() {
//            },
//        },
    ];

    tests.forEach( function(test) {
        // don't execute responsive tests if Browser has a fixed viewport (= phones and tablets)
        if ( test.needsWindowResize && !canBrowserResizeWindow ) {
            console.info( 'Skipping test "' + test.title + '", because it needs a certain viewport size and we run in a browser in which we can\'t change it.' );
            return;
        }

        it( test.title, test.testFunction );
    });
});
