describe( 'Filter functionality', function() {
    var filterForm              = null;
    var filterFormTriggerButton = null;
    var filterFormSubmitButton  = null;

    var tests = [
        {
            title: 'filterForm is not visible initially',
            testFunction: function() {
                expect( filterForm.isDisplayed() ).toBe( false );
            },
        },
        {
            title: 'clicking the trigger opens the filterForm and changes the URL',
            testFunction: function() {
                var start_url;
                browser.driver.getCurrentUrl()
                    .then( function( url ) { start_url = url; })
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
            needsBigScreen: true,
            testFunction: function() {
                var start_url;
                browser.driver.getCurrentUrl()
                    .then( function( url ) { start_url = url; })
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
            title: 'the opened filter doesn\'t show the filter button on large screens',
            needsBigScreen: true,
            testFunction: function() {
                filterFormTriggerButton.click();
                expect( filterFormSubmitButton.isDisplayed() ).toBe( false );
            }
        },
        {
            title: 'status text for dialog mode is shown on small screens',
            needsSmallScreen: true,
            testFunction: function() {
                filterFormTriggerButton.click();
                browser.driver.sleep( 500 ).then( function() { // wait for animation to finish
                    expect( element( by.className( 'l-filter-box--dialog-footer-status-text-dialog' ) ).isDisplayed() ).toBe( true );
                    expect( element( by.className( 'l-filter-box--dialog-footer-status-text'        ) ).isDisplayed() ).toBe( false );
                });
            }
        },

        {
            title: 'status text for bigger screens is shown on small screens',
            needsBigScreen: true,
            testFunction: function() {
                filterFormTriggerButton.click();

                browser.driver.sleep( 1500 ).then( function() { // wait for animation to finish
                    expect( element( by.className( 'l-filter-box--dialog-footer-status-text-dialog' ) ).isDisplayed() ).toBe( false );
                    expect( element( by.className( 'l-filter-box--dialog-footer-status-text'        ) ).isDisplayed() ).toBe( true );
                });
            }
        },

        {
            title: 'Going directly to #serienauswahl opens filter and inits it',
            page: 'directToOpenedFilter',
            testFunction: function() {
                browser.driver.sleep( 1500 ).then( function() { // wait for animation to finish
                    expect( filterForm.isDisplayed() ).toBe( true );
                    expect( filterFormSubmitButton.isDisplayed() ).toBe( false );
                    expect( element.all( by.className( '_is_filter_book_count' ) ).getInnerHtml() ).toMatch( /\d+/ );
                });
            }
        }
    ];

    tests.forEach( function(test) {
        // A test can state if it needs a certain viewport size. That means on some environments (like smartphones), we have to skip some tests, because the
        // browser there doesn't have the required size and we can't change the viewport size.
        var aroundFn = function() {
            browser.driver.manage().window().getSize().then( function(size) {
                var doTest = false;
                if ( canBrowserResizeWindow ) {
                    // provide a certain default size if the test has needsBigScreen or needSmallScreen (if it has both, the test must take care of it itself
                    if ( test.needsBigScreen ) {
                        browser.driver.manage().window().setSize( 1024, 600 );
                    }
                    else if ( test.needsSmallScreen ) {
                        browser.driver.manage().window().setSize( 320, 480 );
                    }
                    doTest = true;
                }
                else if ( typeof test.needsSmallScreen === 'undefined' && typeof test.needsBigScreen === 'undefined' ) {
                    // we can't resize the browser window, but the test says the viewport size doesn't matter anyway.
                    doTest = true;
                }
                else if ( test.needsSmallScreen && size.width < 700 ) {
                    doTest = true;
                }
                else if ( test.needsBigScreen && size.width > 700 ) {
                    doTest = true;
                }

                if ( !doTest ) {
                    expect(true).toBe(true);
                    console.info( 'Skipping test "' + test.title + '", because it needs a certain viewport size and we run in a browser in which we can\'t change it.' );
                }
                else {
                    // Set special URL if a test demands it.
                    var url = 'http://localhost:8001/';

                    if ( test.page === 'directToOpenedFilter' ) {
                        url += '#serienauswahl';
                    }
                    /*else if ( test.page === 'nojs' ) {
                        url += 'index_nojs.html';
                    }*/

                    browser.get(url);

                    filterForm              = element( by.id( 'serienauswahl' ) );
                    filterFormTriggerButton = element( by.className( '_is_filter_trigger' ) );
                    filterFormSubmitButton  = element( by.className( '_is_filter_submit_button' ) );

                    test.testFunction();
                }
            });
        }

        it( test.title, aroundFn );
    });
});
