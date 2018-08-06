'use strict';

const users = require('elyoos-server-test-util').user;
const db = require('elyoos-server-test-util').db;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const requestHandler = require('elyoos-server-test-util').requestHandler;
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
    });

    it('User request to unwatch commitment', async function () {
        dbDsl.watchCommitment({commitmentId: '1', userId: '1'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/commitment/watch', {commitmentId: '1'});
        res.status.should.equal(200);

        let resp = await db.cypher().match("(c:Commitment)<-[:WATCH]-(u:User)").return(`c, u`).end().send();
        resp.length.should.equals(0);
    });

    it('Only logged in user can watch commitment', async function () {
        await dbDsl.sendToDb();
        let res = await requestHandler.put('/api/user/commitment/watch/1');
        res.status.should.equal(401);
    });
});
