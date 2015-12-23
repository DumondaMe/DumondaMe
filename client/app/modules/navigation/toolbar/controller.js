'use strict';

module.exports = ['$mdSidenav', 'loginStateHandler',
    function ($mdSidenav, loginStateHandler) {
        var ctrl = this;
        loginStateHandler.register(ctrl);
        ctrl.isLoggedIn = false;

        ctrl.openLeftNav = function () {
            $mdSidenav("left").toggle();
        };

        ctrl.loginEvent = function () {
            ctrl.isLoggedIn = true;
        };

        ctrl.logoutEvent = function () {
            ctrl.isLoggedIn = false;
        };
    }];