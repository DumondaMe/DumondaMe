'use strict';

var notifyObservables = function (observables, selectedState) {
    angular.forEach(observables, function (observable) {
        observable.stateChanged(selectedState);
    });
};

module.exports = [
    function () {
        var ctrl = this;
        var selectedState;
        var previousState;
        var observables = [];

        ctrl.reset = function () {
            selectedState = 1;
            previousState = 1;
        };

        ctrl.goToPreviousState = function () {
            var hasChanged = selectedState !== previousState;
            selectedState = previousState;
            if (hasChanged) {
                notifyObservables(observables, selectedState);
            }
        };

        ctrl.goToState = function (stateNumber) {
            if (stateNumber !== selectedState) {
                previousState = selectedState;
                selectedState = stateNumber;
                notifyObservables(observables, selectedState);
            }
        };

        ctrl.registerStateChange = function (observable) {
            observables.push(observable);
        };
    }];
