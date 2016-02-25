'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['SearchService', 'SearchUsers',
            function (SearchService, SearchUsers) {
                var ctrl = this;
                ctrl.requestRunning = false;
                ctrl.showUserQuery = false;

                SearchService.register(ctrl, SearchUsers.query, SearchUsers.query);

                ctrl.requestStarted = function () {
                    ctrl.requestRunning = true;
                };

                ctrl.requestFinished = function (resp) {
                    ctrl.requestRunning = false;
                    if (angular.isArray(resp)) {
                        ctrl.showUserQuery = true;
                        ctrl.userQueryResult = resp;
                    }
                };

                ctrl.abortSearch = function () {
                    ctrl.requestRunning = false;
                    ctrl.showUserQuery = false;
                    ctrl.userQueryResult = null;
                };
            }];
    }
};

