'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['Auth', '$state', '$mdSidenav', 'userInfo', 'UnreadMessagesService',
            function (Auth, $state, $mdSidenav, userInfo, UnreadMessagesService) {
                var ctrl = this;

                ctrl.userInfo = userInfo.getUserInfo();
                userInfo.register('leftNav', ctrl);
                UnreadMessagesService.register('leftNav', ctrl);

                ctrl.userInfoChanged = function () {
                    ctrl.userInfo = userInfo.getUserInfo();
                };

                ctrl.modificationChanged = function (modification) {
                    if (modification) {
                        ctrl.userInfo.totalUnreadMessages = modification.totalUnreadMessages;
                    }
                };

                ctrl.goToProfile = function () {
                    $mdSidenav("left").close();
                    $state.go('settings.profile');
                };

                //Function for UnreadMessageService
                ctrl.setUnreadMessage = function (count) {
                    if (ctrl.userInfo) {
                        ctrl.userInfo.totalUnreadMessages = count;
                    }
                };
            }];
    }
};
