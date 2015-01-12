'use strict';

var db = require('./../../neo4j');
var exceptions = require('./../../lib/error/exceptions');
var underscore = require('underscore');
var Promise = require('bluebird').Promise;
var logger = requireLogger.getLogger(__filename);

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

var returnStatistics = function (result, errorDescription) {
    if (result.length === 3) {
        return {statistic: result[1], numberOfContacts: result[2][0].numberOfContacts};
    }
    var invalidOperationException = new exceptions.invalidOperation('Length of ' + errorDescription + ' result not as expected [' + result.length + ']');
    logger.warn(invalidOperationException.message, {error: ''});
    return Promise.reject(invalidOperationException);
};

var addContact = function (userId, contactIds, type) {

    var commands = [];
    commands.push(db.cypher().match('(u:User {userId: {userId}}), (u2:User)')
        .where('u2.userId IN {contactIds} AND NOT (u)-[:IS_CONTACT]->(u2)')
        .createUnique('(u)-[:IS_CONTACT {type: {type}}]->(u2)')
        .with('u, u2')
        .match('(u)-[r:IS_BLOCKED]->(u2)')
        .delete('r')
        .end({
            userId: userId,
            contactIds: contactIds,
            type: type
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

var getContacts = function (userId, itemsPerPage, skip) {

    var commands = [];

    commands.push(db.cypher().match("(user:User)-[r:IS_CONTACT]->(contact:User)")
        .where("user.userId = {userId}")
        .with("contact, user, r")
        .orderBy("contact.surname")
        .skip(skip)
        .limit(itemsPerPage)
        .match("(contact)-[vr:IS_VISIBLE|IS_VISIBLE_NO_CONTACT]->(v:Visibility)")
        .optionalMatch("(user)<-[rContact:IS_CONTACT]-(contact)")
        .with("contact, rContact, user, r, v, vr")
        .where("(rContact IS NULL AND type(vr) = 'IS_VISIBLE_NO_CONTACT') OR (rContact.type = vr.type AND type(vr) = 'IS_VISIBLE')")
        .return("r.type AS type, contact.name AS name, contact.userId AS id, v.profile AS profileVisible, v.image AS imageVisible")
        .end({userId: userId})
        .getCommand());

    commands.push(getContactStatistics(userId).getCommand());

    return getTotalNumberOfContacts(userId)
        .send(commands)
        .then(function (resp) {
            underscore.each(resp[0], function (contact) {
                if (contact.profileVisible === true && contact.imageVisible === true) {
                    contact.profileUrl = 'cms/' + contact.id + '/profile/thumbnail.jpg';
                } else {
                    contact.profileUrl = 'cms/default/profile/thumbnail.jpg';
                }
                delete contact.profileVisible;
                delete contact.imageVisible;
            });
            return resp;
        });
};


module.exports = {
    addContact: addContact,
    deleteContact: deleteContact,
    blockContact: blockContact,
    changeContactState: changeContactState,
    getContacts: getContacts
};
