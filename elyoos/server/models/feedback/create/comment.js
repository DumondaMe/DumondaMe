'use strict';

let db = requireDb();
let time = require('elyoos-server-lib').time;
let uuid = require('elyoos-server-lib').uuid;
let exceptions = require('elyoos-server-lib').exceptions;
let eMailService = require('elyoos-server-lib').eMailService;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let create = function (userId, params, req) {

    let feedbackCommentId = uuid.generateUUID(), created = time.getNowUtcTimestamp();
    return db.cypher().match("(user:User {userId: {userId}}), (feedback:Feedback {feedbackId: {feedbackId}})")
        .where("feedback:Bug OR feedback:Idea OR feedback:DiscussionIdea")
        .createUnique(`(user)-[:IS_CREATOR]->(comment:Feedback:Comment {feedbackId: {feedbackCommentId}, text: {text}, created: {created}})
                        -[:COMMENT]->(feedback)`)
        .return("user")
        .end({
            userId: userId, feedbackId: params.feedbackId, text: params.text,
            created: created, feedbackCommentId: feedbackCommentId
        }).send().then(function (resp) {
            if (resp.length === 1) {
                eMailService.feedbackNewComment(feedbackCommentId);
                return {feedbackId: feedbackCommentId, created: created, creator: {name: resp[0].user.name}};
            }
            return exceptions.getInvalidOperation(`Feedback does not exist for feedbackId ${params.feedbackId}`, logger, req);
        });
};


module.exports = {
    create: create
};
