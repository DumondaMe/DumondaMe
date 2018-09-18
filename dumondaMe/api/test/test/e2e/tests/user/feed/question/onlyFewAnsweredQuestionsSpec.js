'use strict';

const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const users = require('dumonda-me-server-test-util').user;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const moment = require('moment');
const should = require('chai').should();

describe('Get question feed for questions with only a few answers', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(11);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});
        dbDsl.createMainTopic({topicId: 'topic2', descriptionDe: 'topic2De', descriptionEn: 'topic2En'});
        dbDsl.createSubTopic({
            parentTopicId: 'topic2', topicId: 'topic21', descriptionDe: 'topic21De', descriptionEn: 'topic21En'
        });
        dbDsl.createSubTopic({
            parentTopicId: 'topic21', topicId: 'topic221', descriptionDe: 'topic221De', descriptionEn: 'topic221En'
        });
        dbDsl.createMainTopic({topicId: 'topic3', descriptionDe: 'topic3De', descriptionEn: 'topic3En'});

        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'Test elyoos.org change the world1',
            topics: ['topic1'], language: 'de', created: 888, modified: 999
        });
        dbDsl.createTextAnswer('5', {
            creatorId: '5', questionId: '1', answer: 'Answer', created: 600,
        });
        dbDsl.createTextAnswer('6', {
            creatorId: '5', questionId: '1', answer: 'Answer', created: 600,
        });
        dbDsl.createTextAnswer('7', {
            creatorId: '5', questionId: '1', answer: 'Answer', created: 600,
        });
        dbDsl.createTextAnswer('8', {
            creatorId: '5', questionId: '1', answer: 'Answer', created: 600,
        });
        dbDsl.createQuestion('2', {
            creatorId: '3', question: 'Das ist eine Frage2', description: 'Test elyoos.org change the world2',
            topics: ['topic221'], language: 'de', created: 777,
        });
        dbDsl.createTextAnswer('9', {
            creatorId: '5', questionId: '2', answer: 'Answer', created: 600,
        });
        dbDsl.createTextAnswer('10', {
            creatorId: '5', questionId: '2', answer: 'Answer', created: 600,
        });
        dbDsl.createTextAnswer('11', {
            creatorId: '5', questionId: '2', answer: 'Answer', created: 600,
        });
        dbDsl.createQuestion('3', {
            creatorId: '4', question: 'Das ist eine Frage3', description: 'Test elyoos.org change the world3',
            topics: ['topic2'], language: 'en', created: 666,
        });

        dbDsl.watchQuestion({questionId: '2', userId: '1', created: 993});
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Show questions with only a few answers', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/question', {
            guiLanguage: 'de', languages: ['de', 'en'], order: 'onlyFewAnswers'
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(2);

        res.body.feed[0].questionId.should.equals('2');
        res.body.feed[0].question.should.equals('Das ist eine Frage2');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage2');
        res.body.feed[0].description.should.equals('Test elyoos.org change the world2');
        res.body.feed[0].descriptionHtml.should.equals(`Test <a href="http://elyoos.org" class="linkified" target="_blank">elyoos.org</a> change the world2`);
        res.body.feed[0].created.should.equals(777);
        res.body.feed[0].numberOfAnswers.should.equals(3);
        res.body.feed[0].numberOfWatches.should.equals(1);
        res.body.feed[0].isWatchedByUser.should.equals(true);
        res.body.feed[0].user.userId.should.equals('3');
        res.body.feed[0].user.name.should.equals('user Meier3');
        res.body.feed[0].user.slug.should.equals('user-meier3');
        res.body.feed[0].user.userImage.should.equals('profileImage/3/thumbnail.jpg');
        res.body.feed[0].user.userImagePreview.should.equals('profileImage/3/profilePreview.jpg');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(false);
        should.not.exist(res.body.feed[0].creator);

        res.body.feed[1].questionId.should.equals('3');
        res.body.feed[1].question.should.equals('Das ist eine Frage3');
        res.body.feed[1].questionSlug.should.equals('das-ist-eine-frage3');
        res.body.feed[1].description.should.equals('Test elyoos.org change the world3');
        res.body.feed[1].descriptionHtml.should.equals(`Test <a href="http://elyoos.org" class="linkified" target="_blank">elyoos.org</a> change the world3`);
        res.body.feed[1].created.should.equals(666);
        res.body.feed[1].numberOfAnswers.should.equals(0);
        res.body.feed[1].numberOfWatches.should.equals(0);
        res.body.feed[1].isWatchedByUser.should.equals(false);
        res.body.feed[1].user.userId.should.equals('4');
        res.body.feed[1].user.name.should.equals('user Meier4');
        res.body.feed[1].user.slug.should.equals('user-meier4');
        res.body.feed[1].user.userImage.should.equals('profileImage/4/thumbnail.jpg');
        res.body.feed[1].user.userImagePreview.should.equals('profileImage/4/profilePreview.jpg');
        res.body.feed[1].user.isLoggedInUser.should.equals(false);
        res.body.feed[1].user.isTrustUser.should.equals(false);
        should.not.exist(res.body.feed[1].creator);
    });

    it('Show questions with only a few answers (trust circle)', async function () {
        dbDsl.createContactConnection('1', '3');

        dbDsl.createQuestion('4', {
            creatorId: '6', question: 'Das ist eine Frage3', description: 'Test elyoos.org change the world3',
            topics: ['topic2'], language: 'en', created: 666,
        });
        dbDsl.createTextAnswer('12', {
            creatorId: '5', questionId: '4', answer: 'Answer', created: 600,
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/question', {
            guiLanguage: 'de', languages: ['de', 'en'], order: 'onlyFewAnswers', trustCircle: 1
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].questionId.should.equals('2');
        res.body.feed[0].user.userId.should.equals('3');
    });

    it('Show questions with only a few answers (topic filter)', async function () {
        dbDsl.createQuestion('5', {
            creatorId: '4', question: 'Das ist eine Frage5', description: 'Test elyoos.org change the world5',
            topics: ['topic3'], language: 'de', created: 444,
        });
        dbDsl.createTextAnswer('6', {
            creatorId: '3', questionId: '5', answer: 'Answer6', created: 600,
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/question', {
            guiLanguage: 'de', languages: ['de', 'en'], order: 'onlyFewAnswers', topics: ['topic221', 'topic3']
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(2);

        res.body.feed[0].questionId.should.equals('2');
        res.body.feed[0].user.userId.should.equals('3');

        res.body.feed[1].questionId.should.equals('5');
        res.body.feed[1].user.userId.should.equals('4');
    });

    it('Show only english question', async function () {

        dbDsl.createTextAnswer('13', {
            creatorId: '3', questionId: '3', answer: 'Answer6', created: 600,
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/question', {
            guiLanguage: 'de', languages: ['en'], order: 'onlyFewAnswers'
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].questionId.should.equals('3');
        res.body.feed[0].user.userId.should.equals('4');
    });
});
