'use strict';

const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const users = require('dumonda-me-server-test-util').user;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const should = require('chai').should();

describe('Show user profile in the activity feed for watched commitment only if the privacy setting allows this', function () {

    beforeEach(async function () {
        await dbDsl.init(3);

        dbDsl.createRegion('region-1', {de: 'regionDe', en: 'regionEn'});

        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});

        dbDsl.createCommitment('101', {
            adminId: '2', topics: ['topic1'], language: 'de', created: 400, modified: 606, title: 'Test Commitment',
            website: 'https://www.example.org/', regions: ['region-1']
        });

        dbDsl.watchCommitment({commitmentId: '101', userId: '3', created: 501});
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Hide user when privacy setting are set to onlyContact and user is not in trust circle', async function () {
        dbDsl.setUserPrivacy('3', {privacyMode: 'onlyContact'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity', {guiLanguage: 'de', languages: ['de']});
        res.status.should.equal(200);
        res.body.feed.length.should.equals(2);

        res.body.feed[0].type.should.equals('Commitment');
        res.body.feed[0].action.should.equals('watch');
        res.body.feed[0].numberOfWatches.should.equals(1);
        res.body.feed[0].isWatchedByUser.should.equals(false);
        res.body.feed[0].isAdmin.should.equals(false);
        res.body.feed[0].commitmentId.should.equals('101');
        res.body.feed[0].commitmentSlug.should.equals('test-commitment');
        res.body.feed[0].title.should.equals('Test Commitment');
        res.body.feed[0].description.should.equals('commitment101Description');
        res.body.feed[0].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/101/460x460/title.jpg?v=606`);
        res.body.feed[0].regions.length.should.equals(1);
        res.body.feed[0].regions.should.includes('regionDe');
        res.body.feed[0].created.should.equals(501);
        res.body.feed[0].user.isAnonymous.should.equals(true);
        res.body.feed[0].user.userImage.should.equals('profileImage/default/thumbnail.jpg');
        res.body.feed[0].user.userImagePreview.should.equals('profileImage/default/profilePreview.jpg');
        should.not.exist(res.body.feed[0].user.userId);
        should.not.exist(res.body.feed[0].user.name);
        should.not.exist(res.body.feed[0].user.slug);
        should.not.exist(res.body.feed[0].user.isLoggedInUser);
        should.not.exist(res.body.feed[0].user.isTrustUser);
    });

    it('Hide when privacy setting are set to onlyContact and user is not in trust circle (trust circle filter)', async function () {
        dbDsl.setUserPrivacy('3', {privacyMode: 'onlyContact'});
        dbDsl.createContactConnection('1', '3');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity',
            {guiLanguage: 'de', languages: ['de'], trustCircle: 1});
        res.status.should.equal(200);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].action.should.equals('watch');
        res.body.feed[0].commitmentId.should.equals('101');
        res.body.feed[0].user.isAnonymous.should.equals(true);
        res.body.feed[0].user.userImage.should.equals('profileImage/default/thumbnail.jpg');
        res.body.feed[0].user.userImagePreview.should.equals('profileImage/default/profilePreview.jpg');
        should.not.exist(res.body.feed[0].user.userId);
        should.not.exist(res.body.feed[0].user.name);
        should.not.exist(res.body.feed[0].user.slug);
        should.not.exist(res.body.feed[0].user.isLoggedInUser);
        should.not.exist(res.body.feed[0].user.isTrustUser);
    });

    it('Hide when privacy setting are set to onlyContact and user is not in trust circle (topic filter)', async function () {
        dbDsl.setUserPrivacy('3', {privacyMode: 'onlyContact'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity',
            {guiLanguage: 'de', languages: ['de'], topics: ['topic1']});
        res.status.should.equal(200);
        res.body.feed.length.should.equals(2);

        res.body.feed[0].action.should.equals('watch');
        res.body.feed[0].commitmentId.should.equals('101');
        res.body.feed[0].user.isAnonymous.should.equals(true);
        res.body.feed[0].user.userImage.should.equals('profileImage/default/thumbnail.jpg');
        res.body.feed[0].user.userImagePreview.should.equals('profileImage/default/profilePreview.jpg');
        should.not.exist(res.body.feed[0].user.userId);
        should.not.exist(res.body.feed[0].user.name);
        should.not.exist(res.body.feed[0].user.slug);
        should.not.exist(res.body.feed[0].user.isLoggedInUser);
        should.not.exist(res.body.feed[0].user.isTrustUser);
    });

    it('Show user when privacy setting are set to onlyContact and user is in trust circle', async function () {
        dbDsl.setUserPrivacy('3', {privacyMode: 'onlyContact'});
        dbDsl.createContactConnection('3', '1');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity', {guiLanguage: 'de', languages: ['de']});
        res.status.should.equal(200);
        res.body.feed.length.should.equals(2);

        res.body.feed[0].commitmentId.should.equals('101');
        res.body.feed[0].action.should.equals('watch');
        res.body.feed[0].user.isAnonymous.should.equals(false);
        res.body.feed[0].user.userId.should.equals('3');
    });

    it('Show user when privacy setting are set to publicEl and user is logged in', async function () {
        dbDsl.setUserPrivacy('3', {privacyMode: 'publicEl'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity', {guiLanguage: 'de', languages: ['de']});
        res.status.should.equal(200);
        res.body.feed.length.should.equals(2);

        res.body.feed[0].commitmentId.should.equals('101');
        res.body.feed[0].action.should.equals('watch');
        res.body.feed[0].user.isAnonymous.should.equals(false);
        res.body.feed[0].user.userId.should.equals('3');
    });
});
