'use strict';

module.exports = ['$scope', '$state', 'UrlCache', function ($scope, $state, UrlCache) {

    $scope.cacheUrl = UrlCache.cacheUrl;

    $scope.openThread = function (threadId) {
        if (threadId) {
            $state.go('message.threads.detail', {
                threadId: threadId,
                isGroupThread: false
            });
        }
    };
}];
