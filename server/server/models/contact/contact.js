'use strict';

var db = require('./../../neo4j');
var exceptions = require('./../../../common/src/lib/error/exceptions');
var contactStatistic = require('./contactStatistic');
var privacySettings = require('./privacySettings');
var underscore = require('underscore');
var Promise = require('bluebird').Promise;
var logger = requireLogger.getLogger(__filename);
var moment = require('moment');
var userInfo = require('./../user/userInfo');

var getTotalNumberOfContacts = function (userId) {
    return db.cypher().match('(u:User {userId: {userId}})-[:IS_CONTACT]->(:User)')
        .return('count(*) AS numberOfContacts')
        .end({
            userId: userId
        });
};

var getTotalNumberOfContactsPerType = function (userId, types) {
    return db.cypher().match('(u:User {userId: {userId}})-[r:IS_CONTACT]->(:User)')
        .where('r.type IN {types}')
        .return('count(*) AS contactsForPagination')
        .end({
            userId: userId,
            types: types
        });
};

var returnStatistics = function (result, errorDescription) {
    if (result.length === 3) {
        return {statistic: result[1], numberOfContacts: result[2][0].numberOfContacts};
    }
    var invalidOperationException = new exceptions.invalidOperation('Length of ' + errorDescription +
    ' result not as expected [' + result.length + ']');
    logger.warn(invalidOperationException.message, {error: ''});
    return Promise.reject(invalidOperationException);
};

var addContact = function (userId, contactIds, type) {

    var commands = [], timeAddedContact = Math.floor(moment.utc().valueOf() / 1000);
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

    commands.push(contactStatistic.getContactStatistics(userId).getCommand());

    return getTotalNumberOfContacts(userId)
        .send(commands)
        .then(function (result) {
            return returnStatistics(result, 'adding');
        });
};

var deleteContact = function (userId, contactIds) {

    var commands = [];

    commands.push(db.cypher().match('(u:User {userId: {userId}})-[r:IS_CONTACT]->(u2:User)')
        .where('u2.userId IN {contactIds}')
        .delete('r')
        .end({
            userId: userId,
            contactIds: contactIds
        })
        .getCommand());

    commands.push(contactStatistic.getContactStatistics(userId).getCommand());

    return getTotalNumberOfContacts(userId)
        .send(commands)
        .then(function (result) {
            return returnStatistics(result, 'delete');
        });
};

var blockContact = function (userId, blockedUserIds) {

    var commands = [];
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

    commands.push(contactStatistic.getContactStatistics(userId).getCommand());

    return getTotalNumberOfContacts(userId)
        .send(commands)
        .then(function (result) {
            return returnStatistics(result, 'delete');
        });
};

var unblockContact = function (userId, blockedUserIds) {

    var commands = [];
    commands.push(db.cypher().match('(u:User {userId: {userId}})-[blocked:IS_BLOCKED]->(u2:User)')
        .where('u2.userId IN {blockedUserIds}')
        .delete('blocked')
        .end({
            userId: userId,
            blockedUserIds: blockedUserIds
        })
        .getCommand());

    commands.push(contactStatistic.getContactStatistics(userId).getCommand());

    return getTotalNumberOfContacts(userId)
        .send(commands)
        .then(function (result) {
            return returnStatistics(result, 'delete');
        });
};

var changeContactState = function (userId, contactIds, type) {

    var commands = [];

    commands.push(db.cypher().match('(u:User {userId: {userId}})-[r:IS_CONTACT]->(u2:User)')
        .where('u2.userId IN {contactIds}')
        .set('r', {type: type})
        .return('r')
        .end({
            userId: userId,
            contactIds: contactIds,
            type: type
        }).getCommand());

    return contactStatistic.getContactStatistics(userId)
        .send(commands)
        .then(function (rel) {
            if (rel[0].length === contactIds.length) {
                return {statistic: rel[1]};
            }
            var invalidOperationException = new exceptions.invalidOperation('Not all contact connections are updated');
            logger.warn(invalidOperationException.message, {error: ''});
            return Promise.reject(invalidOperationException);
        });
};

var getContact = function (params, where) {
    return db.cypher().match("(user:User)-[r:IS_CONTACT]->(contact:User)")
        .where(where)
        .with("contact, user, r")
        .orderBy("contact.surname")
        .skip("{skip}")
        .limit("{itemsPerPage}")
        .match("(contact)-[vr:HAS_PRIVACY|HAS_PRIVACY_NO_CONTACT]->(v:Privacy)")
        .optionalMatch("(user)<-[rContact:IS_CONTACT]-(contact)")
        .with("contact, rContact, user, r, v, vr")
        .where("(rContact IS NULL AND type(vr) = 'HAS_PRIVACY_NO_CONTACT') OR (rContact.type = vr.type AND type(vr) = 'HAS_PRIVACY')")
        .return("r.type AS type, r.contactAdded AS contactAdded, rContact.type AS contactType, rContact.contactAdded As userAdded, " +
        "contact.name AS name, contact.userId AS id, v.profile AS profileVisible, v.image AS imageVisible")
        .end(params);
};

var getContactsNormal = function (userId, itemsPerPage, skip) {

    var commands = [];

    commands.push(getContact({
        userId: userId,
        itemsPerPage: itemsPerPage,
        skip: skip
    }, "user.userId = {userId}").getCommand());

    commands.push(contactStatistic.getContactStatistics(userId).getCommand());
    commands.push(privacySettings.getPrivacySettings(userId).getCommand());

    return getTotalNumberOfContacts(userId)
        .send(commands)
        .then(function (resp) {
            userInfo.addContactPreviewInfos(resp[0]);
            var data = {};
            data.contacts = resp[0];
            data.statistic = resp[1];
            data.privacySettings = resp[2];
            data.numberOfContacts = resp[3][0].numberOfContacts;
            data.contactsForPagination = data.numberOfContacts;
            return data;
        });
};

var getContactForTypes = function (userId, itemsPerPage, skip, types) {
    var commands = [];

    commands.push(getContact({
        userId: userId,
        itemsPerPage: itemsPerPage,
        skip: skip,
        types: types
    }, "user.userId = {userId} AND r.type IN {types}").getCommand());

    return getTotalNumberOfContactsPerType(userId, types)
        .send(commands)
        .then(function (resp) {
            var data = {};
            userInfo.addContactPreviewInfos(resp[0]);
            data.contacts = resp[0];
            data.contactsForPagination = resp[1][0].contactsForPagination;
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
