'use strict';

let db = require('../db');
let dbConnectionHandling = require('./dbConnectionHandling');

let setUserRegisteredDate = function (userId, registerDate) {
    dbConnectionHandling.getCommands().push(db.cypher().match(`(u:User {userId: {userId}})`).set("u", {registerDate: registerDate})
        .end({userId: userId}).getCommand());
};

let setUserLastLoginTime = function (lastLogin) {
    dbConnectionHandling.getCommands().push(db.cypher().match(`(u:User {userId: '1'})`).set("u", {lastLogin: lastLogin})
        .end().getCommand());
};

let setUserIsDumondaMeAdmin = function (userId) {
    dbConnectionHandling.getCommands().push(db.cypher().match(`(u:User {userId: {userId}})`).set("u", {dumondaMeAdmin: true})
        .end({userId: userId}).getCommand());
};

let setUserIsSuperUser = function (userId) {
    dbConnectionHandling.getCommands().push(db.cypher().match(`(u:User {userId: {userId}})`)
        .addCommand(` set u :SuperUser`)
        .end({userId: userId}).getCommand());
};

let setUserIsHarvestingUser = function (userId, data) {
    dbConnectionHandling.getCommands().push(db.cypher().match(`(u:User {userId: {userId}})`)
        .addCommand(` set u :HarvestingUser, u.privacyMode = 'public'`)
        .set("u", {start: data.start, end: data.end, address: data.address, link: data.link})
        .end({userId: userId}).getCommand());
};

let setUserEmail = function (userId, data) {
    dbConnectionHandling.getCommands().push(db.cypher().match(`(u:User {userId: {userId}})`)
        .set("u", {email: data.email})
        .end({userId: userId}).getCommand());
};

let newEmailRequest = function (userId, data) {
    dbConnectionHandling.getCommands().push(db.cypher().match("(u:User {userId: {userId}})")
        .where(`NOT (u)-[:NEW_EMAIL_REQUEST]->(:NewEMail)`)
        .merge(`(u)-[:NEW_EMAIL_REQUEST]->(:NewEMail {verify: {verify}, email: {email}, created: {created}})`)
        .end({userId, verify: data.verify, email: data.email, created: data.created}).getCommand());
};

let createUser = function (userId, forename, surname, email) {
    let name = `${forename} ${surname}`;
    email = email || null;
    dbConnectionHandling.getCommands().push(db.cypher().create(`(:User {email: {email}, 
        name: {name}, surname: {surname}, forename: {forename}, userId: {userId}})`)
        .end({name: name, surname: surname, forename: forename, userId: userId, email: email}).getCommand());
};

let createUserRegisterRequest = function (data) {
    dbConnectionHandling.getCommands().push(db.cypher().create(`(:UserRegisterRequest {name: {name}, surname: {surname},
    forename: {forename}, email: {email}, emailNormalized: {emailNormalized}, linkId: {linkId}, password: {password}, language: {language}, registerDate: {registerDate}})`)
        .end({
            name: `${data.forename} ${data.surname}`,
            surname: data.surname,
            forename: data.forename,
            language: data.language,
            email: data.email,
            emailNormalized: data.emailNormalized,
            linkId: data.linkId,
            password: data.password,
            registerDate: data.registerDate
        }).getCommand());
};

let blockUser = function (userId, blockedUserId) {
    dbConnectionHandling.getCommands().push(db.cypher().match('(user:User {userId: {userId}}), (blockedUser:User {userId: {blockedUserId}})')
        .create(`(user)-[:IS_BLOCKED]->(blockedUser)`)
        .end({
            userId: userId, blockedUserId: blockedUserId
        }).getCommand());
};

let addSendInvitationCommand = function (sendingEmailPending) {
    if (sendingEmailPending === true) {
        return db.cypher().merge(`(user)-[:SENDING_EMAIL_PENDING]->(invitedUser)`).getCommandString();
    }
    return '';
};

let invitationSentBeforeRegistration = function (userId, data) {
    data.forEach(function (invitationData) {
        dbConnectionHandling.getCommands().push(db.cypher().match('(user:User {userId: {userId}})')
            .merge(`(invitedUser:InvitedUser:EMailNotificationEnabled 
            {emailNormalized: {emailNormalized}})`)
            .merge(`(user)-[:HAS_INVITED]->(invitedUser)`)
            .addCommand(addSendInvitationCommand(invitationData.sendingEmailPending))
            .end({userId: userId, emailNormalized: invitationData.emailOfUserToInvite}).getCommand());
    });
};

let inviteUser = function (userId, invitedUserId) {
    dbConnectionHandling.getCommands().push(db.cypher().match('(user:User {userId: {userId}}), (invitedUser:User {userId: {invitedUserId}})')
        .create(`(user)-[:HAS_INVITED]->(invitedUser)`)
        .end({
            userId: userId, invitedUserId: invitedUserId
        }).getCommand());
};

let setUserPrivacy = function (userId, data) {
    dbConnectionHandling.getCommands().push(db.cypher().match("(u:User {userId: {userId}})")
        .set("u", {privacyMode: data.privacyMode}).end({userId}).getCommand());
};

let setUserProfileActivityPrivacy = function (userId, data) {
    dbConnectionHandling.getCommands().push(db.cypher().match("(u:User {userId: {userId}})")
        .set("u", {showProfileActivity: data.showProfileActivity}).end({userId}).getCommand());
};

let setUserName = function (userId, data) {
    dbConnectionHandling.getCommands().push(db.cypher().match("(u:User {userId: {userId}})")
        .set("u", {name: data.name}).end({userId}).getCommand());
};

let setUserLanguage = function (userId, data) {
    dbConnectionHandling.getCommands().push(db.cypher().match("(u:User {userId: {userId}})")
        .set("u", {language: data.language}).end({userId}).getCommand());
};

let setUserLanguages = function (userId, data) {
    dbConnectionHandling.getCommands().push(db.cypher().match("(u:User {userId: {userId}})")
        .set("u", {languages: data.languages}).end({userId}).getCommand());
};

let setTrustCircle = function (userId, data) {
    dbConnectionHandling.getCommands().push(db.cypher().match("(u:User {userId: {userId}})")
        .set("u", {trustCircle: data.trustCircle}).end({userId}).getCommand());
};

let setInfoState = function (userId, data) {
    dbConnectionHandling.getCommands().push(db.cypher().match("(u:User {userId: {userId}})")
        .set("u", {infoState: data.infoState}).end({userId}).getCommand());
};

let interestedTopics = function (userId, data) {
    dbConnectionHandling.getCommands().push(db.cypher()
        .match(`(u:User {userId: {userId}}), (t:Topic)`)
        .where(`t.topicId IN {topics}`)
        .merge(`(u)-[:INTERESTED]->(t)`)
        .end({userId, topics: data.topics}).getCommand());
};

let interestedRegions = function (userId, data) {
    dbConnectionHandling.getCommands().push(db.cypher()
        .match(`(u:User {userId: {userId}}), (r:Region)`)
        .where(`r.regionId IN {regions}`)
        .merge(`(u)-[:INTERESTED]->(r)`)
        .end({userId, regions: data.regions}).getCommand());
};


module.exports = {
    setUserRegisteredDate,
    setUserLastLoginTime,
    setUserIsDumondaMeAdmin,
    setUserIsSuperUser,
    setUserIsHarvestingUser,
    setUserEmail,
    newEmailRequest,
    createUser,
    createUserRegisterRequest,
    blockUser,
    invitationSentBeforeRegistration,
    inviteUser,
    setUserPrivacy,
    setUserProfileActivityPrivacy,
    setUserName,
    setUserLanguage,
    setUserLanguages,
    setTrustCircle,
    setInfoState,
    interestedTopics,
    interestedRegions
};