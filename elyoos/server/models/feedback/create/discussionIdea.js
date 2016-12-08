'use strict';

let db = requireDb();
let time = requireLib('time');
let uuid = requireLib('uuid');
let exceptions = requireLib('error/exceptions');
let logger = requireLogger.getLogger(__filename);

let create = function (userId, params, req) {

    let feedbackId = uuid.generateUUID(), created = time.getNowUtcTimestamp();
    return db.cypher().match("(user:User {userId: {userId}}), (discussion:Feedback:Discussion {feedbackId: {discussionId}})")
        .createUnique(`(user)-[:IS_CREATOR]->(feedback:Feedback:DiscussionIdea {feedbackId: {feedbackId}, title: {title}, 
                             description: {description}, created: {created}})-[:IS_IDEA]->(discussion)`)
        .return("user").end({
            userId: userId, title: params.title, description: params.description, discussionId: params.discussionId,
            created: created, feedbackId: feedbackId
        }).send().then(function (resp) {
            if (resp.length === 1) {
                return {feedbackId: feedbackId, created: created, creator: {name: resp[0].user.name}};
            }
            return exceptions.getInvalidOperation(`Discussion idea not created for discussionId ${params.discussionId}`, logger, req);
        });
};


module.exports = {
    create: create
};
