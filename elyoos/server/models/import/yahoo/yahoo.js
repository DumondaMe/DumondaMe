'use strict';

let rp = require('request-promise');
let parser = require('./parser');

let clientId = 'dj0yJmk9eUZUbXlHYVNVcDBrJmQ9WVdrOVIycFNkVXd5Tm5VbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD0xNA--';
let client_secret = 'c65da0ccbc68697cd6f6f81ad35ac33c799f17fe';
let redirectUrl = 'https://preview.elyoos.org/auth';

if (process.env.NODE_ENV === 'production') {
    clientId = 'dj0yJmk9bmowWmdhb2hpclBIJmQ9WVdrOVVFeGxRM1I1TkhVbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD1lMg--';
    client_secret = '4bc9075abd60e68f4219a495d19a142fd7ab040a';
    redirectUrl = 'https://www.elyoos.org/auth';
}

let getAccessToken = function (code) {
    let option = {
        method: 'POST',
        uri: `https://api.login.yahoo.com/oauth2/get_token`,
        form: {
            client_id: clientId,
            client_secret: client_secret,
            redirect_uri: redirectUrl,
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
