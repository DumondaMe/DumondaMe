'use strict';

const users = require('dumonda-me-server-test-util').user;
const db = require('dumonda-me-server-test-util').db;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const should = require('chai').should();
const moment = require('moment');

describe('Create one time notification when user watches multiple questions', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(5);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine FragöÖÄäÜü', description: 'description', topics: ['Spiritual'],
            language: 'de'
        });
        dbDsl.createQuestion('2', {
            creatorId: '3', question: 'Das ist eine FragöÖÄäÜü2', description: 'description2', topics: ['Spiritual'],
            language: 'de'
        });
        dbDsl.createQuestion('3', {
            creatorId: '3', question: 'Das ist eine FragöÖÄäÜü2', description: 'description2', topics: ['Spiritual'],
            language: 'de'
        });
        dbDsl.createQuestion('4', {
            creatorId: '3', question: 'Das ist eine FragöÖÄäÜü2', description: 'description2', topics: ['Spiritual'],
            language: 'de'
        });
        dbDsl.createQuestion('5', {
            creatorId: '3', question: 'Das ist eine FragöÖÄäÜü2', description: 'description2', topics: ['Spiritual'],
            language: 'de'
        });
        dbDsl.createQuestion('6', {
            creatorId: '3', question: 'Das ist eine FragöÖÄäÜü2', description: 'description2', topics: ['Spiritual'],
            language: 'de'
        });
        dbDsl.createQuestion('7', {
            creatorId: '3', question: 'Das ist eine FragöÖÄäÜü2', description: 'description2', topics: ['Spiritual'],
            language: 'de'
        });
        dbDsl.createQuestion('8', {
            creatorId: '3', question: 'Das ist eine FragöÖÄäÜü2', description: 'description2', topics: ['Spiritual'],
            language: 'de'
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Watching the third question generates challenge to up vote answer', async function () {
        dbDsl.watchQuestion({questionId: '2', userId: '1'});
        dbDsl.watchQuestion({questionId: '3', userId: '1'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/watch/5');
        res.status.should.equal(200);
        res.body.oneTimeNotificationCreated.should.equals(true);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime {type: 'oneTimeChallengeUpVoteAnswer'})`)
            .return('notification')
            .end().send();
        notification.length.should.equals(1);
        should.exist(notification[0].notification.notificationId);
        notification[0].notification.created.should.least(startTime);
    });

    it('Watching the third question with existing up votes challenge does not generate new challenge', async function () {
        dbDsl.watchQuestion({questionId: '2', userId: '1'});
        dbDsl.watchQuestion({questionId: '3', userId: '1'});
        dbDsl.notificationOneTimeUpVoteFirstAnswer('10', {userId: '1', created: 500});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/watch/5');
        res.status.should.equal(200);
        res.body.oneTimeNotificationCreated.should.equals(false);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime {type: 'oneTimeChallengeUpVoteAnswer'})`)
            .return('notification')
            .end().send();
        notification.length.should.equals(0);
    });

    it('Watching forth question generates no challenge to up vote answer', async function () {
        dbDsl.watchQuestion({questionId: '2', userId: '1'});
        dbDsl.watchQuestion({questionId: '3', userId: '1'});
        dbDsl.watchQuestion({questionId: '4', userId: '1'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/watch/6');
        res.status.should.equal(200);
        res.body.oneTimeNotificationCreated.should.equals(false);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime {type: 'oneTimeChallengeUpVoteAnswer'})`)
            .return('notification')
            .end().send();
        notification.length.should.equals(0);
    });

    it('Watching fifth question generates challenge to watch commitment', async function () {
        dbDsl.watchQuestion({questionId: '2', userId: '1'});
        dbDsl.watchQuestion({questionId: '3', userId: '1'});
        dbDsl.watchQuestion({questionId: '4', userId: '1'});
        dbDsl.watchQuestion({questionId: '5', userId: '1'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/watch/6');
        res.status.should.equal(200);
        res.body.oneTimeNotificationCreated.should.equals(true);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime {type: 'oneTimeChallengeWatchCommitment'})`)
            .return('notification').end().send();
        notification.length.should.equals(1);
        should.exist(notification[0].notification.notificationId);
        notification[0].notification.created.should.least(startTime);
    });

    it('Watching fifth question with existing challenge does not generates a new challenge', async function () {
        dbDsl.watchQuestion({questionId: '2', userId: '1'});
        dbDsl.watchQuestion({questionId: '3', userId: '1'});
        dbDsl.watchQuestion({questionId: '4', userId: '1'});
        dbDsl.watchQuestion({questionId: '5', userId: '1'});
        dbDsl.notificationOneTimeChallengeWatchCommitment('10', {userId: '1', created: 500});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/watch/6');
        res.status.should.equal(200);
        res.body.oneTimeNotificationCreated.should.equals(false);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime {type: 'oneTimeChallengeWatchCommitment'})`)
            .return('notification').end().send();
        notification.length.should.equals(1);
        notification[0].notification.notificationId.should.equals('10');
        notification[0].notification.created.should.equals(500);
    });

    it('Watching fifth question with existing first watch does not generates a new challenge', async function () {
        dbDsl.watchQuestion({questionId: '2', userId: '1'});
        dbDsl.watchQuestion({questionId: '3', userId: '1'});
        dbDsl.watchQuestion({questionId: '4', userId: '1'});
        dbDsl.watchQuestion({questionId: '5', userId: '1'});
        dbDsl.notificationOneTimeWatchFirstCommitment('10', {userId: '1', created: 500});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/watch/6');
        res.status.should.equal(200);
        res.body.oneTimeNotificationCreated.should.equals(false);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime)`)
            .return('notification').end().send();
        notification.length.should.equals(1);
        notification[0].notification.type.should.equals('oneTimeWatchingFirstCommitment');
        notification[0].notification.notificationId.should.equals('10');
        notification[0].notification.created.should.equals(500);
    });

    it('Watching more then 6 question generates one time notification to invite friends', async function () {
        dbDsl.watchQuestion({questionId: '2', userId: '1'});
        dbDsl.watchQuestion({questionId: '3', userId: '1'});
        dbDsl.watchQuestion({questionId: '4', userId: '1'});
        dbDsl.watchQuestion({questionId: '5', userId: '1'});
        dbDsl.watchQuestion({questionId: '6', userId: '1'});
        dbDsl.watchQuestion({questionId: '7', userId: '1'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/watch/8');
        res.status.should.equal(200);
        res.body.oneTimeNotificationCreated.should.equals(true);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime)`)
            .return('notification')
            .end().send();
        notification.length.should.equals(1);
        notification[0].notification.type.should.equals('oneTimeInviteFriends');
        should.exist(notification[0].notification.notificationId);
        notification[0].notification.created.should.least(startTime);
    });

    it('Watching more then 6 question with existing one time notification to invite friends', async function () {
        dbDsl.watchQuestion({questionId: '2', userId: '1'});
        dbDsl.watchQuestion({questionId: '3', userId: '1'});
        dbDsl.watchQuestion({questionId: '4', userId: '1'});
        dbDsl.watchQuestion({questionId: '5', userId: '1'});
        dbDsl.watchQuestion({questionId: '6', userId: '1'});
        dbDsl.watchQuestion({questionId: '7', userId: '1'});
        dbDsl.notificationOneTimeInviteFriends('10', {userId: '1', created: 500});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/watch/8');
        res.status.should.equal(200);
        res.body.oneTimeNotificationCreated.should.equals(false);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime)`)
            .return('notification')
            .end().send();
        notification.length.should.equals(1);
        notification[0].notification.type.should.equals('oneTimeInviteFriends');
        notification[0].notification.notificationId.should.equals('10');
        notification[0].notification.created.should.equals(500);
    });
});
