'use strict';

var setCategories = function (pages, PageCategories) {
    angular.forEach(pages, function (page) {
        page.category = PageCategories.categories[page.label];
    });
};

module.exports = ['$scope', '$state', 'Page', 'SearchPage', 'PageCategories',
    function ($scope, $state, Page, SearchPage, PageCategories) {

        $scope.query = "";
        $scope.itemsPerPage = 30;

        $scope.getPages = function (skip) {
            $scope.page = Page.get({maxItems: $scope.itemsPerPage, skip: skip * $scope.itemsPerPage}, function () {
                setCategories($scope.page.pages, PageCategories);
            });
        };
        $scope.getPages(0);

        $scope.createNewPage = function () {
            $state.go('page.create');
        };

        $scope.searchPage = function (searchValue) {
            if (searchValue && searchValue.trim().length > 0) {
                $scope.page = SearchPage.get({
                    search: searchValue,
                    filterType: 'NoFilter',
                    filterLanguage: 'NoFilter',
                    isSuggestion: false
                }, function () {
                    setCategories($scope.page.pages, PageCategories);
                });
            } else {
                $scope.getPages(0);
            }
        };
    }];
