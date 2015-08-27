'use strict';

var notifyObservables = function (observables, selectedState) {
    angular.forEach(observables, function (observable) {
        observable.stateChanged(selectedState)
    });
};

module.exports = [
    function () {
        var selectedState;
        var previousState;
        var observables = [];

        this.reset = function () {
            selectedState = 1;
            previousState = 1;
        };

        this.goToPreviousState = function () {
            var hasChanged = selectedState !== previousState;
            selectedState = previousState;
            if (hasChanged) {
                notifyObservables(observables, selectedState);
            }
        };

        this.goToState = function (stateNumber) {
            if (stateNumber !== selectedState) {
                previousState = selectedState;
                selectedState = stateNumber;
                notifyObservables(observables, selectedState);
            }
        };

        this.registerStateChange = function (observable) {
            observables.push(observable);
        };

    }];
