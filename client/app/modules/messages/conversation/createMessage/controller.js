'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['Conversation', 'ConversationMessageService',
            function ( Conversation, ConversationMessageService) {
                var ctrl = this;
                ctrl.newMessage = '';

                ctrl.checkHeightOfInput = function ($event) {
                    if ($event.target.offsetHeight < 110) {
                        if ($event.target.offsetHeight < $event.target.scrollHeight) {
                            ctrl.textInputStyle = {height: $event.target.scrollHeight + 2 + 'px'};
                            ctrl.textInputWrapperStyle = {height: $event.target.scrollHeight + 24 + 'px'};
                        }
                    } else if ($event.target.offsetHeight < 144) {
                        ctrl.textInputWrapperStyle = {height: '144px'};
                    }
                };

                ctrl.sendMessage = function () {
                    var message;
                    if (ctrl.newMessage.trim() !== '' && ctrl.newMessage.length <= 1000) {
                        message = ConversationMessageService.getMessage(ctrl.isGroupThread, ctrl.threadId, ctrl.newMessage);
                        ctrl.uploadStarted = true;
                        Conversation.save(message, function (resp) {
                            ctrl.messageSent(resp.message);
                            ctrl.uploadStarted = false;
                        });
                    }
                };
            }];
    }
};

