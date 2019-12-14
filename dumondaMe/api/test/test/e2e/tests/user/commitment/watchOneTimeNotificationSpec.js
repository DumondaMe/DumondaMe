'use strict';

const users = require('dumonda-me-server-test-util').user;
const db = require('dumonda-me-server-test-util').db;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const should = require('chai').should();
const moment = require('moment');

describe('One time notification when user watches commitment', function () {

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
            adminId: '3', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700,
            website: 'https://www.example.org/', regions: ['region']
        });

        dbDsl.createCommitment('3', {
            adminId: '3', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700,
            website: 'https://www.example.org/', regions: ['region']
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Watching the first commitment creates one time first commitment notification', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/commitment/watch/1');
        res.status.should.equal(200);
        res.body.oneTimeNotificationCreated.should.equals(true);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime {type: 'oneTimeWatchingFirstCommitment'})`)
            .return('notification')
            .end().send();
        notification.length.should.equals(1);
        should.exist(notification[0].notification.notificationId);
        notification[0].notification.created.should.least(startTime);
    });

    it('Watching the first commitment with existing first commitment notification does not generate new notification', async function () {
        dbDsl.notificationOneTimeWatchFirstCommitment('10', {userId: '1', created: 500});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/commitment/watch/1');
        res.status.should.equal(200);
        res.body.oneTimeNotificationCreated.should.equals(false);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime {type: 'oneTimeWatchingFirstCommitment'})`)
            .return('notification')
            .end().send();
        notification.length.should.equals(1);
        notification[0].notification.notificationId.should.equals('10');
        notification[0].notification.created.should.equals(500);
    });

    it('Watching second commitment generates no one time first commitment notification', async function () {
        dbDsl.watchCommitment({commitmentId: '2', userId: '1'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/commitment/watch/1');
        res.status.should.equal(200);
        res.body.oneTimeNotificationCreated.should.equals(false);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime {type: 'oneTimeWatchingFirstCommitment'})`)
            .return('notification')
            .end().send();
        notification.length.should.equals(0);
    });

    it('Watching third commitment generates create commitment challenge', async function () {
        dbDsl.watchCommitment({commitmentId: '2', userId: '1'});
        dbDsl.watchCommitment({commitmentId: '3', userId: '1'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/commitment/watch/1');
        res.status.should.equal(200);
        res.body.oneTimeNotificationCreated.should.equals(true);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime {type: 'oneTimeChallengeCreateCommitment'})`)
            .return('notification')
            .end().send();
        notification.length.should.equals(1);
        should.exist(notification[0].notification.notificationId);
        notification[0].notification.created.should.least(startTime);
    });

    it('Watching third commitment with existing create commitment challenge generates no challenge', async function () {
        dbDsl.watchCommitment({commitmentId: '2', userId: '1'});
        dbDsl.watchCommitment({commitmentId: '3', userId: '1'});
        dbDsl.notificationOneTimeChallengeCreateCommitment('10', {userId: '1', created: 500});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/commitment/watch/1');
        res.status.should.equal(200);
        res.body.oneTimeNotificationCreated.should.equals(false);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime {type: 'oneTimeChallengeCreateCommitment'})`)
            .return('notification')
            .end().send();
        notification.length.should.equals(1);
        notification[0].notification.type.should.equals('oneTimeChallengeCreateCommitment');
        notification[0].notification.notificationId.should.equals('10');
        notification[0].notification.created.should.equals(500);
    });

    it('When user has already created commitment, no create commitment challenge is generated', async function () {
        dbDsl.watchCommitment({commitmentId: '2', userId: '1'});
        dbDsl.watchCommitment({commitmentId: '3', userId: '1'});
        dbDsl.createCommitment('4', {
            adminId: '1', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700,
            website: 'https://www.example.org/', regions: ['region']
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/commitment/watch/1');
        res.status.should.equal(200);
        res.body.oneTimeNotificationCreated.should.equals(false);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime {type: 'oneTimeChallengeCreateCommitment'})`)
            .return('notification')
            .end().send();
        notification.length.should.equals(0);
    });

    it('Create challenge complete notification', async function () {
        dbDsl.notificationOneTimeUpVoteFirstAnswer('10', {userId: '1', created: 500});
        dbDsl.notificationOneTimeWatchFirstQuestion('11', {userId: '1', created: 501});
        dbDsl.notificationOneTimeFirstTrustCircleUser('13', {userId: '1', created: 503});
        dbDsl.notificationOneTimeFirstAnswer('14', {userId: '1', created: 504});
        dbDsl.notificationOneTimeFirstQuestion('15', {userId: '1', created: 505});
        dbDsl.notificationOneTimeFirstCommitment('16', {userId: '1', created: 506});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/commitment/watch/1');
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
        dbDsl.notificationOneTimeUpVoteFirstAnswer('10', {userId: '1', created: 500});
        dbDsl.notificationOneTimeWatchFirstQuestion('11', {userId: '1', created: 501});
        dbDsl.notificationOneTimeFirstTrustCircleUser('13', {userId: '1', created: 503});
        dbDsl.notificationOneTimeFirstAnswer('14', {userId: '1', created: 504});
        dbDsl.notificationOneTimeFirstQuestion('15', {userId: '1', created: 505});
        dbDsl.notificationOneTimeFirstCommitment('16', {userId: '1', created: 506});
        dbDsl.notificationOneTimeChallengeComplete('20', {userId: '1', created: 666});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/commitment/watch/1');
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
