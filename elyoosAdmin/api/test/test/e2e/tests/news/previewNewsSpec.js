'use strict';

const users = require('elyoos-server-test-util').user;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const stubEmailQueue = require('elyoos-server-test-util').stubEmailQueue();
const requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests to send news preview', function () {

    beforeEach(async function () {
        stubEmailQueue.createImmediatelyJob.reset();
        await dbDsl.init(4, true);
        await dbDsl.sendToDb();
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Sending news preview', async function () {

        await requestHandler.login(users.validUser);
        let res = await  requestHandler.post('/api/news/preview', {title: 'title', text: 'description'});
        res.status.should.equal(200);

        stubEmailQueue.createImmediatelyJob.calledWith("sendPreviewNews", {
            email: 'user@irgendwo.ch', forename: 'user', title: 'title', text: 'description'
        }).should.be.true;
    });
});
