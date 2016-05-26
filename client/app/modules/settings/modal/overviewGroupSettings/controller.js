'use strict';

module.exports = ['Privacy', 'ElyModal',
    function (Privacy, ElyModal) {
        var ctrl = this;
        ctrl.uploadStarted = true;
        ctrl.uploadAllowed = false;

        ctrl.settings = Privacy.get({}, function () {
            ctrl.uploadStarted = false;
        });

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.openEdit = function (group) {
            ctrl.editMode = true;
            ctrl.editGroup = group;
        };

        ctrl.closeEdit = function() {
            ctrl.editMode = false;
            delete ctrl.editGroup;
        };

    }];

