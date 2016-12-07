'use strict';

let db = requireDb();
let time = requireLib('time');
let uuid = requireLib('uuid');
let exceptions = requireLib('error/exceptions');
let logger = requireLogger.getLogger(__filename);

let checkRatingExists = function (userId, feedbackId, req) {
    return db.cypher().match(`(:User {userId: {userId}})-[:RATED_BY]->(rating:Feedback:Rating)-[:RATING]->
                              (:Feedback {feedbackId: {feedbackId}})`)
        .return("rating").end({userId: userId, feedbackId: feedbackId}).send().then(function (resp) {
            if (resp.length > 0) {
                return exceptions.getInvalidOperation(`User ${userId} has already feedback ${feedbackId} rated`, logger, req);
            }
        });
};

let create = function (userId, params, req) {

    let ratingId = uuid.generateUUID();
    return checkRatingExists(userId, params.feedbackId, req).then(function () {
        return db.cypher().match("(user:User {userId: {userId}}), (feedback:Feedback {feedbackId: {feedbackId}})")
            .where("feedback:Bug OR feedback:Idea OR feedback:DiscussionIdea")
            .createUnique(`(user)-[:RATED_BY]->(rating:Feedback:Rating {ratingId: {ratingId}, created: {created}})-[:RATING]->(feedback)`)
            .return("rating")
            .end({
                userId: userId, feedbackId: params.feedbackId, created: time.getNowUtcTimestamp(), ratingId: ratingId
            }).send().then(function (resp) {
                if (resp.length === 1) {
                    return {ratingId: ratingId};
                }
                return exceptions.getInvalidOperation(`Feedback does not exist for feedbackId ${params.feedbackId}`, logger, req);
            });
    });
};


module.exports = {
    create: create
};
