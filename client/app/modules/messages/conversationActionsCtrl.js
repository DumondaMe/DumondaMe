'use strict';

module.exports = ['$scope', '$state', 'Message', 'Conversation',
    function ($scope, $state, Message, Conversation) {

        $scope.settings.getThread = function (paginationNumber) {
            var skip = (paginationNumber - 1) * $scope.settings.itemsPerPage;
            $scope.settings.currentPagination = paginationNumber;
            $scope.settings.thread = Conversation.get({
                itemsPerPage: $scope.settings.itemsPerPage,
                skip: skip,
                threadId: $scope.settings.selectedThreadId,
                isGroupThread: $scope.settings.selectedIsGroupThread
            }, function () {
                $scope.settings.threads = Message.get({itemsPerPage: 30, skip: 0});
            });
        };
        if ($scope.settings.getThreadAtInit) {
            $scope.settings.getThread($scope.settings.currentPagination);
        }

        $scope.settings.openThread = function (threadId, isGroupThread) {
            if ($scope.settings.selectedIsGroupThread === isGroupThread && threadId === $scope.settings.selectedThreadId) {
                $scope.settings.getThread(1);
            } else {
                $state.go('message.threads.detail', {
                    threadId: threadId,
                    isGroupThread: isGroupThread
                });
            }
        };

        $scope.settings.checkHeightOfInput = function ($event) {
            if ($event.target.offsetHeight < 74) {
                $scope.settings.textInputStyle = {height: $event.target.scrollHeight + 2 + 'px'};
                $scope.settings.textInputWrapperStyle = {height: $event.target.scrollHeight + 18 + 'px'};
            }
        };

        $scope.settings.resetTextInputStyle = function () {
            $scope.settings.textInputStyle = {};
            $scope.settings.textInputWrapperStyle = {};
        };
    }];
