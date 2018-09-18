'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$mdMedia', 'loginStateHandler', function ($mdMedia, loginStateHandler) {
            var ctrl = this;

            loginStateHandler.register('viewPort', ctrl);

            ctrl.loginStyle = {left: 0};
            ctrl.$mdMedia = $mdMedia;

            ctrl.loginEvent = function () {
                ctrl.loginStyle = {};
            };

            ctrl.logoutEvent = function () {
                ctrl.loginStyle = {left: 0};
            };
        }];
    }
};

