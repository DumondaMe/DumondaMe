'use strict';

module.exports = ['UserStateService', 'ContactGroupStatistic', 'UserDetailNavigation', 'userInfo',
    function (UserStateService, ContactGroupStatistic, UserDetailNavigation, userInfo) {
        var ctrl = this;
        ctrl.isUser = userInfo.getUserInfo().userId === ctrl.user.userId;

        ctrl.addContact = function () {
            UserStateService.addContact(ctrl.user.userId, ctrl.user.name).then(function (type) {
                ctrl.user.type = type;
                ContactGroupStatistic.addContactToGroup(ctrl.user.type);
                if (angular.isFunction(ctrl.addedContactEvent)) {
                    ctrl.addedContactEvent(ctrl.user.userId);
                }
            });
        };

        ctrl.deleteContact = function () {
            UserStateService.deleteContact(ctrl.user.userId).then(function () {
                ContactGroupStatistic.removeContactFromGroup(ctrl.user.type);
                delete ctrl.user.type;
            });
        };

        ctrl.unblockContact = function () {
            UserStateService.unblockContact(ctrl.user.userId).then(function () {
                delete ctrl.user.blocked;
            });
        };

        ctrl.goToDetail = function () {
            UserDetailNavigation.openUserDetail(ctrl.user.userId, ctrl.isUser);
        };
    }];

