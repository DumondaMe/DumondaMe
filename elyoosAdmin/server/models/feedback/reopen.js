'use strict';

let db = requireDb();
let time = require('elyoos-server-lib').time;
let uuid = require('elyoos-server-lib').uuid;
let exceptions = require('elyoos-server-lib').exceptions;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);
let feedbackEmail = require('../eMailService/feedback');

let allowedToOpenFeedback = function (feedbackId, req) {
    return db.cypher().match("(feedback:Feedback {feedbackId: {feedbackId}})")
        .return("feedback")
        .end({feedbackId: feedbackId}).send().then(function (resp) {
            if (resp.length === 0) {
                return exceptions.getInvalidOperation(`Feedback does not exist ${feedbackId}`, logger, req);
            }  else if(resp[0].feedback.status === 'open') {
                return exceptions.getInvalidOperation(`Admin tries to reopen a open feedback ${feedbackId}`, logger, req);
            }
        });
};

let open = function (userId, params, req) {
    let closed = time.getNowUtcTimestamp();
    let statusFeedbackId = uuid.generateUUID();
    return allowedToOpenFeedback(params.feedbackId, req).then(function () {
        return db.cypher().match("(feedback:Feedback {feedbackId: {feedbackId}}), (user:User {userId: {userId}})")
            .set("feedback", {status: 'open'})
            .create(`(feedback)<-[:COMMENT]-(:Feedback:Comment:Status {status:'open', feedbackId: {statusFeedbackId}, created: {closed}, 
                        text: {reasonText}})<-[:IS_CREATOR]-(user)`)
            .return("user.name AS name")
            .end({closed: closed, statusFeedbackId: statusFeedbackId, userId: userId, feedbackId: params.feedbackId, reasonText: params.reasonText})
            .send().then(function (resp) {
                feedbackEmail.statusChanged(statusFeedbackId);
                return {closedDate: closed, statusFeedbackId: statusFeedbackId, creator: {name: resp[0].name}};
            });
    });
};


module.exports = {
    open: open
};
