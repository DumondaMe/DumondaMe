'use strict';

const users = require('dumonda-me-server-test-util').user;
const db = require('dumonda-me-server-test-util').db;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const moment = require('moment');

describe('Handling watch commitment requests from a user', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(4);
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

    it('User request to watch commitment', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/commitment/watch/1');
        res.status.should.equal(200);

        let resp = await db.cypher().match("(c:Commitment)<-[w:WATCH]-(u:User)").return(`c, u, w`).end().send();
        resp.length.should.equals(1);
        resp[0].c.commitmentId.should.equals('1');
        resp[0].u.userId.should.equals('1');
        resp[0].w.created.should.least(startTime);
    });

    it('User request to watch commitment as admin is not allowed', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/commitment/watch/2');
        res.status.should.equal(400);

        let resp = await db.cypher().match("(c:Commitment)<-[:WATCH]-(u:User)").return(`c, u`).end().send();
        resp.length.should.equals(0);

        resp = await db.cypher().match("(n:Notification)").return(`n`).end().send();
        resp.length.should.equals(0);
    });

    it('User request to unwatch commitment with read notification', async function () {
        dbDsl.userWatchesCommitment('50', {
            commitmentId: '1', read: true,
            created: 678, watchingUsers: [{userId: '1', created: 555}]
        });
        dbDsl.watchCommitment({commitmentId: '1', userId: '1'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/commitment/watch', {commitmentId: '1'});
        res.status.should.equal(200);

        let resp = await db.cypher().match("(c:Commitment)<-[:WATCH]-(u:User)").return(`c, u`).end().send();
        resp.length.should.equals(0);
    });

    it('User request to unwatch commitment when notification with only one user watching', async function () {
        dbDsl.watchCommitment({commitmentId: '1', userId: '1'});
        dbDsl.userWatchesCommitment('50', {
            commitmentId: '1',
            created: 678, watchingUsers: [{userId: '1', created: 555}]
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/commitment/watch', {commitmentId: '1'});
        res.status.should.equal(200);

        let resp = await db.cypher().match("(c:Commitment)<-[:WATCH]-(u:User)").return(`c, u`).end().send();
        resp.length.should.equals(0);

        resp = await db.cypher().match("(n:Notification)").return(`n`).end().send();
        resp.length.should.equals(0);
    });

    it('User request to unwatch commitment when notification with multiple user watching', async function () {
        dbDsl.watchCommitment({commitmentId: '1', userId: '1'});
        dbDsl.userWatchesCommitment('50', {
            commitmentId: '1',
            created: 678, watchingUsers: [{userId: '1', created: 555}, {userId: '3', created: 666}]
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/commitment/watch', {commitmentId: '1'});
        res.status.should.equal(200);

        let resp = await db.cypher().match("(c:Commitment)<-[:WATCH]-(u:User)").return(`c, u`).end().send();
        resp.length.should.equals(0);

        resp = await db.cypher().match("(n:Notification)").return(`n`).end().send();
        resp.length.should.equals(1);
    });

    it('User request to unwatch commitment do not delete other notifications', async function () {
        dbDsl.watchCommitment({commitmentId: '1', userId: '1'});
        dbDsl.userWatchesCommitment('50', {
            commitmentId: '1',
            created: 678, watchingUsers: [{userId: '1', created: 555}, {userId: '3', created: 666}]
        });
        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});

        dbDsl.createQuestion('1', {
            creatorId: '3', question: 'Das ist eine Frage', description: 'Test dumonda.me change the world1',
            topics: ['topic1'], language: 'de', created: 500, modified: 700
        });
        dbDsl.notificationShowQuestionOnCommitmentRequest('51', {questionId: '1', commitmentId: '1', adminId: '2',
            created: 777});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/commitment/watch', {commitmentId: '1'});
        res.status.should.equal(200);

        let resp = await db.cypher().match("(c:Commitment)<-[:WATCH]-(u:User)").return(`c, u`).end().send();
        resp.length.should.equals(0);

        resp = await db.cypher().match("(n:Notification)").return(`n`).end().send();
        resp.length.should.equals(2);
    });

    it('Only logged in user can watch commitment', async function () {
        await dbDsl.sendToDb();
        let res = await requestHandler.put('/api/user/commitment/watch/1');
        res.status.should.equal(401);
    });
});
