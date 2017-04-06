'use strict';

let db = requireDb();
let registerUserRequest = require('./../eMailService/registerUserRequest');
let randomstring = require("randomstring");
let recaptcha = require('./../util/recaptcha');
let passwordEncryption = require('elyoos-server-lib').passwordEncryption;
let exceptions = require('elyoos-server-lib').exceptions;
let time = require('elyoos-server-lib').time;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let ERROR_CODE_EMAIL_EXISTS = 2;

let checkEmailExists = function (email, req) {
    return db.cypher().match("(user:User {email: {email}})")
        .return("user.userId")
        .end({email: email})
        .send().then(function (resp) {
            if (resp.length > 0) {
                return exceptions.getInvalidOperation('User with email address ' + email + ' already exists', logger, req, ERROR_CODE_EMAIL_EXISTS);
            }
        });
};

let registerUser = function (params, req) {

    let linkId;
    return checkEmailExists(params.email, req).then(function () {
        return recaptcha.verifyRecaptcha(params.response, req);
    }).then(function () {
        return passwordEncryption.generatePasswordHash(params.password);
    }).then(function (hash) {
        let paramsCypher = {
            userData: {
                email: params.email,
                forename: params.forename,
                surname: params.surname,
                name: params.forename + ' ' + params.surname,
                password: hash,
                registerDate: time.getNowUtcTimestamp(),
                latitude: 0,
                longitude: 0
            }
        };
        linkId = randomstring.generate(64);
        paramsCypher.userData.linkId = linkId;
        return db.cypher().create("(:UserRegisterRequest {userData})")
            .end(paramsCypher).send();
    }).then(function () {
        return registerUserRequest.sendRegisterUserVerification(params.email, linkId);
    });
};

module.exports = {
    registerUser: registerUser
};
