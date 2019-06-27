'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$mdMedia', 'loginStateHandler', function ($mdMedia, loginStateHandler) {
            var ctrl = this;

            loginStateHandler.register('viewPort', ctrl);

            ctrl.loginStyle = {left: 0};
            ctrl.showLeftNav = false;
            ctrl.showToolbar = false;
            ctrl.$mdMedia = $mdMedia;

            ctrl.loginEvent = function () {
                ctrl.loginStyle = {};
                ctrl.showLeftNav = true;
                ctrl.showToolbar = true;
            };

            ctrl.logoutEvent = function () {
                ctrl.loginStyle = {left: 0};
                ctrl.showLeftNav = false;
                ctrl.showToolbar = false;
            };
        }];
    }
};

