'use strict';

let rp = require('request-promise');
let parser = require('./parser');

let clientId = 'fd3fdc4c-3601-42ec-a23b-2ba31eb4dc8b';
let clientSecret = 'WNp2TaDo9jYpFb9LZKOdoku';
let redirectUrl = 'http://localhost:8080/auth';

if (process.env.NODE_ENV === 'production') {
    clientId = '4604a845-acf0-4770-9a2c-6b0e19943b94';
    clientSecret = 'gQhRYcf7qdAxkxVmovJS0jA';
    redirectUrl = 'http://www.elyoos.org/auth';
} else if (process.env.NODE_ENV === 'development') {
    clientId = 'dd12544c-d6e4-4d3d-92b8-7b42941284e9';
    clientSecret = '2AU1gtcpfEa5ASOjByY1d47';
    redirectUrl = 'http://preview.elyoos.org/auth';
}

let getAccessToken = function (code) {
    let option = {
        method: 'POST',
        uri: `https://login.microsoftonline.com/common/oauth2/v2.0/token`,
        form: {
            code: code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUrl,
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
