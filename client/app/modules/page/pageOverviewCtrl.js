'use strict';

module.exports = ['$scope', 'PageRecommendationAllContact', 'SearchPage', 'PageCategories', 'PopularPages', 'PageLeftNavElements',
    function ($scope, PageRecommendationAllContact, SearchPage, PageCategories, PopularPages, PageLeftNavElements) {

        $scope.query = "";
        $scope.hide = false;

        $scope.PageRecommendationAllContact = PageRecommendationAllContact;
        $scope.SearchPage = SearchPage;
        $scope.PopularPages = PopularPages;
        $scope.searchPageRequest = {};
        $scope.popularBooksContact = {initParams: {onlyContacts: true, category: 'Book'}};
        $scope.popularYoutubeContact = {initParams: {onlyContacts: true, category: 'Youtube'}};
        $scope.popularBooksAll = {initParams: {onlyContacts: false, category: 'Book'}};
        $scope.popularYoutubeAll = {initParams: {onlyContacts: false, category: 'Youtube'}};

        $scope.$emit(PageLeftNavElements.event, PageLeftNavElements.elements);

        $scope.searchPage = function (searchValue) {
            if (searchValue && searchValue.trim().length > 0) {
                $scope.hide = true;
                $scope.searchPageRequest.startRequested({
                    search: searchValue,
                    isSuggestion: false
                });
            } else {
                $scope.hide = false;
            }
        };

    }];
