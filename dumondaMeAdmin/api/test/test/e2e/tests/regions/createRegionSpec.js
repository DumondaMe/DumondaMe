'use strict';

const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const db = require('dumonda-me-server-test-util').db;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;

describe('Integration Tests for creating new region', function () {

    beforeEach(async function () {
        await dbDsl.init(4, true);
        dbDsl.createRegion('international', {de: 'DeRegion1', en: 'EnRegion1'});
        await dbDsl.sendToDb();
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Create a new region', async function () {

        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/regions', {
            parentRegionId: 'international', de: 'Schweiz', en: 'Switzerland'
        });
        res.status.should.equal(200);

        let regions = await db.cypher().match(`(region:Region {regionId: {regionId}})<-[:SUB_REGION]-(:Region {regionId: 'international'})`)
            .return('region')
            .end({regionId: res.body.regionId}).send();

        regions.length.should.equals(1);
        regions[0].region.de.should.equals('Schweiz');
        regions[0].region.en.should.equals('Switzerland');
    });

    it('Error when parent region not exists', async function () {

        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/regions', {
            parentRegionId: '1', de: 'Schweiz', en: 'Switzerland'
        });
        res.status.should.equal(400);

        let regions = await db.cypher().match(`(region:Region)`)
            .return('region')
            .end({regionId: res.body.regionId}).send();

        regions.length.should.equals(1);
        regions[0].region.regionId.should.equals('international');
    });
});
