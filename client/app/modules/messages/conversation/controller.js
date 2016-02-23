'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['ScrollRequest', 'Conversation', 'MessagesScrollRequestResponseHandler', '$stateParams', '$mdMedia', 'MessageNextDayService',
            'dateFormatter',
            function (ScrollRequest, Conversation, MessagesScrollRequestResponseHandler, $stateParams, $mdMedia, MessageNextDayService,
                      dateFormatter) {
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
                        threadId: ctrl.threadId,
                        isGroupThread: ctrl.isGroupThread
                    }).then(function (thread) {
                        ctrl.initLoad = false;
                        ctrl.thread = thread;
                    });
                };

                ctrl.nextMessages();

                ctrl.newMessageSent = function (newMessage) {
                    ctrl.thread.messages.unshift(newMessage);
                };
            }];
    }
};

