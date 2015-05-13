'use strict';

var db = require('./../../../neo4j');
var exceptions = require('./../../../lib/error/exceptions');
var underscore = require('underscore');
var logger = requireLogger.getLogger(__filename);

var getAdministrator = function (pageId, pageLabel, userId) {

    return db.cypher().match("(" + pageLabel + " {pageId: {pageId}})<-[:IS_ADMIN]-(u:User)")
        .return("u.name AS name, u.userId AS userId, u.userId = {userId} AS userIsAdmin")
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
