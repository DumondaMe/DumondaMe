'use strict';

var db = requireDb();
var logger = requireLogger.getLogger(__filename);
var exceptions = requireLib('error/exceptions');

var privacySettingCheck = function (id, privacySettingType, req, failCondition) {
    return db.cypher().match("(:User {userId: {userId}})-[r:HAS_PRIVACY {type: {type}}]->(:Privacy)")
        .return('r.type AS type')
        .end({
            userId: id,
            type: privacySettingType
        }).send()
        .then(function (result) {
            if (failCondition(result.length)) {
                var invalidJsonException = new exceptions.InvalidOperation('For user ' + id + 'is privacy setting ' +
                    privacySettingType + ' operation failed');
                logger.warn(invalidJsonException.message, req, {});
                return Promise.reject(invalidJsonException);
            }
        });
};

var privacySettingsIsExisting = function (id, privacySettingType, req) {
    return privacySettingCheck(id, privacySettingType, req, function (check) {
        return check === 0;
    });
};

var privacySettingsIsNotExisting = function (id, privacySettingType, req) {
    return privacySettingCheck(id, privacySettingType, req, function (check) {
        return check > 0;
    });
};

var getPrivacySettings = function (id) {
    var commands = [], returnCommand;

    returnCommand = "privacy.profile AS profileVisible, privacy.profileData AS profileDataVisible, " +
        "privacy.image AS imageVisible, privacy.contacts AS contactsVisible, privacy.pinwall AS pinwallVisible, r.type AS type";

    commands.push(db.cypher().match("(user:User {userId: {userId}})-[r:HAS_PRIVACY]->(privacy:Privacy)")
        .return(returnCommand)
        .orderBy("type")
        .end({
            userId: id
        }).getCommand());
    return db.cypher().match("(user:User {userId: {userId}})-[r:HAS_PRIVACY_NO_CONTACT]->(privacy:Privacy)")
        .return(returnCommand)
        .orderBy("type")
        .end({
            userId: id
        }).send(commands)
        .then(function (result) {
            return {normal: result[0], noContact: result[1][0]};
        });
};

var changePrivacySettings = function (id, privacySettingType, privacySettings, req) {
    return privacySettingsIsExisting(id, privacySettingType, req)
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
                    userId: id,
                    type: privacySettingType
                }).send();
        });
};
var changePrivacySettingsNoContact = function (id, privacySettings) {

    return db.cypher().match("(:User {userId: {userId}})-[:HAS_PRIVACY_NO_CONTACT]->(privacy:Privacy)")
        .set('privacy', {
            profile: privacySettings.profileVisible,
            profileData: privacySettings.profileDataVisible,
            image: privacySettings.imageVisible,
            contacts: privacySettings.contactsVisible,
            pinwall: privacySettings.pinwallVisible
        })
        .end({
            userId: id
        }).send();
};

var renamePrivacyOnContact = function (userId, typeOld, typeNew) {
    return db.cypher().match("(user:User {userId: {userId}})-[r:IS_CONTACT {type: {typeOld}}]->(:User)")
        .set('r', {type: typeNew})
        .end({userId: userId, typeOld: typeOld}).getCommand();
};

var renamePrivacyOnBlog = function (userId, typeOld, typeNew) {
    return db.cypher().match("(user:User {userId: {userId}})-[:WRITTEN]->(blog:Blog)")
        .replaceArrayElement('blog', 'visible', typeOld, typeNew)
        .end({userId: userId}).getCommand();
};

var renamePrivacySetting = function (id, privacySettingType, newPrivacySettingType, req) {

    return privacySettingsIsNotExisting(id, newPrivacySettingType, req)
        .then(function () {
            var commands = [];
            commands.push(renamePrivacyOnContact(id, privacySettingType, newPrivacySettingType));
            commands.push(renamePrivacyOnBlog(id, privacySettingType, newPrivacySettingType));
            return db.cypher().match("(:User {userId: {userId}})-[r:HAS_PRIVACY {type: {typeOld}}]->(:Privacy)")
                .set('r', {type: newPrivacySettingType})
                .end({userId: id, typeOld: privacySettingType}).send(commands);
        });
};

var addNewPrivacySetting = function (id, privacySettingType, privacySettings) {

    return privacySettingsIsNotExisting(id, privacySettingType)
        .then(function () {
            privacySettings.userId = id;
            privacySettings.type = privacySettingType;
            return db.cypher().match('(u:User {userId: {userId}})')
                .create("(u)-[:HAS_PRIVACY {type: {type}}]->(:Privacy {profile: {profileVisible}, " +
                    "profileData: {profileDataVisible}, contacts: {contactsVisible}, image: {imageVisible}, pinwall: {pinwallVisible}})")
                .end(privacySettings).send();
        });
};

var deletePrivacySetting = function (id, privacySettingType, newPrivacySettingType) {

    return privacySettingsIsExisting(id, newPrivacySettingType)
        .then(function () {
            var commands = [];
            commands.push(db.cypher().match("(user:User {userId: {userId}})-[r:IS_CONTACT {type: {typeOld}}]->(:User)")
                .set('r', {
                    type: newPrivacySettingType
                })
                .end({
                    userId: id,
                    typeOld: privacySettingType
                }).getCommand());
            return db.cypher().match("(:User {userId: {userId}})-[r:HAS_PRIVACY {type: {typeOld}}]->(privacy:Privacy)")
                .delete("privacy, r")
                .end({
                    userId: id,
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
