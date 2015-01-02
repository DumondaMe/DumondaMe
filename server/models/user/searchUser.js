'use strict';

//var converter = require('../util/resultConverter');
var logger = requireLogger.getLogger(__filename);
var db = require('./../../neo4j');

module.exports = {
    searchUsers: function (userId, userQuery, maxItems) {

        var userQueryRegEx = '(?i)'.concat(userQuery, '.*');

        return db.cypher().match('(u:User {userId: {userId}})-[r:IS_CONTACT]->(contact:User)')
            .where('contact.name =~ {userQueryRegEx}')
            .return('contact.name AS name, r.type AS type, contact.userId AS id')
            .orderBy('name LIMIT {maxItems}')
            .union().match('(u2:User {userId: {userId}}), (noContacts:User)')
            .where("noContacts.name =~ {userQueryRegEx} AND NOT (u2)-[:IS_CONTACT]->(noContacts) AND NOT noContacts.userId = {userId}")
            .return('noContacts.name AS name, null AS type, noContacts.userId AS id')
            .orderBy('name LIMIT {maxItems}')
            .send({userId: userId, userQueryRegEx: userQueryRegEx, maxItems: maxItems})
            .then(function (resp) {
                if (resp.length <= maxItems) {
                    return resp;
                }
                return resp.slice(0, maxItems);
            });
    }
};