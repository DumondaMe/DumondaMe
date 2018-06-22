'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let stubEmailQueue = require('elyoos-server-test-util').stubEmailQueue();
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');

describe('Integration Tests to send news preview', function () {

    let startTime;

    beforeEach(function () {
        stubEmailQueue.createImmediatelyJob.reset();
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return dbDsl.init(4, true);
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Sending news preview', function () {

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.post('/api/admin/news/preview', {title: 'title', text: 'description'});
        }).then(function (res) {
            res.status.should.equal(200);

            stubEmailQueue.createImmediatelyJob.calledWith("sendPreviewNews", {
                email: 'user@irgendwo.ch', forename: 'user', title: 'title', text: 'description'
            }).should.be.true;
        });
    });
});
