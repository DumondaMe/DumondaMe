'use strict';

var countryCodes = [{country: 'Schweiz', code: 'CH'},
    {country: 'Deutschland', code: 'DE'},
    {country: '\u00d6sterreich', code: 'AT'},
    {country: 'Frankreich', code: 'FR'},
    {country: 'Italien', code: 'IT'}];

module.exports = function () {

    this.countryCodes = countryCodes;

    this.getCountryCode = function (country) {
        var result = false;
        angular.forEach(countryCodes, function (countryCode) {
            if (countryCode.country === country) {
                result = countryCode.code;
            }
        });
        return result;
    };

    this.getCountry = function (code) {
        var result = countryCodes[0].country;
        angular.forEach(countryCodes, function (countryCode) {
            if (countryCode.code === code) {
                result = countryCode.country;
            }
        });
        return result;
    };
};
