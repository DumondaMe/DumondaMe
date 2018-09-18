'use strict';

const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const users = require('dumonda-me-server-test-util').user;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const moment = require('moment');
const should = require('chai').should();

describe('Get activity feed with created commitment answers for a user', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(5);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createRegion('region-1', {de: 'regionDe', en: 'regionEn'});
        dbDsl.createRegion('region-2', {de: 'region2De', en: 'region2En'});
        dbDsl.createRegion('region-2-1', {parentRegionId: 'region-2', de: 'region21De', en: 'region21En'});
        dbDsl.createRegion('region-2-2', {parentRegionId: 'region-2', de: 'region22De', en: 'region22En'});
        dbDsl.createRegion('region-2-1-1', {parentRegionId: 'region-2-1', de: 'region211De', en: 'region211En'});
        dbDsl.createRegion('region-2-1-2', {parentRegionId: 'region-2-1', de: 'region212De', en: 'region212En'});

        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});
        dbDsl.createMainTopic({topicId: 'topic2', descriptionDe: 'topic2De', descriptionEn: 'topic2En'});
        dbDsl.createMainTopic({topicId: 'topic3', descriptionDe: 'topic3De', descriptionEn: 'topic3En'});

        dbDsl.createCommitment('100', {
            adminId: '2', topics: ['topic1', 'topic2'], language: 'de', created: 400, modified: 606,
            title: 'Test Commitment', website: 'https://www.example.org/', regions: ['region-1', 'region-2-1-1']
        });

        dbDsl.createCommitment('101', {
            adminId: '2', topics: ['topic1'], language: 'de', created: 400, modified: 606,
            title: 'Test Commitment2', website: 'https://www.example.org/', regions: ['region-1']
        });

        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'Test dumonda.me change the world1',
            topics: ['topic1', 'topic3'], language: 'de', created: 500, modified: 700
        });
        dbDsl.createCommitmentAnswer('6', {
            creatorId: '3', questionId: '1', commitmentId: '100', created: 601, description: 'commitmentDescription'
        });
        dbDsl.createCommitmentAnswer('7', {
            creatorId: '1', questionId: '1', commitmentId: '101', created: 602, description: 'commitmentDescription2'
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Created commitment answer of a user', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile/activity',
            {guiLanguage: 'de', languages: ['de'], userId: '3'});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('CommitmentAnswer');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].answerId.should.equals('6');
        res.body.feed[0].commitmentId.should.equals('100');
        res.body.feed[0].commitmentSlug.should.equals('test-commitment');
        res.body.feed[0].title.should.equals('Test Commitment');
        res.body.feed[0].description.should.equals('commitmentDescription');
        res.body.feed[0].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/100/460x460/title.jpg?v=606`);
        res.body.feed[0].questionId.should.equals('1');
        res.body.feed[0].question.should.equals('Das ist eine Frage');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage');
        res.body.feed[0].regions.length.should.equals(2);
        res.body.feed[0].regions.should.includes('regionDe');
        res.body.feed[0].regions.should.includes('region211De');
        res.body.feed[0].created.should.equals(601);
        res.body.feed[0].user.userId.should.equals('3');
        res.body.feed[0].user.name.should.equals('user Meier3');
        res.body.feed[0].user.slug.should.equals('user-meier3');
        res.body.feed[0].user.userImage.should.equals('profileImage/3/thumbnail.jpg');
        res.body.feed[0].user.userImagePreview.should.equals('profileImage/3/profilePreview.jpg');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(false);
        should.not.exist(res.body.feed[0].creator);
    });

    it('Created commitment answer for logged in user', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile/activity',
            {guiLanguage: 'de', languages: ['de'], userId: '1'});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('CommitmentAnswer');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].answerId.should.equals('7');
        res.body.feed[0].user.userId.should.equals('1');
        res.body.feed[0].user.isLoggedInUser.should.equals(true);
        res.body.feed[0].user.isTrustUser.should.equals(false);
        should.not.exist(res.body.feed[0].creator);
    });
});
