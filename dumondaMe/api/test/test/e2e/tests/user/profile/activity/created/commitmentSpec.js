'use strict';

const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const users = require('dumonda-me-server-test-util').user;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const moment = require('moment');
const should = require('chai').should();

describe('Get activity feed for a user with created commitments', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(3);
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
            adminId: '1', topics: ['topic1'], language: 'de', created: 401, modified: 606,
            title: 'Test Commitment2', website: 'https://www.example.org/', regions: ['region-1']
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Created commitment of a user', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile/activity',
            {guiLanguage: 'de', languages: ['de'], userId: '2'});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Commitment');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].commitmentId.should.equals('100');
        res.body.feed[0].commitmentSlug.should.equals('test-commitment');
        res.body.feed[0].title.should.equals('Test Commitment');
        res.body.feed[0].description.should.equals('commitment100Description');
        res.body.feed[0].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/100/460x460/title.jpg?v=606`);
        res.body.feed[0].regions.length.should.equals(2);
        res.body.feed[0].regions.should.includes('regionDe');
        res.body.feed[0].regions.should.includes('region211De');
        res.body.feed[0].created.should.equals(400);
        res.body.feed[0].isWatchedByUser.should.equals(false);
        res.body.feed[0].isAdmin.should.equals(false);
        res.body.feed[0].user.userId.should.equals('2');
        res.body.feed[0].user.name.should.equals('user Meier2');
        res.body.feed[0].user.slug.should.equals('user-meier2');
        res.body.feed[0].user.userImage.should.equals('profileImage/2/thumbnail.jpg');
        res.body.feed[0].user.userImagePreview.should.equals('profileImage/2/profilePreview.jpg');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(false);
        should.not.exist(res.body.feed[0].creator);
    });

    it('Created commitment of logged in user', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile/activity',
            {guiLanguage: 'de', languages: ['de'], userId: '1'});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Commitment');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].commitmentId.should.equals('101');
        res.body.feed[0].user.userId.should.equals('1');
        res.body.feed[0].user.isLoggedInUser.should.equals(true);
        res.body.feed[0].user.isTrustUser.should.equals(false);
        should.not.exist(res.body.feed[0].creator);
    });
});
