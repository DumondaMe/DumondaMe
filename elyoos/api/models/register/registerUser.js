'use strict';

const db = requireDb();
const registerUserRequest = require('./../eMailService/registerUserRequest');
const randomstring = require("randomstring");
const recaptcha = require('./../util/recaptcha');
const passwordEncryption = require('elyoos-server-lib').passwordEncryption;
const exceptions = require('elyoos-server-lib').exceptions;
const time = require('elyoos-server-lib').time;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const ERROR_CODE_EMAIL_EXISTS = 2;

const checkEmailExists = async function (email, req) {
    let resp = await db.cypher().match("(user:User {emailNormalized: {email}})")
        .return("user.userId").end({email: email}).send();
    if (resp.length > 0) {
        return exceptions.getInvalidOperation('User with email address ' + email + ' already exists', logger, req, ERROR_CODE_EMAIL_EXISTS);
    }
};

const registerUser = async function (params, req) {
    let linkId;
    params.emailNormalized = params.email.toLowerCase();
    await checkEmailExists(params.emailNormalized, req);
    await recaptcha.verifyRecaptcha(params.response, req);
    let hash = await passwordEncryption.generatePasswordHash(params.password);
    let paramsCypher = {
        userData: {
            email: params.email,
            emailNormalized: params.emailNormalized,
            forename: params.forename,
            surname: params.surname,
            name: params.forename + ' ' + params.surname,
            password: hash,
            registerDate: time.getNowUtcTimestamp()
        }
    };
    linkId = randomstring.generate(64);
    paramsCypher.userData.linkId = linkId;
    await db.cypher().create("(:UserRegisterRequest {userData})").end(paramsCypher).send();
    await registerUserRequest.sendRegisterUserVerification(linkId, params.language, params.email);
};

module.exports = {
    registerUser
};
