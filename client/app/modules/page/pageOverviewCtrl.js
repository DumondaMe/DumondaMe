'use strict';

var setCategories = function (pages, PageCategories) {
    angular.forEach(pages, function (page) {
        page.category = PageCategories.categories[page.label];
    });
};

var getSelectedFilters = function ($scope) {
    var typesFilter = '';
    if ($scope.filterDisabled) {
        return;
    }
    angular.forEach($scope.filters, function (filter) {
        if (filter.selected) {
            if (typesFilter.length === 0) {
                typesFilter = typesFilter.concat(filter.filter);
            } else {
                typesFilter = typesFilter.concat(',', filter.filter);
            }
        }
    });
    return typesFilter;
};

module.exports = ['$scope', '$state', 'PageRecommendationContact', 'SearchPage', 'PageCategories', 'PopularPages',
    function ($scope, $state, PageRecommendationContact, SearchPage, PageCategories, PopularPages) {

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

        $scope.getOverview = function() {
            delete $scope.search;
            $scope.getRecommendationContacts(1);
            $scope.getPopularBooks(1, false, 'popularBookPagesContact');
            $scope.getPopularBooks(1, true, 'popularBookPages');
        };

        $scope.getOverview();

        /*$scope.selectChanged = function () {
            if ($scope.lastSearch) {
                $scope.searchPage($scope.lastSearch);
            } else {
                $scope.getRecommendationContacts(1);
            }
        };

        $scope.selectedFilter = function (filter) {
            $scope.filterDisabled = false;
            filter.selected = !filter.selected;
            $scope.selectChanged();
        };

        $scope.selectedAllPages = function () {
            $scope.filterDisabled = true;
            angular.forEach($scope.filters, function (filter) {
                filter.selected = false;
            });
            $scope.selectChanged();
        };*/
    }];
