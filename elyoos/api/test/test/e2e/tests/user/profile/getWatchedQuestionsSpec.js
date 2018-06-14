'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let should = require('chai').should();

describe('Get questions watched by the requested user', function () {

    beforeEach(async function () {
        await dbDsl.init(9);

        dbDsl.createQuestion('100', {
            creatorId: '3', question: 'Das ist eine Frage', description: 'Test elyoos.org change the world',
            topics: ['Spiritual'], language: 'de', created: 666
        });

        dbDsl.createQuestion('101', {
            creatorId: '3', question: 'Das ist eine Frage2', description: 'Test elyoos.org change the world2',
            topics: ['Spiritual'], language: 'de', created: 665
        });
        dbDsl.createTextAnswer('10', {creatorId: '3', questionId: '101', answer: 'Das ist eine Antwort'});
        dbDsl.watchQuestion({questionId: '101', userId: '4'});
        dbDsl.watchQuestion({questionId: '101', userId: '5'});

        dbDsl.createQuestion('102', {
            creatorId: '3', question: 'Das ist eine Frage3',
            topics: ['Spiritual'], language: 'de', created: 664
        });

        dbDsl.createQuestion('103', {
            creatorId: '3', question: 'Das ist eine Frage4', description: 'Test elyoos.org change the world4',
            topics: ['Spiritual'], language: 'de', created: 663
        });

        dbDsl.createQuestion('104', {
            creatorId: '3', question: 'Das ist eine Frage5', description: 'Test elyoos.org change the world5',
            topics: ['Spiritual'], language: 'de', created: 777
        });

        dbDsl.watchQuestion({questionId: '100', userId: '1'});
        dbDsl.watchQuestion({questionId: '101', userId: '1'});
        dbDsl.watchQuestion({questionId: '102', userId: '1'});
        dbDsl.watchQuestion({questionId: '103', userId: '1'});
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get questions the logged in user is watching', async function () {

        dbDsl.setUserPrivacy('1', {privacyMode: 'onlyContact'});
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile/question', {
            userId: '1', maxItems: 2, skip: 1, isWatching: true
        });
        res.status.should.equal(200);
        res.body.numberOfQuestions.should.equal(4);

        res.body.questions.length.should.equal(2);
        res.body.questions[0].questionId.should.equal('101');
        res.body.questions[0].question.should.equal('Das ist eine Frage2');
        res.body.questions[0].descriptionHtml.should.equal(`Test <a href="http://elyoos.org" class="linkified" target="_blank">elyoos.org</a> change the world2`);
        res.body.questions[0].questionSlug.should.equal('das-ist-eine-frage2');
        res.body.questions[0].created.should.equal(665);
        res.body.questions[0].numberOfWatches.should.equal(3);
        res.body.questions[0].numberOfAnswers.should.equal(1);

        res.body.questions[1].questionId.should.equal('102');
        res.body.questions[1].question.should.equal('Das ist eine Frage3');
        should.not.exist(res.body.questions[1].descriptionHtml);
        res.body.questions[1].questionSlug.should.equal('das-ist-eine-frage3');
        res.body.questions[1].created.should.equal(664);
        res.body.questions[1].numberOfWatches.should.equal(1);
        res.body.questions[1].numberOfAnswers.should.equal(0);
    });

    it('Get question a user is watching (public, visible)', async function () {

        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser2);
        let res = await requestHandler.get('/api/user/profile/question', {
            userId: '1', maxItems: 2, skip: 1, isWatching: true
        });
        res.status.should.equal(200);
        res.body.numberOfQuestions.should.equal(4);

        res.body.questions.length.should.equal(2);
        res.body.questions[0].questionId.should.equal('101');
        res.body.questions[0].question.should.equal('Das ist eine Frage2');
        res.body.questions[0].descriptionHtml.should.equal(`Test <a href="http://elyoos.org" class="linkified" target="_blank">elyoos.org</a> change the world2`);
        res.body.questions[0].questionSlug.should.equal('das-ist-eine-frage2');
        res.body.questions[0].created.should.equal(665);
        res.body.questions[0].numberOfWatches.should.equal(3);
        res.body.questions[0].numberOfAnswers.should.equal(1);

        res.body.questions[1].questionId.should.equal('102');
        res.body.questions[1].question.should.equal('Das ist eine Frage3');
        should.not.exist(res.body.questions[1].descriptionHtml);
        res.body.questions[1].questionSlug.should.equal('das-ist-eine-frage3');
        res.body.questions[1].created.should.equal(664);
        res.body.questions[1].numberOfWatches.should.equal(1);
        res.body.questions[1].numberOfAnswers.should.equal(0);
    });

    it('Get question a user is watching (publicEl, visible)', async function () {

        dbDsl.setUserPrivacy('1', {privacyMode: 'publicEl'});
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser2);
        let res = await requestHandler.get('/api/user/profile/question', {
            userId: '1', maxItems: 2, skip: 1, isWatching: true
        });
        res.status.should.equal(200);
        res.body.numberOfQuestions.should.equal(4);
        res.body.questions.length.should.equal(2);
    });

    it('Get question a user is watching (publicEl, invisible)', async function () {

        dbDsl.setUserPrivacy('1', {privacyMode: 'publicEl'});
        await dbDsl.sendToDb();

        let res = await requestHandler.get('/api/user/profile/question', {
            userId: '1', maxItems: 2, skip: 1, isWatching: true
        });
        res.status.should.equal(401);
    });

    it('Get question a user is watching (onlyContact, visible)', async function () {

        dbDsl.setUserPrivacy('1', {privacyMode: 'onlyContact'});
        dbDsl.createContactConnection('1', '2');
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser2);
        let res = await requestHandler.get('/api/user/profile/question', {
            userId: '1', maxItems: 2, skip: 1, isWatching: true
        });
        res.status.should.equal(200);
        res.body.numberOfQuestions.should.equal(4);
        res.body.questions.length.should.equal(2);
    });

    it('Get question a user is watching (onlyContact, invisible)', async function () {

        dbDsl.setUserPrivacy('1', {privacyMode: 'onlyContact'});
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser2);
        let res = await requestHandler.get('/api/user/profile/question', {
            userId: '1', maxItems: 2, skip: 1, isWatching: true
        });
        res.status.should.equal(401);
    });

});
