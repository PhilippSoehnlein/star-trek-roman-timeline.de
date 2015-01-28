( function () {
    /* global Isotope:true, window:true, document:true */
    'use strict';

    function Filter() {
        var config = {
            filterFormId:              'serienauswahl',
            filerFormPositionSelector: '.l-filter-box--dialog',
            filterFormVisibleClass:    'is-l-filter-box-dialog-visible',
            timelineId:                'timeline',
            timelineItemClass:         '_is_timeline_item',
            itemIsOddClass:            'is-l-timeline-item-odd',
            itemIsEvenClass:           'is-l-timeline-item-even',
            itemIsFirstClass:          'is-l-timeline-item-first',
        };

        var triggerButtons         = [];
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

            // fill filterForm
            filterForm = document.getElementById( config.filterFormId );

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

            var isFilterFormVisible = filterForm.classList.contains( config.filterFormVisibleClass );
            if ( isFilterFormVisible ) {
                closeFilterForm();
            }
            else {
                showFilterForm( { clickedButton: event.target } );
            }
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
                    For a short time Isotope sets all items to "position: absolute" during init, which leads to a
                    collapse of the current scroll position if the browser window is higher than the page without
                    the items (because of layout collapsing). To prevent this, save current scroll position and
                    recover it after Isotope is initialized.
                */
                var currentScrollPosition = {
                    top:  window.pageYOffset,
                    left: window.pageXOffset
                };

                isotope = new Isotope( '#' + config.timelineId, { itemSelector: '.' + config.timelineItemClass, });

                window.scrollTo( currentScrollPosition.left, currentScrollPosition.top );
            }

            updateBookCounts();
        }

        function closeFilterForm() {
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

        function onCheckboxChanged( checkbox ) {
            /* jshint unused: false */
            var choosenSeries = filterCheckboxes
                .filter( function( checkbox ) { return checkbox.checked; } )
                .map(    function( checkbox ) { return checkbox.getAttribute( 'value' ); } )
            ;
            if ( choosenSeries.length === 0 ) {
                choosenSeries = filterCheckboxes.map( function( checkbox ) {
                    return checkbox.getAttribute( 'value' );
                } );
            }

            updateBookCounts();

            filterSeriesCountNodes.forEach( function( node ) {
                node.innerHTML = choosenSeries.length;
            });

            // TODO: Only do this in desktop mode.
            var numberOfVisibleItems = 0;
            isotope.arrange({
                //transitionDuration: '1s',
                filter: function( itemNode ) {
                    var itemSeries          = itemNode.getAttribute( 'data-timline-item-series' );
                    var itemShouldBeVisible = choosenSeries.some( function ( seriesId ) { return seriesId === itemSeries } );

                    if ( itemShouldBeVisible ) {
                        numberOfVisibleItems++;
                        var itemNodeClasses = itemNode.classList;
                        itemNodeClasses.remove( config.itemIsFirstClass );
                        itemNodeClasses.remove( config.itemIsOddClass );
                        itemNodeClasses.remove( config.itemIsEvenClass );
                        itemNodeClasses.add( numberOfVisibleItems % 2 == 0 ? config.itemIsEvenClass : config.itemIsOddClass );
                        if ( numberOfVisibleItems === 1 ) {
                            itemNodeClasses.add( config.itemIsFirstClass );
                        }
                    }

                    return itemShouldBeVisible;
                }
            });
        }

        function updateBookCounts() {
            var bookCount = 0;

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
        new Filter();
    }() );
}() );
