'use strict';

const users = require('elyoos-server-test-util').user;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const db = require('elyoos-server-test-util').db;
const requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for edit a region', function () {

    beforeEach(async function () {
        await dbDsl.init(4, true);
        dbDsl.createRegion('international', {de: 'DeRegion1', en: 'EnRegion1'});
        dbDsl.createRegion('11', {parentRegionId: 'international', de: 'Schweiz', en: 'Switzerland'});
        dbDsl.createRegion('111', {parentRegionId: '11', de: 'Bern', en: 'Bern'});
        dbDsl.createRegion('112', {parentRegionId: '11', de: 'Luzern', en: 'Lucern'});
        dbDsl.createRegion('12', {parentRegionId: 'international', de: 'Deutschland', en: 'Germany'});
        await dbDsl.sendToDb();
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Change region data', async function () {

        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/regions', {
            parentRegionId: 'international', regionId: '11', de: 'Schweiz2', en: 'Switzerland2'
        });
        res.status.should.equal(200);

        let regions = await db.cypher()
            .match(`(region:Region {regionId: '11'})<-[:SUB_REGION]-(:Region {regionId: 'international'})`)
            .return(`region`)
            .end().send();

        regions.length.should.equals(1);
        regions[0].region.de.should.equals('Schweiz2');
        regions[0].region.en.should.equals('Switzerland2');
    });

    it('Move region to other parent region', async function () {

        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/regions', {
            parentRegionId: '11', regionId: '12', de: 'Deutschland2', en: 'Germany2'
        });
        res.status.should.equal(200);

        let regions = await db.cypher()
            .match(`(region:Region {regionId: '12'})<-[:SUB_REGION]-(:Region {regionId: '11'})`)
            .return(`region`)
            .end().send();

        regions.length.should.equals(1);
        regions[0].region.de.should.equals('Deutschland2');
        regions[0].region.en.should.equals('Germany2');
    });

    it('Error when parent region not exists', async function () {

        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/regions', {
            parentRegionId: '1', regionId: '11', de: 'Schweiz', en: 'Switzerland'
        });
        res.status.should.equal(400);
    });

    it('Error when region not exists', async function () {

        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/regions', {
            parentRegionId: 'international', regionId: '888', de: 'Schweiz', en: 'Switzerland'
        });
        res.status.should.equal(400);
    });
});
