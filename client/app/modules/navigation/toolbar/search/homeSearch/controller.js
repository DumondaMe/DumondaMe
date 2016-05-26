'use strict';

var charCodeEnter = 13;

module.exports = ['$scope', 'SearchService', '$state', '$timeout',
    function ($scope, SearchService, $state, $timeout) {
        var ctrl = this;

        ctrl.querySearch = SearchService.querySuggestion;
        ctrl.selectedItem = '';
        ctrl.search = '';

        ctrl.commands.abortSearch = function () {
            SearchService.abortSearch();
            ctrl.search = '';
        };

        ctrl.commands.startSearch = function () {
            if (angular.isString(ctrl.search) && ctrl.search.trim !== '') {
                SearchService.startSearchRequest(ctrl.search);
                ctrl.requestStarted();
            }
        };

        ctrl.openSelectedItem = function () {
            if (ctrl.selectedItem) {
                if (ctrl.selectedItem.hasOwnProperty('userId')) {
                    $timeout(function() {
                        $state.go('user.detail', {userId: ctrl.selectedItem.userId});
                        ctrl.onClose();

                    }, 10);
                } else if (ctrl.selectedItem.hasOwnProperty('pageId')) {
                    $timeout(function() {
                        $state.go('page.detail', {pageId: ctrl.selectedItem.pageId, label: ctrl.selectedItem.label});
                        ctrl.onClose();
                    }, 10);
                }
                ctrl.search = '';
            }
        };


        ctrl.keyPressed = function ($event) {
            if ($event.charCode === charCodeEnter || $event.keyCode === charCodeEnter) {
                $scope.$$childHead.$mdAutocompleteCtrl.hidden = true;
                ctrl.commands.startSearch();
            }
        };
    }];
