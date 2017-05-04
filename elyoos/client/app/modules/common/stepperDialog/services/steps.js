'use strict';

module.exports = ['Observables', function (Observables) {

    var service = this, stepperDialog, steps = [], selectedStepIndex, observables = [];

    service.closeStepperDialog = function () {
        steps = [];
        observables = [];
        selectedStepIndex = 0;
    };

    service.setStepperDialog = function (newStepperDialog) {
        stepperDialog = newStepperDialog;
        steps = [];
    };

    service.register = function (name, observable) {
        Observables.register(observables, name, observable);
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
        if (notify && angular.isFunction(steps[index].isSelectedNotification)) {
            steps[index].isSelectedNotification();
        }
        if (notify) {
            Observables.notifyObservables(observables, "selectedStepChanged", selectedStepIndex);
        }
        return selectedStepIndex;
    };

    service.setStepLabel = function (id, newLabel) {
        steps.forEach(function (step) {
            if (step.id === id) {
                step.label = newLabel;
            }
        });
    };
}];
