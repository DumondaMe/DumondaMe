'use strict';

const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;

describe('Privacy setting for user autocomplete', function () {

    beforeEach(async function () {
        await dbDsl.init(2);
        dbDsl.createRegion('region-1', {de: 'Region1De', en: 'Region1En'});
        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});

        dbDsl.setUserName('2', {name: 'Hans Wurst'});

    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Do not show user name when privacy setting to publicEl and not logged in', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'publicEl'});
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        let res = await requestHandler.get('/api/search/autocomplete', {query: 'Hans Wurst'});
        res.status.should.equal(200);
        res.body.length.should.equals(0);
    });

    it('Do not show user name when privacy setting to onlyContact and not logged in', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'onlyContact'});
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        let res = await requestHandler.get('/api/search/autocomplete', {query: 'Hans Wurst'});
        res.status.should.equal(200);
        res.body.length.should.equals(0);
    });

    it('Show user name when privacy setting to public and not logged in', async function () {
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        let res = await requestHandler.get('/api/search/autocomplete', {query: 'Hans Wurst'});
        res.status.should.equal(200);
        res.body.length.should.equals(1);
        res.body[0].should.equals('Hans Wurst');
    });

    it('Show user name when privacy setting to public and logged in', async function () {
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/search/autocomplete', {query: 'Hans Wurst'});
        res.status.should.equal(200);
        res.body.length.should.equals(1);
        res.body[0].should.equals('Hans Wurst');
    });

    it('Show user name when privacy setting to publicEl and logged in', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'publicEl'});
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/search/autocomplete', {query: 'Hans Wurst'});
        res.status.should.equal(200);
        res.body.length.should.equals(1);
        res.body[0].should.equals('Hans Wurst');
    });

    it('Show user name when privacy setting to onlyContact and logged in', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'onlyContact'});
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/search/autocomplete', {query: 'Hans Wurst'});
        res.status.should.equal(200);
        res.body.length.should.equals(1);
        res.body[0].should.equals('Hans Wurst');
    });
});
