'use strict';

let db = requireDb();
let time = require('elyoos-server-lib').time;
let uuid = require('elyoos-server-lib').uuid;
let exceptions = require('elyoos-server-lib').exceptions;
var logger = require('elyoos-server-lib').logging.getLogger(__filename);

let checkRecommendationExists = function (userId, feedbackId) {
    return db.cypher().match(`(:User {userId: {userId}})-[:RECOMMENDED_BY]->(recommendation:Feedback:Recommendation)-[:RECOMMENDS]->
                              (:Feedback {feedbackId: {feedbackId}})`)
        .return("recommendation").end({userId: userId, feedbackId: feedbackId});
};

let checkNotCreatedByUser = function (userId, feedbackId) {
    return db.cypher().match(`(user:User {userId: {userId}})-[:IS_CREATOR]->(:Feedback {feedbackId: {feedbackId}})`)
        .return("user").end({userId: userId, feedbackId: feedbackId});
};

let allowedToAddRecommendation = function (userId, feedbackId, req) {
    let commands = [];
    commands.push(checkNotCreatedByUser(userId, feedbackId).getCommand());

    return checkRecommendationExists(userId, feedbackId).send(commands).then(function (resp) {
        if (resp[0].length > 0) {
            return exceptions.getInvalidOperation(`User ${userId} is creator of feedback ${feedbackId}`, logger, req);
        }
        if (resp[1].length > 0) {
            return exceptions.getInvalidOperation(`User ${userId} has already feedback ${feedbackId} recommended`, logger, req);
        }
    });
};

let create = function (userId, params, req) {

    let recommendationId = uuid.generateUUID();
    return allowedToAddRecommendation(userId, params.feedbackId, req).then(function () {
        return db.cypher().match("(user:User {userId: {userId}}), (feedback:Feedback {feedbackId: {feedbackId}})")
            .where("feedback:Bug OR feedback:Idea OR feedback:DiscussionIdea")
            .createUnique(`(user)-[:RECOMMENDED_BY]->(recommendation:Feedback:Recommendation {recommendationId: {recommendationId}, 
                            created: {created}})-[:RECOMMENDS]->(feedback)`)
            .return("recommendation")
            .end({
                userId: userId, feedbackId: params.feedbackId, created: time.getNowUtcTimestamp(), recommendationId: recommendationId
            }).send().then(function (resp) {
                if (resp.length === 1) {
                    return {recommendationId: recommendationId};
                }
                return exceptions.getInvalidOperation(`Feedback does not exist for feedbackId ${params.feedbackId}`, logger, req);
            });
    });
};


module.exports = {
    create: create
};
