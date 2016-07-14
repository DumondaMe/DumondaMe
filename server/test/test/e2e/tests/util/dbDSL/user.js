'use strict';

var db = require('../db');
var dbConnectionHandling = require('./dbConnectionHandling');

var blockUser = function (userId, blockedUserId) {
    dbConnectionHandling.getCommands().push(db.cypher().match('(user:User {userId: {userId}}), (blockedUser:User {userId: {blockedUserId}})')
        .create(`(user)-[:IS_BLOCKED]->(blockedUser)`)
        .end({
            userId: userId, blockedUserId: blockedUserId
        }).getCommand());
};

var createPrivacy = function (userIds, type, privacy) {
    dbConnectionHandling.getCommands().push(db.cypher().match("(u:User)")
        .where("u.userId IN {userIds}")
        .create(`(u)-[:HAS_PRIVACY {type: {type}}]->(:Privacy {profile: {profile}, image: {image}, profileData: {profileData}, contacts: {contacts}, 
                  pinwall: {pinwall}})`)
        .end({
            userIds: userIds,
            type: type,
            profile: privacy.profile,
            image: privacy.image,
            profileData: privacy.profileData,
            contacts: privacy.contacts,
            pinwall: privacy.pinwall
        }).getCommand());
};

var createPrivacyNoContact = function (userIds, privacy) {
    var idsCommand = null;
    if(userIds) {
        idsCommand = "u.userId IN {userIds}";
    }
    dbConnectionHandling.getCommands().push(db.cypher().match("(u:User)")
        .where(idsCommand)
        .create(`(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: {profile}, image: {image}, profileData: {profileData}, contacts: {contacts}, 
                  pinwall: {pinwall}})`)
        .end({
            userIds: userIds,
            profile: privacy.profile,
            image: privacy.image,
            profileData: privacy.profileData,
            contacts: privacy.contacts,
            pinwall: privacy.pinwall
        }).getCommand());
};

module.exports = {
    blockUser: blockUser,
    createPrivacy: createPrivacy,
    createPrivacyNoContact: createPrivacyNoContact
};