'use strict';

var db = require('./../../../neo4j');
var exceptions = require('./../../../lib/error/exceptions');
var underscore = require('underscore');
var logger = requireLogger.getLogger(__filename);

var getAdministrator = function (pageId, pageLabel, userId) {

    return db.cypher().match("(" + pageLabel + " {pageId: {pageId}})<-[:IS_ADMIN]-(u:User)")
        .optionalMatch('(u)-[isContact:IS_CONTACT]->(user {userId: {userId}})')
        .with('u, user, isContact')
        .optionalMatch('(u)-[privacyRel:HAS_PRIVACY]->(privacy:Privacy)')
        .where('privacyRel.type = isContact.type')
        .with('u, user, isContact, privacy')
        .optionalMatch('(contactOfContact)-[:HAS_PRIVACY_NO_CONTACT]->(noContactPrivacy:Privacy)')
        .where('isContact IS NULL')
        .return('u.name AS name, u.userId AS userId, u.userId = {userId} AS userIsAdmin, privacy.profile AS profile, privacy.image AS imageProfile,' +
        'noContactPrivacy.profile AS profileNoContact, noContactPrivacy.image AS imageProfileNoContact')
        .end({pageId: pageId, userId: userId})
        .getCommand();
};

var isUserAdministrator = function (administrators) {
    var isAdmin = false;
    underscore.forEach(administrators, function (administrator) {
        if (administrator.userIsAdmin) {
            isAdmin = true;
        }
        delete administrator.userIsAdmin;
    });
    return isAdmin;
};

module.exports = {
    getAdministrator: getAdministrator,
    isUserAdministrator: isUserAdministrator
};
