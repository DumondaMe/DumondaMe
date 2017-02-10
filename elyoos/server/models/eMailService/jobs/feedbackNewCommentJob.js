"use strict";

let email = require('elyoos-server-lib').eMail;
let _ = require('lodash');
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let processDefinition = function (data, done) {

    if (data.hasOwnProperty('emails') &&_.isArray(data.emails)) {
        data.emails.forEach(function (emailAddress) {
            email.sendEMail("feedbackNewComment", {
                userCommentName: data.userCommentName,
                titleFeedback: data.titleFeedback,
                textComment: data.textComment
            }, emailAddress);
        });
    } else {
        logger.error("data.emails is not array");
    }
    return done();
};

module.exports = {
    processDefinition: processDefinition
};
