'use strict';

const users = require('elyoos-server-test-util').user;
const db = require('elyoos-server-test-util').db;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const requestHandler = require('elyoos-server-test-util').requestHandler;
const moment = require('moment');

describe('Delete a commitment', function () {

    let startTime;

    beforeEach(async function () {

        await dbDsl.init(3);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createRegion('international', {de: 'InternationalDe', en: 'InternationalEn'});
        dbDsl.createRegion('region-1', {parentRegionId: 'international', de: 'Region1De', en: 'Region1En'});
        dbDsl.createRegion('region-2', {parentRegionId: 'international', de: 'Region2De', en: 'Region2En'});

        dbDsl.createCommitment('1', {
            adminId: '1', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700,
            website: 'https://www.example.org/', regions: ['region-1']
        });
        dbDsl.createCommitment('2', {
            adminId: '2', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700,
            website: 'https://www.example.org/', regions: ['region-1']
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Delete commitment (no events)', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/commitment', {commitmentId: '1'});
        res.status.should.equal(200);

        let resp = await db.cypher().match("(commitment:Commitment {commitmentId :'1'})")
            .return(`commitment`).end().send();
        resp.length.should.equals(0);
    });

    it('Delete commitment (with events)', async function () {
        dbDsl.createCommitmentEvent({
            commitmentId: '1', eventId: '22', created: 777,
            startDate: startTime - 100, endDate: startTime + 200, regionId: 'region-1'
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/commitment', {commitmentId: '1'});
        res.status.should.equal(200);

        let resp = await db.cypher().match("(commitment:Commitment {commitmentId :'1'})")
            .return(`commitment`).end().send();
        resp.length.should.equals(0);

        resp = await db.cypher().match("(event:Event)")
            .return(`event`).end().send();
        resp.length.should.equals(0);
    });

    it('Only allowed to delete commitment where user is admin', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/commitment', {commitmentId: '2'});
        res.status.should.equal(400);
    });


    it('Only allowed to delete a commitment as logged in user', async function () {
        await dbDsl.sendToDb();
        let res = await requestHandler.del('/api/user/commitment', {commitmentId: '1'});
        res.status.should.equal(401);
    });
});
