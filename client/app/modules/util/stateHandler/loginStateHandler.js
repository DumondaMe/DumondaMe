'use strict';

module.exports = [function () {

    var observables = [];

    this.register = function (observable) {
        observables.push(observable);
    };

    this.loginEvent = function () {
      angular.forEach(observables, function (observable) {
          observable.loginEvent();
      });
    };

    this.logoutEvent = function () {
        angular.forEach(observables, function (observable) {
            observable.logoutEvent();
        });
    };

    return this;
}];
