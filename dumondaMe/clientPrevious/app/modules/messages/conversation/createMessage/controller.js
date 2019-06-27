'use strict';

module.exports =
    ['Conversation', 'ConversationMessageService', 'ElyModal', 'CreateMessageCheck', 'errorToast',
        function (Conversation, ConversationMessageService, ElyModal, CreateMessageCheck, errorToast) {
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
                    message = ConversationMessageService.getMessage(ctrl.destinationUserId, ctrl.threadId, ctrl.newMessage);
                    ctrl.uploadStarted = true;
                    Conversation.save(message, function (resp) {
                        ctrl.uploadStarted = false;
                        resp.message.isUser = true;
                        ElyModal.hide(resp.message);
                    }, function() {
                        ctrl.uploadStarted = false;
                        errorToast.showError('Beim Senden der Nachricht ist ein Fehler aufgetretten!');
                    });
                }
            };
        }];

