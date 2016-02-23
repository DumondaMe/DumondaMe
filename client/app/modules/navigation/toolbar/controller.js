'use strict';

module.exports = ['$rootScope', '$mdSidenav', 'loginStateHandler', '$state', 'ToolbarService',
    function ($rootScope, $mdSidenav, loginStateHandler, $state, ToolbarService) {
        var ctrl = this, previousBackNav = false, previousState, previousParams, backNavToState;
        loginStateHandler.register(ctrl);
        ToolbarService.registerToolbar(ctrl);
        ctrl.isLoggedIn = false;
        ctrl.hasSearch = false;
        ctrl.hasBackNav = true;

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
            if (ctrl.hasBackNav) {
                previousBackNav = true;
                ctrl.hasBackNav = false;
            }
        };

        ctrl.searchClose = function () {
            if (previousBackNav) {
                previousBackNav = false;
                ctrl.hasBackNav = true;
            }
        };

        ctrl.navigateBack = function () {
            if (backNavToState && previousState) {
                $state.go(previousState, previousParams);
            } else {
                $state.go('home');
            }
        };

        //Functions for toolbarService
        ctrl.setTitle = function (title) {
            ctrl.title = title;
        };

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            ctrl.hasSearch = false;
            ctrl.hasBackNav = true;
            backNavToState = false;

            if (fromState.name !== 'checkLoginState' && !fromState.abstract) {
                previousState = fromState;
                previousParams = fromParams;
            }

            if (toState.hasOwnProperty('data')) {
                ctrl.hasSearch = toState.data.hasSearch;
                ctrl.title = toState.data.title;
                if (toState.data.hasOwnProperty('hasBackNav')) {
                    ctrl.hasBackNav = toState.data.hasBackNav;
                }
                backNavToState = toState.data.backNavToState;
            }
        });
    }];