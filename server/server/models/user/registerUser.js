'use strict';

var db = require('./../../neo4j');
var uuid = require('./../../../common/src/lib/uuid');
var passwordEncryption = require('./../../lib/passwordEncryption');
var exceptions = require('./../../../common/src/lib/error/exceptions');
var cdnPath = require('./../../../common/src/lib/cdn').getConfig().path;
var mkdirp = require('mkdirp');
var Promise = require('bluebird').Promise;
var ncp = Promise.promisify(require('ncp').ncp);
var logger = requireLogger.getLogger(__filename);

var ERROR_CODE_EMAIL_EXISTS = 1;

var checkEmailExists = function (email) {
    return db.cypher().match("(user:User {email: {email}})")
        .return("user.userId")
        .end({email: email})
        .send().then(function (resp) {
            if (resp.length > 0) {
                return exceptions.getInvalidOperation('User with email address ' + email + ' already exists', logger, ERROR_CODE_EMAIL_EXISTS);
            }
        });
};

var createCdnProfileFolders = function (userId) {
    var path = cdnPath + '/' + userId + '/profile/',
        defaultPath = cdnPath + '/default/profile';
    mkdirp.sync(path);
    return ncp(defaultPath, path);
};

var registerUser = function (params) {

    var userId;
    return checkEmailExists(params.email).then(function () {
        userId = uuid.generateUUID()
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
                userId: userId
            },
            privacy: {
                profile: true,
                profileData: true,
                image: true,
                contacts: true
            }
        };
        return db.cypher().create("(:Privacy {privacy})<-[:HAS_PRIVACY {type: 'Freund'}]-(:User {userData})" +
        "-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {privacy})")
            .end(paramsCypher)
            .send();
    }).then(function () {
        return createCdnProfileFolders(userId);
    });
};

module.exports = {
    registerUser: registerUser
};
