'use strict';

//var converter = require('../util/resultConverter');
var logger = requireLogger.getLogger(__filename);
var db = require('./../../neo4j');
var underscore = require('underscore');

var getContactSerachReturn = function (isSuggestion) {
    if (isSuggestion) {
        return 'contact.name AS name';
    }
    return 'contact.name AS name, r.type AS type, contact.userId AS id';
};

var getNoContactSerachReturn = function (isSuggestion) {
    if (isSuggestion) {
        return 'noContacts.name AS name';
    }
    return 'noContacts.name AS name, null AS type, noContacts.userId AS id';
};

module.exports = {
    searchUsers: function (userId, userQuery, maxItems, isSuggestion) {

        var userQueryRegEx = '(?i).*'.concat(userQuery, '.*'),
            contactReturn = getContactSerachReturn(isSuggestion),
            noContactReturn = getNoContactSerachReturn(isSuggestion);

        return db.cypher().match('(u:User {userId: {userId}})-[r:IS_CONTACT]->(contact:User)')
            .where('contact.name =~ {userQueryRegEx}')
            .return(contactReturn)
            .orderBy('name LIMIT {maxItems}')
            .union().match('(u2:User {userId: {userId}}), (noContacts:User)')
            .where("noContacts.name =~ {userQueryRegEx} AND NOT (u2)-[:IS_CONTACT]->(noContacts) AND NOT noContacts.userId = {userId}")
            .return(noContactReturn)
            .orderBy('name LIMIT {maxItems}')
            .end({userId: userId, userQueryRegEx: userQueryRegEx, maxItems: maxItems})
            .send()
            .then(function (resp) {

                if (!isSuggestion) {
                    underscore.each(resp, function (user) {
                        user.profileUrl = 'cms/' + user.id + '/profile/thumbnail.jpg';
                    });
                }

                if (resp.length <= maxItems) {
                    return resp;
                }
                return resp.slice(0, maxItems);
            });
    }
};