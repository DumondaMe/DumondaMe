"use strict";
var emailQueue = requireLib('eMail/eMailQueue');
var messageReceivedJob = require('./jobs/messageReceivedJob');
var resetPasswordJob = require('./jobs/resetPasswordJob');
var registerUserRequestJob = require('./jobs/registerUserRequestJob');

var startEmailService = function () {
    emailQueue.addJobDefinition('messageReceived', messageReceivedJob.processDefinition);
    emailQueue.addJobDefinition('resetPassword', resetPasswordJob.processDefinition);
    emailQueue.addJobDefinition('registerUserRequest', registerUserRequestJob.processDefinition);
};

module.exports = {
    start: startEmailService
};
