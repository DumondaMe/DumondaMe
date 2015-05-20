'use strict';

var db = require('./../../../neo4j');
var exceptions = require('./../../../lib/error/exceptions');
var underscore = require('underscore');
var logger = requireLogger.getLogger(__filename);

var getAdministrator = function (pageId, pageLabel, userId) {

    return db.cypher().match("(" + pageLabel + " {pageId: {pageId}})<-[:IS_ADMIN]-(u:User)")
        .optionalMatch('(u)-[:IS_CONTACT]->(user {userId: {userId}})')
        .with('u, user')
        .match("(u)-[vr:HAS_PRIVACY|HAS_PRIVACY_NO_CONTACT]->(privacy:Privacy)")
        .optionalMatch("(user)<-[rContact:IS_CONTACT]-(u)")
        .with("u, rContact, privacy, vr")
        .where("(rContact IS NULL AND type(vr) = 'HAS_PRIVACY_NO_CONTACT') OR (rContact.type = vr.type AND type(vr) = 'HAS_PRIVACY')")
        .return('u.name AS name, u.userId AS userId, u.userId = {userId} AS userIsAdmin, ' +
        'privacy.profile AS profileVisible, privacy.image AS imageVisible')
        .end({pageId: pageId, userId: userId})
        .getCommand();
};

var isUserAdministrator = function (administrators) {
    var isAdmin = false;
    underscore.forEach(administrators, function (administrator) {
        if (administrator.userIsAdmin) {
            isAdmin = true;
            administrator.profileVisible = true;
            administrator.imageVisible = true;
        }
        delete administrator.userIsAdmin;
    });
    return isAdmin;
};

module.exports = {
    getAdministrator: getAdministrator,
    isUserAdministrator: isUserAdministrator
};
