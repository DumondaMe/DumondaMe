'use strict';

let db = requireDb();
let time = requireLib('time');
let uuid = requireLib('uuid');
let exceptions = requireLib('error/exceptions');
let logger = requireLogger.getLogger(__filename);

let checkRecommendationExists = function (userId, feedbackId, req) {
    return db.cypher().match(`(:User {userId: {userId}})-[:RECOMMENDED_BY]->(recommendation:Feedback:Recommendation)-[:RECOMMENDS]->
                              (:Feedback {feedbackId: {feedbackId}})`)
        .return("recommendation").end({userId: userId, feedbackId: feedbackId}).send().then(function (resp) {
            if (resp.length > 0) {
                return exceptions.getInvalidOperation(`User ${userId} has already feedback ${feedbackId} recommended`, logger, req);
            }
        });
};

let create = function (userId, params, req) {

    let recommendationId = uuid.generateUUID();
    return checkRecommendationExists(userId, params.feedbackId, req).then(function () {
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
