'use strict';

const dbDsl = require('elyoos-server-test-util').dbDSL;
const users = require('elyoos-server-test-util').user;
const requestHandler = require('elyoos-server-test-util').requestHandler;
const moment = require('moment');

describe('Get up coming events', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(11);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createRegion('international', {de: 'InternationalDe', en: 'InternationalEn'});
        dbDsl.createRegion('region-1', {parentRegionId: 'international', de: 'Region1De', en: 'Region1En'});
        dbDsl.createRegion('region-2', {parentRegionId: 'international', de: 'Region2De', en: 'Region2En'});
        dbDsl.createRegion('region-2-1', {parentRegionId: 'region-2', de: 'Region21De', en: 'Region21En'});

        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});
        dbDsl.createMainTopic({topicId: 'topic2', descriptionDe: 'topic2De', descriptionEn: 'topic2En'});
        dbDsl.createSubTopic({
            parentTopicId: 'topic2', topicId: 'topic21', descriptionDe: 'topic21De', descriptionEn: 'topic21En'
        });
        dbDsl.createSubTopic({
            parentTopicId: 'topic21', topicId: 'topic221', descriptionDe: 'topic221De', descriptionEn: 'topic221En'
        });
        dbDsl.createMainTopic({topicId: 'topic3', descriptionDe: 'topic3De', descriptionEn: 'topic3En'});

        dbDsl.createCommitment('100', {
            adminId: '2', topics: ['topic221'], language: 'de', created: 777, title: 'Test Commitment',
            modified: 606, website: 'https://www.example.org/', regions: ['region-2-1']
        });
        dbDsl.createCommitment('101', {
            adminId: '3', topics: ['topic1'], language: 'en', created: 666, title: 'Test Commitment2',
            modified: 607, website: 'https://www.example1.org/', regions: ['region-1']
        });

        dbDsl.createCommitmentEvent({
            commitmentId: '100', eventId: '22', created: 777,
            startDate: startTime - 100, endDate: startTime + 200, regionId: 'region-1'
        });
        dbDsl.createCommitmentEvent({
            commitmentId: '100', eventId: '23', created: 778,
            startDate: startTime - 200, endDate: startTime - 100, regionId: 'region-1'
        });

        dbDsl.createCommitmentEvent({
            commitmentId: '101', eventId: '24', created: 778,
            startDate: startTime - 101, endDate: startTime + 200, regionId: 'region-2-1'
        });
        dbDsl.createCommitmentEvent({
            commitmentId: '101', eventId: '25', created: 775,
            startDate: startTime - 200, endDate: startTime - 100, regionId: 'region-2-1'
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Show up coming events', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/event', {
            guiLanguage: 'de', languages: ['de', 'en']
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(2);

        res.body.feed[0].type.should.equals('Event');
        res.body.feed[0].commitmentId.should.equals('101');
        res.body.feed[0].commitmentTitle.should.equals('Test Commitment2');
        res.body.feed[0].commitmentDescription.should.equals('commitment101Description');
        res.body.feed[0].commitmentSlug.should.equals('test-commitment2');
        res.body.feed[0].commitmentImageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/101/40x40/title.jpg?v=607`);
        res.body.feed[0].commitmentImageUrlPreview.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/101/210x210/title.jpg?v=607`);
        res.body.feed[0].eventId.should.equals('24');
        res.body.feed[0].title.should.equals('event24Title');
        res.body.feed[0].description.should.equals('event24Description');
        res.body.feed[0].region.should.equals('Region21De');
        res.body.feed[0].location.should.equals('event24Location');
        res.body.feed[0].startDate.should.equals(startTime - 101);
        res.body.feed[0].endDate.should.equals(startTime + 200);

        res.body.feed[1].type.should.equals('Event');
        res.body.feed[1].commitmentId.should.equals('100');
        res.body.feed[1].commitmentTitle.should.equals('Test Commitment');
        res.body.feed[1].commitmentDescription.should.equals('commitment100Description');
        res.body.feed[1].commitmentSlug.should.equals('test-commitment');
        res.body.feed[1].commitmentImageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/100/40x40/title.jpg?v=606`);
        res.body.feed[1].commitmentImageUrlPreview.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/100/210x210/title.jpg?v=606`);
        res.body.feed[1].eventId.should.equals('22');
        res.body.feed[1].title.should.equals('event22Title');
        res.body.feed[1].description.should.equals('event22Description');
        res.body.feed[1].region.should.equals('Region1De');
        res.body.feed[1].location.should.equals('event22Location');
        res.body.feed[1].startDate.should.equals(startTime - 100);
        res.body.feed[1].endDate.should.equals(startTime + 200);
    });

    it('Show up coming events (interested only)', async function () {
        dbDsl.watchCommitment({commitmentId: '100', userId: '1'});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/event', {
            guiLanguage: 'de', languages: ['de', 'en'], interestedOnly: true
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Event');
        res.body.feed[0].commitmentId.should.equals('100');
    });

    it('Show up coming events (topic filter)', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/event', {
            guiLanguage: 'de', languages: ['de', 'en'], topics: ['topic1']
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Event');
        res.body.feed[0].commitmentId.should.equals('101');
    });

    it('Show up coming events (topic sub filter)', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/event', {
            guiLanguage: 'de', languages: ['de', 'en'], topics: ['topic2']
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Event');
        res.body.feed[0].commitmentId.should.equals('100');
    });

    it('Show up coming events (region filter)', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/event', {
            guiLanguage: 'de', languages: ['de', 'en'], regions: ['region-1']
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Event');
        res.body.feed[0].commitmentId.should.equals('100');
    });

    it('Show up coming events (region sub filter)', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/event', {
            guiLanguage: 'de', languages: ['de', 'en'], regions: ['region-2']
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Event');
        res.body.feed[0].commitmentId.should.equals('101');
    });
});
