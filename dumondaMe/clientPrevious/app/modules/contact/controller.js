'use strict';

module.exports = ['SearchService', 'SearchUsers', '$stateParams',
    function (SearchService, SearchUsers, $stateParams) {
        var ctrl = this;
        ctrl.requestRunning = false;
        ctrl.showUserQuery = false;

        if ($stateParams.overview === 'contacting') {
            ctrl.selectedTab = 1;
        } else if ($stateParams.overview === 'recommendation') {
            ctrl.selectedTab = 2;
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

