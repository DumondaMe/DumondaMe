'use strict';

var categories = {
    BookPage: 'Buch',
    VideoPage: 'Video',
    CoursePage: 'Kurs',
    SchoolPage: 'Schule'
};

var setCategories = function (pages) {
    angular.forEach(pages, function (page) {
        page.category = categories[page.label];
    });
};

module.exports = ['$scope', '$state', 'Page', 'SearchPage',
    function ($scope, $state, Page, SearchPage) {

        $scope.itemsPerPage = 30;

        $scope.getPages = function (skip) {
            $scope.page = Page.get({maxItems: $scope.itemsPerPage, skip: skip * $scope.itemsPerPage}, function () {
                setCategories($scope.page.pages);
            });
        };
        $scope.getPages(0);

        $scope.openDetail = function (pageId, label) {
            $state.go('page.detail', {
                label: label,
                pageId: pageId
            });
        };

        $scope.searchPage = function (searchValue) {
            if (searchValue && searchValue.trim().length > 0) {
                $scope.page = SearchPage.get({
                    search: searchValue,
                    filterType: 'NoFilter',
                    filterLanguage: 'NoFilter',
                    isSuggestion: false
                }, function () {
                    setCategories($scope.page.pages);
                });
            } else {
                $scope.getPages(0);
            }
        };
    }];
