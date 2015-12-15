'use strict';

module.exports = ['Auth', '$mdSidenav', 'loginStateHandler', function (Auth, $mdSidenav, loginStateHandler) {
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