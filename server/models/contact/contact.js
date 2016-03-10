'use strict';

var db = require('./../../neo4j');
var exceptions = require('./../../lib/error/exceptions');
var contactStatistic = require('./contactStatistic');
var privacySettings = require('./privacySettings');
var logger = requireLogger.getLogger(__filename);
var moment = require('moment');
var userInfo = require('./../user/userInfo');

var returnStatistics = function (result, errorDescription, req) {
    if (result.length === 3) {
        return {statistic: result[1], numberOfContacts: result[2][0].numberOfContacts};
    }
    var invalidOperationException = new exceptions.InvalidOperation('Length of ' + errorDescription +
        ' result not as expected [' + result.length + ']');
    logger.warn(invalidOperationException.message, req, {error: ''});
    return Promise.reject(invalidOperationException);
};

var validAddContactCommand = function (userId, type, req) {
    return db.cypher().match('(u:User {userId: {userId}})-[r:HAS_PRIVACY {type: {type}}]->()')
        .return("r")
        .end({userId: userId, type: type}).send().then(function (resp) {
            if (resp.length === 0) {
                return exceptions.getInvalidOperation('Type [' + type + '] does not exist for userId [' + userId + ']', logger, req);
            }
        });
};

var addContact = function (userId, contactIds, type, req) {

    var commands = [], timeAddedContact = Math.floor(moment.utc().valueOf() / 1000);
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

        commands.push(contactStatistic.getContactStatisticsCommand(userId).getCommand());

        return contactStatistic.getTotalNumberOfContacts(userId)
            .send(commands)
            .then(function (result) {
                return returnStatistics(result, 'adding', req);
            });
    });
};

var deleteContact = function (userId, contactIds, req) {

    var commands = [];

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
            return returnStatistics(result, 'delete', req);
        });
};

var blockContact = function (userId, blockedUserIds, req) {

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

    commands.push(contactStatistic.getContactStatisticsCommand(userId).getCommand());

    return contactStatistic.getTotalNumberOfContacts(userId)
        .send(commands)
        .then(function (result) {
            return returnStatistics(result, 'block', req);
        });
};

var unblockContact = function (userId, blockedUserIds, req) {

    var commands = [];
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
            return returnStatistics(result, 'unblock', req);
        });
};

var changeContactState = function (userId, contactIds, type, req) {

    var commands = [];

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
            var invalidOperationException = new exceptions.InvalidOperation('Not all contact connections are updated');
            logger.warn(invalidOperationException.message, req, {error: ''});
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
            "contact.name AS name, contact.userId AS userId, v.profile AS profileVisible, v.image AS imageVisible")
        .end(params);
};

var getContactsNormal = function (userId, itemsPerPage, skip) {

    var commands = [];

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

    return contactStatistic.getTotalNumberOfContactsPerType(userId, types)
        .send(commands)
        .then(function (resp) {
            var data = {};
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
