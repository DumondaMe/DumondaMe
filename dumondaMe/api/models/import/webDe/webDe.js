'use strict';

const parser = require('../carddav/parser');
const cardDavRequest = require('../carddav/request');
const user = require('../user');

const importWebDeContacts = async function (userId, request) {
    let addressBookUrl = await cardDavRequest.getAddressUrl(request.username, request.password, 'carddav.web.de');
    let resp = await cardDavRequest.getContacts(request.username, request.password, 'carddav.web.de', addressBookUrl);
    let users = parser.parse(resp);
    return {contacts: await user.getUserInfo(users, userId)};
};

module.exports = {
    import: importWebDeContacts
};
