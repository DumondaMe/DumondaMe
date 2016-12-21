'use strict';

var db = requireDb();
let exceptions = require('elyoos-server-lib').exceptions;
let uuid = require('elyoos-server-lib').uuid;
let time = require('elyoos-server-lib').time;
var cdn = require('./../util/cdn');
var logger = require('elyoos-server-lib').logging.getLogger(__filename);

var EXPIRED = 60 * 60 * 12; // 12h

var deleteInvalidLinkIdRequest = function (linkId, req) {
    return db.cypher().match("(user:UserRegisterRequest {linkId: {linkId}})").delete("user").end({linkId: linkId}).send().then(function () {
        return exceptions.getInvalidOperation(`linkId is expired ${linkId}`, logger, req);
    });
};

var checkValidLinkId = function (linkId, req) {
    return db.cypher().match("(user:UserRegisterRequest {linkId: {linkId}})")
        .return("user")
        .end({linkId: linkId})
        .send().then(function (resp) {
            if (resp.length === 1) {
                if (resp[0].user.registerDate > time.getNowUtcTimestamp() - EXPIRED) {
                    return resp[0].user;
                } else {
                    return deleteInvalidLinkIdRequest(linkId, req);
                }
            } else {
                return exceptions.getInvalidOperation(`Not found or more then one linkId ${linkId}`, logger, req);
            }
        });
};

var verify = function (linkId, req) {

    var userId, email;
    return checkValidLinkId(linkId, req).then(function (user) {
        var commands = [], privacy = {
            profile: true,
            profileData: true,
            image: true,
            contacts: true,
            pinwall: true
        };
        delete user.linkId;
        userId = uuid.generateUUID();
        user.userId = userId;

        commands.push(db.cypher().match(`(user:UserRegisterRequest {linkId: {linkId}})`).return("user").end({linkId: linkId}).getCommand());
        commands.push(db.cypher().create(`(:Privacy {privacy})<-[:HAS_PRIVACY {type: 'Freund'}]-(user:User {userData})
                                          -[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {privacy})`).end({userData: user, privacy: privacy}).getCommand());
        return db.cypher().match("(user:UserRegisterRequest {linkId: {linkId}})").delete("user").end({linkId: linkId}).send(commands);
    }).then(function (resp) {
        email = resp[0][0].user.email;
        return cdn.createFolderRegisterUser(userId);
    }).then(function () {
        return {email: email};
    });
};

module.exports = {
    verify: verify
};
