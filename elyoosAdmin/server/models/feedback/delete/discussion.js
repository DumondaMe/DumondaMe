'use strict';

let db = requireDb();
let exceptions = require('elyoos-server-lib').exceptions;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let allowedToDeleteDiscussion = function (userId, params, req) {
    return db.cypher().match("(discussion:Feedback:Discussion {feedbackId: {discussionId}})<-[:IS_CREATOR]-(:User {userId: {userId}})")
        .optionalMatch("(discussion)<-[:IS_IDEA]-(idea:Feedback:DiscussionIdea)")
        .return("discussion, count(idea) AS numberOfIdeas")
        .end({userId: userId, discussionId: params.discussionId})
        .send().then(function (resp) {
            if (resp.length === 0) {
                return exceptions.getInvalidOperation(`Discussion can not be deleted for discussionId ${params.discussionId}`, logger, req);
            } else if (resp[0].numberOfIdeas > 0) {
                return exceptions.getInvalidOperation(`Discussion can not be deleted when ideas present. discussionId ${params.discussionId}`,
                    logger, req);
            }
        });
};

let deleteDiscussion = function (userId, params, req) {
    return allowedToDeleteDiscussion(userId, params, req).then(function () {
        return db.cypher().match("(discussion:Feedback:Discussion {feedbackId: {discussionId}})<-[rel:IS_CREATOR]-(:User {userId: {userId}})")
            .delete("discussion, rel")
            .end({userId: userId, discussionId: params.discussionId})
            .send();
    });
};


module.exports = {
    delete: deleteDiscussion
};
