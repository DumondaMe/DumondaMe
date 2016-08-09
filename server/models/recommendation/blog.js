'use strict';

var db = require('./../../neo4j');
var exceptions = require('./../../lib/error/exceptions');
var pageRecommendation = require('./page');
var logger = requireLogger.getLogger(__filename);

var checkUserIsNotWriter = function (userId, pageId, req) {
    return db.cypher().match(`(:Blog {pageId: {pageId}})<-[:WRITTEN]-(writer:User)`)
        .return("writer.userId AS writerUserId")
        .end({pageId: pageId}).send()
        .then(function (resp) {
            if(resp.length === 1 && resp[0].writerUserId === userId) {
                return exceptions.getInvalidOperation('User can not recommend own blog ' + pageId, logger, req);
            }
        });
};

var addRecommendation = function (userId, pageId, comment, req) {

    return checkUserIsNotWriter(userId, pageId, req).then(function () {
        return pageRecommendation.addRecommendation(userId, pageId, comment, req);
    });
};

module.exports = {
    addRecommendation: addRecommendation
};
