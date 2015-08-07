'use strict';

module.exports = ['$scope', 'dateFormatter', '$state', 'PageCategories', 'UrlCache',
    function ($scope, dateFormatter, $state, PageCategories, UrlCache) {

        $scope.getFormattedDate = dateFormatter.formatRelativeTimes;
        $scope.cacheUrl = UrlCache.cacheUrl;

        $scope.category = PageCategories.categories[$scope.element.label].description;

        $scope.openDetail = function (pageId, label) {
            $state.go('page.detail', {
                label: label,
                pageId: pageId
            });
        };
    }];

