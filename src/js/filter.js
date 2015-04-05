( function () {
    /* global Isotope:true, window:true, document:true, docReady:true */
    'use strict';

    function Filter() {
        var config = {
            filterFormId:              'serienauswahl',
            filerFormPositionSelector: '.l-filter-box--dialog',
            filterFormVisibleClass:    'is-l-filter-box-dialog-visible',
            filterCloseButtonClass:    '_is_filter_close_button',
            timelineId:                'timeline',
            timelineItemClass:         '_is_timeline_item',
            itemIsOddClass:            'is-l-timeline-item-odd',
            itemIsEvenClass:           'is-l-timeline-item-even',
            itemIsFirstClass:          'is-l-timeline-item-first',
        };

        var triggerButtons         = [];
        var filterCloseButtons     = [];
        var filterForm             = null;
        var filterSubmitButtons    = [];
        var filterCheckboxes       = [];
        var filterBookCountNodes   = [];
        var filterSeriesCountNodes = [];
        var isotope                = null;

        function init() {
            // fill triggerButtons
            [].forEach.call( document.getElementsByClassName( '_is_filter_trigger' ), function( button ) {
                triggerButtons.push( button );
            });

            // assign event to triggerButtons (first one is enough)
            triggerButtons[0].addEventListener( 'click', onFilterTriggerClick, true );

            // fill filterCloseButtons
            [].forEach.call( document.getElementsByClassName( '_is_filter_close_button' ), function( button ) {
                filterCloseButtons.push( button );
            });

            // assign event to filterCloseButtons (first one is enough)
            filterCloseButtons[0].addEventListener( 'click', onFilterCloseClick, false );

            // fill filterForm
            filterForm = document.getElementById( config.filterFormId );
            filterForm.addEventListener( 'submit', onFilterFormSubmit, false );

            // fill filterSubmitButtons
            [].forEach.call( document.getElementsByClassName( '_is_filter_submit_button' ), function( button ) {
                filterSubmitButtons.push( button );
            });

            // fill filterCheckboxes
            [].forEach.call(
                document.querySelectorAll( '#' +  config.filterFormId + ' input[type="checkbox"][name="serie"]' ),
                function( checkbox ) { filterCheckboxes.push( checkbox ); }
            );

            // assign event listener to checkboxes
            filterForm.addEventListener(
                'change',
                function( event ) {
                    if ( event.target.nodeName.toLowerCase() === 'input' &&
                         event.target.getAttribute( 'type' ) === 'checkbox' &&
                         event.target.getAttribute( 'name' ) === 'serie'
                    ) {
                        onCheckboxChanged( event.target );
                    }
                },
                false
            );

            [].forEach.call( document.getElementsByClassName( '_is_filter_book_count' ), function( node ) {
                filterBookCountNodes.push( node );
            });

            [].forEach.call( document.getElementsByClassName( '_is_filter_series_count' ), function( node ) {
                filterSeriesCountNodes.push( node );
            });

            if ( window.location.hash === '#' + config.filterFormId ) {
                showFilterForm();
            }

            // close on escape
            document.addEventListener(
                'keyup',
                function ( event ) {
                    if ( event.keyCode === 27 && getFilterDisplayMode() === 'dialog' &&
                         filterForm.classList.contains( config.filterFormVisibleClass )
                    ) {
                        closeFilterForm();
                    }
                },
                false
            );
        }

        function onFilterTriggerClick( event ) {
            event.preventDefault();

            // TODO: This doesn't work, if we call the site directly with #serienauswahl hash, because then the :target
            // applies, makes the filter visible, but it can never be hidden.
            var isFilterFormVisible = filterForm.classList.contains( config.filterFormVisibleClass );
            if ( isFilterFormVisible ) {
                closeFilterForm();
            }
            else {
                showFilterForm( { clickedButton: event.target } );
            }
        }

        function onFilterCloseClick( event ) {
            event.preventDefault();
            closeFilterForm();
        }

        function onFilterFormSubmit( event ) {
            event.preventDefault();
            filterTimeline();
            closeFilterForm();
        }

        function showFilterForm( params ) {
            if ( getFilterDisplayMode() === 'dialog' ) {
                /* jshint -W030 */
                var triggerButton   = params.clickedButton;
                var buttonBoundings = triggerButton.getBoundingClientRect();
                var topCoordinate   = buttonBoundings.top + ( ( buttonBoundings.bottom - buttonBoundings.top ) / 2 );
                var allStyleSheets  = document.styleSheets;
                var styleSheet      = allStyleSheets[ allStyleSheets.length - 1 ];

                filterForm.style.transition = 'none';
                filterForm.offsetHeight; // force redraw (jshint will complain, error W030)

                styleSheet.insertRule(
                    config.filerFormPositionSelector + ' { top: ' + topCoordinate + 'px; }',
                    styleSheet.cssRules.length
                );
                filterForm.offsetHeight; // force redraw (jshint will complain, error W030)

                filterForm.style.transition = '';
                filterForm.offsetHeight; // force redraw (jshint will complain, error W030)
            }

            filterForm.classList.add( config.filterFormVisibleClass );
            changeFilterDisplayBasedOnMediaQuery();
            window.history.replaceState( {}, null, '#' + config.filterFormId );

            if ( !isotope ) {
                /*
                    (1) For a short time Isotope sets all items to "position: absolute" during init, which leads to a
                    collapse of the current scroll position if the browser window is higher than the page without
                    the items (because of layout collapsing). To prevent this, save current scroll position and
                    recover it after Isotope is initialized.
                    (2) This may also lead to a disappearing scrollbar during init (because all items are layed out
                    at the top left of the parent node. In that case Isotope will calculate slightly wrong item
                    positions for the right column, because they are calculated when the scrollbar isn't there.
                    To fix this, calculate the width of the timeline node, write it into a style attribute, let
                    Isotope initialize and then unset the style attribute.
                    TODO: File a bug at Isotope's Github issue page.
                */
                var timelineNode = document.getElementById( config.timelineId );
                var currentScrollPosition = { // (1)
                    top:  window.pageYOffset,
                    left: window.pageXOffset
                };
                timelineNode.style.width = timelineNode.offsetWidth + 'px'; // (2)

                isotope = new Isotope( '#' + config.timelineId, { itemSelector: '.' + config.timelineItemClass, });

                window.scrollTo( currentScrollPosition.left, currentScrollPosition.top ); // (1)
                timelineNode.style.width = null; // (2)
            }

            updateBookCounts();
        }

        function closeFilterForm() {
            //document.location.hash = '';
            filterForm.classList.remove( config.filterFormVisibleClass );
            window.history.replaceState( {}, null, '/' );
        }

        function changeFilterDisplayBasedOnMediaQuery() {
            var isDialogMode = getFilterDisplayMode() === 'dialog';
            if ( isDialogMode ) {
                filterSubmitButtons.forEach( function( button ) {
                    button.classList.remove( 'hide' );
                });
            }
            else {
                filterSubmitButtons.forEach( function( button ) {
                    button.classList.add( 'hide' );
                });
            }
        }

        function onCheckboxChanged() {
            updateBookCounts();

            var chosenSeries = getChosenSeries();
            filterSeriesCountNodes.forEach( function( node ) {
                // TODO: This is wrong when a series was chosen and then unchosen, because the counter says 4 (=all) instead of 0!
                node.innerHTML = chosenSeries.length;
            });

            if ( getFilterDisplayMode() === 'accordion' ) {
                filterTimeline();
            }
        }

        function getChosenSeries() {
            var chosenSeries = filterCheckboxes
                .filter( function( checkbox ) { return checkbox.checked; } )
                .map(    function( checkbox ) { return checkbox.getAttribute( 'value' ); } )
            ;

            // special behaviour: In no series is chosen, all should be considered chosen.
            if ( chosenSeries.length === 0 ) {
                chosenSeries = filterCheckboxes.map( function( checkbox ) {
                    return checkbox.getAttribute( 'value' );
                } );
            }

            return chosenSeries;
        }

        function filterTimeline() {
            var chosenSeries = getChosenSeries();

            var numberOfVisibleItems = 0;
            isotope.arrange( {
                //transitionDuration: '1s',

                // this function returns if a timeline item is visible and prepares it for being moved to a new position.
                filter: function( itemNode ) {
                    var itemSeries          = itemNode.getAttribute( 'data-timline-item-series' );
                    var itemShouldBeVisible = chosenSeries.some( function ( seriesId ) {
                        return seriesId === itemSeries;
                    } );

                    if ( itemShouldBeVisible ) {
                        numberOfVisibleItems++;
                        var itemNodeClasses = itemNode.classList;
                        itemNodeClasses.remove( config.itemIsFirstClass );
                        itemNodeClasses.remove( config.itemIsOddClass );
                        itemNodeClasses.remove( config.itemIsEvenClass );
                        itemNodeClasses.add( numberOfVisibleItems % 2 === 0 ?
                                                config.itemIsEvenClass :
                                                config.itemIsOddClass
                        );
                        if ( numberOfVisibleItems === 1 ) {
                            itemNodeClasses.add( config.itemIsFirstClass );
                        }
                    }

                    return itemShouldBeVisible;
                }
            } );
        }

        function updateBookCounts() {
            var bookCount = 0;

            // TODO: Refactor. This is basically the same as getChosenSeries()
            var checkedCheckboxes = filterCheckboxes.filter( function( checkbox ) { return checkbox.checked; } );
            if ( checkedCheckboxes.length === 0 ) {
                checkedCheckboxes = filterCheckboxes;
            }

            checkedCheckboxes.forEach( function( checkedCheckbox ) {
                var count = parseInt( checkedCheckbox.getAttribute( 'data-book-count' ), 10 );
                if ( !isNaN( count ) ) {
                    bookCount += count;
                }
                else {
                    console.error( 'data-book-count of this checkbox doesn\'t contain a number.' );
                }
            });

            filterBookCountNodes.forEach( function( node ) {
                node.innerHTML = bookCount + ( bookCount === 1 ? ' Buch' : ' Bücher' );
            });
        }

        function getFilterDisplayMode() {
            // see https://github.com/jquery/jquery/blob/master/src/dimensions.js#L24
            var viewportWidth = document.documentElement.clientWidth;

            // TODO: Find a way to not hard code the value!
            return viewportWidth > 700 ? 'accordion' : 'dialog';
        }

        init();
    }

    ( function() {
        /* jshint nonew: false */

        // docReady is a dependency of Isotope and is therefore in Isotope.pkgd.js
        docReady( function() { new Filter(); } );
    }() );
}() );
