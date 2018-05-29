'use strict';

const users = require('elyoos-server-test-util').user;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const requestHandler = require('elyoos-server-test-util').requestHandler;
const moment = require('moment');

describe('Get events of a commitment', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(8);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createRegion('region-1', {});
        dbDsl.createRegion('region-2', {});
        dbDsl.createRegion('region-1-1', {upperRegionLayerCode: 'region-1'});
        dbDsl.createRegion('region-1-2', {upperRegionLayerCode: 'region-1'});

        dbDsl.createCommitment('1', {
            adminId: '1', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700, modified: 701,
            website: 'https://www.example.org/', regions: ['region-1-1', 'region-1-2']
        });

        dbDsl.createCommitmentEvent({
            commitmentId: '1', eventId: '22',
            startDate: startTime - 100, endDate: startTime + 200, region: 'region-2'
        });

        dbDsl.createCommitmentEvent({
            commitmentId: '1', eventId: '23',
            startDate: startTime - 300, endDate: startTime - 200, region: 'region-2'
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting upcoming events', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/commitment/event', {commitmentId: '1', upComing: true, page: 0});
        res.status.should.equal(200);

        res.body.totalNumberOfEvents.should.equals(1);
        res.body.events.length.should.equals(1);
        res.body.events[0].eventId.should.equals('22');
        res.body.events[0].title.should.equals('event22Title');
        res.body.events[0].description.should.equals('event22Description');
        res.body.events[0].startDate.should.equals(startTime - 100);
        res.body.events[0].endDate.should.equals(startTime + 200);
        res.body.events[0].region.should.equals('region-2');
        res.body.events[0].location.should.equals('event22Location');
    });

    it('Getting past events', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/commitment/event', {commitmentId: '1', upComing: false, page: 0});
        res.status.should.equal(200);

        res.body.totalNumberOfEvents.should.equals(1);
        res.body.events.length.should.equals(1);
        res.body.events[0].eventId.should.equals('23');
        res.body.events[0].title.should.equals('event23Title');
        res.body.events[0].description.should.equals('event23Description');
        res.body.events[0].startDate.should.equals(startTime - 300);
        res.body.events[0].endDate.should.equals(startTime - 200);
        res.body.events[0].region.should.equals('region-2');
        res.body.events[0].location.should.equals('event23Location');
    });

    it('Counting of upcoming events', async function () {

        for (let index = 0; index < 10; index++) {
            dbDsl.createCommitmentEvent({
                commitmentId: '1', eventId: '22' + index,
                startDate: startTime - 100, endDate: startTime + 200, region: 'region-2'
            });
        }

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/commitment/event', {commitmentId: '1', upComing: true, page: 0});
        res.status.should.equal(200);

        res.body.totalNumberOfEvents.should.equals(11);
    });

    it('Get non existing commitment', async function () {
        let res = await requestHandler.get('/api/commitment', {commitmentId: '2'});
        res.status.should.equal(404);
    });

});
