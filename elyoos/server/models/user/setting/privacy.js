'use strict';

let db = requireDb();
let logger = require('elyoos-server-lib').logging.getLogger(__filename);
let exceptions = require('elyoos-server-lib').exceptions;

let privacySettingCheck = function (id, privacySettingTypes, req, failCondition) {
    return db.cypher().match("(:User {userId: {userId}})-[r:HAS_PRIVACY]->(:Privacy)")
        .where("r.type IN {types}")
        .return("r.type AS type")
        .end({userId: id, types: privacySettingTypes}).send()
        .then(function (result) {
            if (failCondition(result.length)) {
                return exceptions.getInvalidOperation(`For user ${id} is privacy setting ${privacySettingTypes} 
                                                       operation failed`, logger, req);
            }
        });
};

let privacySettingsIsNotExisting = function (id, privacySettingType, req) {
    return privacySettingCheck(id, [privacySettingType], req, function (check) {
        return check > 0;
    });
};

let getPrivacySettings = function (userId) {
    let commands = [], returnCommand, returnCommandNoContact;

    returnCommand = `privacy.image AS imageVisible, privacy.contacts AS contactsVisible, 
                     privacy.pinwall AS pinwallVisible, r.type AS type`;
    returnCommandNoContact = `${returnCommand}, privacy.profile AS profileVisible`;

    commands.push(db.cypher().match("(user:User {userId: {userId}})-[r:HAS_PRIVACY]->(privacy:Privacy)")
        .return(returnCommand)
        .orderBy("type").end({userId: userId}).getCommand());
    return db.cypher().match("(user:User {userId: {userId}})-[r:HAS_PRIVACY_NO_CONTACT]->(privacy:Privacy)")
        .return(returnCommandNoContact)
        .orderBy("type").end({userId: userId}).send(commands)
        .then(function (result) {
            return {group: result[0], noContact: result[1][0]};
        });
};

let getGroupTypes = function (groups) {
    let result = [];
    groups.forEach(function (group) {
        result.push(group.type);
    });
    return result;
};

let allPrivacySettingExists = function (id, groups, req) {
    let groupTypes = getGroupTypes(groups);
    return privacySettingCheck(id, groupTypes, req, function (check) {
        return check !== groupTypes.length;
    });
};

let changePrivacySettings = function (userId, privacySettings, req) {
    return allPrivacySettingExists(userId, privacySettings.group, req).then(function () {
        let commands = [];
        privacySettings.group.forEach(function (group) {
            commands.push(db.cypher().match("(:User {userId: {userId}})-[:HAS_PRIVACY {type: {type}}]->(privacy:Privacy)")
                .set('privacy', {
                    image: group.imageVisible,
                    contacts: group.contactsVisible,
                    pinwall: group.pinwallVisible
                }).end({userId: userId, type: group.type}).getCommand());
        });
        return db.cypher().match("(:User {userId: {userId}})-[:HAS_PRIVACY_NO_CONTACT]->(privacy:Privacy)")
            .set('privacy', {
                profile: privacySettings.noContact.profileVisible,
                image: privacySettings.noContact.imageVisible,
                contacts: privacySettings.noContact.contactsVisible,
                pinwall: privacySettings.noContact.pinwallVisible
            }).end({userId: userId}).send(commands);
    });
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

let addNewPrivacySetting = function (userId, privacySettings) {

    return privacySettingsIsNotExisting(userId, privacySettings.type)
        .then(function () {
            privacySettings.userId = userId;
            privacySettings.type = privacySettings.type;
            return db.cypher().match('(u:User {userId: {userId}})')
                .create(`(u)-[:HAS_PRIVACY {type: {type}}]->(:Privacy {contacts: {contactsVisible}, 
                image: {imageVisible}, pinwall: {pinwallVisible}})`)
                .end(privacySettings).send();
        });
};

let privacySettingExists = function (id, privacySettingType, req) {
    return privacySettingCheck(id, [privacySettingType], req, function (check) {
        return check === 0;
    });
};

let deletePrivacySetting = function (userId, privacySettingType, newPrivacySettingType) {

    return privacySettingExists(userId, newPrivacySettingType)
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
    renamePrivacySetting: renamePrivacySetting,
    addNewPrivacySetting: addNewPrivacySetting,
    deletePrivacySetting: deletePrivacySetting
};
