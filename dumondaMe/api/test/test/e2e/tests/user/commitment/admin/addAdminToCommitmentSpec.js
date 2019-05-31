'use strict';

const users = require('dumonda-me-server-test-util').user;
const db = require('dumonda-me-server-test-util').db;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const moment = require('moment');

describe('Add a admin to a commitment', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(5);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createRegion('international', {de: 'InternationalDe', en: 'InternationalEn'});
        dbDsl.createRegion('region-1', {parentRegionId: 'international', de: 'Region1De', en: 'Region1En'});

        dbDsl.createCommitment('1', {
            adminId: '1', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700,
            website: 'https://www.example.org/', regions: ['region-1']
        });
        dbDsl.createCommitment('2', {
            adminId: '2', topics: ['Environmental', 'Economy'], language: 'de', created: 701,
            website: 'https://www.example2.org/', regions: ['region-1']
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Send request to add a valid new admin to commitment', async function () {
        dbDsl.notificationRequestAdminOfCommitment('10',
            {commitmentId: '1', existingAdminId: '1', newAdminId: '4', created: 500, read: true});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/commitment/admin', {
            commitmentId: '1', userId: '4'
        });
        res.status.should.equal(200);

        let resp = await db.cypher()
            .match(`(commitment:Commitment {commitmentId: '1'})<-[:NOTIFICATION]-(n:Notification:Unread {type: 'requestAdminOfCommitment'})`)
            .where(`(n)-[:ORIGINATOR_OF_NOTIFICATION]->(:User {userId: '1'}) AND (n)-[:NOTIFIED]->(:User {userId: '4'})`)
            .return(`n`).end().send();
        resp.length.should.equals(1);
        resp[0].n.created.should.least(startTime);
    });

    it('Not allowed to add admin twice', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/commitment/admin', {
            commitmentId: '1', userId: '1'
        });
        res.status.should.equal(400);

        let resp = await db.cypher()
            .match(`(n:Notification:Unread {type: 'requestAdminOfCommitment'})`)
            .return(`n`).end().send();
        resp.length.should.equals(0);
    });

    it('Not allowed to add admin to commitment where user is not admin', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/commitment/admin', {
            commitmentId: '2', userId: '4'
        });
        res.status.should.equal(400);

        let resp = await db.cypher()
            .match(`(n:Notification:Unread {type: 'requestAdminOfCommitment'})`)
            .return(`n`).end().send();
        resp.length.should.equals(0);
    });

    it('Not allowed to add admin when accept request is pending', async function () {
        dbDsl.notificationRequestAdminOfCommitment('10',
            {commitmentId: '1', existingAdminId: '1', newAdminId: '4', created: 500});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/commitment/admin', {
            commitmentId: '1', userId: '4'
        });
        res.status.should.equal(400);

        let resp = await db.cypher()
            .match(`(n:Notification:Unread {type: 'requestAdminOfCommitment'})`)
            .return(`n`).end().send();
        resp.length.should.equals(1);
    });
});
