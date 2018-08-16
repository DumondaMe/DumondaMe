'use strict';

const dbDsl = require('elyoos-server-test-util').dbDSL;
const users = require('elyoos-server-test-util').user;
const requestHandler = require('elyoos-server-test-util').requestHandler;
const moment = require('moment');
const should = require('chai').should();

describe('Get activity feed for created questions', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(11);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});
        dbDsl.createMainTopic({topicId: 'topic2', descriptionDe: 'topic2De', descriptionEn: 'topic2En'});
        dbDsl.createMainTopic({topicId: 'topic3', descriptionDe: 'topic3De', descriptionEn: 'topic3En'});

        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'Test elyoos.org change the world1',
            topics: ['topic1'], language: 'de', created: 500, modified: 700
        });
        dbDsl.createTextAnswer('5', {
            creatorId: '6', questionId: '1', answer: 'Answer', created: 600,
        });
        dbDsl.createBookAnswer('6', {
            creatorId: '7', questionId: '1', created: 601, authors: 'Hans Wurst', googleBookId: '1234',
            hasPreviewImage: true
        });
        dbDsl.createQuestion('2', {
            creatorId: '3', question: 'Das ist eine Frage2', description: 'Test elyoos.org change the world',
            topics: ['topic2'], language: 'de', created: 602,
        });
        dbDsl.createQuestion('3', {
            creatorId: '4', question: 'Das ist eine Frage2', description: 'Test elyoos.org change the world',
            topics: ['topic3'], language: 'en', created: 555,
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get created question when only timestamp filter is active', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity', {
            guiLanguage: 'de', languages: ['de'], timestamp: 500
        });
        res.status.should.equal(200);
        res.body.timestamp.should.equals(500);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Question');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].questionId.should.equals('1');
        res.body.feed[0].question.should.equals('Das ist eine Frage');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage');
        res.body.feed[0].description.should.equals('Test elyoos.org change the world1');
        res.body.feed[0].descriptionHtml.should.equals(`Test <a href="http://elyoos.org" class="linkified" target="_blank">elyoos.org</a> change the world1`);
        res.body.feed[0].created.should.equals(500);
        res.body.feed[0].numberOfAnswers.should.equals(2);
        res.body.feed[0].user.userId.should.equals('2');
        res.body.feed[0].user.name.should.equals('user Meier2');
        res.body.feed[0].user.slug.should.equals('user-meier2');
        res.body.feed[0].user.userImage.should.equals('profileImage/2/thumbnail.jpg');
        res.body.feed[0].user.userImagePreview.should.equals('profileImage/2/profilePreview.jpg');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(false);
        should.not.exist(res.body.feed[0].creator);
    });

    it('Get question only created by users of trust circle', async function () {
        dbDsl.createContactConnection('1', '3');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity', {
            guiLanguage: 'de', languages: ['de'], trustCircle: 1
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Question');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].questionId.should.equals('2');
        res.body.feed[0].user.userId.should.equals('3');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(true);
        should.not.exist(res.body.feed[0].creator);
    });

    it('Not getting question created by users not in trust circle', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity', {
            guiLanguage: 'de', languages: ['de'], trustCircle: 1
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(0);
    });

    it('Get created question filtered by topic', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity', {
            guiLanguage: 'de', languages: ['de'], topics: ['topic2']
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Question');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].questionId.should.equals('2');
        res.body.feed[0].user.userId.should.equals('3');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(false);
        should.not.exist(res.body.feed[0].creator);
    });

    it('Get created question filtered by topic and language', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity', {
            guiLanguage: 'de', languages: ['de', 'en'], topics: ['topic2', 'topic3']
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(2);

        res.body.feed[0].type.should.equals('Question');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].questionId.should.equals('2');
        res.body.feed[0].user.userId.should.equals('3');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(false);
        should.not.exist(res.body.feed[0].creator);

        res.body.feed[1].type.should.equals('Question');
        res.body.feed[1].action.should.equals('created');
        res.body.feed[1].questionId.should.equals('3');
        res.body.feed[1].user.userId.should.equals('4');
        res.body.feed[1].user.isLoggedInUser.should.equals(false);
        res.body.feed[1].user.isTrustUser.should.equals(false);
        should.not.exist(res.body.feed[1].creator);
    });

    it('Show question created by the user', async function () {
        dbDsl.createQuestion('21', {
            creatorId: '1', question: 'Das ist eine Frage', description: 'Test elyoos.org change the world1',
            topics: ['topic1', 'topic2'], language: 'de', created: 400, modified: 700
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity', {
            guiLanguage: 'de', languages: ['de'], timestamp: 401
        });
        res.status.should.equal(200);
        res.body.timestamp.should.equals(401);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Question');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].questionId.should.equals('21');
        res.body.feed[0].user.userId.should.equals('1');
        res.body.feed[0].user.isLoggedInUser.should.equals(true);
        res.body.feed[0].user.isTrustUser.should.equals(false);
        should.not.exist(res.body.feed[0].creator);
    });

    it('Show question created by the user when topic filter ist active', async function () {
        dbDsl.createQuestion('21', {
            creatorId: '1', question: 'Das ist eine Frage', description: 'Test elyoos.org change the world1',
            topics: ['topic1', 'topic2'], language: 'de', created: 400, modified: 700
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity', {
            guiLanguage: 'de', languages: ['de'], timestamp: 401, topics: ['topic1']
        });
        res.status.should.equal(200);
        res.body.timestamp.should.equals(401);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Question');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].questionId.should.equals('21');
        res.body.feed[0].user.userId.should.equals('1');
        res.body.feed[0].user.isLoggedInUser.should.equals(true);
        res.body.feed[0].user.isTrustUser.should.equals(false);
        should.not.exist(res.body.feed[0].creator);
    });
});
