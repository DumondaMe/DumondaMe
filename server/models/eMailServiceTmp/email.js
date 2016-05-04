"use strict";
var emailQueue = require('./../../lib/eMail/eMailQueue');
var messageReceivedJob = require('./jobs/messageReceivedJob');

var startEmailService = function () {
    emailQueue.addJobDefinition('messageReceived', messageReceivedJob.processDefinition);
};

module.exports = {
    start: startEmailService
};
