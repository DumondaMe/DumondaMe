'use strict';

var setCategories = function (pages, PageCategories) {
    angular.forEach(pages, function (page) {
        page.category = PageCategories.categories[page.label];
    });
};

module.exports = ['$scope', '$state', 'PageRecommendationContact', 'SearchPage', 'PageCategories', 'PopularPages', 'PageLeftNavElements',
    function ($scope, $state, PageRecommendationContact, SearchPage, PageCategories, PopularPages, PageLeftNavElements) {

        $scope.query = "";
        $scope.itemsPerPage = 30;
        $scope.filterDisabled = true;

        $scope.filters = [{description: 'Buch', filter: 'BookPage'}, {description: 'Video', filter: 'VideoPage'}];

        $scope.getRecommendationContacts = function (skip) {

            skip = (skip - 1) * $scope.itemsPerPage;

            $scope.newestPages = PageRecommendationContact.get({
                maxItems: $scope.itemsPerPage,
                skip: skip
            }, function () {
                setCategories($scope.newestPages.pages, PageCategories);
            });
        };

        $scope.$emit(PageLeftNavElements.event, PageLeftNavElements.elements);

        $scope.getPopularBooks = function (skip, isContact, store) {

            skip = (skip - 1) * $scope.itemsPerPage;

            $scope[store] = PopularPages.get({
                maxItems: $scope.itemsPerPage,
                skip: skip,
                onlyContacts: isContact,
                category: 'BookPage'
            }, function () {
                setCategories($scope[store].pages, PageCategories);
            });
        };


        $scope.createNewPage = function () {
            $state.go('page.create');
        };

        $scope.searchPage = function (searchValue) {
            if (searchValue && searchValue.trim().length > 0) {
                $scope.search = SearchPage.get({
                    search: searchValue,
                    isSuggestion: false
                }, function () {
                    setCategories($scope.search.pages, PageCategories);
                });
            } else {
                $scope.getOverview();
            }
        };

        $scope.getOverview = function () {
            delete $scope.search;
            $scope.getRecommendationContacts(1);
            $scope.getPopularBooks(1, false, 'popularBookPagesContact');
            $scope.getPopularBooks(1, true, 'popularBookPages');
        };

        $scope.getOverview();
    }];
