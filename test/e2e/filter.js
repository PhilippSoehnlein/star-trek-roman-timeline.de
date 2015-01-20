describe( 'Filter functionality', function() {
    const filterId              = 'serienauswahl';

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
            title: 'Going directly to #' + filterId + ' opens filter and inits it',
            page: 'directToOpenedFilter',
            testFunction: function() {
                browser.driver.sleep( 1500 ).then( function() { // wait for animation to finish
                    expect( filterForm.isDisplayed() ).toBe( true );
                    expect( filterFormSubmitButton.isDisplayed() ).toBe( false );
                    expect( element.all( by.className( '_is_filter_book_count' ) ).getInnerHtml() ).toMatch( /\d+ Bücher/ );
                });
            }
        },

        {
            title: 'Labels of checkboxes are correctly linked to their checkboxes',
            testFunction: function() {
                var checkboxes = element.all( by.css( '#' + filterId + ' input[type="checkbox"]' ) );
                var labels     = element.all( by.css( '#' + filterId + ' label' ) );

                expect( checkboxes.count() ).toBe( labels.count() );

                checkboxes.each( function( checkbox ) {
                    expect( checkbox.getAttribute( 'checked' ) ).toBe( null );
                });

                filterFormTriggerButton.click();
                browser.driver.sleep( 1500 ).then( function() { // wait for animation to finish
                    labels.click();
                    checkboxes.each( function( checkbox ) {
                        expect( checkbox.getAttribute( 'checked' ) ).toBe( 'true' );
                    });
                });
            }
        },

        {
            title: 'Selecting series changes the series counter',
            testFunction: function() {
                filterFormTriggerButton.click();
                browser.driver.sleep( 1500 ).then( function() { // wait for animation to finish
                    var checkboxes  = element.all( by.css( '#' + filterId + ' input[type="checkbox"]' ) );
                    var counterNode = element( by.className( '_is_filter_series_count' ) );

                    expect( counterNode.getInnerHtml() ).toBe( '0' );
                    checkboxes.get( 0 ).click();
                    expect( counterNode.getInnerHtml() ).toBe( '1' );
                    checkboxes.get( 1 ).click();
                    expect( counterNode.getInnerHtml() ).toBe( '2' );
                });
            }
        },

        {
            title: 'Selecting a series shows or hides the right books',
            testFunction: function() {
                filterFormTriggerButton.click();
                browser.driver.sleep( 1500 ).then( function() { // wait for filter animation to finish
                    element( by.id( 'series-checkbox-tng-doppelhelix' ) ).click();
                    browser.driver.sleep( 600 ).then( function() { // wait for isotope animation to finish
                        var timelineItems = element.all( by.css( '._is_timeline_item' ) );
                        expect( timelineItems.count() ).toBe( 4 );

                        timelineItems.each( function( timelineItem ) {
                            timelineItem.getAttribute( 'data-timline-item-series' ).then( function( series ) {
                                timelineItem.getAttribute( 'style' ).then(function(style) {console.log(style);});
                                if ( series === 'TNG Doppelhelix' ) {
                                    expect( timelineItem.isDisplayed() ).toBe( true );
                                }
                                else {
                                    expect( timelineItem.isDisplayed() ).toBe( false );
                                }
                            })
                        });
                    });
                });
            }
        },

        {
            title: 'Selecting a series sets right classes on items',
            testFunction: function() {
                filterFormTriggerButton.click();
                browser.driver.sleep( 1500 ).then( function() { // wait for filter animation to finish
                    element( by.id( 'series-checkbox-tng-doppelhelix' ) ).click();
                    browser.driver.sleep( 600 ).then( function() { // wait for isotope animation to finish
                        var timelineItems = element.all( by.css( '._is_timeline_item[data-timline-item-series="TNG Doppelhelix"]' ) );
                        expect( timelineItems.count() ).toBe( 2 );
                        expect( timelineItems.get( 0 ).getAttribute( 'class' ) ).toMatch( /\bis-l-timeline-item-odd\b/ );
                        expect( timelineItems.get( 0 ).getAttribute( 'class' ) ).not.toMatch( /\bis-l-timeline-item-even\b/ );
                        expect( timelineItems.get( 0 ).getAttribute( 'class' ) ).toMatch( /\bis-l-timeline-item-first\b/ );
                        expect( timelineItems.get( 1 ).getAttribute( 'class' ) ).not.toMatch( /\bis-l-timeline-item-odd\b/ );
                        expect( timelineItems.get( 1 ).getAttribute( 'class' ) ).toMatch( /\bis-l-timeline-item-even\b/ );
                        expect( timelineItems.get( 1 ).getAttribute( 'class' ) ).not.toMatch( /\bis-l-timeline-item-first\b/ );
                    });
                });
            }
        },
    ];

    tests.forEach( function( test ) {
        var aroundFn = function() {
            browser.driver.manage().window().getSize().then( function( size ) {
                var doTest = prepareBrowserViewport( test );
                if ( !doTest ) {
                    expect( true ).toBe( true );
                    console.info( 'Skipping test "' + test.title + '", because it needs a certain viewport size and we run in a browser in which we can\'t change it.' );
                }
                else {
                    callTestUrl( test );
                    prepareTestVars();

                    test.testFunction();
                }
            });
        }

        it( test.title, aroundFn );
    });

    function prepareBrowserViewport( test ) {
        // A test can state if it needs a certain viewport size. That means on some environments (like smartphones), we have to skip some tests, because the
        // browser there doesn't have the required size and we can't change the viewport size.
        var canTestBeExecuted = false;
        if ( canBrowserResizeWindow ) {
            // provide a certain default size if the test has needsBigScreen or needSmallScreen (if it has both, the test must take care of it itself
            if ( test.needsBigScreen ) {
                browser.driver.manage().window().setSize( 1024, 600 );
            }
            else if ( test.needsSmallScreen ) {
                browser.driver.manage().window().setSize( 320, 480 );
            }
            canTestBeExecuted = true;
        }
        else if ( typeof test.needsSmallScreen === 'undefined' && typeof test.needsBigScreen === 'undefined' ) {
            // we can't resize the browser window, but the test says the viewport size doesn't matter anyway.
            canTestBeExecuted = true;
        }
        else if ( test.needsSmallScreen && size.width < 700 ) {
            canTestBeExecuted = true;
        }
        else if ( test.needsBigScreen && size.width > 700 ) {
            canTestBeExecuted = true;
        }

        return canTestBeExecuted;
    }

    function callTestUrl( test ) {
        // Set special URL if a test demands it.
        var url = 'http://localhost:8001/';

        if ( test.page === 'directToOpenedFilter' ) {
            url += '#' + filterId;
        }
        /*else if ( test.page === 'nojs' ) {
            url += 'index_nojs.html';
        }*/

        browser.get( url );
    }

    function prepareTestVars() {
        filterForm              = element( by.id( filterId ) );
        filterFormTriggerButton = element( by.className( '_is_filter_trigger' ) );
        filterFormSubmitButton  = element( by.className( '_is_filter_submit_button' ) );
    }
});
