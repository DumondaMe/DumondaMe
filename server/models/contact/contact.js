'use strict';

var db = require('./../../neo4j');
var exceptions = require('./../../lib/error/exceptions');
var underscore = require('underscore');
var Promise = require('bluebird').Promise;
var logger = requireLogger.getLogger(__filename);

var addContact = function (userId, contactIds, type) {

    return db.cypher().match('(u:User {userId: {userId}}), (u2:User)')
        .where('u2.userId IN {contactIds} AND NOT (u)-[:IS_CONTACT]->(u2)')
        .createUnique('(u)-[:IS_CONTACT {type: {type}}]->(u2)')
        .with('u, u2')
        .match('(u)-[r:IS_BLOCKED]->(u2)')
        .delete('r')
        .send({
            userId: userId,
            contactIds: contactIds,
            type: type
        });
};

var blockContact = function (userId, blockedUserIds) {


    return db.cypher().match('(u:User {userId: {userId}}), (u2:User)')
        .where('u2.userId IN {blockedUserIds}')
        .createUnique('(u)-[:IS_BLOCKED]->(u2)')
        .with('u, u2')
        .match('(u)-[r:IS_CONTACT]->(u2)')
        .delete('r')
        .send({
            userId: userId,
            blockedUserIds: blockedUserIds
        });
};

var changeContactState = function (userId, contactIds, type) {

    return db.cypher().match('(u:User {userId: {userId}})-[r:IS_CONTACT]->(u2:User)')
        .where('u2.userId IN {contactIds}')
        .set('r', {type: type})
        .return('r')
        .send({
            userId: userId,
            contactIds: contactIds,
            type: type
        }).then(function (rel) {
            if (rel.length === contactIds.length) {
                return;
            }
            var invalidOperationException = new exceptions.invalidOperation('Not all contact connections are updated');
            logger.warn(invalidOperationException.message, {error: ''});
            return Promise.reject(invalidOperationException);
        });
};

var getContacts = function (userId) {

    return db.cypher().match("(:User {userId: {userId}})-[r:IS_CONTACT]->(contact:User)")
        .return("r.type AS type, contact.name AS name, contact.userId AS id")
        .send({userId: userId})
        .then(function (resp) {
            underscore.each(resp, function (contact) {
                contact.profileUrl = 'cms/' + contact.id + '/profile/thumbnail.jpg';
            });
            return resp;
        });
};


module.exports = {
    addContact: addContact,
    blockContact: blockContact,
    changeContactState: changeContactState,
    getContacts: getContacts
};
