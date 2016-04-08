'use strict';

var charCodeEnter = 13;

module.exports = ['$scope', 'SearchService',
    function ($scope, SearchService) {
        var ctrl = this;

        ctrl.querySearch = SearchService.querySuggestion;

        ctrl.commands.abortSearch = function () {
            SearchService.abortSearch();
            ctrl.searchText = '';
        };

        ctrl.commands.startSearch = function () {
            if (ctrl.searchText !== '') {
                SearchService.startSearchRequest(ctrl.searchText);
                ctrl.requestStarted();
            }
        };


        ctrl.keyPressed = function ($event) {
            if ($event.charCode === charCodeEnter || $event.keyCode === charCodeEnter) {
                $scope.$$childHead.$mdAutocompleteCtrl.hidden = true;
                ctrl.commands.startSearch();
            }
        };
    }];