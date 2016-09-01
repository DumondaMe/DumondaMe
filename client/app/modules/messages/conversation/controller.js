'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$scope', 'ScrollRequest', 'Conversation', 'MessagesScrollRequestResponseHandler', '$stateParams', '$mdMedia',
            'MessageNextDayService', 'dateFormatter', 'ElyModal', 'UnreadMessagesService', 'userInfo', 'ConversationModificationUpdate',
            function ($scope, ScrollRequest, Conversation, MessagesScrollRequestResponseHandler, $stateParams, $mdMedia, MessageNextDayService,
                      dateFormatter, ElyModal, UnreadMessagesService, userInfo, ConversationModificationUpdate) {
                var ctrl = this;
                ctrl.showLoad = true;
                ctrl.$mdMedia = $mdMedia;
                ctrl.checkIsNewDay = MessageNextDayService.checkIsNewDay;
                ctrl.format = dateFormatter.format;

                ctrl.thread = {messages: []};
                ctrl.threadId = $stateParams.threadId;
                ctrl.isGroupThread = $stateParams.isGroupThread === 'true';

                ScrollRequest.reset('messages', Conversation.get, MessagesScrollRequestResponseHandler);

                ctrl.nextMessages = function () {
                    ScrollRequest.nextRequest('messages', ctrl.thread.messages, {
                        threadId: ctrl.threadId
                    }).then(function (thread) {
                        ctrl.showLoad = false;
                        ctrl.thread = thread;
                        UnreadMessagesService.setUnreadMessage(ctrl.thread.totalUnreadMessages);
                    });
                };

                ctrl.nextMessages();

                ctrl.createMessage = function () {
                    ElyModal.show('CreateMessageCtrl', 'app/modules/messages/conversation/createMessage/template.html',
                        {threadId: ctrl.threadId, description: ctrl.thread.threadDescription})
                        .then(function (newMessage) {
                            ctrl.thread.messages.unshift(newMessage);
                            ScrollRequest.addedElement('messages');
                        });
                };

                //Connect to modification change
                userInfo.register('conversation', ctrl);

                ctrl.modificationChanged = function (modification) {
                    ConversationModificationUpdate.update(ctrl.threadId, modification.messages).then(function (newMessages) {
                        if (newMessages && newMessages.hasOwnProperty('messages')) {
                            ctrl.thread.messages = newMessages.messages.concat(ctrl.thread.messages);
                            ScrollRequest.addedMultibleElements('messages', newMessages.messages.length);
                            UnreadMessagesService.setUnreadMessage(newMessages.totalUnreadMessages);
                        }
                    });
                };

                $scope.$on("$destroy", function () {
                    userInfo.remove('conversation');
                });
                //--------------------------------------------
            }];
    }
};

