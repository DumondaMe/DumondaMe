'use strict';

var db = require('./../../../neo4j/index');
var exceptions = require('./../../../lib/error/exceptions');
var logger = requireLogger.getLogger(__filename);

var checkAllowedToEditPage = function (userId, pageId, req) {

    function checkUserAllowedToEditPage(resp) {
        return resp.length === 0;
    }

    var params = {
        userId: userId,
        pageId: pageId
    };

    return db.cypher()
        .match("(page:Page {pageId: {pageId}})<-[:IS_ADMIN]-(user:User {userId: {userId}})")
        .return("user.userId AS userId")
        .end(params).send()
        .then(function (resp) {
            if (checkUserAllowedToEditPage(resp)) {
                return exceptions.getInvalidOperation('User tried to edit page with no Admin rights ' + pageId, logger, req);
            }
        });
};

module.exports = {
    checkAllowedToEditPage: checkAllowedToEditPage
};
