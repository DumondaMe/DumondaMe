'use strict';

var db = require('./../../neo4j');
var exceptions = require('./../../../common/src/lib/error/exceptions');
var underscore = require('underscore');
var Promise = require('bluebird').Promise;
var logger = requireLogger.getLogger(__filename);
var moment = require('moment');
var userInfo = require('./../user/userInfo');

var getContactStatistics = function (userId) {
    return db.cypher().match('(u:User {userId: {userId}})-[r:IS_CONTACT]->(:User)')
        .return('r.type AS type, count(*) AS count')
        .end({
            userId: userId
        });
};

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

    commands.push(getContactStatistics(userId).getCommand());

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

    commands.push(getContactStatistics(userId).getCommand());

    return getTotalNumberOfContacts(userId)
        .send(commands)
        .then(function (result) {
            return returnStatistics(result, 'delete');
        });
};

var blockContact = function (userId, blockedUserIds) {


    return db.cypher().match('(u:User {userId: {userId}}), (u2:User)')
        .where('u2.userId IN {blockedUserIds}')
        .createUnique('(u)-[:IS_BLOCKED]->(u2)')
        .with('u, u2')
        .match('(u)-[r:IS_CONTACT]->(u2)')
        .delete('r')
        .end({
            userId: userId,
            blockedUserIds: blockedUserIds
        })
        .send();
};

var changeContactState = function (userId, contactIds, type) {

    return db.cypher().match('(u:User {userId: {userId}})-[r:IS_CONTACT]->(u2:User)')
        .where('u2.userId IN {contactIds}')
        .set('r', {type: type})
        .return('r')
        .end({
            userId: userId,
            contactIds: contactIds,
            type: type
        })
        .send()
        .then(function (rel) {
            if (rel.length === contactIds.length) {
                return;
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

var getContactsNormal = function (userId, itemsPerPage, skip, expires) {

    var commands = [];

    commands.push(getContact({
        userId: userId,
        itemsPerPage: itemsPerPage,
        skip: skip
    }, "user.userId = {userId}").getCommand());

    commands.push(getContactStatistics(userId).getCommand());

    return getTotalNumberOfContacts(userId)
        .send(commands)
        .then(function (resp) {
            userInfo.addContactPreviewInfos(resp[0], expires);
            return resp;
        });
};

var getContactForTypes = function (userId, itemsPerPage, skip, types, expires) {
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
            userInfo.addContactPreviewInfos(resp[0], expires);
            return resp;
        });
};


module.exports = {
    addContact: addContact,
    deleteContact: deleteContact,
    blockContact: blockContact,
    changeContactState: changeContactState,
    getContactsNormal: getContactsNormal,
    getContactForTypes: getContactForTypes
};
