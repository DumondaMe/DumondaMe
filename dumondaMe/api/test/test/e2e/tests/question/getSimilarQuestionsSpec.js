'use strict';

const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;

describe('Get similar question', function () {

    beforeEach(async function () {
        await dbDsl.init(7);

        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});
        dbDsl.createMainTopic({topicId: 'topic2', descriptionDe: 'topic2De', descriptionEn: 'topic2En'});
        dbDsl.createSubTopic({
            parentTopicId: 'topic2', topicId: 'topic21', descriptionDe: 'topic21De', descriptionEn: 'topic21En'
        });
        dbDsl.createSubTopic({
            parentTopicId: 'topic2', topicId: 'topic22', descriptionDe: 'topic22De', descriptionEn: 'topic22En'
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get similar questions sorted by number of same topics', async function () {
        dbDsl.createQuestion('1', {
            creatorId: '3', question: 'Das ist eine Frage', description: 'Test',
            topics: ['topic1', 'topic22'], language: 'de', created: 500, modified: 700
        });

        dbDsl.createQuestion('2', {
            creatorId: '3', question: 'Das ist eine Frage2', description: 'Test',
            topics: ['topic1', 'topic22'], language: 'de', created: 500, modified: 700
        });

        dbDsl.createQuestion('3', {
            creatorId: '3', question: 'Das ist eine Frage3', description: 'Test',
            topics: ['topic1'], language: 'de', created: 666, modified: 700
        });

        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/question/similar',
            {timestamp: 800, questionId: '1', skip: 0, limit: 10});
        res.status.should.equal(200);
        res.body.similarQuestions.length.should.equals(2);

        res.body.similarQuestions[0].questionId.should.equals('2');
        res.body.similarQuestions[0].question.should.equals('Das ist eine Frage2');
        res.body.similarQuestions[0].questionSlug.should.equals('das-ist-eine-frage2');
        res.body.similarQuestions[0].numberOfAnswers.should.equals(0);

        res.body.similarQuestions[1].questionId.should.equals('3');
        res.body.similarQuestions[1].question.should.equals('Das ist eine Frage3');
        res.body.similarQuestions[1].questionSlug.should.equals('das-ist-eine-frage3');
        res.body.similarQuestions[1].numberOfAnswers.should.equals(0);
    });

    it('Get similar questions sorted by number of watches', async function () {
        dbDsl.createQuestion('1', {
            creatorId: '3', question: 'Das ist eine Frage', description: 'Test',
            topics: ['topic1', 'topic22'], language: 'de', created: 500, modified: 700
        });

        dbDsl.createQuestion('2', {
            creatorId: '3', question: 'Das ist eine Frage2', description: 'Test',
            topics: ['topic1', 'topic22'], language: 'de', created: 500, modified: 700
        });

        dbDsl.createQuestion('3', {
            creatorId: '3', question: 'Das ist eine Frage3', description: 'Test',
            topics: ['topic1', 'topic22'], language: 'de', created: 666, modified: 700
        });

        dbDsl.watchQuestion({questionId: '2', userId: '1', created: 555});
        dbDsl.watchQuestion({questionId: '2', userId: '2', created: 666});
        dbDsl.watchQuestion({questionId: '2', userId: '7', created: 801});
        dbDsl.watchQuestion({questionId: '3', userId: '4', created: 555});
        dbDsl.watchQuestion({questionId: '3', userId: '5', created: 666});
        dbDsl.watchQuestion({questionId: '3', userId: '6', created: 666});

        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/question/similar',
            {timestamp: 800, questionId: '1', skip: 0, limit: 10});
        res.status.should.equal(200);
        res.body.similarQuestions.length.should.equals(2);

        res.body.similarQuestions[0].questionId.should.equals('3');
        res.body.similarQuestions[0].question.should.equals('Das ist eine Frage3');
        res.body.similarQuestions[0].questionSlug.should.equals('das-ist-eine-frage3');
        res.body.similarQuestions[0].numberOfAnswers.should.equals(0);

        res.body.similarQuestions[1].questionId.should.equals('2');
        res.body.similarQuestions[1].question.should.equals('Das ist eine Frage2');
        res.body.similarQuestions[1].questionSlug.should.equals('das-ist-eine-frage2');
        res.body.similarQuestions[1].numberOfAnswers.should.equals(0);
    });

    it('Get similar questions sorted by number of up votes of answers', async function () {
        dbDsl.createQuestion('1', {
            creatorId: '3', question: 'Das ist eine Frage', description: 'Test',
            topics: ['topic1', 'topic22'], language: 'de', created: 500, modified: 700
        });

        dbDsl.createQuestion('2', {
            creatorId: '3', question: 'Das ist eine Frage2', description: 'Test',
            topics: ['topic1', 'topic22'], language: 'de', created: 500, modified: 700
        });
        dbDsl.createTextAnswer('50', {
            creatorId: '2', questionId: '2', answer: 'Answer', created: 500,
        });
        dbDsl.upVoteAnswer({userId: '1', answerId: '50', created: 500});
        dbDsl.upVoteAnswer({userId: '3', answerId: '50', created: 500});
        dbDsl.upVoteAnswer({userId: '4', answerId: '50', created: 801});

        dbDsl.createQuestion('3', {
            creatorId: '3', question: 'Das ist eine Frage3', description: 'Test',
            topics: ['topic1', 'topic22'], language: 'de', created: 444, modified: 700
        });
        dbDsl.createTextAnswer('51', {
            creatorId: '2', questionId: '3', answer: 'Answer', created: 500,
        });
        dbDsl.createTextAnswer('52', {
            creatorId: '2', questionId: '3', answer: 'Answer', created: 500,
        });
        dbDsl.upVoteAnswer({userId: '5', answerId: '51', created: 500});
        dbDsl.upVoteAnswer({userId: '6', answerId: '52', created: 500});
        dbDsl.upVoteAnswer({userId: '7', answerId: '52', created: 799});

        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/question/similar',
            {timestamp: 800, questionId: '1', skip: 0, limit: 10});
        res.status.should.equal(200);
        res.body.similarQuestions.length.should.equals(2);

        res.body.similarQuestions[0].questionId.should.equals('3');
        res.body.similarQuestions[0].question.should.equals('Das ist eine Frage3');
        res.body.similarQuestions[0].questionSlug.should.equals('das-ist-eine-frage3');
        res.body.similarQuestions[0].numberOfAnswers.should.equals(2);

        res.body.similarQuestions[1].questionId.should.equals('2');
        res.body.similarQuestions[1].question.should.equals('Das ist eine Frage2');
        res.body.similarQuestions[1].questionSlug.should.equals('das-ist-eine-frage2');
        res.body.similarQuestions[1].numberOfAnswers.should.equals(1);
    });

    it('Get similar questions sorted by creation date', async function () {

        dbDsl.createQuestion('1', {
            creatorId: '3', question: 'Das ist eine Frage', description: 'Test',
            topics: ['topic1', 'topic22'], language: 'de', created: 500, modified: 700
        });

        dbDsl.createQuestion('2', {
            creatorId: '3', question: 'Das ist eine Frage2', description: 'Test',
            topics: ['topic1'], language: 'de', created: 777, modified: 700
        });

        dbDsl.createQuestion('3', {
            creatorId: '3', question: 'Das ist eine Frage3', description: 'Test',
            topics: ['topic1'], language: 'de', created: 666, modified: 700
        });

        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/question/similar',
            {timestamp: 800, questionId: '1', skip: 0, limit: 10});
        res.status.should.equal(200);
        res.body.similarQuestions.length.should.equals(2);

        res.body.similarQuestions[0].questionId.should.equals('2');
        res.body.similarQuestions[0].question.should.equals('Das ist eine Frage2');
        res.body.similarQuestions[0].questionSlug.should.equals('das-ist-eine-frage2');
        res.body.similarQuestions[0].numberOfAnswers.should.equals(0);

        res.body.similarQuestions[1].questionId.should.equals('3');
        res.body.similarQuestions[1].question.should.equals('Das ist eine Frage3');
        res.body.similarQuestions[1].questionSlug.should.equals('das-ist-eine-frage3');
        res.body.similarQuestions[1].numberOfAnswers.should.equals(0);
    });

    it('Ignore questions created after timestamp', async function () {

        dbDsl.createQuestion('1', {
            creatorId: '3', question: 'Das ist eine Frage', description: 'Test',
            topics: ['topic21', 'topic22'], language: 'de', created: 500, modified: 700
        });

        dbDsl.createQuestion('2', {
            creatorId: '3', question: 'Das ist eine Frage2', description: 'Test',
            topics: ['topic21', 'topic22'], language: 'en', created: 801, modified: 700
        });

        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/question/similar',
            {timestamp: 800, questionId: '1', skip: 0, limit: 10});
        res.status.should.equal(200);
        res.body.similarQuestions.length.should.equals(0);
    });

    it('Ignore questions with no intersecting topic', async function () {

        dbDsl.createQuestion('1', {
            creatorId: '3', question: 'Das ist eine Frage', description: 'Test',
            topics: ['topic21', 'topic22'], language: 'de', created: 500, modified: 700
        });

        dbDsl.createQuestion('2', {
            creatorId: '3', question: 'Das ist eine Frage2', description: 'Test',
            topics: ['topic1'], language: 'en', created: 500, modified: 700
        });

        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/question/similar',
            {timestamp: 800, questionId: '1', skip: 0, limit: 10});
        res.status.should.equal(200);
        res.body.similarQuestions.length.should.equals(0);
    });

    it('Ignore questions with other languages', async function () {

        dbDsl.createQuestion('1', {
            creatorId: '3', question: 'Das ist eine Frage', description: 'Test',
            topics: ['topic1', 'topic22'], language: 'de', created: 500, modified: 700
        });

        dbDsl.createQuestion('2', {
            creatorId: '3', question: 'Das ist eine Frage2', description: 'Test',
            topics: ['topic1', 'topic22'], language: 'en', created: 500, modified: 700
        });

        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/question/similar',
            {timestamp: 800, questionId: '1', skip: 0, limit: 10});
        res.status.should.equal(200);
        res.body.similarQuestions.length.should.equals(0);
    });
});
