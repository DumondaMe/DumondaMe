'use strict';

var db = require('./../../neo4j');
var uuid = require('./../../lib/uuid');
var time = require('./../../lib/time');
var underscore = require('underscore');
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

        var recommendationId = uuid.generateUUID(), commands = [], created = time.getNowUtcTimestamp();

        commands.push(db.cypher().match("(user:User {userId: {userId}}), (page:" + label + " {pageId: {pageId}})")
            .create("(user)-[:RECOMMENDS]->(:Recommendation {created: {created}, rating: {rating}, comment: {comment}, " +
            "recommendationId: {recommendationId}})-[:RECOMMENDS]->(page)")
            .end({
                userId: userId,
                pageId: pageId,
                recommendationId: recommendationId,
                comment: comment,
                rating: rating,
                created: created
            }).getCommand());
        commands.push(recommendation.getRecommendationSummaryAll(pageId, ':' + label).getCommand());
        return recommendation.getRecommendationSummaryContacts(pageId, ':' + label, userId)
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

var addImageUrl = function (previews) {
    underscore.forEach(previews, function (preview) {
        preview.previewUrl = cdn.getUrl('pages/' + preview.label + '/' + preview.pageId + '/pageTitlePicturePreview.jpg');
    });
};

var addLabel = function (previews) {
    underscore.forEach(previews, function (preview) {
        preview.label = preview.types[0];
        delete preview.types;
    });
};

var getRecommendations = function (userId, skip, limit) {
    return db.cypher().match("(:User {userId: {userId}})-[:RECOMMENDS]->(r:Recommendation)-[:RECOMMENDS]->(recommended)")
        .return("r.created AS created, r.rating AS rating, r.comment AS comment, r.recommendationId AS recommendationId, " +
        "LABELS(recommended) AS types, recommended.title AS title, recommended.description AS description, recommended.pageId AS pageId")
        .orderBy("r.created DESC")
        .skip("{skip}")
        .limit("{limit}")
        .end({skip: skip, limit: limit, userId: userId}).send()
        .then(function (resp) {
            addLabel(resp);
            addImageUrl(resp);
            return {recommendations: resp};
        });
};

module.exports = {
    addRecommendation: addRecommendation,
    deleteRecommendation: deleteRecommendation,
    getRecommendations: getRecommendations
};
