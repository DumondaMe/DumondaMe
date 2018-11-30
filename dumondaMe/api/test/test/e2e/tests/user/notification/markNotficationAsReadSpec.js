'use strict';

const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const db = require('dumonda-me-server-test-util').db;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;

describe('Mark notification as read', function () {

    beforeEach(async function () {
        await dbDsl.init(5);

        dbDsl.createRegion('region-1', {de: 'regionDe', en: 'regionEn'});
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Mark addedToTrustCircle notification as read', async function () {

        dbDsl.notificationUserAddedToTrustCircle('50', {
            userId: '1', created: 678, trustCircleUsers:
                [{userId: '3', created: 400}, {userId: '4', created: 401}]
        });

        dbDsl.notificationUserAddedToTrustCircle('51', {
            userId: '2', created: 678, trustCircleUsers:
                [{userId: '3', created: 400}, {userId: '4', created: 401}]
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/notification/read', {notificationId: '50'});
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(n:Notification:Unread)`)
            .return('n.notificationId AS notificationId').end().send();
        notification.length.should.equals(1);
        notification[0].notificationId.should.equals('51');
    });

    it('Mark watchCommitment notification as read', async function () {

        dbDsl.createRegion('region', {de: 'regionDe', en: 'regionEn'});

        dbDsl.createCommitment('50', {
            adminId: '1', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700, title: 'Das ist ein Engagement',
            website: 'https://www.example.org/', regions: ['region']
        });

        dbDsl.userWatchesCommitment('20', {
            commitmentId: '50',
            created: 678, watchingUsers: [{userId: '2', created: 444}, {userId: '4', created: 555}]
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/notification/read', {notificationId: '20'});
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(n:Notification)`)
            .return('n.notificationId AS notificationId').end().send();
        notification.length.should.equals(1);
    });

    it('Mark not existing notification as read', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/notification/read', {notificationId: '11'});
        res.status.should.equal(400);
        res.body.errorCode.should.equal(1);
    });

    it('Not allowed to mark notification of other user as read', async function () {

        dbDsl.notificationUserAddedToTrustCircle('50', {
            userId: '2', created: 678, trustCircleUsers:
                [{userId: '3', created: 400}, {userId: '4', created: 401}]
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/notification/read', {notificationId: '50'});
        res.status.should.equal(400);

        let notification = await db.cypher().match(`(n:Notification:Unread)`)
            .return('n.notificationId AS notificationId').end().send();
        notification.length.should.equals(1);
    });

    it('Not allowed to mark notification as read when not logged in', async function () {

        dbDsl.notificationUserAddedToTrustCircle('50', {
            userId: '1', created: 678, trustCircleUsers:
                [{userId: '3', created: 400}, {userId: '4', created: 401}]
        });

        await dbDsl.sendToDb();
        let res = await requestHandler.put('/api/user/notification/read', {notificationId: '50'});
        res.status.should.equal(401);

        let notification = await db.cypher().match(`(n:Notification:Unread)`)
            .return('n.notificationId AS notificationId').end().send();
        notification.length.should.equals(1);
    });
});
