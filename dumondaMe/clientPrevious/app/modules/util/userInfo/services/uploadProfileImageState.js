'use strict';

module.exports = ['Observables', function (Observables) {

    var service = this, observables = [];

    service.register = function (name, observable) {
        Observables.register(observables, name, observable);
    };

    service.remove = function (name) {
        observables = Observables.remove(observables, name);
    };

    service.profileImageChanged = function () {
        Observables.notifyObservables(observables, "profileImageChangedEvent");
    };
}];
