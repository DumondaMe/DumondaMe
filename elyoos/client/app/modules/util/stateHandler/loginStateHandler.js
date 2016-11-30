'use strict';

module.exports = ['Observables', function (Observables) {

    var observables = [];

    this.register = function (name, observable) {
        Observables.register(observables, name, observable);
    };

    this.loginEvent = function () {
        Observables.notifyObservables(observables, 'loginEvent');
    };

    this.logoutEvent = function () {
        Observables.notifyObservables(observables, 'logoutEvent');
    };
}];
