'use strict';

let xpath = require('xpath');
let dom = require('xmldom').DOMParser;
let rp = require('request-promise');

let getAddressUrl = function (username, password, baseUrl) {
    let option = {
        method: 'PROPFIND',
        uri: `https://${baseUrl}/user-principal-uri`,
        auth: {
            user: username,
            pass: password
        },
        headers: {
            'Depth': 0,
            'Content-Type': 'text/xml ; charset=utf-8'
        }/*,
         body: `<d:propfind xmlns:d=\"DAV:\" xmlns:cs=\"https://${baseUrl}/ns/\"><d:prop><d:displayname /><cs:getctag /></d:prop></d:propfind>`*/
    };
    return rp(option).then(function (resp) {
        let doc = new dom().parseFromString(resp);
        let select = xpath.useNamespaces({"C": "urn:ietf:params:xml:ns:carddav"});
        let defaultAddressBook = select("//C:default-addressbook-URL/*/text()", doc);
        return defaultAddressBook[0].data;
    });
};

let getContacts = function (username, password, baseUrl, addressBookUrl) {
    let option = {
        method: 'REPORT',
        auth: {
            user: username,
            pass: password
        },
        headers: {
            'Depth': 1,
            'Content-Type': 'application/xml; charset=utf-8'
        },
        body: `<?xml version="1.0" encoding="utf-8"?><C:addressbook-query xmlns:D="DAV:" xmlns:C="urn:ietf:params:xml:ns:carddav"><D:prop><C:address-data /></D:prop></C:addressbook-query>`
    };
    option.uri = `https://${baseUrl}${addressBookUrl}/Contact`;
    return rp(option);
};

module.exports = {
    getAddressUrl: getAddressUrl,
    getContacts: getContacts
};
