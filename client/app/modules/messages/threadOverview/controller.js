'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$scope', 'SearchService', 'SearchThread', 'ThreadOverview', 'ScrollRequest', 'ThreadOverviewScrollRequestResponseHandler',
            'ToolbarService', 'userInfo', 'ThreadsModificationUpdate',
            function ($scope, SearchService, SearchThread, ThreadOverview, ScrollRequest, ThreadOverviewScrollRequestResponseHandler,
                      ToolbarService, userInfo, ThreadsModificationUpdate) {
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

                //Functions for handling Search
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

                //Connect to modification change
                userInfo.register('threadOverview', ctrl);

                ctrl.modificationChanged = function (modification) {
                    ThreadsModificationUpdate.update(ctrl.messages.threads, modification.messages);
                };

                $scope.$on("$destroy", function () {
                    userInfo.remove('threadOverview');
                });
                //--------------------------------------------
            }];
    }
};

