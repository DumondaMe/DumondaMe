'use strict';

const users = require('elyoos-server-test-util').user;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const db = require('elyoos-server-test-util').db;
const requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Mark Notification as read', function () {

    beforeEach(async function () {
        await dbDsl.init(5);

        dbDsl.createRegion('region-1', {});
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Remove addedToTrustCircle notification', async function () {

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

        let notification = await db.cypher().match(`(n:Notification)`)
            .return('n.notificationId AS notificationId').end().send();
        notification.length.should.equals(1);
        notification[0].notificationId.should.equals('51');
    });

    it('Not allowed to remove notification of other user', async function () {

        dbDsl.notificationUserAddedToTrustCircle('50', {
            userId: '2', created: 678, trustCircleUsers:
                [{userId: '3', created: 400}, {userId: '4', created: 401}]
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/notification/read', {notificationId: '50'});
        res.status.should.equal(400);

        let notification = await db.cypher().match(`(n:Notification)`)
            .return('n.notificationId AS notificationId').end().send();
        notification.length.should.equals(1);
        notification[0].notificationId.should.equals('50');
    });

    it('Not allowed to remove notification when not logged in', async function () {

        dbDsl.notificationUserAddedToTrustCircle('50', {
            userId: '1', created: 678, trustCircleUsers:
                [{userId: '3', created: 400}, {userId: '4', created: 401}]
        });

        await dbDsl.sendToDb();
        let res = await requestHandler.put('/api/user/notification/read', {notificationId: '50'});
        res.status.should.equal(401);

        let notification = await db.cypher().match(`(n:Notification)`)
            .return('n.notificationId AS notificationId').end().send();
        notification.length.should.equals(1);
        notification[0].notificationId.should.equals('50');
    });
});
