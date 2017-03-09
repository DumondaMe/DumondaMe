'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['Auth', '$state', '$mdSidenav', 'userInfo', 'UnreadMessagesService', 'ElyModal',
            function (Auth, $state, $mdSidenav, userInfo, UnreadMessagesService, ElyModal) {
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

                ctrl.openInviteFriendsDialog = function () {
                    ElyModal.show('InviteFriendsCtrl', 'app/modules/contact/modal/inviteFriends/template.html');
                };
            }];
    }
};
