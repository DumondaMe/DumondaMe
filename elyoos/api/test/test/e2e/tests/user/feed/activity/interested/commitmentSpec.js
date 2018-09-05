'use strict';

const dbDsl = require('elyoos-server-test-util').dbDSL;
const users = require('elyoos-server-test-util').user;
const requestHandler = require('elyoos-server-test-util').requestHandler;
const moment = require('moment');
const should = require('chai').should();

describe('Get activity feed for interested commitments', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(11);
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
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get interested commitment when only timestamp filter is active', async function () {
        dbDsl.watchCommitment({commitmentId: '100', userId: '5', created: 501});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity', {
            guiLanguage: 'de', languages: ['de'], timestamp: 505
        });
        res.status.should.equal(200);
        res.body.timestamp.should.equals(505);
        res.body.feed.length.should.equals(2);

        res.body.feed[0].type.should.equals('Commitment');
        res.body.feed[0].action.should.equals('watch');
        res.body.feed[0].numberOfWatches.should.equals(1);
        res.body.feed[0].isWatchedByUser.should.equals(false);
        res.body.feed[0].commitmentId.should.equals('100');
        res.body.feed[0].commitmentSlug.should.equals('test-commitment');
        res.body.feed[0].title.should.equals('Test Commitment');
        res.body.feed[0].description.should.equals('commitment100Description');
        res.body.feed[0].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/100/460x460/title.jpg?v=606`);
        res.body.feed[0].regions.length.should.equals(2);
        res.body.feed[0].regions.should.includes('regionDe');
        res.body.feed[0].regions.should.includes('region2De');
        res.body.feed[0].created.should.equals(501);
        res.body.feed[0].user.userId.should.equals('5');
        res.body.feed[0].user.name.should.equals('user Meier5');
        res.body.feed[0].user.slug.should.equals('user-meier5');
        res.body.feed[0].user.userImage.should.equals('profileImage/5/thumbnail.jpg');
        res.body.feed[0].user.userImagePreview.should.equals('profileImage/5/profilePreview.jpg');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(false);
        should.not.exist(res.body.feed[0].creator);

        res.body.feed[1].type.should.equals('Commitment');
        res.body.feed[1].action.should.equals('created');
        res.body.feed[1].commitmentId.should.equals('100');
    });

    it('Get interested commitments of a user from the trust circle', async function () {
        dbDsl.createContactConnection('1', '5');
        dbDsl.watchCommitment({commitmentId: '100', userId: '5', created: 501});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity', {
            guiLanguage: 'de', languages: ['de'], trustCircle: 1
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Commitment');
        res.body.feed[0].action.should.equals('watch');
        res.body.feed[0].numberOfWatches.should.equals(1);
        res.body.feed[0].isWatchedByUser.should.equals(false);
        res.body.feed[0].commitmentId.should.equals('100');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(true);
        should.not.exist(res.body.feed[0].creator);
    });

    it('Not getting interesting commitment by users not in trust circle', async function () {
        dbDsl.watchCommitment({commitmentId: '100', userId: '5', created: 501});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity', {
            guiLanguage: 'de', languages: ['de'], trustCircle: 1
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(0);
    });

    it('Get interested commitment of a user filtered by topics', async function () {

        dbDsl.createCommitment('101', {
            adminId: '2', topics: ['topic3', 'topic4'], language: 'de', created: 400, modified: 606,
            title: 'Test Commitment', website: 'https://www.example.org/', regions: ['region-1', 'region-2']
        });

        dbDsl.watchCommitment({commitmentId: '100', userId: '5', created: 501});
        dbDsl.watchCommitment({commitmentId: '101', userId: '5', created: 501});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity', {
            guiLanguage: 'de', languages: ['de'], topics: ['topic3', 'topic5']
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(2);

        res.body.feed[0].type.should.equals('Commitment');
        res.body.feed[0].action.should.equals('watch');
        res.body.feed[0].numberOfWatches.should.equals(1);
        res.body.feed[0].isWatchedByUser.should.equals(false);
        res.body.feed[0].commitmentId.should.equals('101');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(false);
        should.not.exist(res.body.feed[0].creator);

        res.body.feed[1].type.should.equals('Commitment');
        res.body.feed[1].action.should.equals('created');
        res.body.feed[1].commitmentId.should.equals('101');
    });

    it('Get interested commitment of a user filtered by sub topics', async function () {

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

        dbDsl.watchCommitment({commitmentId: '100', userId: '5', created: 501});
        dbDsl.watchCommitment({commitmentId: '101', userId: '5', created: 501});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity', {
            guiLanguage: 'de', languages: ['de'], topics: ['topic3', 'topic5']
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(2);

        res.body.feed[0].type.should.equals('Commitment');
        res.body.feed[0].action.should.equals('watch');
        res.body.feed[0].numberOfWatches.should.equals(1);
        res.body.feed[0].isWatchedByUser.should.equals(false);
        res.body.feed[0].commitmentId.should.equals('101');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(false);
        should.not.exist(res.body.feed[0].creator);

        res.body.feed[1].type.should.equals('Commitment');
        res.body.feed[1].action.should.equals('created');
        res.body.feed[1].commitmentId.should.equals('101');
    });

    it('Get a commitment which is multiple times marked as interested only once', async function () {
        dbDsl.watchCommitment({commitmentId: '100', userId: '5', created: 558});
        dbDsl.watchCommitment({commitmentId: '100', userId: '1', created: 557});
        dbDsl.watchCommitment({commitmentId: '100', userId: '7', created: 556});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity', {
            guiLanguage: 'de', languages: ['de']
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(2);

        res.body.feed[0].type.should.equals('Commitment');
        res.body.feed[0].action.should.equals('watch');
        res.body.feed[0].numberOfWatches.should.equals(3);
        res.body.feed[0].isWatchedByUser.should.equals(true);
        res.body.feed[0].commitmentId.should.equals('100');
        res.body.feed[0].created.should.equals(558);
        res.body.feed[0].user.userId.should.equals('5');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(false);
        should.not.exist(res.body.feed[0].creator);

        res.body.feed[1].type.should.equals('Commitment');
        res.body.feed[1].action.should.equals('created');
        res.body.feed[1].commitmentId.should.equals('100');
    });

    it('Get a commitment which is multiple times marked as interested only once (topics filter)', async function () {
        dbDsl.watchCommitment({commitmentId: '100', userId: '5', created: 558});
        dbDsl.watchCommitment({commitmentId: '100', userId: '6', created: 557});
        dbDsl.watchCommitment({commitmentId: '100', userId: '7', created: 556});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity', {
            guiLanguage: 'de', languages: ['de'], topics: ['topic2', 'topic6']
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(2);

        res.body.feed[0].type.should.equals('Commitment');
        res.body.feed[0].action.should.equals('watch');
        res.body.feed[0].numberOfWatches.should.equals(3);
        res.body.feed[0].isWatchedByUser.should.equals(false);
        res.body.feed[0].commitmentId.should.equals('100');
        res.body.feed[0].created.should.equals(558);
        res.body.feed[0].user.userId.should.equals('5');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(false);
        should.not.exist(res.body.feed[0].creator);

        res.body.feed[1].type.should.equals('Commitment');
        res.body.feed[1].action.should.equals('created');
        res.body.feed[1].commitmentId.should.equals('100');
    });

    it('Get a commitment which is multiple times marked as interested only once (trust circle filter)', async function () {
        dbDsl.watchCommitment({commitmentId: '100', userId: '8', created: 558});
        dbDsl.watchCommitment({commitmentId: '100', userId: '9', created: 557});
        dbDsl.watchCommitment({commitmentId: '100', userId: '10', created: 556});
        dbDsl.createContactConnection('1', '8');
        dbDsl.createContactConnection('1', '9');
        dbDsl.createContactConnection('1', '10');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity', {
            guiLanguage: 'de', languages: ['de'], trustCircle: 1
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Commitment');
        res.body.feed[0].action.should.equals('watch');
        res.body.feed[0].numberOfWatches.should.equals(3);
        res.body.feed[0].isWatchedByUser.should.equals(false);
        res.body.feed[0].commitmentId.should.equals('100');
        res.body.feed[0].created.should.equals(558);
        res.body.feed[0].user.userId.should.equals('8');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(true);
        should.not.exist(res.body.feed[0].creator);
    });

    it('Get a commitment which is multiple times marked as interested only once (trust circle and topic filter)', async function () {
        dbDsl.watchCommitment({commitmentId: '100', userId: '8', created: 558});
        dbDsl.watchCommitment({commitmentId: '100', userId: '9', created: 557});
        dbDsl.watchCommitment({commitmentId: '100', userId: '10', created: 556});
        dbDsl.createContactConnection('1', '8');
        dbDsl.createContactConnection('1', '9');
        dbDsl.createContactConnection('1', '10');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity', {
            guiLanguage: 'de', languages: ['de'], trustCircle: 1, topics: ['topic2', 'topic5']
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Commitment');
        res.body.feed[0].action.should.equals('watch');
        res.body.feed[0].numberOfWatches.should.equals(3);
        res.body.feed[0].isWatchedByUser.should.equals(false);
        res.body.feed[0].commitmentId.should.equals('100');
        res.body.feed[0].created.should.equals(558);
        res.body.feed[0].user.userId.should.equals('8');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(true);
        should.not.exist(res.body.feed[0].creator);
    });

    it('Getting only interesting commitment when topic correct', async function () {
        dbDsl.watchCommitment({commitmentId: '100', userId: '8', created: 558});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity', {
            guiLanguage: 'de', languages: ['de'], topics: ['topic7']
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(0);
    });
});
