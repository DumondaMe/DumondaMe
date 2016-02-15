'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['UserStateService', 'ContactStatisticTypes',
            function (UserStateService, ContactStatisticTypes) {
                var ctrl = this;

                ctrl.addContact = function () {
                    UserStateService.addContact(ctrl.user.userId, ctrl.user.name).then(function (type) {
                        ctrl.user.type = type;
                        ContactStatisticTypes.addContactByName(ctrl.user.type);
                    });
                };

                ctrl.deleteContact = function () {
                    UserStateService.deleteContact(ctrl.user.userId).then(function () {
                        ContactStatisticTypes.removeContactByName(ctrl.user.type);
                        delete ctrl.user.type;
                    });
                };

                ctrl.unblockContact = function () {
                    UserStateService.unblockContact(ctrl.user.userId).then(function () {
                        delete ctrl.user.blocked;
                    });
                };
            }];
    }
};

