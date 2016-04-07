'use strict';

module.exports = ['$state',
    function ($state) {
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
            $state.go('user.detail', {userId: userId});
        };
    }];

