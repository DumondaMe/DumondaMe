'use strict';

let sinon = require('sinon');
let eMailQueue = null;

let sandbox = sinon.sandbox.create();

let createJob;
let createImmediatelyJob;

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