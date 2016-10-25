'use strict';

module.exports = [function () {

    var service = this;

    service.isDefined = function (value) {
        return angular.isDefined(value) && value !== null;
    };

    service.isTrue = function (value) {
       return value === 'true' || value === true;
     };
}];
