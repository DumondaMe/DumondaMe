'use strict';

module.exports = ['$scope', '$state', '$stateParams', 'Conversation', 'Message',
    function ($scope, $state, $stateParams, Conversation, Message) {

        $scope.threads = Message.get({itemsPerPage: 30, skip: 0});

        $scope.sendMessage = function () {
            var message;
            if ($scope.newMessage.trim() !== '') {
                message = {
                    newSingleThread: {
                        contactId: $stateParams.userId,
                        text: $scope.newMessage
                    }
                };
                Conversation.save(message, function (resp) {
                    $state.go('message.threads.detail', {
                        threadId: resp.threadId,
                        isGroupThread: false
                    });
                });
            }
        };
    }];
