'use strict';

const dbDsl = require('elyoos-server-test-util').dbDSL;
const users = require('elyoos-server-test-util').user;
const requestHandler = require('elyoos-server-test-util').requestHandler;
const moment = require('moment');
const should = require('chai').should();

describe('Get activity feed for created events of a commitment', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(5);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createRegion('region-1', {de: 'regionDe', en: 'regionEn'});
        dbDsl.createRegion('region-2', {de: 'region2De', en: 'region2En'});
        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});
        dbDsl.createMainTopic({topicId: 'topic2', descriptionDe: 'topic2De', descriptionEn: 'topic2En'});
        dbDsl.createMainTopic({topicId: 'topic3', descriptionDe: 'topic3De', descriptionEn: 'topic3En'});

        dbDsl.createCommitment('100', {
            adminId: '2', topics: ['topic1', 'topic2'], language: 'de', created: 400, modified: 606,
            title: 'Test Commitment', website: 'https://www.example.org/', regions: ['region-1', 'region-2']
        });

        dbDsl.createCommitmentEvent({
            commitmentId: '100', eventId: '22', created: 777, modified: 999,
            startDate: startTime - 100, endDate: startTime + 200, regionId: 'region-1'
        });
        dbDsl.createCommitmentEvent({
            commitmentId: '100', eventId: '23', created: 778,
            startDate: startTime - 200, endDate: startTime - 100, regionId: 'region-1'
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Created commitment event', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity', {guiLanguage: 'de', languages: ['de']});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(2);

        res.body.feed[0].type.should.equals('Event');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].commitmentId.should.equals('100');
        res.body.feed[0].commitmentSlug.should.equals('test-commitment');
        res.body.feed[0].commitmentTitle.should.equals('Test Commitment');
        res.body.feed[0].commitmentDescription.should.equals('commitment100Description');
        res.body.feed[0].commitmentImageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/100/40x40/title.jpg?v=999`);
        res.body.feed[0].commitmentImageUrlPreview.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/100/210x210/title.jpg?v=999`);
        res.body.feed[0].eventId.should.equals('22');
        res.body.feed[0].created.should.equals(777);
        res.body.feed[0].title.should.equals('event22Title');
        res.body.feed[0].description.should.equals('event22Description');
        res.body.feed[0].region.should.equals('regionDe');
        res.body.feed[0].location.should.equals('event22Location');
        res.body.feed[0].startDate.should.equals(startTime - 100);
        res.body.feed[0].endDate.should.equals(startTime + 200);

        res.body.feed[1].type.should.equals('Commitment');
        res.body.feed[1].action.should.equals('created');
        res.body.feed[1].commitmentId.should.equals('100');
    });

    it('Event is not shown when user of trust circle has created commitment', async function () {
        dbDsl.createContactConnection('1', '2');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity',
            {guiLanguage: 'de', languages: ['de'], trustCircle: 1});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Commitment');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].commitmentId.should.equals('100');
    });

    it('Created commitment event with trust circle filter and interested', async function () {
        dbDsl.watchCommitment({commitmentId: '100', userId: '1', created: 558});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity',
            {guiLanguage: 'de', languages: ['de'], trustCircle: 1, showInterested: true});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Event');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].commitmentId.should.equals('100');
        res.body.feed[0].eventId.should.equals('22');
        res.body.feed[0].created.should.equals(777);
    });

    it('Created commitment event with topic filter and interested', async function () {
        dbDsl.watchCommitment({commitmentId: '100', userId: '1', created: 558});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity',
            {guiLanguage: 'de', languages: ['de'], showInterested: true, topics: ['topic1']});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(2);

        res.body.feed[0].type.should.equals('Event');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].commitmentId.should.equals('100');
        res.body.feed[0].eventId.should.equals('22');
        res.body.feed[0].created.should.equals(777);

        res.body.feed[1].type.should.equals('Commitment');
        res.body.feed[1].action.should.equals('created');
        res.body.feed[1].commitmentId.should.equals('100');
    });

    it('Created commitment event with trust circle filter, topic filter and interested', async function () {
        dbDsl.watchCommitment({commitmentId: '100', userId: '1', created: 558});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity',
            {guiLanguage: 'de', languages: ['de'], trustCircle: 1, showInterested: true, topics: ['topic5']});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Event');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].commitmentId.should.equals('100');
        res.body.feed[0].eventId.should.equals('22');
        res.body.feed[0].created.should.equals(777);
    });

    it('Getting events of commitment with sub topic', async function () {

        dbDsl.createSubTopic({
            parentTopicId: 'topic3', topicId: 'topic11', descriptionDe: 'topic11De', descriptionEn: 'topic11En'
        });
        dbDsl.createSubTopic({
            parentTopicId: 'topic11', topicId: 'topic111', descriptionDe: 'topic111De', descriptionEn: 'topic111En'
        });
        dbDsl.createCommitment('101', {
            adminId: '2', topics: ['topic111'], language: 'de', created: 400, modified: 606,
            title: 'Test Commitment', website: 'https://www.example.org/', regions: ['region-1', 'region-2']
        });
        dbDsl.createCommitmentEvent({
            commitmentId: '101', eventId: '24', created: 777,
            startDate: startTime - 100, endDate: startTime + 200, regionId: 'region-1'
        });
        dbDsl.createCommitmentEvent({
            commitmentId: '101', eventId: '25', created: 778,
            startDate: startTime - 200, endDate: startTime - 100, regionId: 'region-1'
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity', {
            guiLanguage: 'de', languages: ['de'], topics: ['topic3']
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(2);

        res.body.feed[0].type.should.equals('Event');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].commitmentId.should.equals('101');
        res.body.feed[0].eventId.should.equals('24');

        res.body.feed[1].type.should.equals('Commitment');
        res.body.feed[1].action.should.equals('created');
        res.body.feed[1].commitmentId.should.equals('101');
        should.not.exist(res.body.feed[1].creator);
    });

    it('Not getting events of commitment with sub topic', async function () {

        dbDsl.createContactConnection('1', '3');
        dbDsl.createSubTopic({
            parentTopicId: 'topic3', topicId: 'topic11', descriptionDe: 'topic11De', descriptionEn: 'topic11En'
        });
        dbDsl.createSubTopic({
            parentTopicId: 'topic11', topicId: 'topic111', descriptionDe: 'topic111De', descriptionEn: 'topic111En'
        });
        dbDsl.createCommitment('101', {
            adminId: '3', topics: ['topic111'], language: 'de', created: 400, modified: 606,
            title: 'Test Commitment', website: 'https://www.example.org/', regions: ['region-1', 'region-2']
        });
        dbDsl.createCommitmentEvent({
            commitmentId: '101', eventId: '24', created: 777,
            startDate: startTime - 100, endDate: startTime + 200, regionId: 'region-1'
        });
        dbDsl.createCommitmentEvent({
            commitmentId: '101', eventId: '25', created: 778,
            startDate: startTime - 200, endDate: startTime - 100, regionId: 'region-1'
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity', {
            guiLanguage: 'de', languages: ['de'], topics: ['topic3'], trustCircle: 1
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Commitment');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].commitmentId.should.equals('101');
        should.not.exist(res.body.feed[0].creator);
    });
});
