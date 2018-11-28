'use strict';

let app = require('../../../../../../server');
let request = require('supertest');
let users = require('dumonda-me-server-test-util').user;
let requestHandler = require('dumonda-me-server-test-util').requestHandler;
let dbDsl = require('dumonda-me-server-test-util').dbDSL;

describe('Integration Tests Login', function () {

    beforeEach(async function () {
        await dbDsl.init(2);
        dbDsl.createRegion('international', {de: 'internationalDe', en: 'internationalEn'});
        dbDsl.createRegion('region-1', {parentRegionId: 'international', de: 'Region1De', en: 'Region1En'});
        dbDsl.createRegion('region-2', {parentRegionId: 'international', de: 'Region2De', en: 'Region2En'});
        dbDsl.createRegion('region-3', {parentRegionId: 'international', de: 'Region3De', en: 'Region3En'});

        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});
        dbDsl.createMainTopic({topicId: 'topic2', descriptionDe: 'topic2De', descriptionEn: 'topic2En'});
        dbDsl.createSubTopic({
            parentTopicId: 'topic2', topicId: 'topic21', descriptionDe: 'topic21De', descriptionEn: 'topic21En'
        });
        dbDsl.createSubTopic({
            parentTopicId: 'topic2', topicId: 'topic22', descriptionDe: 'topic22De', descriptionEn: 'topic22En'
        });

        dbDsl.interestedTopics('1', {topics: ['topic1', 'topic21']});
        dbDsl.interestedRegions('1', {regions: ['region-1', 'region-3']});
        dbDsl.setInfoState('1', {infoState: 1});
        dbDsl.setUserLanguages('1', {languages: ['en', 'de']});
        dbDsl.setInfoState('2', {infoState: 0});
        dbDsl.setUserLanguages('2', {languages: ['en']});
        await dbDsl.sendToDb();
    });

    it('Login - Return a 400 when invalid username', function (done) {
        request(app).post('/api/login').send(users.invalidUsername).expect(400).end(done);
    });
    it('Login - Return a 400 when invalid password', function (done) {
        request(app).post('/api/login').send(users.invalidPassword).expect(400).end(done);
    });

    it('Login - Return a 200', function (done) {
        request(app).post('/api/login').send(users.validUser).expect(200).end(done);
    });

    it('Login with capital letters- Return a 200', function (done) {
        request(app).post('/api/login').send(users.validUser3).expect(200).end(done);
    });

    it('Login and getting all optional user data', async function () {
        let res = await requestHandler.login(users.validUser);
        res.status.should.equal(200);
        res.body.lang.should.equals('de');
        res.body.languages.length.should.equals(2);
        res.body.languages.should.includes('de');
        res.body.languages.should.includes('en');
        res.body.topics.length.should.equals(2);
        res.body.topics.should.includes('topic1');
        res.body.topics.should.includes('topic21');
        res.body.regions.length.should.equals(2);
        res.body.regions.should.includes('region-1');
        res.body.regions.should.includes('region-3');
        res.body.infoState.should.equals(1);
    });

    it('Login and getting user data', async function () {
        let res = await requestHandler.login(users.validUser2);
        res.status.should.equal(200);
        res.body.lang.should.equals('de');
        res.body.languages.length.should.equals(1);
        res.body.languages.should.includes('en');
        res.body.infoState.should.equals(0);
        res.body.topics.length.should.equals(0);
        res.body.regions.length.should.equals(0);
    });

    it('Logout - Return a 200', function (done) {
        request(app).post('/api/logout').send({}).expect(200).end(done);
    });
});