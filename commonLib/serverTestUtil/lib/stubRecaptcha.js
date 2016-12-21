'use strict';

var sinon = require('sinon');
var promise = require('bluebird');

module.exports = {
    stub: function (recaptcha) {
        var verifyRecaptcha = sinon.stub(recaptcha, 'verifyRecaptcha');

        verifyRecaptcha.returns(promise.resolve());
    }
};