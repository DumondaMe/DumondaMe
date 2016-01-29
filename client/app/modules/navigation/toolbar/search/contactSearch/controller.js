'use strict';

var charCodeEnter = 13;

module.exports = ['$scope', 'SearchUserService',
    function ($scope, SearchUserService) {
        var ctrl = this;

        ctrl.querySearch = SearchUserService.querySuggestion;

        ctrl.selectedItemChanged = function () {
            SearchUserService.startUserSearchRequest(ctrl.searchText);
        };

        ctrl.keyPressed = function ($event) {
            if ($event.charCode === charCodeEnter) {
                $scope.$$childHead.$mdAutocompleteCtrl.hidden = true;
                SearchUserService.startUserSearchRequest(ctrl.searchText);
            }
        };
    }];