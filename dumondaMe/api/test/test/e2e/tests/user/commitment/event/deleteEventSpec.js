'use strict';

const users = require('elyoos-server-test-util').user;
const db = require('elyoos-server-test-util').db;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const requestHandler = require('elyoos-server-test-util').requestHandler;
const moment = require('moment');

describe('Delete an event of an commitment', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(3);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createRegion('international', {de: 'InternationalDe', en: 'InternationalEn'});
        dbDsl.createRegion('region-1', {parentRegionId: 'international', de: 'Region1De', en: 'Region1En'});
        dbDsl.createRegion('region-2', {parentRegionId: 'international', de: 'Region2De', en: 'Region2En'});
        dbDsl.createRegion('region-2-1', {parentRegionId: 'region-2', de: 'Region21De', en: 'Region21En'});

        dbDsl.createCommitment('1', {
            adminId: '1', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700,
            website: 'https://www.example.org/', regions: ['region-1']
        });
        dbDsl.createCommitment('2', {
            adminId: '2', topics: ['Environmental', 'Economy'], language: 'de', created: 701,
            website: 'https://www.example2.org/', regions: ['region-2-1']
        });

        dbDsl.createCommitmentEvent({commitmentId: '1', eventId: '22', created: 666,
            startDate: startTime - 100, endDate: startTime + 200, regionId: 'region-2'});

        dbDsl.createCommitmentEvent({commitmentId: '2', eventId: '23', created: 777,
            startDate: startTime - 101, endDate: startTime + 201, regionId: 'region-2-1'});
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Delete an event', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/commitment/event', {eventId: '22'});
        res.status.should.equal(200);

        let resp = await db.cypher()
            .match(`(event:Event {eventId: '22'})`)
            .return(`event`).end().send();
        resp.length.should.equals(0);
    });

    it('Not administrator of event', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/commitment/event', {
            eventId: '23',
        });
        res.status.should.equal(400);

        let resp = await db.cypher()
            .match(`(event:Event {eventId: '23'})`)
            .return(`event`).end().send();
        resp.length.should.equals(1);
    });

    it('Not logged in user', async function () {
        await dbDsl.sendToDb();
        let res = await requestHandler.del('/api/user/commitment/event', {eventId: '22'});
        res.status.should.equal(401);

        let resp = await db.cypher()
            .match(`(event:Event {eventId: '22'})`)
            .return(`event`).end().send();
        resp.length.should.equals(1);
    });
});
