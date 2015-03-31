'use strict';

var logger = requireLogger.getLogger(__filename);
var db = require('./../../neo4j');
var underscore = require('underscore');
var userInfo = require('./userInfo');

var searchUsersInSuggestionMode = function (userId, userQuery, maxItems) {
    return db.cypher().match('(user:User {userId: {userId}})-[r:IS_CONTACT]->(contact:User)')
        .where('contact.name =~ {userQueryRegEx}')
        .return('contact.name AS name')
        .orderBy('name LIMIT {maxItems}')
        .union().match('(u2:User {userId: {userId}}), (noContacts:User)')
        .where("noContacts.name =~ {userQueryRegEx} AND NOT (u2)-[:IS_CONTACT]->(noContacts) AND NOT noContacts.userId = {userId}")
        .return('noContacts.name AS name')
        .orderBy('name LIMIT {maxItems}')
        .end({userId: userId, userQueryRegEx: userQuery, maxItems: maxItems})
        .send()
        .then(function (resp) {

            if (resp.length <= maxItems) {
                return resp;
            }
            return resp.slice(0, maxItems);
        });
};

var searchUsersInNormalMode = function (userId, userQuery, maxItems) {
    return db.cypher().match('(user:User {userId: {userId}})-[r:IS_CONTACT]->(contact:User)')
        .where('contact.name =~ {userQueryRegEx}')
        .with('contact, r, user')
        .match("(contact)-[vr:HAS_PRIVACY|HAS_PRIVACY_NO_CONTACT]->(v:Privacy)")
        .optionalMatch("(user)<-[rContact:IS_CONTACT]-(contact)")
        .with("contact, rContact, user, r, v, vr")
        .where("(rContact IS NULL AND type(vr) = 'HAS_PRIVACY_NO_CONTACT') OR (rContact.type = vr.type AND type(vr) = 'HAS_PRIVACY')")
        .return('contact.name AS name, r.type AS type, r.contactAdded AS contactAdded, rContact AS contactType, ' +
            'rContact.contactAdded AS userAdded, contact.userId AS id, v.profile AS profileVisible, v.image AS imageVisible, null AS blocked')
        .orderBy('name LIMIT {maxItems}')
        .union().match('(u2:User {userId: {userId}}), (noContacts:User)')
        .where("noContacts.name =~ {userQueryRegEx} AND NOT (u2)-[:IS_CONTACT]->(noContacts) AND NOT noContacts.userId = {userId}")
        .with('noContacts, u2')
        .match("(noContacts)-[vr:HAS_PRIVACY|HAS_PRIVACY_NO_CONTACT]->(v:Privacy)")
        .optionalMatch("(u2)<-[rContact:IS_CONTACT]-(noContacts)")
        .with("noContacts, rContact, u2, v, vr")
        .where("(rContact IS NULL AND type(vr) = 'HAS_PRIVACY_NO_CONTACT') OR (rContact.type = vr.type AND type(vr) = 'HAS_PRIVACY')")
        .return('noContacts.name AS name, null AS type, null AS contactAdded, rContact AS contactType, rContact.contactAdded AS userAdded, ' +
            'noContacts.userId AS id, v.profile AS profileVisible, v.image AS imageVisible, EXISTS((u2)-[:IS_BLOCKED]->(noContacts)) AS blocked')
        .orderBy('name LIMIT {maxItems}')
        .end({userId: userId, userQueryRegEx: userQuery, maxItems: maxItems})
        .send()
        .then(function (resp) {

            userInfo.addContactPreviewInfos(resp);

            if (resp.length <= maxItems) {
                return resp;
            }
            return resp.slice(0, maxItems);
        });
};

module.exports = {
    searchUsers: function (userId, userQuery, maxItems, isSuggestion) {

        var userQueryRegEx = '(?i).*'.concat(userQuery, '.*');

        if (isSuggestion) {
            return searchUsersInSuggestionMode(userId, userQueryRegEx, maxItems);
        }
        return searchUsersInNormalMode(userId, userQueryRegEx, maxItems);


    }
};
