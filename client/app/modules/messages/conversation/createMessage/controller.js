'use strict';

module.exports =
    ['Conversation', 'ConversationMessageService', 'ElyModal', 'CreateMessageCheck',
        function (Conversation, ConversationMessageService, ElyModal, CreateMessageCheck) {
            var ctrl = this;
            ctrl.newMessage = '';
            ctrl.uploadAllowed = false;

            ctrl.messageTextChanged = function () {
                ctrl.uploadAllowed = CreateMessageCheck.isSendMessageAllowed(ctrl.newMessage);
            };

            ctrl.cancel = function () {
                ElyModal.cancel();
            };

            ctrl.sendMessage = function () {
                var message;
                if (ctrl.uploadAllowed) {
                    message = ConversationMessageService.getMessage(ctrl.isGroupThread, ctrl.threadId, ctrl.newMessage);
                    ctrl.uploadStarted = true;
                    Conversation.save(message, function (resp) {
                        ctrl.uploadStarted = false;
                        resp.message.isUser = true;
                        ElyModal.hide(resp.message);
                    });
                }
            };
        }];

