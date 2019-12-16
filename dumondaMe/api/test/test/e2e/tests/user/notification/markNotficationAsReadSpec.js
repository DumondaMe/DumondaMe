'use strict';

const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const db = require('dumonda-me-server-test-util').db;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;

describe('Mark notifications as read', function () {

    beforeEach(async function () {
        await dbDsl.init(5);

        dbDsl.createRegion('region-1', {de: 'regionDe', en: 'regionEn'});
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Mark one unread notification of a user', async function () {

        dbDsl.notificationUserAddedToTrustCircle('50', {
            userId: '1', created: 678, read: false, trustCircleUsers:
                [{userId: '3', created: 400}, {userId: '4', created: 401}]
        });

        dbDsl.notificationUserAddedToTrustCircle('51', {
            userId: '2', created: 678, read: true, trustCircleUsers:
                [{userId: '3', created: 400}, {userId: '4', created: 401}]
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/notification', {skip: 0, limit: 10});
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(n:Notification:Unread)`)
            .return('n.notificationId AS notificationId').end().send();
        notification.length.should.equals(0);
    });

    it('Mark two unread notification of a user', async function () {

        dbDsl.notificationUserAddedToTrustCircle('50', {
            userId: '1', created: 678, read: false, trustCircleUsers:
                [{userId: '3', created: 400}, {userId: '4', created: 401}]
        });

        dbDsl.notificationUserAddedToTrustCircle('51', {
            userId: '1', created: 678, read: false, trustCircleUsers:
                [{userId: '3', created: 400}, {userId: '4', created: 401}]
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/notification', {skip: 0, limit: 10});
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(n:Notification:Unread)`)
            .return('n.notificationId AS notificationId').end().send();
        notification.length.should.equals(0);
    });

    it('Mark not as unread notification when skip greater than 0', async function () {

        dbDsl.notificationUserAddedToTrustCircle('50', {
            userId: '1', created: 678, read: false, trustCircleUsers:
                [{userId: '3', created: 400}, {userId: '4', created: 401}]
        });

        dbDsl.notificationUserAddedToTrustCircle('51', {
            userId: '1', created: 678, read: false, trustCircleUsers:
                [{userId: '3', created: 400}, {userId: '4', created: 401}]
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/notification', {skip: 1, limit: 10});
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(n:Notification:Unread)`)
            .return('n.notificationId AS notificationId').end().send();
        notification.length.should.equals(2);
    });

});
