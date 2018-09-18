'use strict';

const testee = require('../../../../../../../models/eMailService/jobs/sendPreviewNewsJob');
const email = require('dumonda-me-server-lib').eMail;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const sinon = require('sinon');
const expect = require('chai').expect;
const bluebird = require('bluebird');
const Promise = bluebird.Promise;

describe('Unit Test eMailService/jobs/sendPreviewNewsJob', function () {

    let sandbox;

    before(function () {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(async function () {
        await dbDsl.init(3);
        dbDsl.createNews('1', {created: 500});
        dbDsl.createNews('2', {created: 501, isSent: true});
        dbDsl.createNews('3', {created: 502});
        await dbDsl.sendToDb();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Send preview news to the user', function (done) {

        let finished, sendEMail = sandbox.stub(email, 'sendEMail');
        sendEMail.returns(Promise.resolve());

        finished = function () {
            expect(sendEMail.callCount).to.equals(1);

            expect(sendEMail.withArgs('sendNews', {
                title: 'title', text: 'description', forename: 'user',
                unsubscribeLink: `${process.env.ELYOOS_DOMAIN}unsubscribe/news/user@irgendwo.ch`
            }, 'user@irgendwo.ch').calledOnce).to.equal(true);

            done();
        };
        testee.processDefinition({
            email: 'user@irgendwo.ch', forename: 'user', title: 'title', text: 'description'
        }, finished);
    });
});
