'use strict';

const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const should = require('chai').should();

describe('Privacy setting for creator of searched question', function () {

    beforeEach(async function () {
        await dbDsl.init(2);
        dbDsl.createRegion('region-1', {de: 'Region1De', en: 'Region1En'});
        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});

        dbDsl.createQuestion('10', {
            creatorId: '2', question: 'Das ist eine Frage', created: 500, modified: 700,
            description: 'Test dumonda.me change the world1', topics: ['topic1'], language: 'de'
        });
        dbDsl.createCommitment('1', {
            title: 'Das ist eine Frage', regions: ['region-1'],
            adminId: '2', topics: ['topic1'], language: 'de', created: 700, modified: 777,
            website: 'https://www.example.org/'
        }, []);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Hide user when privacy setting to publicEl and not logged in', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'publicEl'});
        dbDsl.createQuestion('11', {
            creatorId: '2', question: 'Frage ein ist Das', created: 500, modified: 700,
            description: 'Test dumonda.me change the world1', topics: ['topic1'], language: 'de'
        });
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        let res = await requestHandler.get('/api/search', {query: 'Das ist eine Frag ', lang: 'de'});
        res.status.should.equal(200);
        res.body.questions.length.should.equals(2);
        res.body.questions[0].questionId.should.equals('10');
        should.not.exist(res.body.questions[0].user.userId);
        should.not.exist(res.body.questions[0].user.name);
        should.not.exist(res.body.questions[0].user.slug);
        res.body.questions[0].user.userImage.should.equals('profileImage/default/thumbnail.jpg');
        res.body.questions[0].user.userImagePreview.should.equals('profileImage/default/profilePreview.jpg');
        res.body.questions[0].user.isAnonymous.should.equals(true);

        res.body.questions[1].questionId.should.equals('11');
    });

    it('Hide user when privacy setting to onlyContact and not logged in', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'onlyContact'});
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        let res = await requestHandler.get('/api/search', {query: 'Das ist eine Frage', lang: 'de'});
        res.status.should.equal(200);
        res.body.questions.length.should.equals(1);
        res.body.questions[0].questionId.should.equals('10');
        should.not.exist(res.body.questions[0].user.userId);
        should.not.exist(res.body.questions[0].user.name);
        should.not.exist(res.body.questions[0].user.slug);
        res.body.questions[0].user.userImage.should.equals('profileImage/default/thumbnail.jpg');
        res.body.questions[0].user.userImagePreview.should.equals('profileImage/default/profilePreview.jpg');
        res.body.questions[0].user.isAnonymous.should.equals(true);
    });

    it('Hide user when privacy setting to onlyContact and logged in', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'onlyContact'});
        dbDsl.createContactConnection('1', '2');
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/search', {query: 'Das ist eine Frage', lang: 'de'});
        res.status.should.equal(200);
        res.body.questions.length.should.equals(1);
        res.body.questions[0].questionId.should.equals('10');
        should.not.exist(res.body.questions[0].user.userId);
        should.not.exist(res.body.questions[0].user.name);
        should.not.exist(res.body.questions[0].user.slug);
        res.body.questions[0].user.userImage.should.equals('profileImage/default/thumbnail.jpg');
        res.body.questions[0].user.userImagePreview.should.equals('profileImage/default/profilePreview.jpg');
        res.body.questions[0].user.isAnonymous.should.equals(true);
    });

    it('Show user when privacy setting to public and not logged in', async function () {
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        let res = await requestHandler.get('/api/search', {query: 'Das ist eine Frage', lang: 'de'});
        res.status.should.equal(200);
        res.body.questions.length.should.equals(1);
        res.body.questions[0].questionId.should.equals('10');
        res.body.questions[0].user.userId.should.equals('2');
        res.body.questions[0].user.name.should.equals('user Meier2');
        res.body.questions[0].user.slug.should.equals('user-meier2');
        res.body.questions[0].user.userImage.should.equals('profileImage/2/thumbnail.jpg');
        res.body.questions[0].user.userImagePreview.should.equals('profileImage/2/profilePreview.jpg');
        res.body.questions[0].user.isLoggedInUser.should.equals(false);
        res.body.questions[0].user.isTrustUser.should.equals(false);
        res.body.questions[0].user.isAnonymous.should.equals(false);
    });

    it('Show user when privacy setting to publicEl and logged in', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'publicEl'});
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/search', {query: 'Das ist eine Frage', lang: 'de'});
        res.status.should.equal(200);
        res.body.questions.length.should.equals(1);
        res.body.questions[0].questionId.should.equals('10');
        res.body.questions[0].user.userId.should.equals('2');
        res.body.questions[0].user.name.should.equals('user Meier2');
        res.body.questions[0].user.slug.should.equals('user-meier2');
        res.body.questions[0].user.userImage.should.equals('profileImage/2/thumbnail.jpg');
        res.body.questions[0].user.userImagePreview.should.equals('profileImage/2/profilePreview.jpg');
        res.body.questions[0].user.isLoggedInUser.should.equals(false);
        res.body.questions[0].user.isTrustUser.should.equals(false);
        res.body.questions[0].user.isAnonymous.should.equals(false);
    });

    it('Show user when privacy setting to onlyContact and user trust logged in user', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'onlyContact'});
        dbDsl.createContactConnection('2', '1');
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/search', {query: 'Das ist eine Frage', lang: 'de'});
        res.status.should.equal(200);
        res.body.questions.length.should.equals(1);
        res.body.questions[0].questionId.should.equals('10');
        res.body.questions[0].user.userId.should.equals('2');
        res.body.questions[0].user.name.should.equals('user Meier2');
        res.body.questions[0].user.slug.should.equals('user-meier2');
        res.body.questions[0].user.userImage.should.equals('profileImage/2/thumbnail.jpg');
        res.body.questions[0].user.userImagePreview.should.equals('profileImage/2/profilePreview.jpg');
        res.body.questions[0].user.isLoggedInUser.should.equals(false);
        res.body.questions[0].user.isTrustUser.should.equals(false);
        res.body.questions[0].user.isAnonymous.should.equals(false);
    });
});
