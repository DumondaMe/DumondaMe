'use strict';

module.exports = ['Privacy', 'ElyModal', 'ModifyGroupNameService',
    function (Privacy, ElyModal, ModifyGroupNameService) {
        var ctrl = this;

        ctrl.settings = Privacy.get({}, function () {
            ctrl.setting = ModifyGroupNameService.getSetting(ctrl.settings.normal, ctrl.settings.noContact, ctrl.groupName);
        });

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.accept = function (groupName) {
            ElyModal.hide(groupName);
        };

    }];

