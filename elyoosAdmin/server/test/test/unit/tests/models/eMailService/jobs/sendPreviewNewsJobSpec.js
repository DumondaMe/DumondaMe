'use strict';

let testee = require('../../../../../../../models/eMailService/jobs/sendPreviewNewsJob');
let email = require('elyoos-server-lib').eMail;
let domain = require('elyoos-server-lib').domain;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let sinon = require('sinon');
let expect = require('chai').expect;
let bluebird = require('bluebird');
let Promise = bluebird.Promise;

describe('Unit Test eMailService/jobs/sendPreviewNewsJob', function () {

    let sandbox;

    before(function () {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(function () {
        return dbDsl.init(3).then(function () {
            dbDsl.createNews('1', {created: 500});
            dbDsl.createNews('2', {created: 501, isSent: true});
            dbDsl.createNews('3', {created: 502});
            return dbDsl.sendToDb();
        });
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
                    unsubscribeLink: `${domain.getDomain()}unsubscribe/news/user@irgendwo.ch`
                },
                'user@irgendwo.ch').calledOnce).to.equal(true);

            done();
        };
        testee.processDefinition({
            email: 'user@irgendwo.ch', forename: 'user', title: 'title', text: 'description'
        }, finished);
    });
});
