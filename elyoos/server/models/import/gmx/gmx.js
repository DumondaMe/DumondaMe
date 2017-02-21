'use strict';

let parser = require('../carddav/parser');
let cardDavRequest = require('../carddav/request');

let importGmxContacts = function (userId, request) {
    return cardDavRequest.getAddressUrl(request.username, request.password, 'carddav.gmx.net').then(function (addressBookUrl) {
        return cardDavRequest.getContacts(request.username, request.password, 'carddav.gmx.net', addressBookUrl);
    }).then(function (resp) {
        return {addresses: parser.parse(resp)};
    });
};

module.exports = {
    import: importGmxContacts
};
