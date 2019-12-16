'use strict';

const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;

describe('Getting one time notifications', function () {

    beforeEach(async function () {
        await dbDsl.init(5);

    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get one time welcome notification', async function () {
        dbDsl.notificationOneTimeWelcome('20', {userId: '1', created: 678});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/notification', {skip: 0, limit: 10});
        res.status.should.equal(200);
        res.body.numberOfUnreadNotifications.should.equals(1);
        res.body.hasMoreNotifications.should.equals(false);
        res.body.notifications.length.should.equals(1);
        res.body.notifications[0].notificationId.should.equals('20');
        res.body.notifications[0].read.should.equals(false);
        res.body.notifications[0].created.should.equals(678);
        res.body.notifications[0].type.should.equals('oneTimeWelcome');
    });

    it('Get one time watch question notification', async function () {
        dbDsl.notificationOneTimeWatchQuestion('20', {userId: '1', created: 678});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/notification', {skip: 0, limit: 10});
        res.status.should.equal(200);
        res.body.numberOfUnreadNotifications.should.equals(1);
        res.body.hasMoreNotifications.should.equals(false);
        res.body.notifications.length.should.equals(1);
        res.body.notifications[0].notificationId.should.equals('20');
        res.body.notifications[0].read.should.equals(false);
        res.body.notifications[0].created.should.equals(678);
        res.body.notifications[0].type.should.equals('oneTimeWatchQuestion');
    });
});
