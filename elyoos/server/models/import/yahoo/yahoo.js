'use strict';

let rp = require('request-promise');
let parser = require('./parser');

let getAccessToken = function (code) {
    let option = {
        method: 'POST',
        uri: `https://api.login.yahoo.com/oauth2/get_token`,
        form: {
            client_id: 'dj0yJmk9YmxtcnBNTVdkUTUwJmQ9WVdrOVFtRnFNMkpUTm1zbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD0wMw--',
            client_secret: '83bee10dae9655f9781e4abb9989e9ddd6fc2a47',
            redirect_uri: 'https://preview.elyoos.org/auth',
            code: code,
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

let importYahooContacts = function (userId, request) {
    return getAccessToken(request.code).then(function (token) {
        let option = {
            uri: `https://social.yahooapis.com/v1/user/me/contacts?format=json`,
            qs: {
                count: 'max'
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
    import: importYahooContacts
};
