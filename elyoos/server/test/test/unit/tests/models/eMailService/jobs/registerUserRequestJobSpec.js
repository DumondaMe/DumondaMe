'use strict';

let testee = require('../../../../../../../models/eMailService/jobs/registerUserRequestJob');
let email = require('elyoos-server-lib').eMail;
let db = require('elyoos-server-test-util').db;
let domainService = require('elyoos-server-lib').domain;
let domain = domainService.getDomain();
let sinon = require('sinon');
let expect = require('chai').expect;

describe('Unit Test eMailService/jobs/registerUserRequestJob', function () {

    let sandbox;

    before(function () {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(function () {
        return db.clearDatabase();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Send a email to verify the email address', function () {

        let finished = sinon.spy(), linkId = 'abro8ueiQ', emailAddress = 'test@gmx.ch',
            sendEMail = sandbox.stub(email, 'sendEMail');

        testee.processDefinition({email: emailAddress, linkId: linkId}, finished);
        expect(sendEMail.withArgs('registerUserRequest', {link: `${domain}register/verify/${linkId}`,}, emailAddress).calledOnce).to.be.true;
        expect(finished.calledOnce).to.be.true;
    });
});
