'use strict';

var sinon = require('sinon');
var eMailQueue = require('../../../../../lib/eMail/eMailQueue');

var sandbox = sinon.sandbox.create();

sandbox.stub(eMailQueue, 'createJob');

module.exports = {
    clear: function () {
        sandbox.restore();
    }
};