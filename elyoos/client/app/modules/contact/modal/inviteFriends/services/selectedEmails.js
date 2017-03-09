'use strict';

module.exports = [function () {

    this.getEmails = function (selectedAddresses) {
        var addresses = [];
        selectedAddresses.forEach(function (selectedAddress) {
            addresses.push(selectedAddress.email);
        });
        return addresses;
    };
}];
