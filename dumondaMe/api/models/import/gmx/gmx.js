'use strict';

const parser = require('../carddav/parser');
const cardDavRequest = require('../carddav/request');
const user = require('../user');

const importGmxContacts = async function (userId, request) {
    let addressBookUrl = await cardDavRequest.getAddressUrl(request.username, request.password, 'carddav.gmx.net');
    let resp = await cardDavRequest.getContacts(request.username, request.password, 'carddav.gmx.net', addressBookUrl);
    let users = parser.parse(resp);
    return {contacts: await user.getUserInfo(users, userId)};
};

module.exports = {
    import: importGmxContacts
};
