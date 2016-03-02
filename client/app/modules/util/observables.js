'use strict';

module.exports = ['$log', function ($log) {

    this.register = function (observables, name, observable) {
        observables.push({name: name, observable: observable});
    };

    this.remove = function (observables, name) {
        return observables.filter(function (observable) {
            return observable.name !== name;
        });
    };

    this.notifyObservables = function (observables, functionName, functionParam) {
        angular.forEach(observables, function (observable) {
            if (observable.hasOwnProperty('observable') && observable.observable.hasOwnProperty(functionName)) {
                observable.observable[functionName](functionParam);
            } else {
                $log.warn('observable property is missing or registered observable misses function');
            }
        });
    };
}];
