'use strict';

module.exports = ['ResetPasswordRequest', function (ResetPasswordRequest) {
    var ctrl = this;

    ctrl.running = false;
    ctrl.emailSent = false;

    ctrl.sendResetPasswordRequest = function () {
        ctrl.running = true;
        ResetPasswordRequest.save({email: ctrl.email}, function () {
            ctrl.running = false;
            ctrl.emailSent = true;
        });
    };
}];
