'use strict';

let users = require('elyoos-server-test-util').user;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let should = require('chai').should();

describe('Getting user profile with questions', function () {

    beforeEach(async function () {
        await dbDsl.init(4);

        dbDsl.createQuestion('10', {
            creatorId: '1', question: 'Das ist eine Frage', description: 'Test elyoos.org change the world', topics: ['Spiritual'],
            language: 'de', created: 666
        });
        dbDsl.createTextAnswer('100', {creatorId: '2', questionId: '10', answer: 'Das ist eine Antwort'});
        dbDsl.watchQuestion({questionId: '10', userId: '3'});
        dbDsl.watchQuestion({questionId: '10', userId: '4'});

        dbDsl.createQuestion('11', {
            creatorId: '1', question: 'Das ist eine Frage2', topics: ['Spiritual'],
            language: 'de', created: 555
        });

        dbDsl.createQuestion('12', {
            creatorId: '3', question: 'Das ist eine Frage3', description: 'description3', topics: ['Spiritual'],
            language: 'de', created: 777
        });
        dbDsl.createTextAnswer('101', {creatorId: '2', questionId: '12', answer: 'Das ist eine Antwort2'});
        dbDsl.watchQuestion({questionId: '12', userId: '1'});
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get profile of logged in user', async function () {

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile', {language: 'de'});
        res.status.should.equal(200);

        res.body.numberOfCreatedQuestions.should.equal(2);
        res.body.numberOfWatchingQuestions.should.equal(1);

        res.body.questions.length.should.equal(2);
        res.body.questions[0].questionId.should.equal('10');
        res.body.questions[0].question.should.equal('Das ist eine Frage');
        res.body.questions[0].descriptionHtml.should.equal(`Test <a href="http://elyoos.org" class="linkified" target="_blank">elyoos.org</a> change the world`);
        res.body.questions[0].questionSlug.should.equal('das-ist-eine-frage');
        res.body.questions[0].created.should.equal(666);
        res.body.questions[0].numberOfWatches.should.equal(2);
        res.body.questions[0].numberOfAnswers.should.equal(1);

        res.body.questions[1].questionId.should.equal('11');
        res.body.questions[1].question.should.equal('Das ist eine Frage2');
        should.not.exist(res.body.questions[1].descriptionHtml);
        res.body.questions[1].questionSlug.should.equal('das-ist-eine-frage2');
        res.body.questions[1].created.should.equal(555);
        res.body.questions[1].numberOfWatches.should.equal(0);
        res.body.questions[1].numberOfAnswers.should.equal(0);

        res.body.watchingQuestions.length.should.equal(1);
        res.body.watchingQuestions[0].questionId.should.equal('12');
        res.body.watchingQuestions[0].question.should.equal('Das ist eine Frage3');
        res.body.watchingQuestions[0].descriptionHtml.should.equal('description3');
        res.body.watchingQuestions[0].questionSlug.should.equal('das-ist-eine-frage3');
        res.body.watchingQuestions[0].created.should.equal(777);
        res.body.watchingQuestions[0].numberOfWatches.should.equal(1);
        res.body.watchingQuestions[0].numberOfAnswers.should.equal(1);
    });

    it('Get profile of another user', async function () {

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser2);
        let res = await requestHandler.get('/api/user/profile', {userId: '1', language: 'de'});
        res.status.should.equal(200);

        res.body.numberOfCreatedQuestions.should.equal(2);
        res.body.numberOfWatchingQuestions.should.equal(1);

        res.body.questions.length.should.equal(2);
        res.body.questions[0].questionId.should.equal('10');
        res.body.questions[0].question.should.equal('Das ist eine Frage');
        res.body.questions[0].descriptionHtml.should.equal(`Test <a href="http://elyoos.org" class="linkified" target="_blank">elyoos.org</a> change the world`);
        res.body.questions[0].questionSlug.should.equal('das-ist-eine-frage');
        res.body.questions[0].created.should.equal(666);
        res.body.questions[0].numberOfWatches.should.equal(2);
        res.body.questions[0].numberOfAnswers.should.equal(1);

        res.body.questions[1].questionId.should.equal('11');
        res.body.questions[1].question.should.equal('Das ist eine Frage2');
        should.not.exist(res.body.questions[1].descriptionHtml);
        res.body.questions[1].questionSlug.should.equal('das-ist-eine-frage2');
        res.body.questions[1].created.should.equal(555);
        res.body.questions[1].numberOfWatches.should.equal(0);
        res.body.questions[1].numberOfAnswers.should.equal(0);

        res.body.watchingQuestions.length.should.equal(1);
        res.body.watchingQuestions[0].questionId.should.equal('12');
        res.body.watchingQuestions[0].question.should.equal('Das ist eine Frage3');
        res.body.watchingQuestions[0].descriptionHtml.should.equal('description3');
        res.body.watchingQuestions[0].questionSlug.should.equal('das-ist-eine-frage3');
        res.body.watchingQuestions[0].created.should.equal(777);
        res.body.watchingQuestions[0].numberOfWatches.should.equal(1);
        res.body.watchingQuestions[0].numberOfAnswers.should.equal(1);
    });

    it('Get profile data of a user (Not logged in)', async function () {


        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/user/profile', {userId: '1', language: 'de'});
        res.status.should.equal(200);

        res.body.numberOfCreatedQuestions.should.equal(2);
        res.body.numberOfWatchingQuestions.should.equal(1);

        res.body.questions.length.should.equal(2);
        res.body.questions[0].questionId.should.equal('10');
        res.body.questions[0].question.should.equal('Das ist eine Frage');
        res.body.questions[0].descriptionHtml.should.equal(`Test <a href="http://elyoos.org" class="linkified" target="_blank">elyoos.org</a> change the world`);
        res.body.questions[0].questionSlug.should.equal('das-ist-eine-frage');
        res.body.questions[0].created.should.equal(666);
        res.body.questions[0].numberOfWatches.should.equal(2);
        res.body.questions[0].numberOfAnswers.should.equal(1);

        res.body.questions[1].questionId.should.equal('11');
        res.body.questions[1].question.should.equal('Das ist eine Frage2');
        should.not.exist(res.body.questions[1].descriptionHtml);
        res.body.questions[1].questionSlug.should.equal('das-ist-eine-frage2');
        res.body.questions[1].created.should.equal(555);
        res.body.questions[1].numberOfWatches.should.equal(0);
        res.body.questions[1].numberOfAnswers.should.equal(0);

        res.body.watchingQuestions.length.should.equal(1);
        res.body.watchingQuestions[0].questionId.should.equal('12');
        res.body.watchingQuestions[0].question.should.equal('Das ist eine Frage3');
        res.body.watchingQuestions[0].descriptionHtml.should.equal('description3');
        res.body.watchingQuestions[0].questionSlug.should.equal('das-ist-eine-frage3');
        res.body.watchingQuestions[0].created.should.equal(777);
        res.body.watchingQuestions[0].numberOfWatches.should.equal(1);
        res.body.watchingQuestions[0].numberOfAnswers.should.equal(1);
    });
});
