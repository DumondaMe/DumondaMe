'use strict';

var addPagePreviews = function ($scope, paginationNumber) {
    if (paginationNumber === 1 || !$scope.pagePreviews) {
        $scope.pagePreviews = $scope.pagePreviewsTemp;
        if ($scope.pagePreviews.pages.length === 0) {
            $scope.noPage = true;
        }
    } else {
        $scope.pagePreviews.pages.push.apply($scope.pagePreviews.pages, $scope.pagePreviewsTemp.pages);
        $scope.pagePreviews.totalNumberOfPages = $scope.pagePreviewsTemp.totalNumberOfPages;
    }
};

module.exports = ['$scope', function ($scope) {

    var itemsPerPage = 30, searchActive = false, lastSearch = '';
    $scope.noSearchResult = false;
    $scope.noPage = false;
    $scope.currentSkip = 1;

    $scope.getPage = function (paginationNumber) {
        var skip = (paginationNumber - 1) * itemsPerPage;
        $scope.noSearchResult = false;
        $scope.pagePreviewsTemp = $scope.getPageService.get({skip: skip, maxItems: itemsPerPage}, function () {
            searchActive = false;
            $scope.noPage = false;
            addPagePreviews($scope, paginationNumber);
        });
    };

    $scope.searchSuggestionPage = function (searchValue) {
        if (searchValue && searchValue.trim().length > 0) {
            return $scope.searchPageService.query({
                search: searchValue,
                maxItems: 7,
                skip: 0,
                isSuggestion: true
            }).$promise;
        } else {
            if (searchActive) {
                $scope.currentSkip = 1;
                $scope.getPage(1);
            }
        }
    };

    $scope.searchPage = function (searchValue, paginationNumber) {
        var skip = 0;
        if (searchValue && searchValue.trim().length > 0) {
            $scope.noSearchResult = false;
            if (isFinite(paginationNumber)) {
                skip = (paginationNumber - 1) * itemsPerPage;
            } else {
                $scope.currentSkip = 1;
            }
            $scope.pageSearchPreviews = $scope.searchPageService.get({
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
            $scope.getPage(1);
        }
    };

    $scope.getNextPages = function () {
        $scope.currentSkip++;
        if (searchActive) {
            $scope.searchPage(lastSearch, $scope.currentSkip);
        } else {
            $scope.getPage($scope.currentSkip);
        }

    };

    $scope.getPage(1);
}];
