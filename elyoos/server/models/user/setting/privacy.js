'use strict';

let db = requireDb();
let logger = require('elyoos-server-lib').logging.getLogger(__filename);
let exceptions = require('elyoos-server-lib').exceptions;

let privacySettingCheck = function (id, privacySettingType, req, failCondition) {
    return db.cypher().match("(:User {userId: {userId}})-[r:HAS_PRIVACY {type: {type}}]->(:Privacy)")
        .return('r.type AS type')
        .end({
            userId: id,
            type: privacySettingType
        }).send()
        .then(function (result) {
            if (failCondition(result.length)) {
                let invalidJsonException = new exceptions.InvalidOperation('For user ' + id + 'is privacy setting ' +
                    privacySettingType + ' operation failed');
                logger.warn(invalidJsonException.message, req, {});
                return Promise.reject(invalidJsonException);
            }
        });
};

let privacySettingsIsExisting = function (id, privacySettingType, req) {
    return privacySettingCheck(id, privacySettingType, req, function (check) {
        return check === 0;
    });
};

let privacySettingsIsNotExisting = function (id, privacySettingType, req) {
    return privacySettingCheck(id, privacySettingType, req, function (check) {
        return check > 0;
    });
};

let getPrivacySettings = function (userId) {
    let commands = [], returnCommand;

    returnCommand = "privacy.profile AS profileVisible, privacy.profileData AS profileDataVisible, " +
        "privacy.image AS imageVisible, privacy.contacts AS contactsVisible, privacy.pinwall AS pinwallVisible, r.type AS type";

    commands.push(db.cypher().match("(user:User {userId: {userId}})-[r:HAS_PRIVACY]->(privacy:Privacy)")
        .return(returnCommand)
        .orderBy("type").end({userId: userId}).getCommand());
    return db.cypher().match("(user:User {userId: {userId}})-[r:HAS_PRIVACY_NO_CONTACT]->(privacy:Privacy)")
        .return(returnCommand)
        .orderBy("type").end({userId: userId}).send(commands)
        .then(function (result) {
            return {normal: result[0], noContact: result[1][0]};
        });
};

let changePrivacySettings = function (userId, privacySettingType, privacySettings, req) {
    return privacySettingsIsExisting(userId, privacySettingType, req)
        .then(function () {
            return db.cypher().match("(:User {userId: {userId}})-[:HAS_PRIVACY {type: {type}}]->(privacy:Privacy)")
                .set('privacy', {
                    profile: privacySettings.profileVisible,
                    profileData: privacySettings.profileDataVisible,
                    image: privacySettings.imageVisible,
                    contacts: privacySettings.contactsVisible,
                    pinwall: privacySettings.pinwallVisible
                })
                .end({
                    userId: userId,
                    type: privacySettingType
                }).send();
        });
};
let changePrivacySettingsNoContact = function (userId, privacySettings) {

    return db.cypher().match("(:User {userId: {userId}})-[:HAS_PRIVACY_NO_CONTACT]->(privacy:Privacy)")
        .set('privacy', {
            profile: privacySettings.profileVisible,
            profileData: privacySettings.profileDataVisible,
            image: privacySettings.imageVisible,
            contacts: privacySettings.contactsVisible,
            pinwall: privacySettings.pinwallVisible
        })
        .end({
            userId: userId
        }).send();
};

let renamePrivacyOnContact = function (userId, typeOld, typeNew) {
    return db.cypher().match("(user:User {userId: {userId}})-[r:IS_CONTACT {type: {typeOld}}]->(:User)")
        .set('r', {type: typeNew})
        .end({userId: userId, typeOld: typeOld}).getCommand();
};

let renamePrivacyOnBlog = function (userId, typeOld, typeNew) {
    return db.cypher().match("(user:User {userId: {userId}})-[:WRITTEN]->(blog:Blog)")
        .replaceArrayElement('blog', 'visible', typeOld, typeNew)
        .end({userId: userId}).getCommand();
};

let renamePrivacySetting = function (userId, privacySettingType, newPrivacySettingType, req) {

    return privacySettingsIsNotExisting(userId, newPrivacySettingType, req)
        .then(function () {
            let commands = [];
            commands.push(renamePrivacyOnContact(userId, privacySettingType, newPrivacySettingType));
            commands.push(renamePrivacyOnBlog(userId, privacySettingType, newPrivacySettingType));
            return db.cypher().match("(:User {userId: {userId}})-[r:HAS_PRIVACY {type: {typeOld}}]->(:Privacy)")
                .set('r', {type: newPrivacySettingType})
                .end({userId: userId, typeOld: privacySettingType}).send(commands);
        });
};

let addNewPrivacySetting = function (userId, privacySettingType, privacySettings) {

    return privacySettingsIsNotExisting(userId, privacySettingType)
        .then(function () {
            privacySettings.userId = userId;
            privacySettings.type = privacySettingType;
            return db.cypher().match('(u:User {userId: {userId}})')
                .create("(u)-[:HAS_PRIVACY {type: {type}}]->(:Privacy {profile: {profileVisible}, " +
                    "profileData: {profileDataVisible}, contacts: {contactsVisible}, image: {imageVisible}, pinwall: {pinwallVisible}})")
                .end(privacySettings).send();
        });
};

let deletePrivacySetting = function (userId, privacySettingType, newPrivacySettingType) {

    return privacySettingsIsExisting(userId, newPrivacySettingType)
        .then(function () {
            let commands = [];
            commands.push(db.cypher().match("(user:User {userId: {userId}})-[r:IS_CONTACT {type: {typeOld}}]->(:User)")
                .set('r', {
                    type: newPrivacySettingType
                })
                .end({
                    userId: userId,
                    typeOld: privacySettingType
                }).getCommand());
            return db.cypher().match("(:User {userId: {userId}})-[r:HAS_PRIVACY {type: {typeOld}}]->(privacy:Privacy)")
                .delete("privacy, r")
                .end({
                    userId: userId,
                    typeOld: privacySettingType
                }).send(commands);
        });
};

module.exports = {
    getPrivacySettings: getPrivacySettings,
    changePrivacySettings: changePrivacySettings,
    changePrivacySettingsNoContact: changePrivacySettingsNoContact,
    renamePrivacySetting: renamePrivacySetting,
    addNewPrivacySetting: addNewPrivacySetting,
    deletePrivacySetting: deletePrivacySetting
};
