'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['SearchService', 'SearchThread', 'ThreadOverview', 'ScrollRequest', 'ThreadOverviewScrollRequestResponseHandler', 'ToolbarService',
            function (SearchService, SearchThread, ThreadOverview, ScrollRequest, ThreadOverviewScrollRequestResponseHandler, ToolbarService) {
                var ctrl = this;

                ctrl.messages = {threads: []};
                ctrl.showLoad = true;
                ctrl.showThreadSearch = false;

                ScrollRequest.reset('threadOverview', ThreadOverview.get, ThreadOverviewScrollRequestResponseHandler);

                ctrl.nextThreads = function () {
                    ScrollRequest.nextRequest('threadOverview', ctrl.messages.threads).then(function (messages) {
                        ctrl.showLoad = false;
                        ctrl.messages = messages;
                        ToolbarService.setUnreadMessage(ctrl.messages.totalUnreadMessages);
                    });
                };

                ctrl.nextThreads();

                SearchService.register(ctrl, SearchThread.query, SearchThread.get);

                ctrl.requestStarted = function () {
                    ctrl.showLoad = true;
                };

                ctrl.requestFinished = function (resp) {
                    ctrl.showLoad = false;
                    ctrl.showThreadSearch = true;
                    ctrl.threadSearchResult = resp;
                };

                ctrl.abortSearch = function () {
                    ctrl.showLoad = false;
                    ctrl.showThreadSearch = false;
                    delete ctrl.threadSearchResult;
                };
            }];
    }
};

