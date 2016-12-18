'use strict';

let db = requireDb();
let time = require('elyoos-server-lib').time;
let uuid = require('elyoos-server-lib').uuid;
let exceptions = require('elyoos-server-lib').exceptions;
var logger = require('elyoos-server-lib').logging.getLogger(__filename);

let allowedToCloseFeedback = function (feedbackId, req) {
    return db.cypher().match("(feedback:Feedback:DiscussionIdea {feedbackId: {feedbackId}})")
        .return("feedback")
        .end({feedbackId: feedbackId}).send().then(function (resp) {
            if (resp.length > 0) {
                return exceptions.getInvalidOperation(`Admin tries to close a discussion idea ${feedbackId}`, logger, req);
            }
        });
};

let close = function (userId, params, req) {
    let closed = time.getNowUtcTimestamp();
    let statusFeedbackId = uuid.generateUUID();
    return allowedToCloseFeedback(params.feedbackId, req).then(function () {
        return db.cypher().match("(feedback:Feedback {feedbackId: {feedbackId}}), (user:User {userId: {userId}})")
            .set("feedback", {status: 'closed'})
            .create(`(feedback)<-[:Test]-(:Feedback:Comment:Status {status:'closed', feedbackId: {statusFeedbackId}, created: {closed}, 
                        reasonText: {reasonText}})<-[:IS_CREATOR]-(user)`)
            .end({closed: closed, statusFeedbackId: statusFeedbackId, userId: userId, feedbackId: params.feedbackId, reasonText: params.reasonText})
            .send().then(function () {
                return {closedDate: closed, statusFeedbackId: statusFeedbackId};
            });
    });
};


module.exports = {
    close: close
};
