'use strict';

var sinon = require('sinon');
var eMailQueue = null;

var sandbox = sinon.sandbox.create();

var createJob;
var createImmediatelyJob;

module.exports = function () {
    return {
        init: function (newEMailQueue) {
            eMailQueue = newEMailQueue;
            createJob = sandbox.stub(eMailQueue, 'createJob');
            createImmediatelyJob = sandbox.stub(eMailQueue, 'createImmediatelyJob');
        },
        clear: function () {
            sandbox.restore();
        },
        createJob: createJob,
        createImmediatelyJob: createImmediatelyJob
    };
};