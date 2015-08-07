'use strict';

module.exports = ['$scope', 'dateFormatter', '$state', 'UrlCache', function ($scope, dateFormatter, $state, UrlCache) {

    $scope.cacheUrl = UrlCache.cacheUrl;

    $scope.openDetail = function (userId) {
        if (userId) {
            $state.go('contact.detail', {
                userId: userId
            });
        }
    };

    $scope.getFormattedDate = dateFormatter.formatRelativeTimes;
}];

