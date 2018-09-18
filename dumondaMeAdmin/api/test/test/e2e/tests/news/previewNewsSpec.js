'use strict';

const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const eMail = require('dumonda-me-server-lib').eMail;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const sinon = require('sinon');

describe('Integration Tests to send news preview', function () {

    let sandbox, stubSendEMail;

    beforeEach(async function () {
        sandbox = sinon.sandbox.create();
        stubSendEMail = sandbox.stub(eMail, 'sendEMail');
        stubSendEMail.resolves({});
        await dbDsl.init(4, true);
        await dbDsl.sendToDb();
    });

    afterEach(function () {
        sandbox.restore();
        return requestHandler.logout();
    });


    it('Sending news preview', async function () {

        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/news/preview', {title: 'title', text: 'description'});
        res.status.should.equal(200);

        stubSendEMail.calledWith("sendNews", {
            title: 'title',
            text: 'description',
            forename: 'user',
            unsubscribeLink: `${process.env.ELYOOS_DOMAIN}unsubscribe/news/user@irgendwo.ch`
        }, 'de', 'user@irgendwo.ch').should.be.true;
    });
});
