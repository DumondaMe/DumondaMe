'use strict';

const rp = require('request-promise');
const parser = require('./parser');
const user = require('../user');

let getAccessToken = async function (code) {
    let resp = await rp.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
        form: {
            code: code,
            client_id: process.env.OAUTH_OUTLOOK_CLIENT_ID,
            client_secret: process.env.OAUTH_OUTLOOK_SECRET,
            redirect_uri: `${process.env.DUMONDA_ME_DOMAIN}auth`,
            grant_type: 'authorization_code'
        }
    });
    resp = JSON.parse(resp);
    return resp.access_token;
};

const importOutlookContacts = async function (userId, request) {
    let token = await getAccessToken(request.code);
    let option = {
        uri: `https://outlook.office.com/api/v2.0/me/contacts`,
        qs: {
            top: 1000
        },
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };
    let resp = await rp.get(option);
    let users = parser.parse(resp);
    return {contacts: await user.getUserInfo(users, userId)};
};

module.exports = {
    import: importOutlookContacts
};
