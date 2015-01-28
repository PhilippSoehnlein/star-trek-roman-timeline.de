/*
    This is a rewrite of the filter e2e tests with Mocha. Some things I discovered:
    - Not sure what is better: expect( something ).to.eventually.equal( true ) or expect( something ).to.eventually.be.true.
      The later is IMO a bit easier to read, but jshint will complain.
    - It looks like Chai doesn't automatically resolve promises as last part of the assertion:
      expect( something ).to.eventually.equal( somePromise ) <-- somePromise has to be resolved by the test first
      See test "Labels of checkboxes are correctly linked to their checkboxes"
    - Nyan reporter rules! ;-) http://mochajs.org/#nyan-reporter
*/

describe( 'Filter functionality', function() {
    const filterId              = 'serienauswahl';

    var filterForm              = null;
    var filterFormTriggerButton = null;
    var filterFormSubmitButton  = null;

    var tests = [
        {
            title: 'filterForm is not visible initially',
            testFunction: function() {
                expect( filterForm.isDisplayed() ).to.eventually.equal( false );
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
                        expect( filterForm.isDisplayed() ).to.eventually.equal( true );
                        browser.driver.getCurrentUrl().then( function(url) { expect(url).to.not.equal( start_url ) } );
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
                            expect( filterForm.isDisplayed() ).to.eventually.equal( false );
                            browser.driver.getCurrentUrl().then( function(url) { expect(url).to.equal( start_url ) } );
                        })
                ;
            },
        },
        {
            title: 'the opened filter doesn\'t show the filter button on large screens',
            needsBigScreen: true,
            testFunction: function() {
                filterFormTriggerButton.click();
                expect( filterFormSubmitButton.isDisplayed() ).to.eventually.equal( false );
            }
        },
        {
            title: 'status text for dialog mode is shown on small screens',
            needsSmallScreen: true,
            testFunction: function() {
                filterFormTriggerButton.click();
                browser.driver.sleep( 1000 );  // wait for animation to finish
                expect( element( by.className( 'l-filter-box--dialog-footer-status-text-dialog' ) ).isDisplayed() ).to.eventually.equal( true );
                expect( element( by.className( 'l-filter-box--dialog-footer-status-text'        ) ).isDisplayed() ).to.eventually.equal( false );
            }
        },

        {
            title: 'status text for bigger screens is shown on small screens',
            needsBigScreen: true,
            testFunction: function() {
                filterFormTriggerButton.click();
                browser.driver.sleep( 1500 ); // wait for animation to finish
                expect( element( by.className( 'l-filter-box--dialog-footer-status-text-dialog' ) ).isDisplayed() ).to.eventually.equal( false );
                expect( element( by.className( 'l-filter-box--dialog-footer-status-text'        ) ).isDisplayed() ).to.eventually.equal( true );
            }
        },

        {
            title: 'Going directly to #' + filterId + ' opens filter and inits it',
            page: 'directToOpenedFilter',
            testFunction: function() {
                browser.driver.sleep( 1500 ); // wait for animation to finish
                expect( filterForm.isDisplayed() ).to.eventually.equal( true );
                expect( filterFormSubmitButton.isDisplayed() ).to.eventually.equal( false );
                expect( element.all( by.className( '_is_filter_book_count' ) ).getText() ).to.eventually.match( /\d+ Bücher/ );
            }
        },

        {
            title: 'Labels of checkboxes are correctly linked to their checkboxes',
            testFunction: function() {
                var checkboxes = element.all( by.css( '#' + filterId + ' input[type="checkbox"]' ) );
                var labels     = element.all( by.css( '#' + filterId + ' label' ) );

                labels.count().then( function( labelCount ) {
                    expect( checkboxes.count() ).to.eventually.equal( labelCount );
                });

                checkboxes.each( function( checkbox ) {
                    expect( checkbox.getAttribute( 'checked' ) ).to.eventually.be.null;
                });

                filterFormTriggerButton.click();
                browser.driver.sleep( 1500 ); // wait for animation to finish
                labels.click();
                checkboxes.each( function( checkbox ) {
                    expect( checkbox.getAttribute( 'checked' ) ).to.eventually.equal( 'true' );
                });
            }
        },

        {
            title: 'Selecting series changes the series counter',
            needsSmallScreen: true,
            testFunction: function() {
                filterFormTriggerButton.click();
                browser.driver.sleep( 1500 ); // wait for animation to finish
                var checkboxes  = element.all( by.css( '#' + filterId + ' input[type="checkbox"]' ) );
                var counterNode = element( by.className( '_is_filter_series_count' ) );

                expect( counterNode.getText() ).to.eventually.equal( '0' );
                checkboxes.get( 0 ).click();
                expect( counterNode.getText() ).to.eventually.equal( '1' );
                checkboxes.get( 1 ).click();
                expect( counterNode.getText() ).to.eventually.equal( '2' );
            }
        },

        {
            title: 'Selecting a series shows or hides the right books',
            needsBigScreen: true,
            testFunction: function() {
                filterFormTriggerButton.click();
                browser.driver.sleep( 1500 ); // wait for filter animation to finish
                element( by.id( 'series-checkbox-tng-doppelhelix' ) ).click();
                browser.driver.sleep( 600 ); // wait for isotope animation to finish
                var timelineItems = element.all( by.css( '._is_timeline_item' ) );
                expect( timelineItems.count() ).to.eventually.equal( 4 );

                timelineItems.each( function( timelineItem ) {
                    timelineItem.getAttribute( 'data-timline-item-series' ).then( function( series ) {
                        if ( series === 'TNG Doppelhelix' ) {
                            expect( timelineItem.isDisplayed() ).to.eventually.be.true;
                        }
                        else {
                            expect( timelineItem.isDisplayed() ).to.eventually.be.false;
                        }
                    })
                });
            }
        },

        {
            title: 'Selecting a series sets right classes on items',
            needsBigScreen: true,
            testFunction: function() {
                filterFormTriggerButton.click();

                browser.driver.sleep( 1500 ); // wait for filter animation to finish
                element( by.id( 'series-checkbox-tng-doppelhelix' ) ).click();

                browser.driver.sleep( 1000 ); // wait for isotope animation to finish
                var timelineItems = element.all( by.css( '._is_timeline_item[data-timline-item-series="TNG Doppelhelix"]' ) );
                expect( timelineItems.count() ).to.eventually.equal( 2 );
                expect( timelineItems.get( 0 ).getAttribute( 'class' ) ).to.eventually.match( /\bis-l-timeline-item-odd\b/ );
                expect( timelineItems.get( 0 ).getAttribute( 'class' ) ).to.eventually.not.match( /\bis-l-timeline-item-even\b/ );
                expect( timelineItems.get( 0 ).getAttribute( 'class' ) ).to.eventually.match( /\bis-l-timeline-item-first\b/ );
                expect( timelineItems.get( 1 ).getAttribute( 'class' ) ).to.eventually.not.match( /\bis-l-timeline-item-odd\b/ );
                expect( timelineItems.get( 1 ).getAttribute( 'class' ) ).to.eventually.match( /\bis-l-timeline-item-even\b/ );
                expect( timelineItems.get( 1 ).getAttribute( 'class' ) ).to.eventually.not.match( /\bis-l-timeline-item-first\b/ );
            }
        },

        {
            title: 'Unchecking all previously checked checkboxes should show all books again',
            needsBigScreen: true,
            testFunction: function() {
                filterFormTriggerButton.click();
                browser.driver.sleep( 1500 ); // wait for filter animation to finish
                element.all( by.css( '._is_timeline_item' ) ).count().then( function( numberOfTimelineItems ) {
                    var bookCounterRegex = new RegExp( '^' + numberOfTimelineItems + ' ' );
                    var bookCounterNodes = element.all( by.className( '_is_filter_book_count' ) );
                    var checkboxToClick  = element( by.id( 'series-checkbox-tng-doppelhelix' ) );

                    // all these last() calls here are because the test is probably done in a wider browser and a
                    // expect( bookCounterNodes.getText() ).toMatch( bookCounterRegex ) doesn't match in Firefox
                    // because the webdriver for Firefox only returns text for visible nodes.
                    expect( bookCounterNodes.last().getText() ).to.eventually.match( bookCounterRegex );
                    checkboxToClick.click();

                    expect( bookCounterNodes.last().getText() ).to.eventually.not.match( bookCounterRegex );
                    checkboxToClick.click();

                    browser.driver.sleep( 600 ); // wait for isotope animation to finish
                    var timelineItems = element.all( by.css( '._is_timeline_item' ) );
                    timelineItems.each( function( timelineItem ) {
                        expect( timelineItem.isDisplayed() ).to.eventually.be.true;
                    });
                    expect( bookCounterNodes.last().getText() ).to.eventually.match( bookCounterRegex );
                });
            }
        },
        
        {
            title: 'Pressing Escape key closes filter dialog in dialog mode (when opened)',
            needsSmallScreen: true,
            testFunction: function() {
                filterFormTriggerButton.click();
                browser.driver.sleep( 1000 ); // wait for filter animation to finish
                $('body').sendKeys( protractor.Key.ESCAPE );
                browser.driver.sleep( 1000 ); // wait for filter animation to finish
                expect( filterForm.isDisplayed() ).to.eventually.be.false;
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

                    browser.getCapabilities().then( function ( capabilities ) {
                        /* Delay test in Chrome, because it plays all transitions when the page is rendering which may lead to inaccurate test results,
                           because the transitions may still be in progress when the first scripted click (or whatever) happens and sometimes this
                           click may land on the just running transition. The correct thing would be to fix the strange behaviour in Chrome right away, but
                           the only way I can think of right now is http://css-tricks.com/transitions-only-after-page-load/ and I don't like a JS solution for
                           that. So, this is the current workaround for the tests, the actual implementation should be changed later. Therefore: TODO */
                        if ( test.needsSmallScreen && capabilities.caps_.browserName === 'chrome' ) {
                            browser.driver.sleep( 500 );
                        }
                        test.testFunction();
                    });
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
        // Tests may time out in Safari when you switch from an url to another and the only difference is the hash. To prevent this, request another page first.
        browser.get( 'about:blank' );

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
