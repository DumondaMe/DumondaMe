'use strict';


module.exports = [function () {
    var ctrl = this;

    ctrl.selectedStep = 0;
    ctrl.steps = [];

    ctrl.back = function () {
        if (ctrl.selectedStep > 0) {
            ctrl.selectStep(ctrl.selectedStep - 1);
        }
    };

    ctrl.next = function () {
        if (ctrl.selectedStep < ctrl.steps.length - 1) {
            ctrl.selectStep(ctrl.selectedStep + 1);
        }
    };

    ctrl.addStep = function (step) {
        ctrl.steps.push(step);
        ctrl.selectStep(0);
    };

    ctrl.selectStep = function (index) {
        for (var i = 0; i < ctrl.steps.length; i++) {
            ctrl.steps[i].selected = false;
        }
        ctrl.steps[index].selected = true;
        ctrl.selectedStep = index;
    };
}];
