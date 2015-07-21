'use strict';

module.exports = ['$scope', '$state', function ($scope, $state) {

    $scope.openThread = function (threadId) {
        if (threadId) {
            $state.go('message.threads.detail', {
                threadId: threadId,
                isGroupThread: false
            });
        }
    };
}];
