'use strict';

let db = requireDb();
let time = requireLib('time');
let uuid = requireLib('uuid');
let exceptions = requireLib('error/exceptions');
let logger = requireLogger.getLogger(__filename);

let create = function (userId, params, req) {

    let feedbackCommentId = uuid.generateUUID();
    return db.cypher().match("(user:User {userId: {userId}}), (feedback:Feedback {feedbackId: {feedbackId}})")
        .where("feedback:Bug OR feedback:Idea OR feedback:DiscussionIdea")
        .createUnique(`(user)-[:IS_CREATOR]->(comment:Feedback:Comment {feedbackId: {feedbackCommentId}, text: {text}, created: {created}})
                        -[:COMMENT]->(feedback)`)
        .return("comment")
        .end({
            userId: userId, feedbackId: params.feedbackId, text: params.text,
            created: time.getNowUtcTimestamp(), feedbackCommentId: feedbackCommentId
        }).send().then(function (resp) {
            if (resp.length === 1) {
                return {feedbackId: feedbackCommentId};
            }
            return exceptions.getInvalidOperation(`Feedback does not exist for feedbackId ${params.feedbackId}`, logger, req);
        });
};


module.exports = {
    create: create
};
