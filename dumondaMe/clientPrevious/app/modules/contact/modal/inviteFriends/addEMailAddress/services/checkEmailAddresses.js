'use strict';

module.exports = [function () {

    var checkSingleAddress = function (emailAddress) {
        return emailAddress.match(/@/) !== null;
    };

    var checkArrayOfAddress = function (emailAddresses) {
        var isValid = true;
        emailAddresses.forEach(function (address) {
            if (!checkSingleAddress(address)) {
                isValid = false;
            }
        });
        return isValid;
    };

    var getNonEmptyStringArray = function (addresses) {
        var result = [];
        addresses.forEach(function (address) {
            if (address.trim() !== '') {
                result.push(address.trim());
            }
        });
        return result;
    };

    var splitAddresses = function (addresses) {
        if (angular.isString(addresses)) {
            if (addresses.split(/[;, \n]/).length > 1) {
                return getNonEmptyStringArray(addresses.split(/[;, \n]/));
            } else {
                return [addresses];
            }
        }
        return addresses;
    };

    this.checkAddresses = function (addresses) {
        addresses = splitAddresses(addresses);
        if (angular.isArray(addresses)) {
            return checkArrayOfAddress(addresses);
        }
        return false;
    };

}];
