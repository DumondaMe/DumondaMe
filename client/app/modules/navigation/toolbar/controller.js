'use strict';

module.exports = ['$rootScope', '$mdSidenav', 'loginStateHandler', '$state', 'ToolbarService', 'userInfo',
    function ($rootScope, $mdSidenav, loginStateHandler, $state, ToolbarService, userInfo) {
        var ctrl = this, previousState, previousParams, backNavToState, defaultBackNavState = null;
        ToolbarService.registerToolbar(ctrl);
        userInfo.register('toolbar', ctrl);
        ctrl.hasSearch = false;
        ctrl.hasBackNav = true;
        ctrl.searchExpanded = false;
        ctrl.isEnabled = true;

        ctrl.openLeftNav = function () {
            if (ctrl.isEnabled) {
                $mdSidenav("left").toggle();
            }
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
            } else if (defaultBackNavState) {
                $state.go(defaultBackNavState);
            } else {
                $state.go('home');
            }
        };

        ctrl.modificationChanged = function (modification) {
            if (modification) {
                ctrl.count = modification.totalUnreadMessages;
            }
        };

        ctrl.userInfoChanged = function (userInfo) {
            if (userInfo) {
                ctrl.count = userInfo.totalUnreadMessages;
            }
        };

        //Functions for toolbarService
        ctrl.setTitle = function (title) {
            ctrl.title = title;
        };

        ctrl.setUnreadMessage = function (count) {
            ctrl.count = count;
        };

        ctrl.enabled = function () {
            ctrl.isEnabled = true;
        };

        ctrl.disabled = function () {
            ctrl.isEnabled = false;
        };

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            ctrl.hasSearch = false;
            ctrl.hasBackNav = true;
            backNavToState = false;
            defaultBackNavState = null;
            ctrl.searchExpanded = false;
            ctrl.title = '';

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
                defaultBackNavState = toState.data.defaultBackNavState;
            }
        });
    }];
