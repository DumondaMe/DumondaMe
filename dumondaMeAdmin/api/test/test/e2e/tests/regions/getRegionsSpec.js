'use strict';

const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;

describe('Integration Tests to get regions', function () {

    beforeEach(async function () {
        await dbDsl.init(4, true);
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Get all regions for a parent region', async function () {

        dbDsl.createRegion('international', {de: 'DeRegion1', en: 'EnRegion1'});
        dbDsl.createRegion('11', {parentRegionId: 'international', de: 'Schweiz', en: 'Switzerland'});
        dbDsl.createRegion('111', {parentRegionId: '11', de: 'Bern', en: 'Bern'});
        dbDsl.createRegion('112', {parentRegionId: '11', de: 'Luzern', en: 'Lucern'});
        dbDsl.createRegion('12', {parentRegionId: 'international', de: 'Deutschland', en: 'Germany'});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/regions', {language: 'de', parentRegionId: 'international'});
        res.status.should.equal(200);

        res.body.regions.length.should.equals(2);
        res.body.regions[0].regionId.should.equals('12');
        res.body.regions[0].parentRegionId.should.equals('international');
        res.body.regions[0].de.should.equals('Deutschland');
        res.body.regions[0].en.should.equals('Germany');
        res.body.regions[0].numberOfSubRegions.should.equals(0);

        res.body.regions[1].regionId.should.equals('11');
        res.body.regions[1].parentRegionId.should.equals('international');
        res.body.regions[1].de.should.equals('Schweiz');
        res.body.regions[1].en.should.equals('Switzerland');
        res.body.regions[1].numberOfSubRegions.should.equals(2);
    });
});
