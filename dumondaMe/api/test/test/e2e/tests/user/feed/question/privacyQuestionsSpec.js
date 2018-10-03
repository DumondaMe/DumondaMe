'use strict';

const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const users = require('dumonda-me-server-test-util').user;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const should = require('chai').should();

describe('Show the user profile in the question feed only if the privacy setting allows this', function () {

    beforeEach(async function () {
        await dbDsl.init(11);

        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});

        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'Test dumonda.me change the world1',
            topics: ['topic1'], language: 'de', created: 500, modified: 700
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Hide user when privacy setting are set to onlyContact and user is not in trust circle (mostPopular)', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'onlyContact'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/question', {
            guiLanguage: 'de', languages: ['de', 'en'], order: 'mostPopular'
        });
        res.status.should.equal(200);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].questionId.should.equals('1');
        res.body.feed[0].user.isAnonymous.should.equals(true);
        res.body.feed[0].user.userImage.should.equals('profileImage/default/thumbnail.jpg');
        res.body.feed[0].user.userImagePreview.should.equals('profileImage/default/profilePreview.jpg');
        should.not.exist(res.body.feed[0].user.userId);
        should.not.exist(res.body.feed[0].user.name);
        should.not.exist(res.body.feed[0].user.slug);
        should.not.exist(res.body.feed[0].user.isLoggedInUser);
        should.not.exist(res.body.feed[0].user.isTrustUser);
    });

    it('Show user when privacy setting are set to onlyContact and user is in trust circle (mostPopular)', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'onlyContact'});
        dbDsl.createContactConnection('2', '1');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/question', {
            guiLanguage: 'de', languages: ['de', 'en'], order: 'mostPopular'
        });
        res.status.should.equal(200);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].questionId.should.equals('1');
        res.body.feed[0].user.isAnonymous.should.equals(false);
        res.body.feed[0].user.userId.should.equals('2');
    });

    it('Show user when privacy setting are set to onlyContact and user is logged in user (mostPopular)', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'onlyContact'});
        dbDsl.createContactConnection('2', '1');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser2);
        let res = await requestHandler.get('/api/user/feed/question', {
            guiLanguage: 'de', languages: ['de', 'en'], order: 'mostPopular'
        });
        res.status.should.equal(200);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].questionId.should.equals('1');
        res.body.feed[0].user.isAnonymous.should.equals(false);
        res.body.feed[0].user.userId.should.equals('2');
    });

    it('Hide user when privacy setting are set to onlyContact and user is not in trust circle (newest)', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'onlyContact'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/question', {
            guiLanguage: 'de', languages: ['de', 'en'], order: 'newest'
        });
        res.status.should.equal(200);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].questionId.should.equals('1');
        res.body.feed[0].user.isAnonymous.should.equals(true);
        res.body.feed[0].user.userImage.should.equals('profileImage/default/thumbnail.jpg');
        res.body.feed[0].user.userImagePreview.should.equals('profileImage/default/profilePreview.jpg');
        should.not.exist(res.body.feed[0].user.userId);
        should.not.exist(res.body.feed[0].user.name);
        should.not.exist(res.body.feed[0].user.slug);
        should.not.exist(res.body.feed[0].user.isLoggedInUser);
        should.not.exist(res.body.feed[0].user.isTrustUser);
    });

    it('Show user when privacy setting are set to onlyContact and user is not in trust circle (newest)', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'onlyContact'});
        dbDsl.createContactConnection('2', '1');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/question', {
            guiLanguage: 'de', languages: ['de', 'en'], order: 'newest'
        });
        res.status.should.equal(200);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].questionId.should.equals('1');
        res.body.feed[0].user.isAnonymous.should.equals(false);
        res.body.feed[0].user.userId.should.equals('2');
    });

    it('Show user when privacy setting are set to onlyContact and user is logged in user (newest)', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'onlyContact'});
        dbDsl.createContactConnection('2', '1');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser2);
        let res = await requestHandler.get('/api/user/feed/question', {
            guiLanguage: 'de', languages: ['de', 'en'], order: 'newest'
        });
        res.status.should.equal(200);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].questionId.should.equals('1');
        res.body.feed[0].user.isAnonymous.should.equals(false);
        res.body.feed[0].user.userId.should.equals('2');
    });

    it('Hide user when privacy setting are set to onlyContact and user is not in trust circle (notAnswered)', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'onlyContact'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/question', {
            guiLanguage: 'de', languages: ['de', 'en'], order: 'notAnswered'
        });
        res.status.should.equal(200);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].questionId.should.equals('1');
        res.body.feed[0].user.isAnonymous.should.equals(true);
        res.body.feed[0].user.userImage.should.equals('profileImage/default/thumbnail.jpg');
        res.body.feed[0].user.userImagePreview.should.equals('profileImage/default/profilePreview.jpg');
        should.not.exist(res.body.feed[0].user.userId);
        should.not.exist(res.body.feed[0].user.name);
        should.not.exist(res.body.feed[0].user.slug);
        should.not.exist(res.body.feed[0].user.isLoggedInUser);
        should.not.exist(res.body.feed[0].user.isTrustUser);
    });

    it('Show user when privacy setting are set to onlyContact and user is not in trust circle (notAnswered)', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'onlyContact'});
        dbDsl.createContactConnection('2', '1');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/question', {
            guiLanguage: 'de', languages: ['de', 'en'], order: 'notAnswered'
        });
        res.status.should.equal(200);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].questionId.should.equals('1');
        res.body.feed[0].user.isAnonymous.should.equals(false);
        res.body.feed[0].user.userId.should.equals('2');
    });

    it('Show user when privacy setting are set to onlyContact and user is logged in user (notAnswered)', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'onlyContact'});
        dbDsl.createContactConnection('2', '1');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser2);
        let res = await requestHandler.get('/api/user/feed/question', {
            guiLanguage: 'de', languages: ['de', 'en'], order: 'notAnswered'
        });
        res.status.should.equal(200);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].questionId.should.equals('1');
        res.body.feed[0].user.isAnonymous.should.equals(false);
        res.body.feed[0].user.userId.should.equals('2');
    });
});
