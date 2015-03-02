'use strict';

module.exports = ['$scope', '$state', '$stateParams', 'Conversation', 'Message', 'dateFormatter',
    function ($scope, $state, $stateParams, Conversation, Message, dateFormatter) {

        var isGroupThread = $stateParams.isGroupThread === 'true', getThread;
        $scope.newMessage = '';
        $scope.selectedThreadId = $stateParams.threadId;
        getThread = function () {
            $scope.thread = Conversation.get({
                itemsPerPage: 10,
                skip: 0,
                threadId: $stateParams.threadId,
                isGroupThread: $stateParams.isGroupThread
            }, function () {
                $scope.threads = Message.get({itemsPerPage: 10, skip: 0});
            });
        };
        getThread();

        $scope.$on('message.changed', function () {
            getThread();
        });

        $scope.getFormattedDate = dateFormatter.formatExact;

        $scope.openThread = function (threadId, isGroupThread) {
            $state.go('message.threads.detail', {threadId: threadId, isGroupThread: isGroupThread});
        };

        $scope.sendMessage = function () {
            var message;
            if ($scope.newMessage.trim() !== '') {
                if (isGroupThread) {
                    message = {
                        addGroupMessage: {
                            threadId: $stateParams.threadId,
                            text: $scope.newMessage
                        }
                    };
                } else {
                    message = {
                        addMessage: {
                            threadId: $stateParams.threadId,
                            text: $scope.newMessage
                        }
                    };
                }
                Conversation.save(message, function (resp) {
                    $scope.thread.messages.unshift(resp.message);
                    $scope.newMessage = '';
                });
            }
        };
    }];
