'use strict';

var operatingSystems = [{description: 'Windows', code: 'windows'},
    {description: 'Mac OS', code: 'macOs'},
    {description: 'Linux', code: 'linux'},
    {description: 'Anderes', code: 'other'}];

module.exports = function () {

    this.operatingSystems = operatingSystems;

    this.getOSDescription = function (code) {
        var result = null;
        angular.forEach(operatingSystems, function (osCode) {
            if (osCode.code === code) {
                result = osCode.description;
            }
        });
        return result;
    };
};
