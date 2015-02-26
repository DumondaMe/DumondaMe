'use strict';

module.exports = ['$scope', '$state', '$stateParams', 'Conversation', 'Message', 'dateFormatter',
    function ($scope, $state, $stateParams, Conversation, Message, dateFormatter) {

        $scope.selectedThreadId = $stateParams.threadId;
        $scope.thread = Conversation.get({
            itemsPerPage: 10,
            skip: 0,
            threadId: $stateParams.threadId,
            isGroupThread: $stateParams.isGroupThread
        });
        $scope.threads = Message.get({itemsPerPage: 10, skip: 0});

        $scope.getFormattedDate = dateFormatter.format;

        $scope.openThread = function (threadId, isGroupThread) {
            $state.go('message.threads.detail', {threadId: threadId, isGroupThread: isGroupThread});
        };
    }];
