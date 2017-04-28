'use strict';

module.exports = ['StepperDialogCommandHandler',
    function (StepperDialogCommandHandler) {
        var ctrl = this;

        ctrl.data = {};
        ctrl.showPrivacy = false;

        ctrl.showPrivacyEvent = function () {
            ctrl.showPrivacy = true;
        };
    }];
