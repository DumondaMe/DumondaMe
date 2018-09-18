'use strict';

let rp = require('request-promise');
let parser = require('./parser');

let getAccessToken = function (code) {
    let option = {
        method: 'POST',
        uri: `https://www.googleapis.com/oauth2/v4/token`,
        form: {
            code: code,
            client_id: '270929621236-4cauqnck95vm8ohkvu3rokhp74jued28.apps.googleusercontent.com',
            client_secret: '0C5eH6e2qZ2RHA5FlV8i2wLp',
            redirect_uri: `${process.env.DUMONDA_ME_DOMAIN}auth`,
            grant_type: 'authorization_code'
        },
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        }
    };
    return rp(option).then(function (resp) {
        resp = JSON.parse(resp);
        return resp.access_token;
    });
};

let importGmailContacts = function (userId, request) {
    return getAccessToken(request.code).then(function (token) {
        let option = {
            uri: `https://www.google.com/m8/feeds/contacts/default/full`,
            qs: {
                access_token: token,
                'max-results': 3000
            }
        };
        return rp(option);
    }).then(function (resp) {
        return {addresses: parser.parseXML((resp))};
    });
};

module.exports = {
    import: importGmailContacts
};
