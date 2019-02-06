'use strict';

const rp = require('request-promise');
const parser = require('./parser');
const user = require('../user');

const getAccessToken = async function (code) {
    let normalizedCode = code.replace('%2F', '/');
    let resp = await rp.post('https://www.googleapis.com/oauth2/v4/token', {
        form: {
            code: normalizedCode,
            client_id: process.env.OAUTH_GOOGLE_CLIENT_ID,
            client_secret: process.env.OAUTH_GOOGLE_SECRET,
            redirect_uri: `${process.env.DUMONDA_ME_DOMAIN}auth`,
            grant_type: 'authorization_code'
        }
    });
    resp = JSON.parse(resp);
    return resp.access_token;
};

const importGmailContacts = async function (userId, request) {
    let token = await getAccessToken(request.code);
    let option = {
        url: `https://www.google.com/m8/feeds/contacts/default/full`,
        qs: {access_token: token, 'max-results': 3000}
    };
    let resp = await rp.get(option);
    let users = parser.parseXML(resp);
    return {contacts: await user.getUserInfo(users, userId)};
};

module.exports = {
    import: importGmailContacts
};
