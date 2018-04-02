'use strict';

const users = require('elyoos-server-test-util').user;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const requestHandler = require('elyoos-server-test-util').requestHandler;
const sinon = require('sinon');

describe('Get regions', function () {

    let sandbox;

    beforeEach(async function () {
        await dbDsl.init(3);
        sandbox = sinon.sandbox.create();

        dbDsl.createRegion('international', {});
        dbDsl.createRegion('ch', {upperRegionLayerCode: 'international'});
        dbDsl.createRegion('ch-fr', {upperRegionLayerCode: 'ch'});
        dbDsl.createRegion('ch-zg', {upperRegionLayerCode: 'ch'});
        dbDsl.createRegion('ch-zh', {upperRegionLayerCode: 'ch'});
        dbDsl.createRegion('ch-zh-1', {upperRegionLayerCode: 'ch-zh'});
        dbDsl.createRegion('ch-zh-2', {upperRegionLayerCode: 'ch-zh'});
        dbDsl.createRegion('de', {upperRegionLayerCode: 'international'});
        dbDsl.createRegion('de-by', {upperRegionLayerCode: 'de'});
        dbDsl.createRegion('de-bw', {upperRegionLayerCode: 'de'});
        await dbDsl.sendToDb();
    });

    afterEach(function () {
        sandbox.restore();
        return requestHandler.logout();
    });

    it('Get regions', async function () {
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/region');
        res.status.should.equal(200);
        res.body.regions.length.should.equals(3);
        res.body.regions[0].code.should.equals('international');
        res.body.regions[0].subRegions.length.should.equals(0);

        res.body.regions[1].code.should.equals('ch');
        res.body.regions[1].subRegions.length.should.equals(3);
        res.body.regions[1].subRegions[0].code.should.equals('ch-fr');
        res.body.regions[1].subRegions[0].subRegions.length.should.equals(0);
        res.body.regions[1].subRegions[1].code.should.equals('ch-zg');
        res.body.regions[1].subRegions[1].subRegions.length.should.equals(0);
        res.body.regions[1].subRegions[2].code.should.equals('ch-zh');
        res.body.regions[1].subRegions[2].subRegions.length.should.equals(2);
        res.body.regions[1].subRegions[2].subRegions[0].code.should.equals('ch-zh-1');
        res.body.regions[1].subRegions[2].subRegions[1].code.should.equals('ch-zh-2');

        res.body.regions[2].code.should.equals('de');
        res.body.regions[2].subRegions.length.should.equals(2);
        res.body.regions[2].subRegions[0].code.should.equals('de-bw');
        res.body.regions[2].subRegions[0].subRegions.length.should.equals(0);
        res.body.regions[2].subRegions[1].code.should.equals('de-by');
        res.body.regions[2].subRegions[1].subRegions.length.should.equals(0);
    });
});
