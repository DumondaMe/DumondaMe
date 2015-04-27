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

var checkAddingRecommendationAllowed = function (userId, pageId, label, req) {
    return db.cypher().match("(user:User {userId: {userId}})-[:RECOMMENDS]->(:Recommendation)-[:RECOMMENDS]->(:" + label + " {pageId: {pageId}})")
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

var deleteRecommendation = function (userId, recommendationId, pageId, label, req) {
    return checkDeleteRecommendationAllowed(userId, recommendationId, req).then(function () {

        var commands = [];

        commands.push(db.cypher().match("(user:User {userId: {userId}})-[rel:RECOMMENDS]->" +
            "(rec:Recommendation {recommendationId: {recommendationId}})-[rel2:RECOMMENDS]->(page)")
            .delete("rel, rec, rel2")
            .end({
                userId: userId,
                recommendationId: recommendationId
            }).getCommand());

        commands.push(recommendation.getRecommendationSummaryAll(pageId, ':' + label).getCommand());
        return recommendation.getRecommendationSummaryContacts(pageId, ':' + label, userId)
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

var addRecommendation = function (userId, pageId, label, comment, rating, req) {
    if (!comment) {
        comment = '';
    }
    return checkAddingRecommendationAllowed(userId, pageId, label, req).then(function () {

        var recommendationId = uuid.generateUUID(), commands = [];

        commands.push(db.cypher().match("(user:User {userId: {userId}}), (page:" + label + " {pageId: {pageId}})")
            .create("(user)-[:RECOMMENDS]->(:Recommendation {created: {created}, rating: {rating}, comment: {comment}, " +
            "recommendationId: {recommendationId}})-[:RECOMMENDS]->(page)")
            .end({
                userId: userId,
                pageId: pageId,
                recommendationId: recommendationId,
                comment: comment,
                rating: rating,
                created: time.getNowUtcTimestamp()
            }).getCommand());
        commands.push(recommendation.getRecommendationSummaryAll(pageId, ':' + label).getCommand());
        return recommendation.getRecommendationSummaryContacts(pageId, ':' + label, userId)
            .send(commands)
            .then(function (resp) {
                return {
                    profileUrl: cdn.getUrl('profileImage/' + userId + '/thumbnail.jpg'),
                    recommendationId: recommendationId,
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
