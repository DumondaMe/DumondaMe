'use strict';

let xpath = require('xpath');
let dom = require('xmldom').DOMParser;
let VCard = require('vcard');

let parse = function (xmlString) {
    let contacts = [];
    let doc = new dom().parseFromString(xmlString);
    let select = xpath.useNamespaces({"C": "urn:ietf:params:xml:ns:carddav"});
    let vcardData = select("//C:address-data/text()", doc);
    vcardData.forEach(function (data) {
        let card = new VCard(), contact = {};
        card.readData(data.data, function (err, json) {
            if (json.EMAIL && json.EMAIL.value) {
                contact.email = json.EMAIL.value;
                contacts.push(contact);
            }
            if (json.FN) {
                contact.name = json.FN;
            }
        });
    });
    return contacts;
};

module.exports = {
    parse: parse
};
