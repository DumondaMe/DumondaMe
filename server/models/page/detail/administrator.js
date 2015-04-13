'use strict';

var db = require('./../../../neo4j');
var exceptions = require('./../../../lib/error/exceptions');
var underscore = require('underscore');
var logger = requireLogger.getLogger(__filename);

var getAdministrator = function (pageId, pageLabel) {

    return db.cypher().match("(" + pageLabel + " {pageId: {pageId}})<-[:IS_ADMIN]-(u:User)")
        .return("u.name AS name, u.userId AS userId")
        .end({pageId: pageId})
        .getCommand();
};

module.exports = {
    getAdministrator: getAdministrator
};
