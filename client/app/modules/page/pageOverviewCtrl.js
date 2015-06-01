'use strict';

module.exports = ['$scope', '$state', 'PageRecommendationContact', 'SearchPage', 'PageCategories', 'PopularPages', 'PageLeftNavElements',
    function ($scope, $state, PageRecommendationContact, SearchPage, PageCategories, PopularPages, PageLeftNavElements) {

        $scope.query = "";
        $scope.hide = false;

        $scope.PageRecommendationContact = PageRecommendationContact;
        $scope.SearchPage = SearchPage;
        $scope.SearchPageParameter = {};
        $scope.PopularPages = PopularPages;

        $scope.$emit(PageLeftNavElements.event, PageLeftNavElements.elements);

        $scope.searchPage = function (searchValue) {
            if (searchValue && searchValue.trim().length > 0) {
                $scope.hide = true;
                $scope.SearchPageParameter = {
                    search: searchValue,
                    isSuggestion: false
                };
            } else {
                $scope.hide = false;
            }
        };

    }];
