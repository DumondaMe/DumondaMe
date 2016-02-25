'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['SearchService', 'SearchThread', 'ThreadOverview', 'ScrollRequest', 'ThreadOverviewScrollRequestResponseHandler', 'ToolbarService',
            function (SearchService, SearchThread, ThreadOverview, ScrollRequest, ThreadOverviewScrollRequestResponseHandler, ToolbarService) {
                var ctrl = this;

                ctrl.messages = {threads: []};
                ctrl.initLoad = true;

                ScrollRequest.reset('threadOverview', ThreadOverview.get, ThreadOverviewScrollRequestResponseHandler);

                ctrl.nextThreads = function () {
                    ScrollRequest.nextRequest('threadOverview', ctrl.messages.threads).then(function (messages) {
                        ctrl.initLoad = false;
                        ctrl.messages = messages;
                        ToolbarService.setUnreadMessage(ctrl.messages.totalUnreadMessages);
                    });
                };

                ctrl.nextThreads();

                SearchService.register(ctrl, SearchThread.query, SearchThread.get);

                ctrl.requestStarted = function () {

                };

                ctrl.requestFinished = function (resp) {

                };

                ctrl.abortSearch = function () {

                };
            }];
    }
};

