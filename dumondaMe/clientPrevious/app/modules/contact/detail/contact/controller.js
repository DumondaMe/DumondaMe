'use strict';

module.exports = ['$state', 'UserDetailNavigation',
    function ($state, UserDetailNavigation) {
        var ctrl = this;

        if (angular.isObject(ctrl.events)) {
            ctrl.events.detailClosed = function () {
                ctrl.isShowClose = false;
            };
        }

        ctrl.openDetail = function () {
            ctrl.isShowClose = true;
            ctrl.showDetail();
        };

        ctrl.closeDetail = function () {
            ctrl.isShowClose = false;
            ctrl.onDetailClosed();
        };

        ctrl.openUserDetail = function (userId) {
            UserDetailNavigation.openUserDetail(userId);
        };
    }];

