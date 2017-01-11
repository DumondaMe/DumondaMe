'use strict';

module.exports = ['$rootScope', '$mdSidenav', 'loginStateHandler', '$state', 'ToolbarService', 'userInfo', 'UnreadMessagesService', 'Auth',
    '$mdBottomSheet',
    function ($rootScope, $mdSidenav, loginStateHandler, $state, ToolbarService, userInfo, UnreadMessagesService, Auth, $mdBottomSheet) {
        var ctrl = this, previousState, previousParams, backNavToState, defaultBackNavState = null;
        ToolbarService.registerToolbar(ctrl);
        userInfo.register('toolbar', ctrl);
        UnreadMessagesService.register('toolbar', ctrl);
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

        ctrl.logout = function () {
            Auth.logout().then(function () {
                $state.go('public');
            });
        };

        ctrl.openCreatePage = function () {
            $mdBottomSheet.show({
                templateUrl: 'app/modules/navigation/createPage/template.html',
                controller: 'CreatePageNavCtrl',
                controllerAs: 'ctrl',
                locals: {},
                clickOutsideToClose: true,
                parent: '#viewport'
            });
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

        ctrl.userInfoChanged = function (changedUserInfo) {
            if (changedUserInfo) {
                ctrl.count = changedUserInfo.totalUnreadMessages;
            }
        };

        //Function for UnreadMessageService
        ctrl.setUnreadMessage = function (count) {
            ctrl.count = count;
        };

        //Functions for toolbarService
        ctrl.setTitle = function (title) {
            ctrl.title = title;
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
