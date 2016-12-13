'use strict';

let db = requireDb();
let time = require('elyoos-server-lib').time;
let exceptions = require('elyoos-server-lib').exceptions;
var logger = require('elyoos-server-lib').logging.getLogger(__filename);

let checkAllowedToEdit = function (userId, feedbackId, req) {
    return db.cypher().match("(:User {userId: {userId}})-[:IS_CREATOR]->(feedback:Feedback {feedbackId: {feedbackId}})")
        .return("feedback, ANY(label IN LABELS(feedback) WHERE label = 'Discussion') AS isDiscussion").end({userId: userId, feedbackId: feedbackId})
        .send().then(function (resp) {
        if(resp.length === 0) {
            return exceptions.getInvalidOperation(`User ${userId} can not edit feedback ${feedbackId}`, logger, req);
        } else if(resp[0].feedback.status === 'closed') {
            return exceptions.getInvalidOperation(`User ${userId} can not edit closed feedback ${feedbackId}`, logger, req);
        } else if(resp[0].isDiscussion) {
            return exceptions.getInvalidOperation(`User ${userId} is not allowed to edit discussion ${feedbackId}`, logger, req);
        }
    });
};

let edit = function (userId, params, req) {

    let modified = time.getNowUtcTimestamp();
    return checkAllowedToEdit(userId, params.feedbackId, req).then(function () {
        return db.cypher().match("(feedback:Feedback {feedbackId: {feedbackId}})")
            .set("feedback", {title: params.title, description: params.description, modified: modified})
            .end({feedbackId: params.feedbackId}).send().then(function () {
                return {modified: modified};
            });
    });
};

module.exports = {
    edit: edit
};
