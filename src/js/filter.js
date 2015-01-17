(function () {
    'use strict';

    function Filter() {
        var config = {
            filterFormId:           'serienauswahl',
            filterFormVisibleClass: 'is-l-filter-box-dialog-visible',
            timelineId:             'timeline',
            timelineItemClass:      'l-timeline--item',
        };

        var triggerButtons       = [];
        var filterForm           = null;
        var filterSubmitButtons  = [];
        var filterCheckboxes     = [];
        var filterBookCountNodes = [];
        var isotope              = null;

        function init() {
            // fill triggerButtons
            [].forEach.call( document.getElementsByClassName( '_is_filter_trigger' ), function( button ) {
                triggerButtons.push( button );
            });

            // assign event to triggerButtons
            triggerButtons.forEach( function(button) {
                button.addEventListener( 'click', onFilterTriggerClick, false );
            });

            // fill filterForm
            filterForm = document.getElementById( config.filterFormId );

            // fill filterSubmitButtons
            [].forEach.call( document.getElementsByClassName( '_is_filter_submit_button' ), function( button ) {
                filterSubmitButtons.push( button );
            });

            // fill filterCheckboxes
            [].forEach.call( document.querySelectorAll( 'input[type="checkbox"][name="serie"]' ), function( checkbox ) {
                filterCheckboxes.push( checkbox );
            });

            // assign event listener to checkboxes
            filterForm.addEventListener(
                'change',
                function( event ) {
                    if (    event.target.nodeName.toLowerCase() === 'input'
                         && event.target.getAttribute( 'type' ) === 'checkbox'
                         && event.target.getAttribute( 'name' ) === 'serie'
                    ) {
                        onCheckboxChanged( event.target );
                    }
                },
                false
            );

            [].forEach.call( document.getElementsByClassName( '_is_filter_book_count' ), function ( node ) {
                filterBookCountNodes.push( node );
            });

            if ( window.location.hash === '#' + config.filterFormId ) {
                showFilterForm();
            }
        }

        function onFilterTriggerClick( event ) {
            event.preventDefault();

            var isFilterFormVisible = filterForm.classList.contains( config.filterFormVisibleClass );
            if ( isFilterFormVisible ) {
                closeFilterForm();
            }
            else {
                showFilterForm();
            }
        }

        function showFilterForm() {
            filterForm.classList.add( config.filterFormVisibleClass );
            changeFilterDisplayBasedOnMediaQuery();
            window.history.replaceState( {}, null, '#' + config.filterFormId );

            if ( !isotope ) {
                isotope = new Isotope( '#' + config.timelineId, { itemSelector: '.' + config.timelineItemClass, });
                isotope.on( 'layoutComplete', afterTimelineFiltered );
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
            var choosenSeries = filterCheckboxes
                .filter( function(checkbox) { return checkbox.checked; } )
                .map( function(checkbox) { return checkbox.getAttribute('value'); } )
            ;

            // TODO: Only do this in desktop mode.
            isotope.arrange({
                //transitionDuration: '1s',
                filter: function( itemNode ) {
                    var itemSeries = itemNode.getAttribute( 'data-timline-item-series' );
                    return choosenSeries.some( function ( seriesId ) { return seriesId === itemSeries } );
                }
            });
        }

        function afterTimelineFiltered() {
            updateBookCounts();
        }

        function updateBookCounts() {
            var elements = isotope.getItemElements();
            var nr = elements.filter( function( element ) { return element.offsetWidth > 0 || element.offsetHeight > 0 } ).length;
            //console.log(nr);
            filterBookCountNodes.forEach( function( node ) {
                node.innerHTML = nr;
            });
        }

        function getFilterDisplayMode() {
            // TODO: Find a way to not hard code the value!
            var viewportWidth = document.documentElement.clientWidth; // see https://github.com/jquery/jquery/blob/master/src/dimensions.js#L24
            return viewportWidth > 700 ? 'accordion' : 'dialog';
        }

        init();
    }

    new Filter();
}());
