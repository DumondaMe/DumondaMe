'use strict';

module.exports = [function () {

    var format = function (addresses) {
        var result = [];
        addresses.forEach(function (address) {
            if (address.trim() !== '') {
                result.push({email: address.trim(), manuallyAdded: true});
            }
        });
        return result;
    };

    var splitAddresses = function (addresses) {
        if (angular.isString(addresses)) {
            if (addresses.split(/[;, \n]/).length > 1) {
                return format(addresses.split(/[;, \n]/));
            } else {
                return format([addresses]);
            }
        }
        return addresses;
    };

    this.parse = function (addresses) {
        return splitAddresses(addresses);
    };

}];
