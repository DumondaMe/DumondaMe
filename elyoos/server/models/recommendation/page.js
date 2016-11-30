'use strict';

var db = requireDb();
var uuid = requireLib('uuid');
var time = requireLib('time');
var cdn = require('../util/cdn');
var recommendation = require('../page/detail/recommendation');
var exceptions = requireLib('error/exceptions');
var securityRecommendation = require('./security');
var logger = requireLogger.getLogger(__filename);

var checkAddingRecommendationAllowed = function (userId, pageId, isBlog, req) {
    var commands = [];

    commands.push(db.cypher().match("(blog:Blog {pageId: {pageId}})").return("blog").end({pageId: pageId}).getCommand());

    return db.cypher().match("(user:User {userId: {userId}})-[:RECOMMENDS]->(:Recommendation)-[:RECOMMENDS]->(page:Page {pageId: {pageId}})")
        .return("user.userId AS userId, LABELS(page) AS labels")
        .end({userId: userId, pageId: pageId}).send(commands)
        .then(function (resp) {
            if (resp[1].length > 0) {
                return exceptions.getInvalidOperation('User tries to add recommendation for page ' + pageId + ' twice', logger, req);
            }
            if (resp[0].length > 0 && !isBlog) {
                return exceptions.getInvalidOperation('Wrong api call for ' + pageId, logger, req);
            }
        });
};

var deleteRecommendation = function (userId, recommendationId, pageId, req) {
    return securityRecommendation.checkDeleteRecommendationAllowed(userId, recommendationId, req).then(function () {

        var commands = [];

        commands.push(db.cypher().match("(:User {userId: {userId}})-[rel:RECOMMENDS]->" +
            "(rec:Recommendation {recommendationId: {recommendationId}})-[rel2]->(page:Page)")
            .delete("rel, rec, rel2")
            .end({
                userId: userId,
                recommendationId: recommendationId
            }).getCommand());

        commands.push(recommendation.getRecommendationSummaryAll(pageId).getCommand());
        return recommendation.getRecommendationSummaryContacts(pageId, userId)
            .send(commands)
            .then(function (resp) {
                return {
                    recommendation: {
                        all: resp[1][0],
                        contact: resp[2][0]
                    }
                };
            });
    });
};

var addRecommendation = function (userId, pageId, comment, isBlog, req) {
    if (!comment) {
        comment = '';
    }
    return checkAddingRecommendationAllowed(userId, pageId, isBlog, req).then(function () {

        var recommendationId = uuid.generateUUID(), commands = [], created = time.getNowUtcTimestamp();

        commands.push(db.cypher().match("(user:User {userId: {userId}}), (page:Page {pageId: {pageId}})")
            .create("(user)-[:RECOMMENDS]->(recommendation:Recommendation:PinwallElement {created: {created}, " +
                "comment: {comment}, recommendationId: {recommendationId}})-[:RECOMMENDS]->(page)")
            .with("recommendation, page")
            .create("(recommendation)-[:PINWALL_DATA]->(page)")
            .end({
                userId: userId,
                pageId: pageId,
                recommendationId: recommendationId,
                comment: comment,
                created: created
            }).getCommand());
        commands.push(recommendation.getRecommendationSummaryAll(pageId).getCommand());
        return recommendation.getRecommendationSummaryContacts(pageId, userId)
            .send(commands)
            .then(function (resp) {
                return {
                    profileUrl: cdn.getUrl('profileImage/' + userId + '/thumbnail.jpg'),
                    recommendationId: recommendationId,
                    created: created,
                    recommendation: {
                        all: resp[1][0],
                        contact: resp[2][0]
                    }
                };
            });
    });
};

module.exports = {
    addRecommendation: addRecommendation,
    deleteRecommendation: deleteRecommendation
};
