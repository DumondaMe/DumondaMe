'use strict';

module.exports = ['Mailcheck', function (Mailcheck) {

    var format = function (addresses) {
        var result = [];
        addresses.forEach(function (address) {
            if (address.trim() !== '') {
                var suggestion = null;
                Mailcheck.run({
                    email: address.trim(), suggested: function (mailcheckSuggestion) {
                        suggestion = mailcheckSuggestion.full;
                    }
                });
                result.push({email: address.trim(), manuallyAdded: true, suggestion: suggestion});
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
