'use strict';

let parseString = require('xml2js').parseString;
let lodash = require('lodash');

let parseXML = function (xmlString) {
    let document = null, addresses = [];
    parseString(xmlString, function (err, result) {
        document = result;
    });
    if(document.feed && lodash.isArray(document.feed.entry)) {
        document.feed.entry.forEach(function (entry) {
            let emailAddress = {};
            if(entry['gd:email'] && entry['gd:email'].length > 0 && entry['gd:email'][0].$ && entry['gd:email'][0].$.address) {
                emailAddress.email = entry['gd:email'][0].$.address;
            }
            if(entry.title && entry.title.length > 0 && entry.title[0]._ && entry.title[0]._) {
                emailAddress.name = entry.title[0]._;
            }
            if(emailAddress.hasOwnProperty('email')) {
                addresses.push(emailAddress);
            }
        });
    }
    return addresses;
};

module.exports = {
    parseXML: parseXML
};
