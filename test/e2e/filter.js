/* jshint node:true */
/* global describe:true, expect:true, browser:true, element:true, by:true, $:true, protractor:true, it:true, xit:true */
describe( 'Filter functionality', function() {
    'use strict';
    var filterId                = 'serienauswahl';

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
                var startUrl;
                browser.driver.getCurrentUrl()
                    .then( function( url ) { startUrl = url; })
                    .then( function() {
                        filterFormTriggerButton.click();
                        expect( filterForm.isDisplayed() ).toBe( true );
                        browser.driver.getCurrentUrl().then( function( url ) { expect( url ).not.toBe( startUrl ); } );
                    })
                ;
            },
        },

        {
            title: 'clicking the trigger button again closes the filterForm and resets the URL',
            needsBigScreen: true,
            testFunction: function() {
                var startUrl;
                browser.driver.getCurrentUrl()
                    .then( function( url ) { startUrl = url; })
                    .then( function() {
                        filterFormTriggerButton.click();
                        filterFormTriggerButton.click();
                        expect( filterForm.isDisplayed() ).toBe( false );
                        browser.driver.getCurrentUrl().then( function( url ) { expect( url ).toBe( startUrl ); } );
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
                browser.driver.sleep( 1000 );  // wait for animation to finish

                var dialogStatusNode = element( by.className( 'l-filter-box--dialog-footer-status-text-dialog' ) );
                expect( dialogStatusNode.isDisplayed() ).toBe( true );

                var statusNode = element( by.className( 'l-filter-box--dialog-footer-status-text' ) );
                expect( statusNode.isDisplayed() ).toBe( false );
            }
        },

        {
            title: 'status text for bigger screens is shown on small screens',
            needsBigScreen: true,
            testFunction: function() {
                filterFormTriggerButton.click();
                browser.driver.sleep( 1500 ); // wait for animation to finish

                var dialogStatusNode = element( by.className( 'l-filter-box--dialog-footer-status-text-dialog' ) );
                expect( dialogStatusNode.isDisplayed() ).toBe( false );

                var statusNode = element( by.className( 'l-filter-box--dialog-footer-status-text' ) );
                expect( statusNode.isDisplayed() ).toBe( true );
            }
        },

        {
            title: 'Going directly to #' + filterId + ' opens filter and inits it',
            page: 'directToOpenedFilter',
            testFunction: function() {
                browser.driver.sleep( 1500 ); // wait for animation to finish
                expect( filterForm.isDisplayed() ).toBe( true );
                expect( filterFormSubmitButton.isDisplayed() ).toBe( false );
                expect( element.all( by.className( '_is_filter_book_count' ) ).getText() ).toMatch( /\d+ Bücher/ );
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
                browser.driver.sleep( 1500 ); // wait for animation to finish
                labels.click();
                checkboxes.each( function( checkbox ) {
                    expect( checkbox.getAttribute( 'checked' ) ).toBe( 'true' );
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

                expect( counterNode.getText() ).toBe( '0' );
                checkboxes.get( 0 ).click();
                expect( counterNode.getText() ).toBe( '1' );
                checkboxes.get( 1 ).click();
                expect( counterNode.getText() ).toBe( '2' );
            }
        },

        {
            title: 'Selecting a series shows or hides the right books (accordion mode)',
            needsBigScreen: true,
            testFunction: function() {
                filterFormTriggerButton.click();
                browser.driver.sleep( 1500 ); // wait for filter animation to finish
                element( by.id( 'series-checkbox-tng-doppelhelix' ) ).click();
                browser.driver.sleep( 600 ); // wait for isotope animation to finish
                var timelineItems = element.all( by.css( '._is_timeline_item' ) );
                expect( timelineItems.count() ).toBe( 4 );

                timelineItems.each( function( timelineItem ) {
                    timelineItem.getAttribute( 'data-timline-item-series' ).then( function( series ) {
                        if ( series === 'TNG Doppelhelix' ) {
                            expect( timelineItem.isDisplayed() ).toBe( true );
                        }
                        else {
                            expect( timelineItem.isDisplayed() ).toBe( false );
                        }
                    });
                });
            }
        },

        {
            title: 'Selecting a series shows or hides the right books (dialog mode)',
            needsSmallScreen: true,
            testFunction: function() {
                filterFormTriggerButton.click();
                browser.driver.sleep( 1000 ); // wait for filter animation to finish
                element( by.id( 'series-checkbox-tng-doppelhelix' ) ).click();
                filterFormSubmitButton.click();
                browser.driver.sleep( 1000 ); // wait for isotope animation to finish
                var timelineItems = element.all( by.css( '._is_timeline_item' ) );
                expect( timelineItems.count() ).toBe( 4 );

                timelineItems.each( function( timelineItem ) {
                    timelineItem.getAttribute( 'data-timline-item-series' ).then( function( series ) {
                        if ( series === 'TNG Doppelhelix' ) {
                            expect( timelineItem.isDisplayed() ).toBe( true );
                        }
                        else {
                            expect( timelineItem.isDisplayed() ).toBe( false );
                        }
                    });
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
                var timelineItemsSelector = '._is_timeline_item[data-timline-item-series="TNG Doppelhelix"]';
                var timelineItems         = element.all( by.css( timelineItemsSelector ) );
                expect( timelineItems.count() ).toBe( 2 );
                expect( timelineItems.get( 0 ).getAttribute( 'class' ) ).toMatch( /\bis-l-timeline-item-odd\b/ );
                expect( timelineItems.get( 0 ).getAttribute( 'class' ) ).not.toMatch( /\bis-l-timeline-item-even\b/ );
                expect( timelineItems.get( 0 ).getAttribute( 'class' ) ).toMatch( /\bis-l-timeline-item-first\b/ );
                expect( timelineItems.get( 1 ).getAttribute( 'class' ) ).not.toMatch( /\bis-l-timeline-item-odd\b/ );
                expect( timelineItems.get( 1 ).getAttribute( 'class' ) ).toMatch( /\bis-l-timeline-item-even\b/ );
                expect( timelineItems.get( 1 ).getAttribute( 'class' ) ).not.toMatch( /\bis-l-timeline-item-first\b/ );
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
                    expect( bookCounterNodes.last().getText() ).toMatch( bookCounterRegex );
                    checkboxToClick.click();

                    expect( bookCounterNodes.last().getText() ).not.toMatch( bookCounterRegex );
                    checkboxToClick.click();

                    browser.driver.sleep( 600 ); // wait for isotope animation to finish
                    var timelineItems = element.all( by.css( '._is_timeline_item' ) );
                    timelineItems.each( function( timelineItem ) {
                        expect( timelineItem.isDisplayed() ).toBe( true );
                    });
                    expect( bookCounterNodes.last().getText() ).toMatch( bookCounterRegex );
                });
            }
        },

        {
            title: 'Pressing Escape key closes filter dialog in dialog mode (when opened)',
            needsSmallScreen: true,
            testFunction: function() {
                filterFormTriggerButton.click();
                browser.driver.sleep( 1000 ); // wait for filter animation to finish
                $( 'body' ).sendKeys( protractor.Key.ESCAPE );
                browser.driver.sleep( 1000 ); // wait for filter animation to finish
                expect( filterForm.isDisplayed() ).toBe( false );
            }
        },

        {
            title: 'Filter form closes when using the close button',
            needsSmallScreen: true,
            testFunction: function() {
                filterFormTriggerButton.click();
                browser.driver.sleep( 1000 ); // wait for filter animation to finish
                element( by.className( '_is_filter_close_button' ) ).click();
                browser.driver.sleep( 1000 ); // wait for filter animation to finish
                expect( filterForm.isDisplayed() ).toBe( false );
            }
        },

        {
            title: 'Opening the filter shouldn\'t alter the scroll position',
            testFunction: function() {
                // to make this test work, we need a viewport which has a vertical scrollbar
                browser.driver.manage().window().setSize( 1024, 300 );

                var scrollTopValue = 100;
                browser.driver.executeScript( 'window.scrollTo( 0, ' + scrollTopValue + ' )' );
                filterFormTriggerButton.click();
                browser.driver.executeScript( 'return window.pageYOffset;' ).then( function ( scrollY ) {
                    expect( scrollY ).toBe( scrollTopValue );
                });
            }
        },

        {
            title: 'Filter dialog transitions "out of the button"',
            needsSmallScreen: true,
            testFunction: function() {
                // Well, this doesn't really test if the dialog transition "out of the button", but at least it's able
                // to check if the top coordinate of filterForm gets manipulated (which is the start point of the
                // animation.
                var topInitial, topAfterFirstScroll;
                filterForm.getCssValue( 'top' )
                    .then( function( top ) {
                        topInitial = top;

                        browser.driver.executeScript( 'window.scrollTo( 0, 100 )' );
                        filterFormTriggerButton.click();
                        $( 'body' ).sendKeys( protractor.Key.ESCAPE );
                        browser.driver.sleep( 1000 ); // make sure the former dialog open / close stuff is done

                        return filterForm.getCssValue( 'top' );
                    })
                    .then( function( top ) {
                        topAfterFirstScroll = top;
                        expect( topAfterFirstScroll ).not.toBe( topInitial );

                        browser.driver.executeScript( 'window.scrollTo( 0, 50 )' );
                        filterFormTriggerButton.click();
                        $( 'body' ).sendKeys( protractor.Key.ESCAPE );
                        browser.driver.sleep( 1000 ); // make sure the former dialog open / close stuff is done

                        return filterForm.getCssValue( 'top' );
                    })
                    .then( function( top ) {
                        expect( top ).not.toBe( topAfterFirstScroll );
                    })
                ;
            },
        },

        {
            title: 'Right column timeline items should be aligned correctly',
            testFunction: function() {
                // this test depends heavily on the *height* of the window. It will always work, if the window is
                // lower then ~600px. See filter.showFilterForm() for more details.
                browser.driver.manage().window().setSize( 1024, 600 );

                var timelineItems = element.all( by.className( 'l-timeline--item' ) );
                filterFormTriggerButton.click();

                timelineItems.get( 0 ).getCssValue( 'width' )
                    .then( function( width ) {
                        expect( timelineItems.get( 1 ).getCssValue( 'left' ) )
                            .toBe(
                                // parseInt to avoid subpixel results, + 'px' to stay in the same unit
                                parseInt( width, 10 ) + 'px'
                            )
                        ;
                    })
                ;
            }
        }
    ];

    if ( tests.some( function ( test ) { return test.isExclusive; } ) ) {
        tests = tests.filter( function ( test ) { return test.isExclusive; } );
    }

    tests.forEach( function( test ) {
        var aroundFn = function() {
            browser.driver.manage().window().getSize().then( function( size ) {
                var doTest = prepareBrowserViewport( test, size );
                if ( !doTest ) {
                    expect( true ).toBe( true );
                    console.info( 'Skipping test "' + test.title + '", because it needs a certain viewport size ' +
                                  'and we run in a browser in which we can\'t change it.' );
                }
                else {
                    callTestUrl( test );
                    prepareTestVars();

                    browser.getCapabilities().then( function ( capabilities ) {
                        /* Delay test in Chrome, because it plays all transitions when the page is rendering which may
                           lead to inaccurate test results, because the transitions may still be in progress when the
                           first scripted click (or whatever) happens and sometimes this click may land on the just
                           running transition. The correct thing would be to fix the strange behaviour in Chrome right
                           away, but the only way I can think of right now is
                           http://css-tricks.com/transitions-only-after-page-load/ and I don't like a JS solution for
                           that. So, this is the current workaround for the tests, the actual implementation should be
                           changed later. Therefore: TODO */
                        if ( test.needsSmallScreen && capabilities.caps_.browserName === 'chrome' ) {
                            browser.driver.sleep( 500 );
                        }
                        test.testFunction();
                    });
                }
            });
        };

        if ( test.skipTest ) {
            xit( test.title, aroundFn );
        }
        else {
            it( test.title, aroundFn );
        }
    });

    function prepareBrowserViewport( test, viewPortSize ) {
        /* A test can state if it needs a certain viewport size. That means on some environments (like smartphones),
           we have to skip some tests, because the browser there doesn't have the required size and we can't change
           the viewport size.
        */

        var canTestBeExecuted = false;
        if ( global.canBrowserResizeWindow ) {
            // provide a certain default size if the test has needsBigScreen or needSmallScreen
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
        else if ( test.needsSmallScreen && viewPortSize.width < 700 ) {
            canTestBeExecuted = true;
        }
        else if ( test.needsBigScreen && viewPortSize.width > 700 ) {
            canTestBeExecuted = true;
        }

        return canTestBeExecuted;
    }

    function callTestUrl( test ) {
        /* Tests may time out in Safari when you switch from an url to another and the only difference is the hash.
           To prevent this, request another page first.
        */
        browser.get( 'about:blank' );

        // Set special URL if a test demands it.
        var url = 'http://' + global.testHost + '/';

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
