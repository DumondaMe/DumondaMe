'use strict';

const users = require('dumonda-me-server-test-util').user;
const db = require('dumonda-me-server-test-util').db;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const should = require('chai').should();
const moment = require('moment');

describe('Create one time challenge when user has answered question', function () {

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

    it('First answer does create create commitment challenge', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/youtube/1', {
            link: 'https://www.youtube.com/watch?v=Lhku7ZBWEK8',
            title: 'titleYoutube', description: 'descriptionYoutube'
        });
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

    it('First answer with existing create commitment challenge does not create new challenge', async function () {
        dbDsl.notificationOneTimeChallengeCreateCommitment('10', {userId: '1', created: 500});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/youtube/1', {
            link: 'https://www.youtube.com/watch?v=Lhku7ZBWEK8',
            title: 'titleYoutube', description: 'descriptionYoutube'
        });
        res.status.should.equal(200);
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

    it('No create commitment challenge when user has already created a commitment', async function () {
        dbDsl.createRegion('region-1', {de: 'regionDe', en: 'regionEn'});
        dbDsl.createCommitment('100', {
            adminId: '1', topics: ['topic1'], language: 'de', created: 400, modified: 606, title: 'Test Commitment',
            website: 'https://www.example.org/', regions: ['region-1']
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/youtube/1', {
            link: 'https://www.youtube.com/watch?v=Lhku7ZBWEK8',
            title: 'titleYoutube', description: 'descriptionYoutube'
        });
        res.status.should.equal(200);
        res.body.oneTimeNotificationCreated.should.equals(false);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime)`)
            .return('notification')
            .end().send();
        notification.length.should.equals(0);
    });
});
