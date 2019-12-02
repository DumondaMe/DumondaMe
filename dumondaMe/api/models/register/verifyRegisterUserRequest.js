'use strict';

const db = requireDb();
const exceptions = require('dumonda-me-server-lib').exceptions;
const uuid = require('dumonda-me-server-lib').uuid;
const cdn = require('dumonda-me-server-lib').cdn;
const time = require('dumonda-me-server-lib').time;
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

let createUser = async function (linkId, user) {
    let commands = [];
    commands.push(db.cypher().create(`(user:User:EMailNotificationEnabled {userData})`)
        .end({userData: user}).getCommand());
    await db.cypher().match("(user:UserRegisterRequest {linkId: {linkId}})")
        .delete("user").end({linkId}).send(commands);
};

let moveInvitedUserToAnswerQuestionRelationship = async function (emailNormalized) {
    await db.cypher()
        .match(`(invitedUser:InvitedUser {emailNormalized: {emailNormalized}})<-[askedRel:ASKED]-
                (asked:AskedToAnswerQuestion)<-[:ASKED_TO_ANSWER_QUESTION]-(:User)`)
        .delete(`askedRel`)
        .with(`asked`)
        .match(`(registeredUser:User {emailNormalized: {emailNormalized}})`)
        .merge(`(asked)-[:ASKED]->(registeredUser)`)
        .end({emailNormalized}).send();
};

let createInvitedUserToAskQuestionHasRegisteredNotification = async function (emailNormalized) {
    await db.cypher()
        .match(`(registeredUser:User {emailNormalized: {emailNormalized}})<-[:ASKED]-(asked:AskedToAnswerQuestion)
                 <-[:ASKED_TO_ANSWER_QUESTION]-(user:User)`)
        .where(`NOT (user)-[:HAS_INVITED]->(:InvitedUser {emailNormalized: {emailNormalized}})`)
        .with(`DISTINCT user, registeredUser`)
        .merge(`(user)<-[:NOTIFIED]-(n:Notification:Unread {type: 'invitedUserHasRegistered', created: {created},
                 notificationId: apoc.create.uuid()})-[:ORIGINATOR_OF_NOTIFICATION]->(registeredUser)`)
        .end({emailNormalized, created: time.getNowUtcTimestamp()}).send();
};

let createInvitedUserHasRegisteredNotification = async function (emailNormalized) {
    await db.cypher()
        .match(`(invitedUser:InvitedUser {emailNormalized: {emailNormalized}})<-[:HAS_INVITED]-(user:User)`)
        .with(`DISTINCT invitedUser, user`)
        .match(`(registeredUser:User {emailNormalized: {emailNormalized}})`)
        .merge(`(user)<-[:NOTIFIED]-(n:Notification:Unread {type: 'invitedUserHasRegistered', created: {created},
                 notificationId: apoc.create.uuid()})-[:ORIGINATOR_OF_NOTIFICATION]->(registeredUser)`)
        .end({emailNormalized, created: time.getNowUtcTimestamp()}).send();
};

let deleteInvitedUser = async function (emailNormalized) {
    await db.cypher().match(`(invitedUser:InvitedUser)`)
        .where(`invitedUser.emailNormalized = {emailNormalized}`)
        .optionalMatch(`(invitedUser)-[rel]-()`)
        .delete(`invitedUser, rel`)
        .end({emailNormalized}).send();
};

let verify = async function (linkId, req) {

    let user = await checkValidLinkId(linkId, req);
    await checkUserExistsAlready(user, req);

    delete user.linkId;
    let userId = uuid.generateUUID();
    user.userId = userId;
    user.privacyMode = 'publicEl';
    user.emailNotificationInterval = 86400;
    user.lastEmailSent = time.getNowUtcTimestamp();
    user.showProfileActivity = true;
    user.languages = ['de', 'en'];

    await createUser(linkId, user);
    await cdn.createFolderRegisterUser(userId);

    try {
        await moveInvitedUserToAnswerQuestionRelationship(user.emailNormalized);
        await createInvitedUserToAskQuestionHasRegisteredNotification(user.emailNormalized);
        await createInvitedUserHasRegisteredNotification(user.emailNormalized);
        await deleteInvitedUser(user.emailNormalized);
    } catch (error) {
        logger.error('Error occurred o')
    }

    return {email: user.email};
};

module.exports = {
    verify
};
