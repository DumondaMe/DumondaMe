'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let should = require('chai').should();

describe('Edit a suggestion of a question', function () {

    beforeEach(async function () {
        await dbDsl.init(3);

        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});
        dbDsl.createMainTopic({topicId: 'topic2', descriptionDe: 'topic2De', descriptionEn: 'topic2En'});

        dbDsl.createQuestion('10', {
            creatorId: '2', question: 'Das ist eine FragöÖÄäÜü', description: 'description', topics: ['topic1'],
            language: 'de'
        });

        dbDsl.addSuggestionToQuestion({
            questionId: '10', suggestionId: '100', userId: '1', title: 'newTitle', description: 'newDescription',
            explanation: 'explanation'
        })
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Super user edits suggestion with all params', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/superUser/question/suggestion/', {
            suggestionId: '100',
            title: 'modifiedTitle1',
            description: 'modifiedDescription1',
            explanation: 'modifiedExplanation1',
        });
        res.status.should.equal(200);

        let resp = await db.cypher()
            .match(`(:Question {questionId: '10'})<-[:SUGGESTION]-(suggestion:QuestionSuggestion {suggestionId: '100'})
                     <-[:IS_CREATOR]-(:User {userId: '1'})`)
            .return(`suggestion`).end().send();
        resp.length.should.equals(1);
        resp[0].suggestion.title.should.equals('modifiedTitle1');
        resp[0].suggestion.description.should.equals('modifiedDescription1');
        resp[0].suggestion.explanation.should.equals('modifiedExplanation1');
    });

    it('Super user edits suggestion only title', async function () {
        dbDsl.setUserIsSuperUser('1');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/superUser/question/suggestion', {
            suggestionId: '100',
            title: 'modifiedTitle1',
        });
        res.status.should.equal(200);

        let resp = await db.cypher()
            .match(`(:Question {questionId: '10'})<-[:SUGGESTION]-(suggestion:QuestionSuggestion {suggestionId: '100'})
                     <-[:IS_CREATOR]-(:User {userId: '1'})`)
            .return(`suggestion`).end().send();
        resp.length.should.equals(1);
        resp[0].suggestion.title.should.equals('modifiedTitle1');
        should.not.exist(resp[0].suggestion.description);
        should.not.exist(resp[0].suggestion.explanation);
    });

    it('Super user edits suggestion with only description', async function () {
        dbDsl.setUserIsSuperUser('1');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/superUser/question/suggestion', {
            suggestionId: '100',
            description: 'modifiedDescription1',
        });
        res.status.should.equal(200);

        let resp = await db.cypher()
            .match(`(:Question {questionId: '10'})<-[:SUGGESTION]-(suggestion:QuestionSuggestion {suggestionId: '100'})
                     <-[:IS_CREATOR]-(:User {userId: '1'})`)
            .return(`suggestion`).end().send();
        resp.length.should.equals(1);
        resp[0].suggestion.description.should.equals('modifiedDescription1');
        should.not.exist(resp[0].suggestion.title);
        should.not.exist(resp[0].suggestion.explanation);
    });

    it('Super user edits suggestion with only explanation', async function () {
        dbDsl.setUserIsSuperUser('1');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/superUser/question/suggestion', {
            suggestionId: '100',
            explanation: 'modifiedExplanation1',
        });
        res.status.should.equal(200);

        let resp = await db.cypher()
            .match(`(:Question {questionId: '10'})<-[:SUGGESTION]-(suggestion:QuestionSuggestion {suggestionId: '100'})
                     <-[:IS_CREATOR]-(:User {userId: '1'})`)
            .return(`suggestion`).end().send();
        resp.length.should.equals(1);
        resp[0].suggestion.explanation.should.equals('modifiedExplanation1');
        should.not.exist(resp[0].suggestion.title);
        should.not.exist(resp[0].suggestion.description);
    });

    it('Fails because only suggestionId has been sent', async function () {
        dbDsl.setUserIsSuperUser('1');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/superUser/question/suggestion', {
            suggestionId: '100'
        });
        res.status.should.equal(400);
    });

    it('Fails because user is not creator of suggestion', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser2);
        let res = await requestHandler.put('/api/superUser/question/suggestion', {
            suggestionId: '100',
            explanation: 'explanation1',
        });
        res.status.should.equal(400);
    });
});
