'use strict';

const users = require('dumonda-me-server-test-util').user;
const db = require('dumonda-me-server-test-util').db;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const should = require('chai').should();
const moment = require('moment');

describe('Notification when user watches a question', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(5);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine FragöÖÄäÜü', description: 'description', topics: ['Spiritual'],
            language: 'de'
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Watching a question creates a new notification for the admin of the question', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/watch/1');
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(:User {userId: '2'})<-[:NOTIFIED]-
        (notification:Notification {type: 'watchingQuestion'})-[relNot:ORIGINATOR_OF_NOTIFICATION]->(user)`)
            .match(`(notification)-[:NOTIFICATION]->(q:Question)`)
            .return('notification, q, user.userId AS userId, relNot.created AS created')
            .end().send();
        notification.length.should.equals(1);
        should.exist(notification[0].notification.notificationId);
        notification[0].notification.created.should.least(startTime);
        notification[0].q.questionId.should.equals('1');
        notification[0].userId.should.equals('1');
        notification[0].created.should.least(startTime);
    });

    it('Notification is not added twice to the same user', async function () {
        dbDsl.userWatchesQuestion('50', {
            questionId: '1',
            created: 678, watchingUsers: [{userId: '1', created: 555}]
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/watch/1');
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(:User {userId: '2'})<-[:NOTIFIED]-
        (notification:Notification {type: 'watchingQuestion'})-[relNot:ORIGINATOR_OF_NOTIFICATION]->(user)`)
            .match(`(notification)-[:NOTIFICATION]->(q:Question)`)
            .return('notification')
            .end().send();
        notification.length.should.equals(1);
    });

    it('Watching a question adds to existing notification the new watching user', async function () {
        dbDsl.userWatchesQuestion('50', {
            questionId: '1',
            created: 678, watchingUsers: [{userId: '3', created: 555}, {userId: '4', created: 444}]
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/watch/1');
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(:User {userId: '2'})<-[:NOTIFIED]-
        (notification:Notification {type: 'watchingQuestion'})-[relNot:ORIGINATOR_OF_NOTIFICATION]->(user)`)
            .match(`(notification)-[:NOTIFICATION]->(q:Question)`)
            .return('notification, q, collect(user.userId) AS userIds, collect(relNot.created) AS created')
            .end().send();
        notification.length.should.equals(1);
        notification[0].notification.notificationId.should.equals('50');
        notification[0].notification.created.should.least(startTime);
        notification[0].q.questionId.should.equals('1');
        notification[0].userIds.length.should.equals(3);
        notification[0].created.length.should.equals(3);
    });

    it('Delete watch of a question deletes notification', async function () {
        dbDsl.userWatchesQuestion('50', {
            questionId: '1',
            created: 678, watchingUsers: [{userId: '1', created: 555}]
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question/watch', {questionId: '1'});
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(:User {userId: '2'})<-[:NOTIFIED]-
        (notification:Notification {type: 'watchingQuestion'})`)
            .return('notification')
            .end().send();
        notification.length.should.equals(0);
    });

    it('Delete watch of a question removes only relationship to notification', async function () {
        dbDsl.userWatchesQuestion('50', {
            questionId: '1',
            created: 678, watchingUsers: [{userId: '1', created: 555}, {userId: '3', created: 666}]
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question/watch', {questionId: '1'});
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(:User {userId: '2'})<-[:NOTIFIED]-
        (notification:Notification {type: 'watchingQuestion'})-[relNot:ORIGINATOR_OF_NOTIFICATION]->(user)`)
            .return('notification, user.userId AS userId, relNot.created AS created')
            .end().send();
        notification.length.should.equals(1);
        notification[0].notification.notificationId.should.equals('50');
        notification[0].notification.created.should.equals(678);
        notification[0].userId.should.equals('3');
        notification[0].created.should.equals(666);
    });
});
