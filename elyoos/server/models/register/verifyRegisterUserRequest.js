'use strict';

let db = requireDb();
let exceptions = require('elyoos-server-lib').exceptions;
let uuid = require('elyoos-server-lib').uuid;
let time = require('elyoos-server-lib').time;
let cdn = require('elyoos-server-lib').cdn;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let EXPIRED = 60 * 60 * 12; // 12h

let deleteInvalidLinkIdRequest = function (linkId, req) {
    return db.cypher().match("(user:UserRegisterRequest {linkId: {linkId}})").delete("user")
        .end({linkId: linkId}).send().then(function () {
            return exceptions.getInvalidOperation(`linkId is expired ${linkId}`, logger, req);
        });
};

let deleteRegisterRequest = function (emailNormalized, req) {
    return db.cypher().match("(user:UserRegisterRequest {emailNormalized: {emailNormalized}})")
        .delete("user").end({emailNormalized: emailNormalized}).send().then(function () {
            return exceptions.getInvalidOperation(`User does already exist for email ${emailNormalized}`, logger, req);
        });
};

let checkValidLinkId = function (linkId, req) {
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

let checkUserExistsAlready = function (user, req) {
    return db.cypher().match("(user:User {emailNormalized: {emailNormalized}})")
        .return("user")
        .end({emailNormalized: user.emailNormalized})
        .send().then(function (resp) {
            if (resp.length === 1) {
                return deleteRegisterRequest(user.emailNormalized, req);
            }
        });
};

let verify = function (linkId, req) {

    let userId, email;
    return checkValidLinkId(linkId, req).then(function (user) {
        return checkUserExistsAlready(user, req).then(function () {
            let commands = [], privacy = {
                profile: true,
                profileData: true,
                image: true,
                contacts: true,
                pinwall: true
            };
            delete user.linkId;
            userId = uuid.generateUUID();
            user.userId = userId;

            commands.push(db.cypher().match(`(user:UserRegisterRequest {linkId: {linkId}})`)
                .return("user").end({linkId: linkId}).getCommand());
            commands.push(db.cypher().create(`(:Privacy {privacy})<-[:HAS_PRIVACY {type: 'Freund'}]-(user:User {userData})
                                          -[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {privacy})`)
                .end({userData: user, privacy: privacy}).getCommand());
            commands.push(db.cypher().match(`(user:User {userId: {userId}}), (invitedUser:InvitedUser)<-[:HAS_INVITED]-(inviteUser:User)`)
                .where(`invitedUser.emailNormalized = {email}`)
                .createUnique(`(user)<-[:HAS_INVITED]-(inviteUser)`)
                .end({userId: userId, email: user.emailNormalized}).getCommand());
            commands.push(db.cypher().match(`(invitedUser:InvitedUser)<-[rel:HAS_INVITED]-(:User)`)
                .where(`invitedUser.emailNormalized = {email}`).delete(`invitedUser, rel`)
                .end({email: user.emailNormalized}).getCommand());
            return db.cypher().match("(user:UserRegisterRequest {linkId: {linkId}})").delete("user").end({linkId: linkId}).send(commands);
        });
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
