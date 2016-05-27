"use strict";
var emailQueue = require('./../../lib/eMail/eMailQueue');
var messageReceivedJob = require('./jobs/messageReceivedJob');
var resetPasswordJob = require('./jobs/resetPasswordJob');

var startEmailService = function () {
    emailQueue.addJobDefinition('messageReceived', messageReceivedJob.processDefinition);
    emailQueue.addJobDefinition('resetPassword', resetPasswordJob.processDefinition);
};

module.exports = {
    start: startEmailService
};
