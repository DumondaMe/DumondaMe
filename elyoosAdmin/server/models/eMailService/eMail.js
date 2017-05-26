"use strict";

let emailService = require('elyoos-server-lib').eMailService;
let emailQueue = require('elyoos-server-lib').eMailQueue;
let feedbackStatusChangedJob = require('./jobs/feedbackStatusChangeJob');
let sendNewsJob = require('./jobs/sendNewsJob');
let sendPreviewNewsJob = require('./jobs/sendPreviewNewsJob');

let startEmailService = function () {
    emailQueue.addJobDefinition('feedbackStatusChanged', feedbackStatusChangedJob.processDefinition);
    emailQueue.addJobDefinition('sendNews', sendNewsJob.processDefinition);
    emailQueue.addJobDefinition('sendPreviewNews', sendPreviewNewsJob.processDefinition);
    emailService.startEmailService();
};

module.exports = {
    start: startEmailService
};
