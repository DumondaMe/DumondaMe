'use strict';

module.exports = ['ContactGroupStatistic',
    function (ContactGroupStatistic) {

        this.checkNameExists = function (name) {
            var contactGroups = ContactGroupStatistic.getGroups();
            var isValid = true;
            if (angular.isString(name)) {
                angular.forEach(contactGroups, function (existingName) {
                    if (existingName.toLowerCase() === name.toLowerCase()) {
                        isValid = false;
                    }
                });
            }
            return isValid;
        };
    }]
;
