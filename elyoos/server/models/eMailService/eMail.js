"use strict";
let emailQueue = require('elyoos-server-lib').eMailQueue;
let messageReceivedJob = require('./jobs/messageReceivedJob');
let resetPasswordJob = require('./jobs/resetPasswordJob');
let registerUserRequestJob = require('./jobs/registerUserRequestJob');

let startEmailService = function () {
    emailQueue.addJobDefinition('messageReceived', messageReceivedJob.processDefinition);
    emailQueue.addJobDefinition('resetPassword', resetPasswordJob.processDefinition);
    emailQueue.addJobDefinition('registerUserRequest', registerUserRequestJob.processDefinition);
};

module.exports = {
    start: startEmailService
};
