'use strict';

var db = require('./../../neo4j');
var uuid = require('./../../lib/uuid');
var time = require('./../../lib/time');
var cdn = require('../util/cdn');
var recommendation = require('../page/detail/recommendation');
var exceptions = require('./../../lib/error/exceptions');
var logger = requireLogger.getLogger(__filename);

var checkDeleteRecommendationAllowed = function (userId, recommendationId, req) {
    return db.cypher().match("(user:User {userId: {userId}})-[:RECOMMENDS]->(rec:Recommendation {recommendationId: {recommendationId}})")
        .return("user.userId AS userId")
        .end({
            userId: userId,
            recommendationId: recommendationId
        }).send()
        .then(function (resp) {
            if (resp.length === 0) {
                return exceptions.getInvalidOperation('User tries to delete other users recommendation ' + recommendationId, logger, req);
            }
        });
};

var checkAddingRecommendationAllowed = function (userId, pageId, req) {
    return db.cypher().match("(user:User {userId: {userId}})-[:RECOMMENDS]->(:Recommendation)-[:RECOMMENDS]->(:Page {pageId: {pageId}})")
        .return("user.userId AS userId")
        .end({
            userId: userId,
            pageId: pageId
        }).send()
        .then(function (resp) {
            if (resp.length > 0) {
                return exceptions.getInvalidOperation('User tries to add recommendation for page ' + pageId + ' with label ' +
                    pageId + ' twice', logger, req);
            }
        });
};

var deleteRecommendation = function (userId, recommendationId, pageId, req) {
    return checkDeleteRecommendationAllowed(userId, recommendationId, req).then(function () {

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

var addRecommendation = function (userId, pageId, comment, rating, req) {
    if (!comment) {
        comment = '';
    }
    return checkAddingRecommendationAllowed(userId, pageId, req).then(function () {

        var recommendationId = uuid.generateUUID(), commands = [], created = time.getNowUtcTimestamp();

        commands.push(db.cypher().match("(user:User {userId: {userId}}), (page:Page {pageId: {pageId}})")
            .create("(user)-[:RECOMMENDS]->(recommendation:Recommendation:PinwallElement {created: {created}, rating: {rating}, " +
                "comment: {comment}, recommendationId: {recommendationId}})-[:RECOMMENDS]->(page)")
            .with("recommendation, page")
            .create("(recommendation)-[:PINWALL_DATA]->(page)")
            .end({
                userId: userId,
                pageId: pageId,
                recommendationId: recommendationId,
                comment: comment,
                rating: rating,
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
