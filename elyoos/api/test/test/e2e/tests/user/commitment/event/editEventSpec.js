'use strict';

const users = require('elyoos-server-test-util').user;
const db = require('elyoos-server-test-util').db;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const requestHandler = require('elyoos-server-test-util').requestHandler;
const moment = require('moment');
const should = require('chai').should();

describe('Edit an event of an commitment', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(3);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createRegion('international', {});
        dbDsl.createRegion('region-1', {upperRegionLayerCode: 'international'});
        dbDsl.createRegion('region-2', {upperRegionLayerCode: 'international'});
        dbDsl.createRegion('region-2-1', {upperRegionLayerCode: 'region-2'});

        dbDsl.createCommitment('1', {
            adminId: '1', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700,
            website: 'https://www.example.org/', regions: ['region-1']
        });
        dbDsl.createCommitment('2', {
            adminId: '2', topics: ['Environmental', 'Economy'], language: 'de', created: 701,
            website: 'https://www.example2.org/', regions: ['region-2-1']
        });

        dbDsl.createCommitmentEvent({commitmentId: '1', eventId: '22', created: 666,
            startDate: startTime - 100, endDate: startTime + 200, region: 'region-2'});

        dbDsl.createCommitmentEvent({commitmentId: '2', eventId: '23', created: 777,
            startDate: startTime - 101, endDate: startTime + 201, region: 'region-2-1'});
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Edit an event (mandatory properties)', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/commitment/event', {
            eventId: '22',
            title: 'Event Example',
            location: 'Some where',
            region: 'region-2-1',
            startDate: startTime + 200,
            endDate: startTime + 300
        });
        res.status.should.equal(200);

        let resp = await db.cypher()
            .match(`(event:Event {eventId: '22'})-[:BELONGS_TO_REGION]->(region:Region)`)
            .return(`event, region.code AS region`).end().send();
        resp.length.should.equals(1);
        resp[0].event.title.should.equals('Event Example');
        resp[0].event.location.should.equals('Some where');
        resp[0].event.created.should.equals(666);
        resp[0].event.modified.should.least(startTime);
        resp[0].event.startDate.should.equals(startTime + 200);
        resp[0].event.endDate.should.equals(startTime + 300);
        resp[0].region.should.equals('region-2-1');
        should.not.exist(resp[0].event.description);
        should.not.exist(resp[0].event.linkDescription);
    });

    it('Edit an event (all properties)', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/commitment/event', {
            eventId: '22',
            title: 'Event Example',
            description: 'Event Example Description',
            location: 'Some where',
            region: 'region-2-1',
            startDate: startTime + 200,
            endDate: startTime + 300,
            linkDescription: 'https://www.example.org/description/link',
        });
        res.status.should.equal(200);

        let resp = await db.cypher()
            .match(`(event:Event {eventId: '22'})-[:BELONGS_TO_REGION]->(region:Region)`)
            .return(`event, region.code AS region`).end().send();
        resp.length.should.equals(1);
        resp[0].event.title.should.equals('Event Example');
        resp[0].event.description.should.equals('Event Example Description');
        resp[0].event.location.should.equals('Some where');
        resp[0].event.created.should.equals(666);
        resp[0].event.modified.should.least(startTime);
        resp[0].event.startDate.should.equals(startTime + 200);
        resp[0].event.endDate.should.equals(startTime + 300);
        resp[0].event.linkDescription.should.equals('https://www.example.org/description/link');
        resp[0].region.should.equals('region-2-1');
    });

    it('Not existing region', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/commitment/event', {
            eventId: '22',
            title: 'Event Example',
            description: 'Event Example Description',
            location: 'Some where',
            region: 'region-2-2-2',
            startDate: startTime + 200,
            endDate: startTime + 300,
            linkDescription: 'https://www.example.org/description/link',
        });
        res.status.should.equal(401);
    });

    it('Not administrator of event', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/commitment/event', {
            eventId: '23',
            title: 'Event Example',
            description: 'Event Example Description',
            location: 'Some where',
            region: 'region-2-1',
            startDate: startTime + 200,
            endDate: startTime + 300,
            linkDescription: 'https://www.example.org/description/link',
        });
        res.status.should.equal(400);
    });

    it('Not logged in user', async function () {
        await dbDsl.sendToDb();
        let res = await requestHandler.put('/api/user/commitment/event', {
            eventId: '22',
            title: 'Event Example',
            description: 'Event Example Description',
            location: 'Some where',
            region: 'region-2-1',
            startDate: startTime + 200,
            endDate: startTime + 300,
            linkDescription: 'https://www.example.org/description/link',
        });
        res.status.should.equal(401);
    });
});
