'use strict';

var db = require('./../../neo4j');
var registerUserRequest = require('./../eMailService/registerUserRequest');
var randomstring = require("randomstring");
var recaptcha = require('./../util/recaptcha');
var passwordEncryption = require('./../../lib/passwordEncryption');
var exceptions = require('./../../lib/error/exceptions');
var time = require('./../../lib/time');
var logger = requireLogger.getLogger(__filename);

var ERROR_CODE_EMAIL_EXISTS = 2;

var checkEmailExists = function (email, req) {
    return db.cypher().match("(user:User {email: {email}})")
        .return("user.userId")
        .end({email: email})
        .send().then(function (resp) {
            if (resp.length > 0) {
                return exceptions.getInvalidOperation('User with email address ' + email + ' already exists', logger, req, ERROR_CODE_EMAIL_EXISTS);
            }
        });
};

var registerUser = function (params, req) {

    var linkId;
    return checkEmailExists(params.email, req).then(function () {
        return recaptcha.verifyRecaptcha(params.response, req);
    }).then(function () {
        return passwordEncryption.generatePasswordHash(params.password);
    }).then(function (hash) {
        var paramsCypher = {
            userData: {
                email: params.email,
                forename: params.forename,
                surname: params.surname,
                name: params.forename + ' ' + params.surname,
                password: hash,
                birthday: params.birthday,
                country: params.country,
                female: params.female,
                street: params.street,
                place: params.place,
                registerDate: time.getNowUtcTimestamp()
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
