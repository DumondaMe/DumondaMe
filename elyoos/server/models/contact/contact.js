'use strict';

let db = requireDb();
let exceptions = require('elyoos-server-lib').exceptions;
let contactStatistic = require('./contactStatistic');
let privacySettings = require('./privacySettings');
let logger = require('elyoos-server-lib').logging.getLogger(__filename);
let moment = require('moment');
let userInfo = require('./../user/userInfo');

let validAddContactCommand = function (userId, type, req) {
    return db.cypher().match('(u:User {userId: {userId}})-[r:HAS_PRIVACY {type: {type}}]->()')
        .return("r")
        .end({userId: userId, type: type}).send().then(function (resp) {
            if (resp.length === 0) {
                return exceptions.getInvalidOperation('Type [' + type + '] does not exist for userId [' + userId + ']', logger, req);
            }
        });
};

let removeInvitation = function (userId, contactIds) {
    return db.cypher().match('(u:User {userId: {userId}})<-[invitedRel:HAS_INVITED]-(u2:User)')
        .where('u2.userId IN {contactIds}')
        .delete('invitedRel')
        .end({userId: userId, contactIds: contactIds})
        .getCommand();
};

let addContact = function (userId, contactIds, type, req) {

    let commands = [], timeAddedContact = Math.floor(moment.utc().valueOf() / 1000);
    return validAddContactCommand(userId, type, req).then(function () {
        commands.push(db.cypher().match('(u:User {userId: {userId}}), (u2:User)')
            .where('u2.userId IN {contactIds} AND NOT (u)-[:IS_CONTACT]->(u2)')
            .createUnique('(u)-[:IS_CONTACT {type: {type}, contactAdded: {contactAdded}}]->(u2)')
            .with('u, u2')
            .match('(u)-[r:IS_BLOCKED]->(u2)')
            .delete('r')
            .end({
                userId: userId,
                contactIds: contactIds,
                type: type,
                contactAdded: timeAddedContact
            })
            .getCommand());

        commands.push(removeInvitation(userId, contactIds));
        commands.push(contactStatistic.getContactStatisticsCommand(userId).getCommand());

        return contactStatistic.getTotalNumberOfContacts(userId)
            .send(commands)
            .then(function (result) {
                return {statistic: result[2], numberOfContacts: result[3][0].numberOfContacts};
            });
    });
};

let deleteContact = function (userId, contactIds) {

    let commands = [];

    commands.push(db.cypher().match('(u:User {userId: {userId}})-[r:IS_CONTACT]->(u2:User)')
        .where('u2.userId IN {contactIds}')
        .delete('r')
        .end({
            userId: userId,
            contactIds: contactIds
        })
        .getCommand());

    commands.push(contactStatistic.getContactStatisticsCommand(userId).getCommand());

    return contactStatistic.getTotalNumberOfContacts(userId)
        .send(commands)
        .then(function (result) {
            return {statistic: result[1], numberOfContacts: result[2][0].numberOfContacts};
        });
};

let blockContact = function (userId, blockedUserIds) {

    let commands = [];
    commands.push(db.cypher().match('(u:User {userId: {userId}}), (u2:User)')
        .where('u2.userId IN {blockedUserIds}')
        .createUnique('(u)-[:IS_BLOCKED]->(u2)')
        .with('u, u2')
        .match('(u)-[r:IS_CONTACT]->(u2)')
        .delete('r')
        .end({
            userId: userId,
            blockedUserIds: blockedUserIds
        })
        .getCommand());

    commands.push(removeInvitation(userId, blockedUserIds));
    commands.push(contactStatistic.getContactStatisticsCommand(userId).getCommand());

    return contactStatistic.getTotalNumberOfContacts(userId)
        .send(commands)
        .then(function (result) {
            return {statistic: result[2], numberOfContacts: result[3][0].numberOfContacts};
        });
};

let unblockContact = function (userId, blockedUserIds) {

    let commands = [];
    commands.push(db.cypher().match('(u:User {userId: {userId}})-[blocked:IS_BLOCKED]->(u2:User)')
        .where('u2.userId IN {blockedUserIds}')
        .delete('blocked')
        .end({
            userId: userId,
            blockedUserIds: blockedUserIds
        })
        .getCommand());

    commands.push(contactStatistic.getContactStatisticsCommand(userId).getCommand());

    return contactStatistic.getTotalNumberOfContacts(userId)
        .send(commands)
        .then(function (result) {
            return {statistic: result[1], numberOfContacts: result[2][0].numberOfContacts};
        });
};

let changeContactState = function (userId, contactIds, type, req) {

    let commands = [];

    commands.push(db.cypher().match('(u:User {userId: {userId}})-[r:IS_CONTACT]->(u2:User)')
        .where('u2.userId IN {contactIds}')
        .set('r', {type: type})
        .return('r')
        .end({
            userId: userId,
            contactIds: contactIds
        }).getCommand());

    return contactStatistic.getContactStatisticsCommand(userId)
        .send(commands)
        .then(function (rel) {
            if (rel[0].length === contactIds.length) {
                return {statistic: rel[1]};
            }
            let invalidOperationException = new exceptions.InvalidOperation('Not all contact connections are updated');
            logger.warn(invalidOperationException.message, req, {error: ''});
            return Promise.reject(invalidOperationException);
        });
};

let getContact = function (params, where) {
    return db.cypher().match("(user:User)-[r:IS_CONTACT]->(contact:User)")
        .where(where)
        .with("contact, user, r")
        .orderBy("contact.name")
        .skip("{skip}")
        .limit("{itemsPerPage}")
        .match("(contact)-[vr:HAS_PRIVACY|HAS_PRIVACY_NO_CONTACT]->(v:Privacy)")
        .optionalMatch("(user)<-[rContact:IS_CONTACT]-(contact)")
        .with("contact, rContact, user, r, v, vr")
        .where("(rContact IS NULL AND type(vr) = 'HAS_PRIVACY_NO_CONTACT') OR (rContact.type = vr.type AND type(vr) = 'HAS_PRIVACY')")
        .return("r.type AS type, r.contactAdded AS contactAdded, rContact.type AS contactType, rContact.contactAdded As userAdded, " +
            "contact.name AS name, contact.userId AS userId, v.profile AS profileVisible, v.image AS imageVisible")
        .end(params);
};

let getContactsNormal = function (userId, itemsPerPage, skip) {

    let commands = [];

    commands.push(getContact({
        userId: userId,
        itemsPerPage: itemsPerPage,
        skip: skip
    }, "user.userId = {userId}").getCommand());

    commands.push(contactStatistic.getContactStatisticsCommand(userId).getCommand());
    commands.push(privacySettings.getPrivacySettings(userId).getCommand());

    return contactStatistic.getTotalNumberOfContacts(userId)
        .send(commands)
        .then(function (resp) {
            userInfo.addContactPreviewInfos(resp[0]);
            let data = {};
            data.contacts = resp[0];
            data.statistic = resp[1];
            data.privacySettings = resp[2];
            data.numberOfContacts = resp[3][0].numberOfContacts;
            data.contactsForPagination = data.numberOfContacts;
            return data;
        });
};

let getContactForTypes = function (userId, itemsPerPage, skip, types) {
    let commands = [];

    commands.push(getContact({
        userId: userId,
        itemsPerPage: itemsPerPage,
        skip: skip,
        types: types
    }, "user.userId = {userId} AND r.type IN {types}").getCommand());

    return contactStatistic.getTotalNumberOfContactsPerType(userId, types)
        .send(commands)
        .then(function (resp) {
            let data = {};
            userInfo.addContactPreviewInfos(resp[0]);
            data.contacts = resp[0];
            data.numberOfContacts = resp[1][0].numberOfContacts;
            return data;
        });
};


module.exports = {
    addContact: addContact,
    deleteContact: deleteContact,
    blockContact: blockContact,
    unblockContact: unblockContact,
    changeContactState: changeContactState,
    getContactsNormal: getContactsNormal,
    getContactForTypes: getContactForTypes
};
