'use strict';

const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const moment = require('moment');

describe('Get public popular question', function () {

    let startTime;
    const FOUR_WEEKS = 2419200;

    beforeEach(async function () {
        await dbDsl.init(6);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createQuestion('1', {
            creatorId: '3', question: 'Das ist eine Frage', description: 'Test dumonda.me change the world',
            topics: ['Spiritual', 'Education'], language: 'de', created: 500, modified: 700
        });

        dbDsl.createQuestion('2', {
            creatorId: '3', question: 'Das ist eine Frage2', description: 'Test dumonda.me change the world2',
            topics: ['Spiritual', 'Education'], language: 'de', created: 400, modified: 701
        });
        dbDsl.createTextAnswer('50', {
            creatorId: '2', questionId:'2', answer: 'Answer', created: startTime - 600,
        });

        dbDsl.createQuestion('3', {
            creatorId: '3', question: 'Das ist eine Frage3', description: 'Test dumonda.me change the world3',
            topics: ['Spiritual', 'Education'], language: 'de', created: 401, modified: 701
        });
        dbDsl.createTextAnswer('51', {
            creatorId: '2', questionId:'3', answer: 'Answer2', created: startTime - 501,
        });
        dbDsl.createTextAnswer('52', {
            creatorId: '2', questionId:'3', answer: 'Answer3', created: startTime - 502,
        });
        dbDsl.watchQuestion({questionId: '3', userId: '5', created: startTime - 500});
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Returns the most popular questions of the last four weeks', async function () {
        dbDsl.createQuestion('4', {
            creatorId: '3', question: 'Das ist eine Frage4', description: 'Test dumonda.me change the world4',
            topics: ['Spiritual', 'Education'], language: 'de', created: 402, modified: 701
        });
        dbDsl.createTextAnswer('53', {
            creatorId: '2', questionId:'4', answer: 'Answer4', created: startTime - (FOUR_WEEKS - 10),
        });
        dbDsl.createTextAnswer('54', {
            creatorId: '2', questionId:'4', answer: 'Answer5', created: startTime - (FOUR_WEEKS - 10),
        });
        dbDsl.upVoteAnswer({userId: '4', answerId: '53', created: startTime - (FOUR_WEEKS - 10)});
        dbDsl.watchQuestion({questionId: '4', userId: '5', created: startTime - (FOUR_WEEKS - 10)});

        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/question/popular', {language: 'de'});
        res.status.should.equal(200);
        res.body.popularQuestions.length.should.equals(3);

        res.body.popularQuestions[0].questionId.should.equals('4');
        res.body.popularQuestions[0].question.should.equals('Das ist eine Frage4');
        res.body.popularQuestions[0].questionSlug.should.equals('das-ist-eine-frage4');
        res.body.popularQuestions[0].numberOfAnswers.should.equals(2);
        res.body.popularQuestions[0].numberOfWatches.should.equals(1);

        res.body.popularQuestions[1].questionId.should.equals('3');
        res.body.popularQuestions[1].question.should.equals('Das ist eine Frage3');
        res.body.popularQuestions[1].questionSlug.should.equals('das-ist-eine-frage3');
        res.body.popularQuestions[1].numberOfAnswers.should.equals(2);
        res.body.popularQuestions[1].numberOfWatches.should.equals(1);

        res.body.popularQuestions[2].questionId.should.equals('2');
        res.body.popularQuestions[2].question.should.equals('Das ist eine Frage2');
        res.body.popularQuestions[2].questionSlug.should.equals('das-ist-eine-frage2');
        res.body.popularQuestions[2].numberOfAnswers.should.equals(1);
        res.body.popularQuestions[2].numberOfWatches.should.equals(0);
    });

    it('Returns the most popular questions of the last four weeks (ignoring to old questions)', async function () {
        dbDsl.createQuestion('4', {
            creatorId: '3', question: 'Das ist eine Frage4', description: 'Test dumonda.me change the world4',
            topics: ['Spiritual', 'Education'], language: 'de', created: 402, modified: 701
        });
        dbDsl.createTextAnswer('53', {
            creatorId: '2', questionId:'4', answer: 'Answer4', created: startTime - (FOUR_WEEKS + 1),
        });
        dbDsl.createTextAnswer('54', {
            creatorId: '2', questionId:'4', answer: 'Answer5', created: startTime - (FOUR_WEEKS + 1),
        });
        dbDsl.upVoteAnswer({userId: '4', answerId: '53', created: - (FOUR_WEEKS + 1)});
        dbDsl.watchQuestion({questionId: '4', userId: '5', created: startTime - (FOUR_WEEKS + 1)});

        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/question/popular', {language: 'de'});
        res.status.should.equal(200);
        res.body.popularQuestions.length.should.equals(2);

        res.body.popularQuestions[0].questionId.should.equals('3');
        res.body.popularQuestions[0].question.should.equals('Das ist eine Frage3');
        res.body.popularQuestions[0].questionSlug.should.equals('das-ist-eine-frage3');
        res.body.popularQuestions[0].numberOfAnswers.should.equals(2);
        res.body.popularQuestions[0].numberOfWatches.should.equals(1);

        res.body.popularQuestions[1].questionId.should.equals('2');
        res.body.popularQuestions[1].question.should.equals('Das ist eine Frage2');
        res.body.popularQuestions[1].questionSlug.should.equals('das-ist-eine-frage2');
        res.body.popularQuestions[1].numberOfAnswers.should.equals(1);
        res.body.popularQuestions[1].numberOfWatches.should.equals(0);
    });
});
