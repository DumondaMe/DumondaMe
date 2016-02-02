'use strict';

module.exports = ['ContactStatisticTypes',
    function (ContactStatisticTypes) {

        this.checkNameExists = function (name) {
            var names = ContactStatisticTypes.getTypes();
            var isValid = true;
            if (angular.isString(name)) {
                angular.forEach(names, function (existingName) {
                    if (existingName.toLowerCase() === name.toLowerCase()) {
                        isValid = false;
                    }
                });
            }
            return isValid;
        };
    }]
;
