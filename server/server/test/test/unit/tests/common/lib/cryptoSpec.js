'use strict';

var testee = require('../../../../../../../common/src/lib/crypto');
var sinon = require('sinon');
var expect = require('chai').expect;

describe('Unit Test for common lib', function () {

    var sandbox;

    before(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Encyrpt and decrypt successful a text', function () {

        var text = "blablairgendwasundwieterso", expectedText = '', password = 'd6F3Efeq;';

        expectedText = testee.encrypt(text, password);
        expect(expectedText).to.equal('ceb0bbbcf536bd73e33d40651bc30992b52630caef867f46f8db');
        expectedText = testee.decrypt(expectedText, password);

        expect(expectedText).to.equal(text);
    });
});
