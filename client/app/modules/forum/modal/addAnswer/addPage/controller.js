'use strict';

var charCodeEnter = 13;

module.exports = ['$scope', 'SearchPage',
    function ($scope, SearchPage) {
        var ctrl = this;

        ctrl.querySearch = function (pageQuery) {
            return SearchPage.get({search: pageQuery, isSuggestion: true, skip: 0, maxItems: 3}).$promise.then(function (resp) {
                return resp.pages;
            });
        };

        ctrl.querySearchFull = function (pageQuery) {
            ctrl.searchResult = SearchPage.get({search: pageQuery, isSuggestion: false, skip: 0, maxItems: 10}, function (resp) {
                ctrl.test = 0;
            });
        };

        ctrl.keyPressed = function ($event) {
            if ($event.charCode === charCodeEnter || $event.keyCode === charCodeEnter) {
                $scope.$$childHead.$mdAutocompleteCtrl.hidden = true;
                ctrl.querySearchFull(ctrl.search);
            }
        };
        
        ctrl.addPage = function () {
            ctrl.finish(ctrl.pageToAdd);
        };

        ctrl.selectedPage = function (page) {
            ctrl.pageToAdd = page;
        }
    }];
