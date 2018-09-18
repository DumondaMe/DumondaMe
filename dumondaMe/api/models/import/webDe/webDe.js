'use strict';

let parser = require('../carddav/parser');
let cardDavRequest = require('../carddav/request');

let importWebDeContacts = function (userId, request) {
    return cardDavRequest.getAddressUrl(request.username, request.password, 'carddav.web.de').then(function (addressBookUrl) {
        return cardDavRequest.getContacts(request.username, request.password, 'carddav.web.de', addressBookUrl);
    }).then(function (resp) {
        return {addresses: parser.parse(resp)};
    });
};

module.exports = {
    import: importWebDeContacts
};
