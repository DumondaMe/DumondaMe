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

        dbDsl.createRegion('international', {de: 'InternationalDe', en: 'InternationalEn'});
        dbDsl.createRegion('ch', {parentRegionId: 'international', de:'chDe', en:'chEn'});
        dbDsl.createRegion('ch-fr', {parentRegionId: 'ch', de:'chFrDe', en:'chFrEn'});
        dbDsl.createRegion('ch-zg', {parentRegionId: 'ch', de:'chZgDe', en:'chZgEn'});
        dbDsl.createRegion('ch-zh', {parentRegionId: 'ch', de:'chZhDe', en:'chZhEn'});
        dbDsl.createRegion('ch-zh-1', {parentRegionId: 'ch-zh', de:'chZh1De', en:'chZh1En'});
        dbDsl.createRegion('ch-zh-2', {parentRegionId: 'ch-zh', de:'chZh2De', en:'chZh2En'});
        dbDsl.createRegion('de', {parentRegionId: 'international', de:'deDe', en:'deEn'});
        dbDsl.createRegion('de-by', {parentRegionId: 'de', de:'deByDe', en:'deByEn'});
        dbDsl.createRegion('de-bw', {parentRegionId: 'de', de:'deBwDe', en:'deBwEn'});
        await dbDsl.sendToDb();
    });

    afterEach(function () {
        sandbox.restore();
        return requestHandler.logout();
    });

    it('Get regions in german', async function () {
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/region', {language: 'de'});
        res.status.should.equal(200);
        res.body.regions.length.should.equals(3);
        res.body.regions[0].id.should.equals('international');
        res.body.regions[0].description.should.equals('InternationalDe');
        res.body.regions[0].subItems.length.should.equals(0);

        res.body.regions[1].id.should.equals('ch');
        res.body.regions[1].description.should.equals('chDe');
        res.body.regions[1].subItems.length.should.equals(3);
        res.body.regions[1].subItems[0].id.should.equals('ch-fr');
        res.body.regions[1].subItems[0].description.should.equals('chFrDe');
        res.body.regions[1].subItems[0].subItems.length.should.equals(0);
        res.body.regions[1].subItems[1].id.should.equals('ch-zg');
        res.body.regions[1].subItems[1].description.should.equals('chZgDe');
        res.body.regions[1].subItems[1].subItems.length.should.equals(0);
        res.body.regions[1].subItems[2].id.should.equals('ch-zh');
        res.body.regions[1].subItems[2].description.should.equals('chZhDe');
        res.body.regions[1].subItems[2].subItems.length.should.equals(2);
        res.body.regions[1].subItems[2].subItems[0].id.should.equals('ch-zh-1');
        res.body.regions[1].subItems[2].subItems[0].description.should.equals('chZh1De');
        res.body.regions[1].subItems[2].subItems[1].id.should.equals('ch-zh-2');
        res.body.regions[1].subItems[2].subItems[1].description.should.equals('chZh2De');

        res.body.regions[2].id.should.equals('de');
        res.body.regions[2].description.should.equals('deDe');
        res.body.regions[2].subItems.length.should.equals(2);
        res.body.regions[2].subItems[0].id.should.equals('de-bw');
        res.body.regions[2].subItems[0].description.should.equals('deBwDe');
        res.body.regions[2].subItems[0].subItems.length.should.equals(0);
        res.body.regions[2].subItems[1].id.should.equals('de-by');
        res.body.regions[2].subItems[1].description.should.equals('deByDe');
        res.body.regions[2].subItems[1].subItems.length.should.equals(0);
    });

    it('Get regions in english', async function () {
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/region', {language: 'en'});
        res.status.should.equal(200);
        res.body.regions.length.should.equals(3);
        res.body.regions[0].id.should.equals('international');
        res.body.regions[0].description.should.equals('InternationalEn');
        res.body.regions[0].subItems.length.should.equals(0);

        res.body.regions[1].id.should.equals('ch');
        res.body.regions[1].description.should.equals('chEn');
        res.body.regions[1].subItems.length.should.equals(3);
        res.body.regions[1].subItems[0].id.should.equals('ch-fr');
        res.body.regions[1].subItems[0].description.should.equals('chFrEn');
        res.body.regions[1].subItems[0].subItems.length.should.equals(0);
        res.body.regions[1].subItems[1].id.should.equals('ch-zg');
        res.body.regions[1].subItems[1].description.should.equals('chZgEn');
        res.body.regions[1].subItems[1].subItems.length.should.equals(0);
        res.body.regions[1].subItems[2].id.should.equals('ch-zh');
        res.body.regions[1].subItems[2].description.should.equals('chZhEn');
        res.body.regions[1].subItems[2].subItems.length.should.equals(2);
        res.body.regions[1].subItems[2].subItems[0].id.should.equals('ch-zh-1');
        res.body.regions[1].subItems[2].subItems[0].description.should.equals('chZh1En');
        res.body.regions[1].subItems[2].subItems[1].id.should.equals('ch-zh-2');
        res.body.regions[1].subItems[2].subItems[1].description.should.equals('chZh2En');

        res.body.regions[2].id.should.equals('de');
        res.body.regions[2].description.should.equals('deEn');
        res.body.regions[2].subItems.length.should.equals(2);
        res.body.regions[2].subItems[0].id.should.equals('de-bw');
        res.body.regions[2].subItems[0].description.should.equals('deBwEn');
        res.body.regions[2].subItems[0].subItems.length.should.equals(0);
        res.body.regions[2].subItems[1].id.should.equals('de-by');
        res.body.regions[2].subItems[1].description.should.equals('deByEn');
        res.body.regions[2].subItems[1].subItems.length.should.equals(0);
    });
});
