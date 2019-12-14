'use strict';

const users = require('dumonda-me-server-test-util').user;
const db = require('dumonda-me-server-test-util').db;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const should = require('chai').should();
const moment = require('moment');

describe('Create a one time notification when user has created a question', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(5);
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});

        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine FragöÖÄäÜü', description: 'description', topics: ['topic1'],
            language: 'de'
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('First question does create first question notification', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question', {
            question: 'Das ist eine FragöÖÄäÜü', description: 'description', topics: ['topic1'], lang: 'de'
        });
        res.status.should.equal(200);
        res.body.oneTimeNotificationCreated.should.equals(true);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime {type: 'oneTimeFirstQuestion'})`)
            .return('notification').end().send();
        notification.length.should.equals(1);
        should.exist(notification[0].notification.notificationId);
        notification[0].notification.created.should.least(startTime);
    });

    it('Second question does not create first answer notification', async function () {
        dbDsl.createQuestion('2', {
            creatorId: '1', question: 'Das ist eine FragöÖÄäÜü', description: 'description', topics: ['topic1'],
            language: 'de'
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question', {
            question: 'Das ist eine FragöÖÄäÜü', description: 'description', topics: ['topic1'], lang: 'de'
        });
        res.status.should.equal(200);
        res.body.oneTimeNotificationCreated.should.equals(false);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime {type: 'oneTimeFirstQuestion'})`)
            .return('notification').end().send();
        notification.length.should.equals(0);
    });

    it('First question with existing first question notification does not create new notification', async function () {
        dbDsl.notificationOneTimeFirstQuestion('10', {userId: '1', created: 500});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question', {
            question: 'Das ist eine FragöÖÄäÜü', description: 'description', topics: ['topic1'], lang: 'de'
        });
        res.status.should.equal(200);
        res.body.oneTimeNotificationCreated.should.equals(false);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime)`)
            .return('notification').end().send();
        notification.length.should.equals(1);
        notification[0].notification.type.should.equals('oneTimeFirstQuestion');
        notification[0].notification.notificationId.should.equals('10');
        notification[0].notification.created.should.equals(500);
    });

    it('Create challenge complete notification', async function () {
        dbDsl.notificationOneTimeUpVoteFirstAnswer('10', {userId: '1', created: 500});
        dbDsl.notificationOneTimeWatchFirstQuestion('11', {userId: '1', created: 501});
        dbDsl.notificationOneTimeWatchFirstCommitment('12', {userId: '1', created: 502});
        dbDsl.notificationOneTimeFirstTrustCircleUser('13', {userId: '1', created: 503});
        dbDsl.notificationOneTimeFirstAnswer('14', {userId: '1', created: 504});
        dbDsl.notificationOneTimeFirstCommitment('16', {userId: '1', created: 506});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question', {
            question: 'Das ist eine FragöÖÄäÜü', description: 'description', topics: ['topic1'], lang: 'de'
        });
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
        dbDsl.notificationOneTimeWatchFirstCommitment('12', {userId: '1', created: 502});
        dbDsl.notificationOneTimeFirstTrustCircleUser('13', {userId: '1', created: 503});
        dbDsl.notificationOneTimeFirstAnswer('14', {userId: '1', created: 504});
        dbDsl.notificationOneTimeFirstCommitment('16', {userId: '1', created: 506});
        dbDsl.notificationOneTimeChallengeComplete('20', {userId: '1', created: 666});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question', {
            question: 'Das ist eine FragöÖÄäÜü', description: 'description', topics: ['topic1'], lang: 'de'
        });
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
