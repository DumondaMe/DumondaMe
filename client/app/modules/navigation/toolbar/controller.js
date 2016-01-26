'use strict';

module.exports = ['$rootScope', '$mdSidenav', 'loginStateHandler',
    function ($rootScope, $mdSidenav, loginStateHandler) {
        var ctrl = this;
        loginStateHandler.register(ctrl);
        ctrl.isLoggedIn = false;
        ctrl.hasSearch = false;

        ctrl.openLeftNav = function () {
            $mdSidenav("left").toggle();
        };

        ctrl.loginEvent = function () {
            ctrl.isLoggedIn = true;
        };

        ctrl.logoutEvent = function () {
            ctrl.isLoggedIn = false;
        };

        $rootScope.$on('$stateChangeSuccess', function (event, toState) {
            ctrl.hasSearch = toState.hasSearch;
        });
    }];