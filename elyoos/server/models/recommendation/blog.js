'use strict';

var db = requireDb();
var exceptions = requireLib('error/exceptions');
var pageRecommendation = require('./page');
var logger = requireLogger.getLogger(__filename);

var checkAddingRecommendationAllowed = function (userId, pageId, req) {
    var commands = [];

    commands.push(db.cypher().match("(blog:Blog {pageId: {pageId}})").return("blog").end({pageId: pageId}).getCommand());
    return db.cypher().match(`(:Blog {pageId: {pageId}})<-[:WRITTEN]-(writer:User)`)
        .return("writer.userId AS writerUserId")
        .end({pageId: pageId}).send(commands)
        .then(function (resp) {
            if(resp[1].length === 1 && resp[1][0].writerUserId === userId) {
                return exceptions.getInvalidOperation('User can not recommend own blog ' + pageId, logger, req);
            }
            if(resp[0].length === 0) {
                return exceptions.getInvalidOperation('Only Blog can be recommended ' + pageId, logger, req);
            }
        });
};

var addRecommendation = function (userId, pageId, comment, req) {

    return checkAddingRecommendationAllowed(userId, pageId, req).then(function () {
        return pageRecommendation.addRecommendation(userId, pageId, comment, true, req);
    });
};

module.exports = {
    addRecommendation: addRecommendation
};
