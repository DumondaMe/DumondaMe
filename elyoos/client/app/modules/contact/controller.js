'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['SearchService', 'SearchUsers', '$stateParams',
            function (SearchService, SearchUsers, $stateParams) {
                var ctrl = this;
                ctrl.requestRunning = false;
                ctrl.showUserQuery = false;

                if ($stateParams.showContacting) {
                    ctrl.selectedTab = 1;
                }

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

