'use strict';

const db = requireDb();
const exceptions = require('dumonda-me-server-lib').exceptions;
const uuid = require('dumonda-me-server-lib').uuid;
const cdn = require('dumonda-me-server-lib').cdn;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

let deleteRegisterRequest = async function (emailNormalized, req) {
    await db.cypher().match("(user:UserRegisterRequest {emailNormalized: {emailNormalized}})")
        .delete("user").end({emailNormalized: emailNormalized}).send();
    return exceptions.getInvalidOperation(`User does already exist for email ${emailNormalized}`, logger, req);
};

let checkValidLinkId = async function (linkId, req) {
    let resp = await db.cypher().match("(user:UserRegisterRequest {linkId: {linkId}})")
        .return("user")
        .end({linkId: linkId}).send();
    if (resp.length === 1) {
        return resp[0].user;
    }
    return exceptions.getInvalidOperation(`Not found or more then one linkId ${linkId}`, logger, req);

};

let checkUserExistsAlready = async function (user, req) {
    let resp = await db.cypher().match("(user:User {emailNormalized: {emailNormalized}})")
        .return("user")
        .end({emailNormalized: user.emailNormalized}).send();
    if (resp.length === 1) {
        await deleteRegisterRequest(user.emailNormalized, req);
    }
};

let verify = async function (linkId, req) {

    let userId, email, commands = [];
    let user = await checkValidLinkId(linkId, req);
    await checkUserExistsAlready(user, req);

    delete user.linkId;
    userId = uuid.generateUUID();
    user.userId = userId;
    user.privacyMode = 'publicEl';
    user.showProfileActivity = true;

    commands.push(db.cypher().match(`(user:UserRegisterRequest {linkId: {linkId}})`)
        .return("user").end({linkId: linkId}).getCommand());
    commands.push(db.cypher().create(`(user:User {userData})`)
        .end({userData: user}).getCommand());
    commands.push(db.cypher().match(`(user:User {userId: {userId}}), (invitedUser:InvitedUser)<-[:HAS_INVITED]-(inviteUser:User)`)
        .where(`invitedUser.emailNormalized = {email}`)
        .createUnique(`(user)<-[:HAS_INVITED]-(inviteUser)`)
        .end({userId: userId, email: user.emailNormalized}).getCommand());
    commands.push(db.cypher().match(`(invitedUser:InvitedUser)<-[rel:HAS_INVITED]-(:User)`)
        .where(`invitedUser.emailNormalized = {email}`).delete(`invitedUser, rel`)
        .end({email: user.emailNormalized}).getCommand());

    let resp = await db.cypher().match("(user:UserRegisterRequest {linkId: {linkId}})")
        .delete("user").end({linkId: linkId}).send(commands);

    email = resp[0][0].user.email;
    await cdn.createFolderRegisterUser(userId);
    return {email: email};
};

module.exports = {
    verify
};
