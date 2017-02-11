"use strict";
let emailQueue = require('../eMailQueue');
let feedbackNewCommentJob = require('./jobs/feedbackNewCommentJob');
let feedback = require('./feedback');

let startEmailService = function () {
    emailQueue.addJobDefinition('feedbackNewComment', feedbackNewCommentJob.processDefinition);
};

module.exports = {
    startEmailService: startEmailService,
    feedbackNewComment: feedback.newComment
};
