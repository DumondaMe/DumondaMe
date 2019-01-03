'use strict';

const parse = function (outlookAdresses) {
    let data = JSON.parse(outlookAdresses), addresses = [];
    if (data && typeof data.value === 'object' && data.value.length > 0) {
        for (let address of data.value) {
            let newAddress = {};
            if (address.EmailAddresses && address.EmailAddresses.length > 0) {
                newAddress.email = address.EmailAddresses[0].Address;
            }
            if (typeof address.DisplayName === 'string') {
                newAddress.name = address.DisplayName;
            }
            if (newAddress.email) {
                addresses.push(newAddress);
            }
        }
    }
    return addresses;
};

module.exports = {
    parse
};
