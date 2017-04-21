'use strict';

module.exports = ['userInfo', 'StepperDialogSteps', function (userInfo, StepperDialogSteps) {
    var ctrl = this;

    ctrl.forename = userInfo.getUserInfo().forename;

    ctrl.step = {
        label: 'Willkommen',
        selected: false
    };
    StepperDialogSteps.addStep(ctrl.step);
}];
