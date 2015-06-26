'use strict';

var addPagePreviews = function ($scope, paginationNumber) {
    if (paginationNumber === 1 || !$scope.pagePreviews) {
        $scope.pagePreviews = $scope.pagePreviewsTemp;
        if($scope.pagePreviews.pages.length === 0) {
            $scope.noPageRecommendation = true;
        }
    } else {
        $scope.pagePreviews.pages.push.apply($scope.pagePreviews.pages, $scope.pagePreviewsTemp.pages);
        $scope.pagePreviews.totalNumberOfPages = $scope.pagePreviewsTemp.totalNumberOfPages;
    }
};

module.exports = ['$scope', 'PageLeftNavElements', 'PageUserRecommendation', 'PageSearchUserRecommendation',
    function ($scope, PageLeftNavElements, PageUserRecommendation, PageSearchUserRecommendation) {

        var itemsPerPage = 30, searchActive = false, lastSearch = '';
        $scope.noSearchResult = false;
        $scope.noPageRecommendation = false;
        $scope.currentSkip = 1;
        $scope.$emit(PageLeftNavElements.event, PageLeftNavElements.elements);

        $scope.getPageUserRecommendation = function (paginationNumber) {
            var skip = (paginationNumber - 1) * itemsPerPage;
            $scope.noSearchResult = false;
            $scope.pagePreviewsTemp = PageUserRecommendation.get({skip: skip, maxItems: itemsPerPage}, function () {
                searchActive = false;
                $scope.noPageRecommendation = false;
                addPagePreviews($scope, paginationNumber);
            });
        };

        $scope.searchSuggestionPageUserRecommendation = function (searchValue) {
            if (searchValue && searchValue.trim().length > 0) {
                return PageSearchUserRecommendation.query({
                    search: searchValue,
                    maxItems: 7,
                    skip: 0,
                    isSuggestion: true
                }).$promise;
            } else {
                if (searchActive) {
                    $scope.currentSkip = 1;
                    $scope.getPageUserRecommendation(1);
                }
            }
        };

        $scope.searchPageUserRecommendation = function (searchValue, paginationNumber) {
            var skip = 0;
            if (searchValue && searchValue.trim().length > 0) {
                $scope.noSearchResult = false;
                if (isFinite(paginationNumber)) {
                    skip = (paginationNumber - 1) * itemsPerPage;
                } else {
                    $scope.currentSkip = 1;
                }
                $scope.pageSearchPreviews = PageSearchUserRecommendation.get({
                    search: searchValue,
                    maxItems: itemsPerPage,
                    skip: skip,
                    isSuggestion: false
                }, function () {
                    searchActive = true;
                    lastSearch = searchValue;
                    if ($scope.pageSearchPreviews.pages && $scope.pageSearchPreviews.pages.length > 0) {
                        if (skip === 0) {
                            $scope.pagePreviews = $scope.pageSearchPreviews;
                        } else {
                            $scope.pagePreviews.pages.push.apply($scope.pagePreviews.pages, $scope.pageSearchPreviews.pages);
                            $scope.pagePreviews.totalNumberOfPages = $scope.pageSearchPreviews.totalNumberOfPages;
                        }
                    } else {
                        $scope.noSearchResult = true;
                    }
                });
            } else {
                $scope.currentSkip = 1;
                $scope.getPageUserRecommendation(1);
            }
        };

        $scope.getNextUserPageRecommendation = function () {
            $scope.currentSkip++;
            if (searchActive) {
                $scope.searchPageUserRecommendation(lastSearch, $scope.currentSkip);
            } else {
                $scope.getPageUserRecommendation($scope.currentSkip);
            }

        };
        $scope.getPageUserRecommendation(1);
    }];
