'use strict';

const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const users = require('dumonda-me-server-test-util').user;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const moment = require('moment');
const should = require('chai').should();

describe('Get question feed for the most popular questions', function () {

    let startTime;
    const FOUR_WEEKS = 2419200;
    const WEEK = 604800;

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
            creatorId: '2', question: 'Das ist eine Frage', description: 'Test dumonda.me change the world1',
            topics: ['topic1'], language: 'de', created: 500, modified: 700
        });
        dbDsl.createTextAnswer('5', {
            creatorId: '3', questionId: '1', answer: 'Answer', created: 600,
        });
        dbDsl.createBookAnswer('6', {
            creatorId: '4', questionId: '1', created: 601, authors: 'Hans Wurst', googleBookId: '1234',
            hasPreviewImage: true
        });
        dbDsl.createQuestion('2', {
            creatorId: '3', question: 'Das ist eine Frage2', description: 'Test dumonda.me change the world2',
            topics: ['topic221'], language: 'de', created: 602,
        });
        dbDsl.createQuestion('3', {
            creatorId: '1', question: 'Das ist eine Frage3', description: 'Test dumonda.me change the world3',
            topics: ['topic2', 'topic3'], language: 'en', created: 555,
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Only questions with at least one answer are shown', async function () {
        dbDsl.upVoteAnswer({userId: '8', answerId: '5', created: 995});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/question', {
            guiLanguage: 'de', languages: ['de'], order: 'mostPopular'
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].questionId.should.equals('1');
        res.body.feed[0].question.should.equals('Das ist eine Frage');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage');
        res.body.feed[0].description.should.equals('Test dumonda.me change the world1');
        res.body.feed[0].descriptionHtml.should.equals(`Test <a href="http://dumonda.me" class="linkified" target="_blank">dumonda.me</a> change the world1`);
        res.body.feed[0].created.should.equals(500);
        res.body.feed[0].numberOfAnswers.should.equals(2);
        res.body.feed[0].numberOfWatches.should.equals(0);
        res.body.feed[0].isWatchedByUser.should.equals(false);
        res.body.feed[0].user.userId.should.equals('2');
        res.body.feed[0].user.name.should.equals('user Meier2');
        res.body.feed[0].user.slug.should.equals('user-meier2');
        res.body.feed[0].user.userImage.should.equals('profileImage/2/thumbnail.jpg');
        res.body.feed[0].user.userImagePreview.should.equals('profileImage/2/profilePreview.jpg');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(false);
        should.not.exist(res.body.feed[0].creator);
    });

    it('Question sorted by number of up votes and watches', async function () {
        dbDsl.createTextAnswer('7', {
            creatorId: '7', questionId: '2', answer: 'Answer2', created: 600,
        });
        dbDsl.createTextAnswer('8', {
            creatorId: '8', questionId: '3', answer: 'Answer3', created: 601,
        });
        //Score for question 3
        dbDsl.upVoteAnswer({userId: '4', answerId: '8', created: 999});
        dbDsl.upVoteAnswer({userId: '5', answerId: '8', created: 998});
        dbDsl.watchQuestion({questionId: '3', userId: '5', created: 997});
        dbDsl.watchQuestion({questionId: '3', userId: '6', created: 996});
        //Score for question 2
        dbDsl.upVoteAnswer({userId: '4', answerId: '7', created: 995});
        dbDsl.upVoteAnswer({userId: '5', answerId: '7', created: 994});
        dbDsl.watchQuestion({questionId: '2', userId: '1', created: 993});
        //Score for question1
        dbDsl.upVoteAnswer({userId: '8', answerId: '5', created: 995});

        dbDsl.createContactConnection('1', '3');

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/question', {
            guiLanguage: 'de', languages: ['de', 'en'], order: 'mostPopular'
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(3);

        res.body.feed[0].questionId.should.equals('3');
        res.body.feed[0].numberOfAnswers.should.equals(1);
        res.body.feed[0].numberOfWatches.should.equals(2);
        res.body.feed[0].isWatchedByUser.should.equals(false);
        res.body.feed[0].user.userId.should.equals('1');
        res.body.feed[0].user.isLoggedInUser.should.equals(true);
        res.body.feed[0].user.isTrustUser.should.equals(false);

        res.body.feed[1].questionId.should.equals('2');
        res.body.feed[1].numberOfAnswers.should.equals(1);
        res.body.feed[1].numberOfWatches.should.equals(1);
        res.body.feed[1].isWatchedByUser.should.equals(true);
        res.body.feed[1].user.userId.should.equals('3');
        res.body.feed[1].user.isLoggedInUser.should.equals(false);
        res.body.feed[1].user.isTrustUser.should.equals(true);

        res.body.feed[2].questionId.should.equals('1');
        res.body.feed[2].numberOfAnswers.should.equals(2);
        res.body.feed[2].numberOfWatches.should.equals(0);
        res.body.feed[2].user.userId.should.equals('2');
        res.body.feed[2].user.isLoggedInUser.should.equals(false);
        res.body.feed[2].user.isTrustUser.should.equals(false);
    });

    it('Question sorted by number of up votes and watches (only trust circle)', async function () {
        dbDsl.createTextAnswer('7', {
            creatorId: '7', questionId: '2', answer: 'Answer2', created: 600,
        });
        dbDsl.createTextAnswer('8', {
            creatorId: '8', questionId: '3', answer: 'Answer3', created: 601,
        });
        //Score for question 3
        dbDsl.upVoteAnswer({userId: '4', answerId: '8', created: 999});
        dbDsl.upVoteAnswer({userId: '5', answerId: '8', created: 998});
        dbDsl.watchQuestion({questionId: '3', userId: '6', created: 997});
        dbDsl.watchQuestion({questionId: '3', userId: '7', created: 996});
        //Score for question 2
        dbDsl.upVoteAnswer({userId: '8', answerId: '7', created: 995});
        dbDsl.upVoteAnswer({userId: '9', answerId: '7', created: 994});
        dbDsl.watchQuestion({questionId: '2', userId: '10', created: 993});
        //Score for question1
        dbDsl.upVoteAnswer({userId: '11', answerId: '5', created: 995});

        dbDsl.createContactConnection('1', '4');
        dbDsl.createContactConnection('1', '8');
        dbDsl.createContactConnection('1', '10');

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/question', {
            guiLanguage: 'de', languages: ['de', 'en'], order: 'mostPopular', trustCircle: 1
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(2);

        res.body.feed[0].questionId.should.equals('2');
        res.body.feed[0].numberOfAnswers.should.equals(1);
        res.body.feed[0].numberOfWatches.should.equals(1);
        res.body.feed[0].isWatchedByUser.should.equals(false);
        res.body.feed[0].user.userId.should.equals('3');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(false);

        res.body.feed[1].questionId.should.equals('3');
        res.body.feed[1].numberOfAnswers.should.equals(1);
        res.body.feed[1].numberOfWatches.should.equals(2);
        res.body.feed[1].isWatchedByUser.should.equals(false);
        res.body.feed[1].user.userId.should.equals('1');
        res.body.feed[1].user.isLoggedInUser.should.equals(true);
        res.body.feed[1].user.isTrustUser.should.equals(false);
    });

    it('Question sorted by number of up votes and watches (topic filter)', async function () {
        dbDsl.createTextAnswer('7', {
            creatorId: '7', questionId: '2', answer: 'Answer2', created: 600,
        });
        dbDsl.createTextAnswer('8', {
            creatorId: '8', questionId: '3', answer: 'Answer3', created: 601,
        });
        //Score for question 3
        dbDsl.upVoteAnswer({userId: '4', answerId: '8', created: 999});
        dbDsl.upVoteAnswer({userId: '5', answerId: '8', created: 998});
        dbDsl.watchQuestion({questionId: '3', userId: '5', created: 997});
        dbDsl.watchQuestion({questionId: '3', userId: '6', created: 996});
        //Score for question 2
        dbDsl.upVoteAnswer({userId: '4', answerId: '7', created: 995});
        dbDsl.upVoteAnswer({userId: '5', answerId: '7', created: 994});
        dbDsl.watchQuestion({questionId: '2', userId: '1', created: 993});
        //Score for question1
        dbDsl.upVoteAnswer({userId: '8', answerId: '5', created: 995});

        dbDsl.createContactConnection('1', '3');

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/question', {
            guiLanguage: 'de', languages: ['de', 'en'], order: 'mostPopular', topics: ['topic221', 'topic3']
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(2);

        res.body.feed[0].questionId.should.equals('3');
        res.body.feed[0].numberOfAnswers.should.equals(1);
        res.body.feed[0].numberOfWatches.should.equals(2);
        res.body.feed[0].isWatchedByUser.should.equals(false);
        res.body.feed[0].user.userId.should.equals('1');
        res.body.feed[0].user.isLoggedInUser.should.equals(true);
        res.body.feed[0].user.isTrustUser.should.equals(false);

        res.body.feed[1].questionId.should.equals('2');
        res.body.feed[1].numberOfAnswers.should.equals(1);
        res.body.feed[1].numberOfWatches.should.equals(1);
        res.body.feed[1].isWatchedByUser.should.equals(true);
        res.body.feed[1].user.userId.should.equals('3');
        res.body.feed[1].user.isLoggedInUser.should.equals(false);
        res.body.feed[1].user.isTrustUser.should.equals(true);
    });

    it('Question sorted by number of up votes and watches (trust circle and topic filter)', async function () {
        dbDsl.createTextAnswer('7', {
            creatorId: '7', questionId: '2', answer: 'Answer2', created: 600,
        });
        dbDsl.createTextAnswer('8', {
            creatorId: '8', questionId: '3', answer: 'Answer3', created: 601,
        });
        //Score for question 3
        dbDsl.upVoteAnswer({userId: '4', answerId: '8', created: 999});
        dbDsl.upVoteAnswer({userId: '5', answerId: '8', created: 998});
        dbDsl.watchQuestion({questionId: '3', userId: '6', created: 997});
        dbDsl.watchQuestion({questionId: '3', userId: '7', created: 996});
        //Score for question 2
        dbDsl.upVoteAnswer({userId: '8', answerId: '7', created: 995});
        dbDsl.upVoteAnswer({userId: '9', answerId: '7', created: 994});
        dbDsl.watchQuestion({questionId: '2', userId: '10', created: 993});
        //Score for question1
        dbDsl.upVoteAnswer({userId: '11', answerId: '5', created: 995});

        dbDsl.createContactConnection('1', '4');
        dbDsl.createContactConnection('1', '8');
        dbDsl.createContactConnection('1', '10');

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/question', {
            guiLanguage: 'de', languages: ['de', 'en'], order: 'mostPopular', trustCircle: 1, topics: ['topic221']
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].questionId.should.equals('2');
        res.body.feed[0].numberOfAnswers.should.equals(1);
        res.body.feed[0].numberOfWatches.should.equals(1);
        res.body.feed[0].isWatchedByUser.should.equals(false);
        res.body.feed[0].user.userId.should.equals('3');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(false);
    });

    it('Question show only english', async function () {
        dbDsl.createTextAnswer('7', {
            creatorId: '7', questionId: '2', answer: 'Answer2', created: 600,
        });
        dbDsl.createTextAnswer('8', {
            creatorId: '8', questionId: '3', answer: 'Answer3', created: 601,
        });
        //Score for question 3
        dbDsl.upVoteAnswer({userId: '4', answerId: '8', created: 999});
        //Score for question 2
        dbDsl.upVoteAnswer({userId: '4', answerId: '7', created: 995});
        //Score for question1
        dbDsl.upVoteAnswer({userId: '8', answerId: '5', created: 995});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/question', {
            guiLanguage: 'de', languages: ['en'], order: 'mostPopular'
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].questionId.should.equals('3');
        res.body.feed[0].numberOfAnswers.should.equals(1);
        res.body.feed[0].numberOfWatches.should.equals(0);
        res.body.feed[0].isWatchedByUser.should.equals(false);
        res.body.feed[0].user.userId.should.equals('1');
        res.body.feed[0].user.isLoggedInUser.should.equals(true);
        res.body.feed[0].user.isTrustUser.should.equals(false);
    });

    it('Question sorted by number of up votes and watches (only last 7 Days)', async function () {
        dbDsl.createTextAnswer('7', {
            creatorId: '7', questionId: '2', answer: 'Answer2', created: 600,
        });
        dbDsl.createTextAnswer('8', {
            creatorId: '8', questionId: '3', answer: 'Answer3', created: 601,
        });
        //Score for question 3
        dbDsl.upVoteAnswer({userId: '4', answerId: '8', created: startTime - (WEEK - 10)});
        dbDsl.upVoteAnswer({userId: '5', answerId: '8', created: startTime - (WEEK + 11)});
        dbDsl.watchQuestion({questionId: '3', userId: '5', created: startTime - (WEEK + 12)});
        dbDsl.watchQuestion({questionId: '3', userId: '6', created: startTime - (WEEK + 10)});
        //Score for question 2
        dbDsl.upVoteAnswer({userId: '4', answerId: '7', created: startTime - (WEEK + 10)});
        dbDsl.upVoteAnswer({userId: '5', answerId: '7', created: startTime - (WEEK - 10)});
        dbDsl.watchQuestion({questionId: '2', userId: '1', created: startTime - (WEEK - 11)});
        //Score for question1
        dbDsl.upVoteAnswer({userId: '8', answerId: '5', created: startTime - (WEEK + 11)});

        dbDsl.createContactConnection('1', '3');

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/question', {
            guiLanguage: 'de', languages: ['de', 'en'], order: 'mostPopular', periodOfTime: 'week'
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(2);

        res.body.feed[0].questionId.should.equals('2');
        res.body.feed[0].numberOfAnswers.should.equals(1);
        res.body.feed[0].numberOfWatches.should.equals(1);
        res.body.feed[0].isWatchedByUser.should.equals(true);
        res.body.feed[0].user.userId.should.equals('3');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(true);

        res.body.feed[1].questionId.should.equals('3');
        res.body.feed[1].numberOfAnswers.should.equals(1);
        res.body.feed[1].numberOfWatches.should.equals(2);
        res.body.feed[1].isWatchedByUser.should.equals(false);
        res.body.feed[1].user.userId.should.equals('1');
        res.body.feed[1].user.isLoggedInUser.should.equals(true);
        res.body.feed[1].user.isTrustUser.should.equals(false);
    });

    it('Question sorted by number of up votes and watches (only last month)', async function () {
        dbDsl.createTextAnswer('7', {
            creatorId: '7', questionId: '2', answer: 'Answer2', created: 600,
        });
        dbDsl.createTextAnswer('8', {
            creatorId: '8', questionId: '3', answer: 'Answer3', created: 601,
        });
        //Score for question 3
        dbDsl.upVoteAnswer({userId: '4', answerId: '8', created: startTime - (FOUR_WEEKS - 10)});
        dbDsl.upVoteAnswer({userId: '5', answerId: '8', created: startTime - (FOUR_WEEKS + 11)});
        dbDsl.watchQuestion({questionId: '3', userId: '5', created: startTime - (FOUR_WEEKS + 12)});
        dbDsl.watchQuestion({questionId: '3', userId: '6', created: startTime - (FOUR_WEEKS + 10)});
        //Score for question 2
        dbDsl.upVoteAnswer({userId: '4', answerId: '7', created: startTime - (FOUR_WEEKS + 10)});
        dbDsl.upVoteAnswer({userId: '5', answerId: '7', created: startTime - (FOUR_WEEKS - 10)});
        dbDsl.watchQuestion({questionId: '2', userId: '1', created: startTime - (FOUR_WEEKS - 11)});
        //Score for question1
        dbDsl.upVoteAnswer({userId: '8', answerId: '5', created: startTime - (FOUR_WEEKS + 11)});

        dbDsl.createContactConnection('1', '3');

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/question', {
            guiLanguage: 'de', languages: ['de', 'en'], order: 'mostPopular', periodOfTime: 'month'
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(2);

        res.body.feed[0].questionId.should.equals('2');
        res.body.feed[0].numberOfAnswers.should.equals(1);
        res.body.feed[0].numberOfWatches.should.equals(1);
        res.body.feed[0].isWatchedByUser.should.equals(true);
        res.body.feed[0].user.userId.should.equals('3');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(true);

        res.body.feed[1].questionId.should.equals('3');
        res.body.feed[1].numberOfAnswers.should.equals(1);
        res.body.feed[1].numberOfWatches.should.equals(2);
        res.body.feed[1].isWatchedByUser.should.equals(false);
        res.body.feed[1].user.userId.should.equals('1');
        res.body.feed[1].user.isLoggedInUser.should.equals(true);
        res.body.feed[1].user.isTrustUser.should.equals(false);
    });
});
