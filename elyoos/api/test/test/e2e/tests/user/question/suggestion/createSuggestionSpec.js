'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let should = require('chai').should();
let moment = require('moment');

describe('Creating a new suggestion for a question', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(3);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});
        dbDsl.createMainTopic({topicId: 'topic2', descriptionDe: 'topic2De', descriptionEn: 'topic2En'});

        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine FragöÖÄäÜü', description: 'description', topics: ['topic1'],
            language: 'de'
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Super user adds suggestion with all params', async function () {
        dbDsl.setUserIsSuperUser('1');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/suggestion', {
            questionId: '1',
            title: 'newTitle1',
            description: 'newDescription1',
            explanation: 'explanation1',
        });
        res.status.should.equal(200);
        res.body.created.should.least(startTime);
        res.body.creator.name.should.equals('user Meier');
        res.body.creator.slug.should.equals('user-meier');
        res.body.creator.isLoggedInUser.should.equals(true);
        res.body.creator.isTrustUser.should.equals(false);
        res.body.creator.userImage.should.equals('profileImage/1/thumbnail.jpg');
        res.body.creator.userImagePreview.should.equals('profileImage/1/profilePreview.jpg');

        let resp = await db.cypher().match("(:Question {questionId: '1'})<-[:SUGGESTION]-(suggestion:QuestionSuggestion)<-[:IS_CREATOR]-(:User {userId: '1'})")
            .return(`suggestion`).end().send();
        resp.length.should.equals(1);
        resp[0].suggestion.suggestionId.should.equals(res.body.suggestionId);
        resp[0].suggestion.created.should.equals(res.body.created);
        resp[0].suggestion.title.should.equals('newTitle1');
        resp[0].suggestion.description.should.equals('newDescription1');
        resp[0].suggestion.explanation.should.equals('explanation1');
    });

    it('Super user adds suggestion only title', async function () {
        dbDsl.setUserIsSuperUser('1');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/suggestion', {
            questionId: '1',
            title: 'newTitle1',
        });
        res.status.should.equal(200);

        let resp = await db.cypher().match("(:Question {questionId: '1'})<-[:SUGGESTION]-(suggestion:QuestionSuggestion)<-[:IS_CREATOR]-(:User {userId: '1'})")
            .return(`suggestion`).end().send();
        resp.length.should.equals(1);
        resp[0].suggestion.suggestionId.should.equals(res.body.suggestionId);
        resp[0].suggestion.created.should.least(startTime);
        resp[0].suggestion.title.should.equals('newTitle1');
        should.not.exist(resp[0].suggestion.description);
        should.not.exist(resp[0].suggestion.explanation);
    });

    it('Super user adds suggestion with only description', async function () {
        dbDsl.setUserIsSuperUser('1');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/suggestion', {
            questionId: '1',
            description: 'newDescription1',
        });
        res.status.should.equal(200);

        let resp = await db.cypher().match("(:Question {questionId: '1'})<-[:SUGGESTION]-(suggestion:QuestionSuggestion)<-[:IS_CREATOR]-(:User {userId: '1'})")
            .return(`suggestion`).end().send();
        resp.length.should.equals(1);
        resp[0].suggestion.suggestionId.should.equals(res.body.suggestionId);
        resp[0].suggestion.created.should.least(startTime);
        resp[0].suggestion.description.should.equals('newDescription1');
        should.not.exist(resp[0].suggestion.title);
        should.not.exist(resp[0].suggestion.explanation);
    });

    it('Super user adds suggestion with only explanation', async function () {
        dbDsl.setUserIsSuperUser('1');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/suggestion', {
            questionId: '1',
            explanation: 'explanation1',
        });
        res.status.should.equal(200);

        let resp = await db.cypher().match("(:Question {questionId: '1'})<-[:SUGGESTION]-(suggestion:QuestionSuggestion)<-[:IS_CREATOR]-(:User {userId: '1'})")
            .return(`suggestion`).end().send();
        resp.length.should.equals(1);
        resp[0].suggestion.suggestionId.should.equals(res.body.suggestionId);
        resp[0].suggestion.created.should.least(startTime);
        resp[0].suggestion.explanation.should.equals('explanation1');
        should.not.exist(resp[0].suggestion.title);
        should.not.exist(resp[0].suggestion.description);
    });

    it('Fails because only questionId has been sent', async function () {
        dbDsl.setUserIsSuperUser('1');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/suggestion', {
            questionId: '1',
        });
        res.status.should.equal(400);

        let resp = await db.cypher().match("(:Question {questionId: '1'})<-[:SUGGESTION]-(suggestion:QuestionSuggestion)<-[:IS_CREATOR]-(:User {userId: '1'})")
            .return(`suggestion`).end().send();
        resp.length.should.equals(0);
    });

    it('Fails because user is not super user', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/suggestion', {
            questionId: '1',
            explanation: 'explanation1',
        });
        res.status.should.equal(400);

        let resp = await db.cypher().match("(:Question {questionId: '1'})<-[:SUGGESTION]-(suggestion:QuestionSuggestion)<-[:IS_CREATOR]-(:User {userId: '1'})")
            .return(`suggestion`).end().send();
        resp.length.should.equals(0);
    });

    it('Fails because user is admin of question', async function () {
        dbDsl.setUserIsSuperUser('2');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser2);
        let res = await requestHandler.post('/api/user/question/suggestion', {
            questionId: '1',
            explanation: 'explanation1',
        });
        res.status.should.equal(400);

        let resp = await db.cypher().match("(:Question {questionId: '1'})<-[:SUGGESTION]-(suggestion:QuestionSuggestion)<-[:IS_CREATOR]-(:User {userId: '1'})")
            .return(`suggestion`).end().send();
        resp.length.should.equals(0);
    });
});
