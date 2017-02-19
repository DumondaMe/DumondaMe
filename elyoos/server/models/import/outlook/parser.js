'use strict';

let _ = require('lodash');

let parse = function (xmlString) {
    let data = JSON.parse(xmlString), addresses = [];
    if (_.isArray(data.value)) {
        data.value.forEach(function (address) {
            let newAddress = {};
            if (address.EmailAddresses && address.EmailAddresses.length > 0) {
                newAddress.email = address.EmailAddresses[0].Address;
            }
            if (_.isString(address.DisplayName)) {
                newAddress.name = address.DisplayName;
            }
            if (newAddress.email) {
                addresses.push(newAddress);
            }
        });
    }
    return addresses;
};

module.exports = {
    parse: parse
};
