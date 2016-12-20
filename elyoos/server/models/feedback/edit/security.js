'use strict';

let db = requireDb();
let exceptions = require('elyoos-server-lib').exceptions;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let checkAllowedToEdit = function (userId, feedbackId, filter, req) {
    return db.cypher().match("(:User {userId: {userId}})-[:IS_CREATOR]->(feedback:Feedback {feedbackId: {feedbackId}})")
        .where(filter)
        .return("feedback").end({userId: userId, feedbackId: feedbackId})
        .send().then(function (resp) {
            if (resp.length === 0) {
                return exceptions.getInvalidOperation(`User ${userId} can not edit feedback ${feedbackId}`, logger, req);
            } else if (resp[0].feedback.status === 'closed') {
                return exceptions.getInvalidOperation(`User ${userId} can not edit closed feedback ${feedbackId}`, logger, req);
            }
        });
};

module.exports = {
    checkAllowedToEdit: checkAllowedToEdit
};
