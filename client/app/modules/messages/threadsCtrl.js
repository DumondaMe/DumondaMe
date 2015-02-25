'use strict';

module.exports = ['$scope', '$state', 'Message', 'dateFormatter', function ($scope, $state, Message, dateFormatter) {

    $scope.itemsPerPage = 10;

    $scope.threads = Message.get({itemsPerPage: $scope.itemsPerPage, skip: 0}, function () {
        angular.forEach()
    });

    $scope.getFormattedDate = function (dateValue) {
        return dateFormatter.format(dateValue);
    };

    $scope.openThread = function (threadId, isGroupThread) {
        $state.go('message.threads.detail', {threadId: threadId, isGroupThread: isGroupThread});
    };
}];
