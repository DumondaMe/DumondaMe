'use strict';

module.exports = [function () {

    var service = this, stepperDialog, steps = [], selectedStepIndex;

    service.closeStepperDialog = function () {
        steps = [];
    };

    service.setStepperDialog = function (newStepperDialog) {
        stepperDialog = newStepperDialog;
        steps = [];
    };

    service.addStep = function (step) {
        steps.push(step);
        service.selectStep(0, false);
        stepperDialog.notifyStepAdded(steps);
    };

    service.selectStep = function (index, notify) {
        for (var i = 0; i < steps.length; i++) {
            steps[i].selected = false;
        }
        steps[index].selected = true;
        selectedStepIndex = index;
        if (notify) {

        }
        return selectedStepIndex;
    };
}];
