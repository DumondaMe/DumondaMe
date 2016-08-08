'use strict';

var sinon = require('sinon');
var recaptcha = require('../../../../../models/util/recaptcha');
var promise = require('bluebird');

var verifyRecaptcha = sinon.stub(recaptcha, 'verifyRecaptcha');

verifyRecaptcha.returns(promise.resolve());

module.exports = {
};