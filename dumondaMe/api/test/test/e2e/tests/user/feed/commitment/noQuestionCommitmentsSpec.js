'use strict';

const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const users = require('dumonda-me-server-test-util').user;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const moment = require('moment');
const should = require('chai').should();

describe('Get feed for commitments without any link to a question', function () {

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
            adminId: '2', topics: ['topic221'], language: 'de', created: 777, title: 'Test Commitment100',
            modified: 606, website: 'https://www.example.org/', regions: ['region-2-1']
        });
        dbDsl.createCommitment('101', {
            adminId: '3', topics: ['topic1'], language: 'de', created: 666,
            modified: 606, website: 'https://www.example1.org/', regions: ['region-1']
        });
        dbDsl.createCommitment('103', {
            adminId: '5', topics: ['topic3'], language: 'en', created: 444,
            modified: 606, website: 'https://www.example3.org/', regions: ['region-1']
        });

        dbDsl.watchCommitment({commitmentId: '100', userId: '1', created: 999});
        dbDsl.watchCommitment({commitmentId: '100', userId: '7', created: 999});

        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'Test elyoos.org change the world1',
            topics: ['topic1', 'topic2'], language: 'de', created: 500, modified: 700
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Show commitments with no question link', async function () {
        dbDsl.createCommitmentAnswer('11', {
            creatorId: '2', questionId: '1', commitmentId: '101', created: 496, description: 'test'
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/commitment', {
            guiLanguage: 'de', languages: ['de'], order: 'noQuestionLink'
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Commitment');
        res.body.feed[0].commitmentId.should.equals('100');
        res.body.feed[0].commitmentSlug.should.equals('test-commitment100');
        res.body.feed[0].title.should.equals('Test Commitment100');
        res.body.feed[0].description.should.equals('commitment100Description');
        res.body.feed[0].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/100/460x460/title.jpg?v=606`);
        res.body.feed[0].numberOfWatches.should.equals(2);
        res.body.feed[0].isWatchedByUser.should.equals(true);
        res.body.feed[0].regions.length.should.equals(1);
        res.body.feed[0].regions.should.include('Region21De');
        res.body.feed[0].created.should.equals(777);
        res.body.feed[0].user.userId.should.equals('2');
        res.body.feed[0].user.name.should.equals('user Meier2');
        res.body.feed[0].user.slug.should.equals('user-meier2');
        res.body.feed[0].user.userImage.should.equals('profileImage/2/thumbnail.jpg');
        should.not.exist(res.body.feed[0].creator);
    });

    it('Filter by user of trust who created commitment', async function () {
        dbDsl.createContactConnection('1', '3');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/commitment', {
            guiLanguage: 'de', languages: ['de', 'en'], order: 'noQuestionLink', trustCircle: 1
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Commitment');
        res.body.feed[0].commitmentId.should.equals('101');
    });

    it('Filter by topic', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/commitment', {
            guiLanguage: 'de', languages: ['de', 'en'], order: 'noQuestionLink', topics: ['topic1']
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Commitment');
        res.body.feed[0].commitmentId.should.equals('101');
    });

    it('Filter by sub topic', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/commitment', {
            guiLanguage: 'de', languages: ['de', 'en'], order: 'noQuestionLink', topics: ['topic2', 'topic4']
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Commitment');
        res.body.feed[0].commitmentId.should.equals('100');
    });

    it('Filter by region', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/commitment', {
            guiLanguage: 'de', languages: ['de', 'en'], order: 'noQuestionLink', regions: ['region-2-1']
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Commitment');
        res.body.feed[0].commitmentId.should.equals('100');
    });

    it('Filter by sub region', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/commitment', {
            guiLanguage: 'de', languages: ['de'], order: 'noQuestionLink', regions: ['region-2', 'region-4']
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Commitment');
        res.body.feed[0].commitmentId.should.equals('100');
    });
});
