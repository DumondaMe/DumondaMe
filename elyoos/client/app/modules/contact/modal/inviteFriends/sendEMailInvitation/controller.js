'use strict';

module.exports = ['SendInviteEmail', 'ElyModal', function (SendInviteEmail, ElyModal) {
    var ctrl = this;

    ctrl.close = function () {
        ElyModal.hide();
    };

    ctrl.upload = function () {
        /*ctrl.uploadStarted = true;
        SendInviteEmail.save({emails: ctrl.addresses}, function () {
            ctrl.successfullySent = true;
            ctrl.uploadStarted = false;
        }, function () {
            ctrl.uploadStarted = false;
        });*/
        ctrl.successfullySent = true;
    };
}];
