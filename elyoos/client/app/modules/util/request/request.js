'use strict';

module.exports = [function () {

    this.getOptionalString = function (optionalString) {
        if (angular.isString(optionalString) && optionalString.trim() !== "" && optionalString.length > 0) {
            return optionalString;
        }
        return undefined;
    };

}];
