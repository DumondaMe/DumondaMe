'use strict';

const users = require('dumonda-me-server-test-util').user;
const db = require('dumonda-me-server-test-util').db;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const should = require('chai').should();
const moment = require('moment');

describe('Notification when user watches a commitment', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(5);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createRegion('region', {de: 'regionDe', en: 'regionEn'});

        dbDsl.createCommitment('1', {
            adminId: '2', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700,
            website: 'https://www.example.org/', regions: ['region']
        });

        dbDsl.createCommitment('2', {
            adminId: '1', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700,
            website: 'https://www.example.org/', regions: ['region']
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Watching a commitment creates a new notification for the admin of the commitment', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/commitment/watch/1');
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(:User {userId: '2'})<-[:NOTIFIED]-
        (notification:Notification:Unread {type: 'watchingCommitment'})-[relNot:ORIGINATOR_OF_NOTIFICATION]->(user)`)
            .match(`(notification)-[:NOTIFICATION]->(c:Commitment)`)
            .return('notification, c, user.userId AS userId, relNot.created AS created')
            .end().send();
        notification.length.should.equals(1);
        should.exist(notification[0].notification.notificationId);
        notification[0].notification.created.should.least(startTime);
        notification[0].c.commitmentId.should.equals('1');
        notification[0].userId.should.equals('1');
        notification[0].created.should.least(startTime);
    });

    it('Notification is not added twice to the same user (notification unread)', async function () {
        dbDsl.userWatchesCommitment('50', {
            commitmentId: '1',
            created: 678, watchingUsers: [{userId: '1', created: 555}]
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/commitment/watch/1');
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(:User {userId: '2'})<-[:NOTIFIED]-
        (notification:Notification {type: 'watchingCommitment'})-[relNot:ORIGINATOR_OF_NOTIFICATION]->(user)`)
            .match(`(notification)-[:NOTIFICATION]->(c:Commitment)`)
            .return('notification, c, user.userId AS userId, relNot.created AS created')
            .end().send();
        notification.length.should.equals(1);
    });

    it('Notification is not added twice to the same user (notification read)', async function () {
        dbDsl.userWatchesCommitment('50', {
            commitmentId: '1', read: true,
            created: 678, watchingUsers: [{userId: '1', created: 555}]
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/commitment/watch/1');
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(:User {userId: '2'})<-[:NOTIFIED]-
        (notification:Notification {type: 'watchingCommitment'})-[relNot:ORIGINATOR_OF_NOTIFICATION]->(user)`)
            .match(`(notification)-[:NOTIFICATION]->(c:Commitment)`)
            .return('notification, c, user.userId AS userId, relNot.created AS created')
            .end().send();
        notification.length.should.equals(1);
    });

    it('Watching a commitment adds to existing unread notification the new watching user', async function () {
        dbDsl.userWatchesCommitment('50', {
            commitmentId: '1',
            created: 678, watchingUsers: [{userId: '3', created: 555}, {userId: '4', created: 444}]
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/commitment/watch/1');
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(:User {userId: '2'})<-[:NOTIFIED]-
        (notification:Notification:Unread {type: 'watchingCommitment'})-[relNot:ORIGINATOR_OF_NOTIFICATION]->(user)`)
            .match(`(notification)-[:NOTIFICATION]->(c:Commitment)`)
            .return('notification, c, collect(user.userId) AS userIds, collect(relNot.created) AS created')
            .end().send();
        notification.length.should.equals(1);
        notification[0].notification.notificationId.should.equals('50');
        notification[0].notification.created.should.least(startTime);
        notification[0].c.commitmentId.should.equals('1');
        notification[0].userIds.length.should.equals(3);
        notification[0].created.length.should.equals(3);
    });

    it('Watching a commitment creates new notification because all existing notification are read', async function () {
        dbDsl.userWatchesCommitment('50', {
            commitmentId: '1', read: true,
            created: 678, watchingUsers: [{userId: '3', created: 555}, {userId: '4', created: 444}]
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/commitment/watch/1');
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(:User {userId: '2'})<-[:NOTIFIED]-
        (notification:Notification:Unread {type: 'watchingCommitment'})-[relNot:ORIGINATOR_OF_NOTIFICATION]->(user)`)
            .match(`(notification)-[:NOTIFICATION]->(c:Commitment)`)
            .return('notification, c, user.userId AS userId')
            .end().send();
        notification.length.should.equals(1);
        notification[0].notification.notificationId.should.not.equals('50');
        notification[0].notification.created.should.least(startTime);
        notification[0].c.commitmentId.should.equals('1');
        notification[0].userId.should.equals('1');
    });

    it('Delete watch of a commitment deletes notification', async function () {
        dbDsl.userWatchesCommitment('50', {
            commitmentId: '1',
            created: 678, watchingUsers: [{userId: '1', created: 555}]
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/commitment/watch', {commitmentId: '1'});
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(:User {userId: '2'})<-[:NOTIFIED]-
        (notification:Notification {type: 'watchingCommitment'})`)
            .return('notification')
            .end().send();
        notification.length.should.equals(0);
    });

    it('Delete watch of a commitment removes only relationship to notification', async function () {
        dbDsl.userWatchesCommitment('50', {
            commitmentId: '1',
            created: 678, watchingUsers: [{userId: '1', created: 555}, {userId: '3', created: 666}]
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/commitment/watch', {commitmentId: '1'});
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(:User {userId: '2'})<-[:NOTIFIED]-
        (notification:Notification {type: 'watchingCommitment'})-[relNot:ORIGINATOR_OF_NOTIFICATION]->(user)`)
            .return('notification, user.userId AS userId, relNot.created AS created')
            .end().send();
        notification.length.should.equals(1);
        notification[0].notification.notificationId.should.equals('50');
        notification[0].notification.created.should.equals(678);
        notification[0].userId.should.equals('3');
        notification[0].created.should.equals(666);
    });
});
