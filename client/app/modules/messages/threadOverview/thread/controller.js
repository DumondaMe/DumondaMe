'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['dateFormatter', '$state',
            function (dateFormatter, $state) {
                var ctrl = this;

                ctrl.getFormattedDate = dateFormatter.format;

                ctrl.goToConversation = function () {
                    $state.go('message.threads.detail', {threadId: ctrl.thread.threadId});
                };
            }];
    }
};

