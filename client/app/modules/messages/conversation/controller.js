'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['ScrollRequest', 'Conversation', 'MessagesScrollRequestResponseHandler', '$stateParams', '$mdMedia', 'MessageNextDayService',
            'dateFormatter', 'ElyModal',
            function (ScrollRequest, Conversation, MessagesScrollRequestResponseHandler, $stateParams, $mdMedia, MessageNextDayService,
                      dateFormatter, ElyModal) {
                var ctrl = this;
                ctrl.initLoad = true;
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
                        ctrl.initLoad = false;
                        ctrl.thread = thread;
                    });
                };

                ctrl.nextMessages();

                ctrl.createMessage = function () {
                    ElyModal.show('CreateMessageCtrl', 'app/modules/messages/conversation/createMessage/template.html',
                        {threadId: ctrl.threadId, description: ctrl.thread.threadDescription})
                        .then(function (newMessage) {
                            ctrl.thread.messages.unshift(newMessage);
                        });
                };
            }];
    }
};

