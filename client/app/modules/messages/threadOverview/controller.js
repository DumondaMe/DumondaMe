'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['SearchUserService', 'Message', 'ScrollRequest', 'ThreadOverviewScrollRequestResponseHandler',
            function (SearchUserService, Message, ScrollRequest, ThreadOverviewScrollRequestResponseHandler) {
                var ctrl = this;

                ctrl.messages = {threads: []};

                ScrollRequest.reset('threadOverview', Message.get, ThreadOverviewScrollRequestResponseHandler);

                ctrl.nextThreads = function () {
                    ScrollRequest.nextRequest('threadOverview', ctrl.messages.threads).then(function (messages) {
                        ctrl.messages = messages;
                    });
                };

                ctrl.nextThreads();

                SearchUserService.register(ctrl);

                ctrl.requestStarted = function () {

                };

                ctrl.requestFinished = function (resp) {

                };

                ctrl.abortSearch = function () {

                };
            }];
    }
};

