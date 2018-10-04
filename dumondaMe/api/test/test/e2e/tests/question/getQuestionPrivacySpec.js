'use strict';

let users = require('dumonda-me-server-test-util').user;
let dbDsl = require('dumonda-me-server-test-util').dbDSL;
let requestHandler = require('dumonda-me-server-test-util').requestHandler;
let moment = require('moment');
const should = require('chai').should();

describe('Privacy settings of the user created a question', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(2);
        await requestHandler.logout();
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createRegion('region-1', {de: 'Region1De', en: 'Region1En'});

        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});

        dbDsl.createCommitment('2', {
            title: 'Das ist ein Engagement', regions: ['region-1'], adminId: '2', topics: ['topic1'],
            language: 'de', created: 700, modified: 701, website: 'https://www.example.org/'
        }, []);

        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'Test dumonda.me change the world',
            topics: ['topic1', 'topic2'], language: 'de', modified: 700
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Hide creator of question when not logged in and privacy setting is publicEl', async function () {

        dbDsl.setUserPrivacy('2', {privacyMode: 'publicEl'});
        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/question/detail/1', {language: 'de'});
        res.status.should.equal(200);
        res.body.questionId.should.equals('1');
        res.body.creator.isAnonymous.should.equals(true);
        res.body.creator.userImage.should.equals('profileImage/default/thumbnail.jpg');
        res.body.creator.userImagePreview.should.equals('profileImage/default/profilePreview.jpg');
        should.not.exist(res.body.creator.userId);
        should.not.exist(res.body.creator.name);
        should.not.exist(res.body.creator.slug);
        should.not.exist(res.body.creator.isLoggedInUser);
        should.not.exist(res.body.creator.isTrustUser);
    });

    it('Hide creator of question when logged in and privacy setting is onlyContact', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'onlyContact'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/question/detail/1', {language: 'de'});
        res.status.should.equal(200);
        res.body.questionId.should.equals('1');
        res.body.creator.isAnonymous.should.equals(true);
        res.body.creator.userImage.should.equals('profileImage/default/thumbnail.jpg');
        res.body.creator.userImagePreview.should.equals('profileImage/default/profilePreview.jpg');
        should.not.exist(res.body.creator.userId);
        should.not.exist(res.body.creator.name);
        should.not.exist(res.body.creator.slug);
        should.not.exist(res.body.creator.isLoggedInUser);
        should.not.exist(res.body.creator.isTrustUser);
    });

    it('Show creator of question when logged in user', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'onlyContact'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser2);
        let res = await requestHandler.get('/api/question/detail/1', {language: 'de'});
        res.status.should.equal(200);
        res.body.questionId.should.equals('1');
        res.body.creator.isAnonymous.should.equals(false);
        res.body.creator.name.should.equals('user Meier2');
        res.body.creator.userId.should.equals('2');
        res.body.creator.slug.should.equals('user-meier2');
        res.body.creator.userImage.should.equals('profileImage/2/thumbnail.jpg');
        res.body.creator.userImagePreview.should.equals('profileImage/2/profilePreview.jpg');
        res.body.creator.isTrustUser.should.equals(false);
    });

    it('Show creator of question when user is in trust circle', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'onlyContact'});
        dbDsl.createContactConnection('2', '1');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/question/detail/1', {language: 'de'});
        res.status.should.equal(200);
        res.body.questionId.should.equals('1');
        res.body.creator.isAnonymous.should.equals(false);
        res.body.creator.name.should.equals('user Meier2');
        res.body.creator.userId.should.equals('2');
        res.body.creator.slug.should.equals('user-meier2');
        res.body.creator.userImage.should.equals('profileImage/2/thumbnail.jpg');
        res.body.creator.userImagePreview.should.equals('profileImage/2/profilePreview.jpg');
        res.body.creator.isTrustUser.should.equals(false);
    });

    it('Show creator of question when user is logged in and privacy is publicEl', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'publicEl'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/question/detail/1', {language: 'de'});
        res.status.should.equal(200);
        res.body.questionId.should.equals('1');
        res.body.creator.isAnonymous.should.equals(false);
        res.body.creator.name.should.equals('user Meier2');
        res.body.creator.userId.should.equals('2');
        res.body.creator.slug.should.equals('user-meier2');
        res.body.creator.userImage.should.equals('profileImage/2/thumbnail.jpg');
        res.body.creator.userImagePreview.should.equals('profileImage/2/profilePreview.jpg');
        res.body.creator.isTrustUser.should.equals(false);
    });
});
