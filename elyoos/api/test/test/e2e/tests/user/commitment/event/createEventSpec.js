'use strict';

const users = require('elyoos-server-test-util').user;
const db = require('elyoos-server-test-util').db;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const requestHandler = require('elyoos-server-test-util').requestHandler;
const moment = require('moment');
const should = require('chai').should();

describe('Create a new event for a commitment', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(3);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createRegion('international', {});
        dbDsl.createRegion('region-1', {upperRegionLayerCode: 'international'});
        dbDsl.createRegion('region-2', {upperRegionLayerCode: 'international'});
        dbDsl.createRegion('region-2-1', {upperRegionLayerCode: 'region-2'});
        dbDsl.createRegion('region-2-2', {upperRegionLayerCode: 'region-2'});

        dbDsl.createCommitment('1', {
            adminId: '1', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700,
            website: 'https://www.example.org/', regions: ['region-1']
        });
        dbDsl.createCommitment('2', {
            adminId: '2', topics: ['Environmental', 'Economy'], language: 'de', created: 701,
            website: 'https://www.example2.org/', regions: ['region-2-1']
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Create a new event (only mandatory properties)', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/commitment/event', {
            commitmentId: '1',
            title: 'Event Example',
            location: 'Some where',
            topics: ['Spiritual', 'Meditation'],
            region: 'region-2',
            startDate: startTime + 100,
            endDate: startTime + 200
        });
        res.status.should.equal(200);

        let resp = await db.cypher()
            .match(`(commitment:Commitment {commitmentId: '1'})-[:EVENT]->(event:Event)`)
            .optionalMatch(`(event)-[:BELONGS_TO_REGION]->(r:Region)`)
            .optionalMatch(`(event)<-[:TOPIC]-(t:Topic)`)
            .return(`event, collect(DISTINCT t.name) AS topics, collect(DISTINCT r.code) AS regions`).end().send();
        resp.length.should.equals(1);
        resp[0].event.title.should.equals('Event Example');
        resp[0].event.location.should.equals('Some where');
        resp[0].event.created.should.least(startTime);
        resp[0].event.startDate.should.equals(startTime + 100);
        resp[0].event.endDate.should.equals(startTime + 200);
        resp[0].regions.length.should.equals(1);
        resp[0].regions.should.include('region-2');
        resp[0].topics.length.should.equals(2);
        resp[0].topics.should.include('Spiritual');
        resp[0].topics.should.include('Meditation');
        should.not.exist(resp[0].event.description);
        should.not.exist(resp[0].event.linkDescription);
    });

    it('Create a new event (all properties)', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/commitment/event', {
            commitmentId: '1',
            title: 'Event Example',
            description: 'Event Example Description',
            location: 'Some where',
            topics: ['Meditation'],
            region: 'region-2',
            linkDescription: 'https://www.example.org/description/link',
            startDate: startTime + 100,
            endDate: startTime + 200
        });
        res.status.should.equal(200);

        let resp = await db.cypher()
            .match(`(commitment:Commitment {commitmentId: '1'})-[:EVENT]->(event:Event)`)
            .optionalMatch(`(event)-[:BELONGS_TO_REGION]->(r:Region)`)
            .optionalMatch(`(event)<-[:TOPIC]-(t:Topic)`)
            .return(`event, collect(DISTINCT t.name) AS topics, collect(DISTINCT r.code) AS regions`).end().send();
        resp.length.should.equals(1);
        resp[0].event.title.should.equals('Event Example');
        resp[0].event.description.should.equals('Event Example Description');
        resp[0].event.location.should.equals('Some where');
        resp[0].event.created.should.least(startTime);
        resp[0].event.startDate.should.equals(startTime + 100);
        resp[0].event.endDate.should.equals(startTime + 200);
        resp[0].regions.length.should.equals(1);
        resp[0].regions.should.include('region-2');
        resp[0].topics.length.should.equals(1);
        resp[0].topics.should.include('Meditation');
        resp[0].event.linkDescription.should.equals('https://www.example.org/description/link');
    });

    it('Not existing topic', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/commitment/event', {
            commitmentId: '1',
            title: 'Event Example',
            description: 'Event Example Description',
            location: 'Some where',
            topics: ['Not Existing'],
            region: 'region-2',
            linkDescription: 'https://www.example.org/description/link',
            startDate: startTime + 100,
            endDate: startTime + 200
        });
        res.status.should.equal(401);
    });

    it('Not existing region', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/commitment/event', {
            commitmentId: '1',
            title: 'Event Example',
            description: 'Event Example Description',
            location: 'Some where',
            topics: ['Meditation'],
            region: 'region-2-2-2',
            linkDescription: 'https://www.example.org/description/link',
            startDate: startTime + 100,
            endDate: startTime + 200
        });
        res.status.should.equal(401);
    });

    it('Not administrator of commitment', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/commitment/event', {
            commitmentId: '2',
            title: 'Event Example',
            description: 'Event Example Description',
            location: 'Some where',
            topics: ['Meditation'],
            region: 'region-2',
            linkDescription: 'https://www.example.org/description/link',
            startDate: startTime + 100,
            endDate: startTime + 200
        });
        res.status.should.equal(400);
    });

    it('Not logged in user', async function () {
        await dbDsl.sendToDb();
        let res = await requestHandler.post('/api/user/commitment/event', {
            commitmentId: '1',
            title: 'Event Example',
            description: 'Event Example Description',
            location: 'Some where',
            topics: ['Meditation'],
            region: 'region-2',
            linkDescription: 'https://www.example.org/description/link',
            startDate: startTime + 100,
            endDate: startTime + 200
        });
        res.status.should.equal(401);
    });
});
