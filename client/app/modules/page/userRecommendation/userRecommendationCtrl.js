'use strict';

module.exports = ['$scope', 'PageLeftNavElements', 'PageUserRecommendation', 'PageSearchUserRecommendation',
    function ($scope, PageLeftNavElements, PageUserRecommendation, PageSearchUserRecommendation) {

        var itemsPerPage = 30;
        $scope.noSearchResult = false;
        $scope.$emit(PageLeftNavElements.event, PageLeftNavElements.elements);

        $scope.getPageUserRecommendation = function (paginationNumber) {
            var skip = (paginationNumber - 1) * itemsPerPage;
            $scope.noSearchResult = false;
            $scope.pagePreviews = PageUserRecommendation.get({skip: skip, maxItems: itemsPerPage});
        };

        $scope.searchPageUserRecommendation = function (searchValue) {
            if (searchValue && searchValue.trim().length > 0) {
                $scope.noSearchResult = false;
                $scope.pageSearchPreviews = PageSearchUserRecommendation.get({
                    search: searchValue,
                    maxItems: itemsPerPage,
                    skip: 0
                }, function () {
                    if ($scope.pageSearchPreviews.pages && $scope.pageSearchPreviews.pages.length > 0) {
                        $scope.pagePreviews = $scope.pageSearchPreviews;
                    } else {
                        $scope.noSearchResult = true;
                    }
                });
            } else {
                $scope.getPageUserRecommendation(1);
            }
        };
        $scope.getPageUserRecommendation(1);
    }];
