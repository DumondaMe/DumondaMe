'use strict';

module.exports = ['Observables',
    function (Observables) {

        var service = this, observables = [];

        service.register = function (name, observable) {
            Observables.register(observables, name, observable);
        };

        service.setUnreadMessage = function (count) {
            Observables.notifyObservables(observables, "setUnreadMessage", count);
        };
    }];
