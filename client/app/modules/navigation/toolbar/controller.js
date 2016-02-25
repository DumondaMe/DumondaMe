'use strict';

module.exports = ['$rootScope', '$mdSidenav', 'loginStateHandler', '$state', 'ToolbarService', 'userInfo',
    function ($rootScope, $mdSidenav, loginStateHandler, $state, ToolbarService, userInfo) {
        var ctrl = this, previousState, previousParams, backNavToState;
        loginStateHandler.register(ctrl);
        ToolbarService.registerToolbar(ctrl);
        userInfo.register('toolbar', ctrl);
        ctrl.isLoggedIn = false;
        ctrl.hasSearch = false;
        ctrl.hasBackNav = true;
        ctrl.searchExpanded = false;

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
            ctrl.searchExpanded = true;
        };

        ctrl.searchClose = function () {
            ctrl.searchExpanded = false;
        };

        ctrl.navigateBack = function () {
            if (backNavToState && previousState) {
                $state.go(previousState, previousParams);
            } else {
                $state.go('home');
            }
        };

        ctrl.modificationChanged = function (modification) {
            ctrl.count = modification.totalUnreadMessages;
        };

        ctrl.userInfoChanged = function (userInfo) {
            ctrl.count = userInfo.totalUnreadMessages;
        };

        //Functions for toolbarService
        ctrl.setTitle = function (title) {
            ctrl.title = title;
        };

        ctrl.setUnreadMessage = function (count) {
            ctrl.count = count;
        };

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            ctrl.hasSearch = false;
            ctrl.hasBackNav = true;
            backNavToState = false;
            ctrl.searchExpanded = false;

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