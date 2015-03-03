'use strict';

module.exports = ['$scope', '$state', '$stateParams', 'Conversation', 'Message', 'dateFormatter',
    function ($scope, $state, $stateParams, Conversation, Message, dateFormatter) {

        var isGroupThread = $stateParams.isGroupThread === 'true', currentPagination;
        $scope.itemsPerPage = 30;
        $scope.newMessage = '';
        $scope.selectedThreadId = $stateParams.threadId;
        currentPagination = 1;

        $scope.getThread = function (paginationNumber) {
            var skip = (paginationNumber - 1) * $scope.itemsPerPage;
            currentPagination = paginationNumber;
            $scope.thread = Conversation.get({
                itemsPerPage: $scope.itemsPerPage,
                skip: skip,
                threadId: $stateParams.threadId,
                isGroupThread: $stateParams.isGroupThread
            }, function () {
                $scope.threads = Message.get({itemsPerPage: 30, skip: 0});
            });
        };
        $scope.getThread(currentPagination);

        $scope.$on('message.changed', function () {
            if (currentPagination === 1) {
                $scope.getThread(currentPagination);
            } else {
                $scope.threads = Message.get({itemsPerPage: 30, skip: 0});
            }
        });

        $scope.getFormattedDate = dateFormatter.formatExact;

        $scope.openThread = function (threadId, isGroupThread) {
            var isGroupThreadParam = $stateParams.isGroupThread === 'true';
            if (isGroupThreadParam === isGroupThread && threadId === $stateParams.threadId) {
                $scope.getThread(1);
            } else {
                $state.go('message.threads.detail', {
                    threadId: threadId,
                    isGroupThread: isGroupThread
                });
            }
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
