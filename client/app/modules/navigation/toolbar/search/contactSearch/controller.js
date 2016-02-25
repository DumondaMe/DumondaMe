'use strict';

var charCodeEnter = 13;

module.exports = ['$scope', 'SearchService',
    function ($scope, SearchService) {
        var ctrl = this;

        ctrl.querySearch = SearchService.querySuggestion;

        ctrl.commands.abortSearch = function () {
            SearchService.abortSearch();
        };

        ctrl.selectedItemChanged = function () {
            SearchService.startSearchRequest(ctrl.searchText);
        };

        ctrl.keyPressed = function ($event) {
            if ($event.charCode === charCodeEnter || $event.keyCode === charCodeEnter) {
                $scope.$$childHead.$mdAutocompleteCtrl.hidden = true;
                SearchService.startSearchRequest(ctrl.searchText);
            }
        };
    }];