'use strict';

module.exports = ['$rootScope', '$mdSidenav', 'loginStateHandler',
    function ($rootScope, $mdSidenav, loginStateHandler) {
        var ctrl = this;
        loginStateHandler.register(ctrl);
        ctrl.isLoggedIn = false;
        ctrl.hasSearch = false;
        ctrl.hasSubNav = false;

        ctrl.openLeftNav = function () {
            $mdSidenav("left").toggle();
        };

        ctrl.loginEvent = function () {
            ctrl.isLoggedIn = true;
        };

        ctrl.logoutEvent = function () {
            ctrl.isLoggedIn = false;
        };

        ctrl.searchOpen = function () {
            if(ctrl.hasSearch && ctrl.hasOwnProperty('subViews')) {
                ctrl.hasSubNav = false;
            }
        };

        ctrl.searchClose = function () {
            if(ctrl.hasSearch && ctrl.hasOwnProperty('subViews')) {
                ctrl.hasSubNav = true;
            }
        };

        $rootScope.$on('$stateChangeSuccess', function (event, toState) {
            ctrl.hasSearch = false;
            ctrl.hasSubNav = false;

            if(toState.hasOwnProperty('data')) {
                ctrl.hasSearch = toState.data.hasSearch;

                if(toState.data.hasOwnProperty('subViews')) {
                    ctrl.hasSubNav = true;
                    ctrl.subViews = toState.data.subViews;
                    ctrl.selectedSubNav = toState.data.subViews[0];
                }
            }
        });
    }];