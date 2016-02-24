'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['SearchUserService', 'ThreadOverview', 'ScrollRequest', 'ThreadOverviewScrollRequestResponseHandler',
            function (SearchUserService, ThreadOverview, ScrollRequest, ThreadOverviewScrollRequestResponseHandler) {
                var ctrl = this;

                ctrl.messages = {threads: []};
                ctrl.initLoad = true;

                ScrollRequest.reset('threadOverview', ThreadOverview.get, ThreadOverviewScrollRequestResponseHandler);

                ctrl.nextThreads = function () {
                    ScrollRequest.nextRequest('threadOverview', ctrl.messages.threads).then(function (messages) {
                        ctrl.initLoad = false;
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

