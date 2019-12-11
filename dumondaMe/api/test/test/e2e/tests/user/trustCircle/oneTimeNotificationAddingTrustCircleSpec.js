'use strict';

const users = require('dumonda-me-server-test-util').user;
const db = require('dumonda-me-server-test-util').db;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const moment = require('moment');
const should = require('chai').should();

describe('Create one time notifications when person is added to trust circle', function () {

    let startTime;

    beforeEach(async function () {

        startTime = Math.floor(moment.utc().valueOf() / 1000);
        await dbDsl.init(6);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Adding first person to trust circle generates one time notification', async function () {

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/trustCircle/5');
        res.status.should.equal(200);
        res.body.personOfTrustSince.should.least(startTime);
        res.body.oneTimeNotificationCreated.should.equals(true);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime {type: 'oneTimeFirstTrustCircleUser'})`)
            .return('notification')
            .end().send();
        notification.length.should.equals(1);
        should.exist(notification[0].notification.notificationId);
        notification[0].notification.created.should.least(startTime);
    });

    it('Adding second person to trust circle generates no one time notification', async function () {
        dbDsl.createContactConnection('1', '2');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/trustCircle/5');
        res.status.should.equal(200);
        res.body.personOfTrustSince.should.least(startTime);
        res.body.oneTimeNotificationCreated.should.equals(false);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime {type: 'oneTimeFirstTrustCircleUser'})`)
            .return('notification')
            .end().send();
        notification.length.should.equals(0);
    });

    it('Adding first person to trust circle with existing notification generates no one time notification', async function () {
        dbDsl.notificationOneTimeFirstTrustCircleUser('10', {userId: '1', created: 500});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/trustCircle/5');
        res.status.should.equal(200);
        res.body.personOfTrustSince.should.least(startTime);
        res.body.oneTimeNotificationCreated.should.equals(false);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime {type: 'oneTimeFirstTrustCircleUser'})`)
            .return('notification')
            .end().send();
        notification.length.should.equals(1);
        notification[0].notification.notificationId.should.equals('10');
        notification[0].notification.created.should.equals(500);
    });

    it('Adding third person to trust circle generates watch commitment challenge', async function () {
        dbDsl.createContactConnection('1', '2');
        dbDsl.createContactConnection('1', '3');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/trustCircle/5');
        res.status.should.equal(200);
        res.body.personOfTrustSince.should.least(startTime);
        res.body.oneTimeNotificationCreated.should.equals(true);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime {type: 'oneTimeChallengeWatchCommitment'})`)
            .return('notification')
            .end().send();
        notification.length.should.equals(1);
        should.exist(notification[0].notification.notificationId);
        notification[0].notification.created.should.least(startTime);
    });

    it('Adding forth person to trust circle generates no challenge', async function () {
        dbDsl.createContactConnection('1', '2');
        dbDsl.createContactConnection('1', '3');
        dbDsl.createContactConnection('1', '4');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/trustCircle/5');
        res.status.should.equal(200);
        res.body.personOfTrustSince.should.least(startTime);
        res.body.oneTimeNotificationCreated.should.equals(false);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime {type: 'oneTimeChallengeWatchCommitment'})`)
            .return('notification')
            .end().send();
        notification.length.should.equals(0);
    });

    it('Adding third person to trust circle with existing commitment challenge does not generates challenge', async function () {
        dbDsl.createContactConnection('1', '2');
        dbDsl.createContactConnection('1', '3');
        dbDsl.notificationOneTimeChallengeWatchCommitment('10', {userId: '1', created: 500});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/trustCircle/5');
        res.status.should.equal(200);
        res.body.personOfTrustSince.should.least(startTime);
        res.body.oneTimeNotificationCreated.should.equals(false);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime {type: 'oneTimeChallengeWatchCommitment'})`)
            .return('notification')
            .end().send();
        notification.length.should.equals(1);
        notification[0].notification.notificationId.should.equals('10');
        notification[0].notification.created.should.equals(500);
    });

    it('Adding third person to trust circle with existing first commitment watch does not generates challenge', async function () {
        dbDsl.createContactConnection('1', '2');
        dbDsl.createContactConnection('1', '3');
        dbDsl.notificationOneTimeWatchFirstCommitment('10', {userId: '1', created: 500});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/trustCircle/5');
        res.status.should.equal(200);
        res.body.personOfTrustSince.should.least(startTime);
        res.body.oneTimeNotificationCreated.should.equals(false);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime)`)
            .return('notification')
            .end().send();
        notification.length.should.equals(1);
        notification[0].notification.type.should.equals('oneTimeWatchingFirstCommitment');
        notification[0].notification.notificationId.should.equals('10');
        notification[0].notification.created.should.equals(500);
    });

    it('Adding fifth person to trust circle generates create commitment challenge', async function () {
        dbDsl.createContactConnection('1', '2');
        dbDsl.createContactConnection('1', '3');
        dbDsl.createContactConnection('1', '4');
        dbDsl.createContactConnection('1', '5');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/trustCircle/6');
        res.status.should.equal(200);
        res.body.personOfTrustSince.should.least(startTime);
        res.body.oneTimeNotificationCreated.should.equals(true);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime {type: 'oneTimeChallengeCreateCommitment'})`)
            .return('notification')
            .end().send();
        notification.length.should.equals(1);
        should.exist(notification[0].notification.notificationId);
        notification[0].notification.created.should.least(startTime);
    });

    it('Adding fifth person to trust circle with existing create commitment challenge generates no challenge', async function () {
        dbDsl.createContactConnection('1', '2');
        dbDsl.createContactConnection('1', '3');
        dbDsl.createContactConnection('1', '4');
        dbDsl.createContactConnection('1', '5');
        dbDsl.notificationOneTimeChallengeCreateCommitment('10', {userId: '1', created: 500});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/trustCircle/6');
        res.status.should.equal(200);
        res.body.personOfTrustSince.should.least(startTime);
        res.body.oneTimeNotificationCreated.should.equals(false);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime)`)
            .return('notification')
            .end().send();
        notification.length.should.equals(1);
        notification[0].notification.type.should.equals('oneTimeChallengeCreateCommitment');
        notification[0].notification.notificationId.should.equals('10');
        notification[0].notification.created.should.equals(500);
    });

    it('When user has already created commitment, no create commitment challenge is generated', async function () {
        dbDsl.createContactConnection('1', '2');
        dbDsl.createContactConnection('1', '3');
        dbDsl.createContactConnection('1', '4');
        dbDsl.createContactConnection('1', '5');

        dbDsl.createRegion('region-1', {de: 'regionDe', en: 'regionEn'});
        dbDsl.createCommitment('100', {
            adminId: '1', topics: ['topic1'], language: 'de', created: 400, modified: 606, title: 'Test Commitment',
            website: 'https://www.example.org/', regions: ['region-1']
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/trustCircle/6');
        res.status.should.equal(200);
        res.body.personOfTrustSince.should.least(startTime);
        res.body.oneTimeNotificationCreated.should.equals(false);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime {type: 'oneTimeChallengeCreateCommitment'})`)
            .return('notification')
            .end().send();
        notification.length.should.equals(0);
    });
});
