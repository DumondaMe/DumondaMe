'use strict';

let _ = require('lodash');

let parse = function (xmlString) {
    let data = JSON.parse(xmlString), addresses = [];
    if (data.contacts && _.isArray(data.contacts.contact)) {
        data.contacts.contact.forEach(function (contact) {
            if (_.isArray(contact.fields)) {
                let address = {};
                contact.fields.forEach(function (field) {
                    if (field.type === "name" && _.isObject(field.value)) {
                        address.name = `${field.value.givenName} ${field.value.familyName}`;
                    } else if (field.type === "email" && _.isString(field.value)) {
                        address.email = field.value;
                    }
                });
                if (address.email) {
                    addresses.push(address);
                }
            }
        });
    }
    return addresses;
};

module.exports = {
    parse: parse
};
