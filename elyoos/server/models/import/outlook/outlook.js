'use strict';

let rp = require('request-promise');
let parser = require('./parser');

let getAccessToken = function (code) {
    let option = {
        method: 'POST',
        uri: `https://login.microsoftonline.com/common/oauth2/v2.0/token`,
        form: {
            code: code,
            client_id: 'fd3fdc4c-3601-42ec-a23b-2ba31eb4dc8b',
            client_secret: 'WNp2TaDo9jYpFb9LZKOdoku',
            redirect_uri: 'http://localhost:8080/auth',
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

let importOutlookContacts = function (userId, request) {
    return getAccessToken(request.code).then(function (token) {
        let option = {
            uri: `https://outlook.office.com/api/v2.0/me/contacts`,
            qs: {
                top : 1000
            },
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        return rp(option);
    }).then(function (resp) {
        return {addresses: parser.parse((resp))};
    });
};

module.exports = {
    import: importOutlookContacts
};
