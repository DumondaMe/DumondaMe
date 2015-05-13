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

module.exports = ['$scope', '$state', 'PageRecommendationContact', 'SearchPage', 'PageCategories',
    function ($scope, $state, PageRecommendationContact, SearchPage, PageCategories) {

        $scope.query = "";
        $scope.itemsPerPage = 30;
        $scope.filterDisabled = true;

        $scope.filters = [{description: 'Buch', filter: 'BookPage'}, {description: 'Video', filter: 'VideoPage'}];

        $scope.getRecommendationContacts = function (skip) {

            skip = (skip - 1) * $scope.itemsPerPage;

            $scope.page = PageRecommendationContact.get({
                maxItems: $scope.itemsPerPage,
                skip: skip,
                filters: getSelectedFilters($scope)
            }, function () {
                delete $scope.lastSearch;
                setCategories($scope.page.pages, PageCategories);
            });
        };
        $scope.getRecommendationContacts(1);

        $scope.createNewPage = function () {
            $state.go('page.create');
        };

        $scope.searchPage = function (searchValue) {
            if (searchValue && searchValue.trim().length > 0) {
                $scope.page = SearchPage.get({
                    search: searchValue,
                    filterType: getSelectedFilters($scope),
                    isSuggestion: false
                }, function () {
                    $scope.lastSearch = searchValue;
                    setCategories($scope.page.pages, PageCategories);
                });
            } else {
                $scope.getRecommendationContacts(1);
            }
        };

        $scope.selectChanged = function () {
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
        };
    }];
