"use strict";
let emailService = require('elyoos-server-lib').eMailService;
let emailQueue = require('elyoos-server-lib').eMailQueue;
let feedbackStatusChangedJob = require('./jobs/feedbackStatusChangeJob');

let startEmailService = function () {
    emailQueue.addJobDefinition('feedbackStatusChanged', feedbackStatusChangedJob.processDefinition);
    emailService.startEmailService();
};

module.exports = {
    start: startEmailService
};
