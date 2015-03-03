'use strict';

module.exports = ['$scope', '$state', 'Message', 'dateFormatter', function ($scope, $state, Message, dateFormatter) {

    var currentPagination = 1;
    $scope.itemsPerPage = 30;

    $scope.getThreads = function (paginationNumber) {
        currentPagination = paginationNumber;
        var skip = (paginationNumber - 1) * $scope.itemsPerPage;
        $scope.threads = Message.get({itemsPerPage: $scope.itemsPerPage, skip: skip});
    };
    $scope.getThreads(currentPagination);

    $scope.getFormattedDate = dateFormatter.format;

    $scope.openThread = function (threadId, isGroupThread) {
        $state.go('message.threads.detail', {threadId: threadId, isGroupThread: isGroupThread});
    };

    $scope.$on('message.changed', function () {
        $scope.getThreads(currentPagination);
    });
}];
