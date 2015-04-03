'use strict';

module.exports = ['$scope', '$state', '$stateParams', 'Conversation', 'Message',
    function ($scope, $state, $stateParams, Conversation, Message) {

        $scope.settings = {};
        $scope.settings.getThreadAtInit = false;
        $scope.settings.thread = {threadDescription: $stateParams.name};

        $scope.settings.threads = Message.get({itemsPerPage: 30, skip: 0});

        $scope.sendMessage = function () {
            var message;
            if ($scope.settings.newMessage.trim() !== '') {
                message = {
                    newSingleThread: {
                        contactId: $stateParams.userId,
                        text: $scope.settings.newMessage
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
