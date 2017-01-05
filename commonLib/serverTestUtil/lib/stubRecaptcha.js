'use strict';

let sinon = require('sinon');
let promise = require('bluebird');

module.exports = {
    stub: function (recaptcha) {
        let verifyRecaptcha = sinon.stub(recaptcha, 'verifyRecaptcha');

        verifyRecaptcha.returns(promise.resolve());
    }
};