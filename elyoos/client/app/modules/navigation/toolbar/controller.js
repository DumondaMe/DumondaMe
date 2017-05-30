'use strict';

module.exports = ['$rootScope', '$mdSidenav', 'loginStateHandler', '$window', 'ToolbarService', 'userInfo', 'UnreadMessagesService', 'Auth',
    'ElyModal', '$state',
    function ($rootScope, $mdSidenav, loginStateHandler, $window, ToolbarService, userInfo, UnreadMessagesService, Auth, ElyModal, $state) {
        var ctrl = this;
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
            ElyModal.show('CreatePageNavCtrl', 'app/modules/navigation/createPage/template.html', {});
        };

        ctrl.navigateBack = function () {
            $window.history.back();
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

        $rootScope.$on('$stateChangeSuccess', function (event, toState) {
            ctrl.hasSearch = false;
            ctrl.hasBackNav = true;
            ctrl.searchExpanded = false;
            ctrl.title = '';

            if (toState.hasOwnProperty('data')) {
                ctrl.hasSearch = toState.data.hasSearch;
                ctrl.title = toState.data.title;
                if (toState.data.hasOwnProperty('hasBackNav')) {
                    ctrl.hasBackNav = toState.data.hasBackNav;
                }
            }
        });
    }];
