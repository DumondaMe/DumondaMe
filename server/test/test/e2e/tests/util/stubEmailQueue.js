'use strict';

var sinon = require('sinon');
var eMailQueue = require('../../../../../lib/eMail/eMailQueue');

var sandbox = sinon.sandbox.create();

var createJob = sandbox.stub(eMailQueue, 'createJob');
var createImmediatelyJob = sandbox.stub(eMailQueue, 'createImmediatelyJob');

module.exports = {
    clear: function () {
        sandbox.restore();
    },
    createJob,
    createImmediatelyJob
};