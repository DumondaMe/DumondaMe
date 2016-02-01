'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['UserStateService',
            function (UserStateService) {
                var ctrl = this;

                ctrl.addContact = function () {
                    UserStateService.addContact(ctrl.user.userId, ctrl.user.name).then(function (type) {
                        ctrl.user.type = type;
                    });
                };

                ctrl.deleteContact = function () {
                    UserStateService.deleteContact(ctrl.user.userId).then(function () {
                        delete ctrl.user.type;
                    });
                };
            }];
    }
};

