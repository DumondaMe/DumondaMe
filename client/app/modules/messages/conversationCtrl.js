'use strict';

module.exports = ['$scope', '$stateParams', 'Conversation', 'Message', 'dateFormatter', 'MessageLeftNavElements',
    function ($scope, $stateParams, Conversation, Message, dateFormatter, MessageLeftNavElements) {

        $scope.settings = {};
        $scope.settings.itemsPerPage = 30;
        $scope.settings.selectedThreadId = $stateParams.threadId;
        $scope.settings.selectedIsGroupThread = $stateParams.isGroupThread === 'true';
        $scope.settings.currentPagination = 1;
        $scope.settings.getThreadAtInit = true;
        $scope.settings.newMessage = '';

        $scope.$emit(MessageLeftNavElements.event, MessageLeftNavElements.elements);

        $scope.$on('message.changed', function () {
            if ($scope.settings.currentPagination === 1) {
                $scope.settings.getThread($scope.settings.currentPagination);
            } else {
                $scope.settings.threads = Message.get({itemsPerPage: 30, skip: 0});
            }
        });

        $scope.getFormattedDate = dateFormatter.formatExact;

        $scope.sendMessage = function () {
            var message;
            if ($scope.settings.newMessage.trim() !== '') {
                if ($scope.settings.selectedIsGroupThread) {
                    message = {
                        addGroupMessage: {
                            threadId: $scope.settings.selectedThreadId,
                            text: $scope.settings.newMessage
                        }
                    };
                } else {
                    message = {
                        addMessage: {
                            threadId: $scope.settings.selectedThreadId,
                            text: $scope.settings.newMessage
                        }
                    };
                }
                Conversation.save(message, function (resp) {
                    $scope.settings.thread.messages.unshift(resp.message);
                    $scope.settings.newMessage = '';
                    $scope.settings.resetTextInputStyle($scope);
                });
            }
        };
    }];
