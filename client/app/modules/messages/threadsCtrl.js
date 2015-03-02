'use strict';

module.exports = ['$scope', '$state', 'Message', 'dateFormatter', function ($scope, $state, Message, dateFormatter) {

    $scope.itemsPerPage = 10;

    $scope.threads = Message.get({itemsPerPage: $scope.itemsPerPage, skip: 0});

    $scope.getFormattedDate = dateFormatter.format;

    $scope.openThread = function (threadId, isGroupThread) {
        $state.go('message.threads.detail', {threadId: threadId, isGroupThread: isGroupThread});
    };

    $scope.$on('message.changed', function () {
        $scope.threads = Message.get({itemsPerPage: $scope.itemsPerPage, skip: 0});
    });
}];
