'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');

describe('Get commitment feed', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(3);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createRegion('region-1', {name: 'region1'});
        dbDsl.createRegion('region-2', {name: 'region2'});
        dbDsl.createRegion('region-1-1', {name: 'region11', upperRegionLayerCode: 'region-1'});
        dbDsl.createRegion('region-1-2', {name: 'region12', upperRegionLayerCode: 'region-1'});
        dbDsl.createRegion('region-1-1-1', {name: 'region111', upperRegionLayerCode: 'region-1-1'});
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get commitment feed (only regional)', async function () {

        dbDsl.createCommitment('1', {
            adminId: '2', topics: ['Spiritual', 'Education'], language: 'de', created: 700, title: 'Test Commitment',
            website: 'https://www.example.org/', region: 'region-1-1-1'
        });
        dbDsl.createCommitment('2', {
            adminId: '3', topics: ['Health'], language: 'de', created: 600, website: 'https://www.example2.org/',
            region: 'region-1-1'
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/feed/commitment', {region: 'region-1-1-1'});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.commitments.length.should.equals(1);
        res.body.commitments[0].answerId.should.equals('1');
        res.body.commitments[0].title.should.equals('Test Commitment');
        res.body.commitments[0].slug.should.equals('test-commitment');
        res.body.commitments[0].description.should.equals('commitment1Description');
        res.body.commitments[0].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/1/120x120/title.jpg`);
        res.body.commitments[0].created.should.equals(700);
        res.body.commitments[0].topics.length.should.equals(2);
        res.body.commitments[0].topics.should.include('Spiritual');
        res.body.commitments[0].topics.should.include('Education');
    });

    it('Get commitment feed when not logged in', async function () {

        dbDsl.createCommitment('1', {
            adminId: '2', topics: ['Spiritual', 'Education'], language: 'de', created: 700, title: 'Test Commitment',
            website: 'https://www.example.org/', region: 'region-1-1-1'
        });
        dbDsl.createCommitment('2', {
            adminId: '3', topics: ['Health'], language: 'de', created: 600, website: 'https://www.example2.org/',
            region: 'region-1-1'
        });
        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/feed/commitment', {region: 'region-1-1-1'});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.commitments.length.should.equals(1);
        res.body.commitments[0].answerId.should.equals('1');
    });
});
