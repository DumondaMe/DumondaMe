'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for creating question in forum', function () {

    beforeEach(function () {

        return dbDsl.init(1).then(function () {
            return dbDsl.sendToDb();
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Creating a new question in a forum - Return 200', function () {

        let questionId,
            description = 'Warum ist Fleisch essen problematisch?', language = 'de', topic = ['environmental'];
        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.post('/api/user/forum/question', {
                description: description,
                language: language,
                topic: topic
            }, agent);
        }).then(function (res) {
            questionId = res.body.questionId;
            res.status.should.equal(200);
            return db.cypher().match("(:User {userId: '1'})-[:IS_ADMIN]->(question:ForumQuestion {questionId: {questionId}})")
                .return('question')
                .end({questionId: questionId}).send();
        }).then(function (question) {
            question.length.should.equals(1);
            question[0].question.description.should.equals(description);
            question[0].question.language.should.equals(language);
            question[0].question.topic.length.should.equals(1);
            question[0].question.topic[0].should.equals('environmental');
        });
    });

});
