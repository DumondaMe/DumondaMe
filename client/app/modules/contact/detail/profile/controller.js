'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['UserStateService', 'ContactStatisticTypes',
            function (UserStateService, ContactStatisticTypes) {
                var ctrl = this;

                ctrl.moveContact = function () {
                    UserStateService.moveContact(ctrl.detail.user.userId, ctrl.detail.user.name, ctrl.detail.user.type).then(function (newGroup) {
                        ctrl.detail.user.type = newGroup;
                    });
                };

                ctrl.addContact = function () {
                    UserStateService.addContact(ctrl.detail.user.userId, ctrl.detail.user.name).then(function (type) {
                        ctrl.detail.user.type = type;
                        ContactStatisticTypes.addContactByName(ctrl.detail.user.type);
                    });
                };

                ctrl.deleteContact = function () {
                    UserStateService.deleteContact(ctrl.detail.user.userId).then(function () {
                        ContactStatisticTypes.removeContactByName(ctrl.detail.user.type);
                        delete ctrl.detail.user.type;
                    });
                };

                ctrl.blockContact = function () {
                    UserStateService.blockContact(ctrl.detail.user.userId).then(function () {
                        ctrl.detail.user.blocked = true;
                    });
                };

                ctrl.unblockContact = function () {
                    UserStateService.unblockContact(ctrl.detail.user.userId).then(function () {
                        delete ctrl.detail.user.blocked;
                        delete ctrl.detail.user.type;
                    });
                };
            }];
    }
};

