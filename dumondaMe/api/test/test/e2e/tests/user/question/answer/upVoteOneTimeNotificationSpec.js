'use strict';

const users = require('dumonda-me-server-test-util').user;
const db = require('dumonda-me-server-test-util').db;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const should = require('chai').should();
const moment = require('moment');

describe('Up vote answer generate one time notifications', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(3);
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'description', topics: ['Spiritual'],
            language: 'de'
        });
        dbDsl.createDefaultAnswer('5', {
            creatorId: '3', questionId:'1', answer: 'Answer'
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Up vote fist answer generates first answer notification', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/upVote/5');
        res.status.should.equal(200);
        res.body.oneTimeNotificationCreated.should.equals(true);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime {type: 'oneTimeUpVoteFirstAnswer'})`)
            .return('notification')
            .end().send();
        notification.length.should.equals(1);
        should.exist(notification[0].notification.notificationId);
        notification[0].notification.created.should.least(startTime);
    });

    it('Up vote fist answer with existing first answer notification does not generate new notification', async function () {
        dbDsl.notificationOneTimeUpVoteFirstAnswer('10', {userId: '1', created: 500});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/upVote/5');
        res.status.should.equal(200);
        res.body.oneTimeNotificationCreated.should.equals(false);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime {type: 'oneTimeUpVoteFirstAnswer'})`)
            .return('notification')
            .end().send();
        notification.length.should.equals(1);
        notification[0].notification.notificationId.should.equals('10');
        notification[0].notification.created.should.equals(500);
    });

    it('Up vote second answer generates no first answer notification', async function () {
        dbDsl.createDefaultAnswer('6', {
            creatorId: '3', questionId:'1', answer: 'Answer'
        });
        dbDsl.upVoteAnswer({userId: '1', answerId: '6'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/upVote/5');
        res.status.should.equal(200);
        res.body.oneTimeNotificationCreated.should.equals(false);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime {type: 'oneTimeUpVoteFirstAnswer'})`)
            .return('notification')
            .end().send();
        notification.length.should.equals(0);
    });

    it('Up vote third answer generates watch commitment challenge notification', async function () {
        dbDsl.createDefaultAnswer('6', {
            creatorId: '3', questionId:'1', answer: 'Answer'
        });
        dbDsl.createDefaultAnswer('7', {
            creatorId: '3', questionId:'1', answer: 'Answer'
        });
        dbDsl.upVoteAnswer({userId: '1', answerId: '6'});
        dbDsl.upVoteAnswer({userId: '1', answerId: '7'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/upVote/5');
        res.status.should.equal(200);
        res.body.oneTimeNotificationCreated.should.equals(true);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime {type: 'oneTimeChallengeWatchCommitment'})`)
            .return('notification')
            .end().send();
        notification.length.should.equals(1);
        should.exist(notification[0].notification.notificationId);
        notification[0].notification.created.should.least(startTime);
    });

    it('Up vote third answer with existing watch commitment challenge does not generate notification', async function () {
        dbDsl.createDefaultAnswer('6', {
            creatorId: '3', questionId:'1', answer: 'Answer'
        });
        dbDsl.createDefaultAnswer('7', {
            creatorId: '3', questionId:'1', answer: 'Answer'
        });
        dbDsl.upVoteAnswer({userId: '1', answerId: '6'});
        dbDsl.upVoteAnswer({userId: '1', answerId: '7'});
        dbDsl.notificationOneTimeChallengeWatchCommitment('10', {userId: '1', created: 500});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/upVote/5');
        res.status.should.equal(200);
        res.body.oneTimeNotificationCreated.should.equals(false);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime {type: 'oneTimeChallengeWatchCommitment'})`)
            .return('notification')
            .end().send();
        notification.length.should.equals(1);
        notification[0].notification.notificationId.should.equals('10');
        notification[0].notification.created.should.equals(500);
    });

    it('Up vote third answer with existing first watch does not generates a new challenge', async function () {
        dbDsl.createDefaultAnswer('6', {
            creatorId: '3', questionId:'1', answer: 'Answer'
        });
        dbDsl.createDefaultAnswer('7', {
            creatorId: '3', questionId:'1', answer: 'Answer'
        });
        dbDsl.upVoteAnswer({userId: '1', answerId: '6'});
        dbDsl.upVoteAnswer({userId: '1', answerId: '7'});
        dbDsl.notificationOneTimeWatchFirstCommitment('10', {userId: '1', created: 500});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/upVote/5');
        res.status.should.equal(200);
        res.body.oneTimeNotificationCreated.should.equals(false);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime {type: 'oneTimeChallengeWatchCommitment'})`)
            .return('notification')
            .end().send();
        notification.length.should.equals(0);
    });

    it('Up vote 5 answers generates one time notification to invite friends', async function () {
        dbDsl.createDefaultAnswer('6', {
            creatorId: '3', questionId:'1', answer: 'Answer'
        });
        dbDsl.createDefaultAnswer('7', {
            creatorId: '3', questionId:'1', answer: 'Answer'
        });
        dbDsl.createDefaultAnswer('8', {
            creatorId: '3', questionId:'1', answer: 'Answer'
        });
        dbDsl.createDefaultAnswer('9', {
            creatorId: '3', questionId:'1', answer: 'Answer'
        });
        dbDsl.upVoteAnswer({userId: '1', answerId: '6'});
        dbDsl.upVoteAnswer({userId: '1', answerId: '7'});
        dbDsl.upVoteAnswer({userId: '1', answerId: '8'});
        dbDsl.upVoteAnswer({userId: '1', answerId: '9'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/upVote/5');
        res.status.should.equal(200);
        res.body.oneTimeNotificationCreated.should.equals(true);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime)`)
            .return('notification').end().send();

        notification.length.should.equals(1);
        notification[0].notification.type.should.equals('oneTimeInviteFriends');
        should.exist(notification[0].notification.notificationId);
        notification[0].notification.created.should.least(startTime);
    });

    it('Up vote 5 answers with existing one time notification to invite friends', async function () {
        dbDsl.createDefaultAnswer('6', {
            creatorId: '3', questionId:'1', answer: 'Answer'
        });
        dbDsl.createDefaultAnswer('7', {
            creatorId: '3', questionId:'1', answer: 'Answer'
        });
        dbDsl.createDefaultAnswer('8', {
            creatorId: '3', questionId:'1', answer: 'Answer'
        });
        dbDsl.createDefaultAnswer('9', {
            creatorId: '3', questionId:'1', answer: 'Answer'
        });
        dbDsl.upVoteAnswer({userId: '1', answerId: '6'});
        dbDsl.upVoteAnswer({userId: '1', answerId: '7'});
        dbDsl.upVoteAnswer({userId: '1', answerId: '8'});
        dbDsl.upVoteAnswer({userId: '1', answerId: '9'});
        dbDsl.notificationOneTimeInviteFriends('10', {userId: '1', created: 500});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/upVote/5');
        res.status.should.equal(200);
        res.body.oneTimeNotificationCreated.should.equals(false);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime)`)
            .return('notification').end().send();

        notification.length.should.equals(1);
        notification[0].notification.type.should.equals('oneTimeInviteFriends');
        notification[0].notification.notificationId.should.equals('10');
        notification[0].notification.created.should.equals(500);
    });

    it('Create challenge complete notification', async function () {
        dbDsl.notificationOneTimeWatchFirstQuestion('11', {userId: '1', created: 501});
        dbDsl.notificationOneTimeWatchFirstCommitment('12', {userId: '1', created: 502});
        dbDsl.notificationOneTimeFirstTrustCircleUser('13', {userId: '1', created: 503});
        dbDsl.notificationOneTimeFirstAnswer('14', {userId: '1', created: 504});
        dbDsl.notificationOneTimeFirstQuestion('15', {userId: '1', created: 505});
        dbDsl.notificationOneTimeFirstCommitment('16', {userId: '1', created: 506});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/upVote/5');
        res.status.should.equal(200);
        res.body.oneTimeNotificationCreated.should.equals(true);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime {type: 'oneTimeChallengeComplete'})`)
            .return('notification').end().send();
        notification.length.should.equals(1);
        should.exist(notification[0].notification.notificationId);
        notification[0].notification.created.should.least(startTime);
    });

    it('Existing challenge complete notification does not generate new challenge complete', async function () {
        dbDsl.notificationOneTimeWatchFirstQuestion('11', {userId: '1', created: 501});
        dbDsl.notificationOneTimeWatchFirstCommitment('12', {userId: '1', created: 502});
        dbDsl.notificationOneTimeFirstTrustCircleUser('13', {userId: '1', created: 503});
        dbDsl.notificationOneTimeFirstAnswer('14', {userId: '1', created: 504});
        dbDsl.notificationOneTimeFirstQuestion('15', {userId: '1', created: 505});
        dbDsl.notificationOneTimeFirstCommitment('16', {userId: '1', created: 506});
        dbDsl.notificationOneTimeChallengeComplete('20', {userId: '1', created: 666});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/upVote/5');
        res.status.should.equal(200);
        res.body.oneTimeNotificationCreated.should.equals(true);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime {type: 'oneTimeChallengeComplete'})`)
            .return('notification').end().send();
        notification.length.should.equals(1);
        notification[0].notification.notificationId.should.equals('20');
        notification[0].notification.created.should.equals(666);
    });
});
