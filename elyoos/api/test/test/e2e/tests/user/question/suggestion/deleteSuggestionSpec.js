'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');

describe('Delete a suggestion of a question', function () {

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

    it('Delete of suggestion', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question/suggestion/', {suggestionId: '100'});
        res.status.should.equal(200);

        let resp = await db.cypher()
            .match(`(:Question {questionId: '10'})<-[:SUGGESTION]-(suggestion:QuestionSuggestion {suggestionId: '100'})
                     <-[:IS_CREATOR]-(:User {userId: '1'})`)
            .return(`suggestion`).end().send();
        resp.length.should.equals(0);
    });

    it('Fails because user is not creator of suggestion', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser2);
        let res = await requestHandler.del('/api/user/question/suggestion', {suggestionId: '100'});
        res.status.should.equal(400);
    });
});
