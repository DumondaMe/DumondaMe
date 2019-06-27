'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['dateFormatter', '$state', 'ElyModal',
            function (dateFormatter, $state, ElyModal) {
                var ctrl = this;

                ctrl.getFormattedDate = dateFormatter.format;

                ctrl.goToConversation = function () {
                    if (ctrl.thread.lastUpdate) {
                        $state.go('message.threads.detail', {threadId: ctrl.thread.threadId});
                    }
                };

                ctrl.writeMessage = function () {
                    ElyModal.show('CreateMessageCtrl', 'app/modules/messages/conversation/createMessage/template.html',
                        {destinationUserId: ctrl.thread.userId, description: ctrl.thread.description})
                        .then(function (newMessage) {
                            $state.go('message.threads.detail', {threadId: newMessage.threadId});
                        });
                };
            }];
    }
};

