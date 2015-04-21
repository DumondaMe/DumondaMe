'use strict';

var db = require('./../../neo4j');
var Promise = require('bluebird').Promise;
var uuid = require('./../../lib/uuid');
var time = require('./../../lib/time');
var exceptions = require('./../../lib/error/exceptions');
var logger = requireLogger.getLogger(__filename)

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

var deleteRecommendation = function (userId, recommendationId, req) {
    return checkDeleteRecommendationAllowed(userId, recommendationId, req).then(function () {
        return db.cypher().match("(user:User {userId: {userId}})-[rel:RECOMMENDS]->" +
        "(rec:Recommendation {recommendationId: {recommendationId}})-[rel2:RECOMMENDS]->(page)")
            .delete("rel, rec, rel2")
            .end({
                userId: userId,
                recommendationId: recommendationId
            }).send();
    });
};

var addRecommendation = function (userId, pageId, label, comment, rating) {
    return db.cypher().match("(user:User {userId: {userId}}), (page:" + label + " {pageId: {pageId}})")
        .create("(user)-[:RECOMMENDS]->(:Recommendation {created: {created}, rating: {rating}, comment: {comment}, " +
        "recommendationId: {recommendationId}})-[:RECOMMENDS]->(page)")
        .end({
            userId: userId,
            pageId: pageId,
            recommendationId: uuid.generateUUID(),
            comment: comment,
            rating: rating,
            created: time.getNowUtcTimestamp()
        }).send();
};

module.exports = {
    addRecommendation: addRecommendation,
    deleteRecommendation: deleteRecommendation
};
