(function () {
    'use strict';

    function Filter() {
        var config = {
            filterFormId:           'serienauswahl',
            filterFormVisibleClass: 'is-l-filter-box-dialog-visible',
        };

        var triggerButtons      = [];
        var filterForm          = null;
        var filterSubmitButtons = [];

        function init() {
            var buttons;

            // fill triggerButtons
            buttons = document.getElementsByClassName( '_is_filter_trigger' );
            for ( var i = 0; i < buttons.length; i++ ) {
                triggerButtons.push( buttons.item(i) );
            }

            // assign event to triggerButtons
            triggerButtons.forEach( function(button) {
                button.addEventListener( 'click', onFilterTriggerClick, false );
            });

            // fill filterForm
            filterForm = document.getElementById( config.filterFormId );

            // fill filterSubmitButtons
            buttons = document.getElementsByClassName( '_is_filter_submit_button' );
            for ( var i = 0; i < buttons.length; i++ ) {
                filterSubmitButtons.push( buttons.item(i) );
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
        }

        function closeFilterForm() {
            filterForm.classList.remove( config.filterFormVisibleClass );
            window.history.replaceState( {}, null, '/' );
        }

        function changeFilterDisplayBasedOnMediaQuery() {
            var isDialogMode = false;
            if ( window.matchMedia && window.matchMedia( '(max-width: 700px)' ).matches ) { // TODO: Find a way to not hard code the media query!
                isDialogMode = true;
            }

            // TODO: Set status box text
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

        init();
    }

    new Filter();
}());
