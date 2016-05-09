'use strict';

var users = require('../../../util/user');
var db = require('../../../util/db');
var requestHandler = require('../../../util/request');
var moment = require('moment');

describe('Integration Tests for creating question in forum', function () {

    var requestAgent, startTime;

    beforeEach(function () {
        
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return db.clearDatabase().then(function () {
            return db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', forename: 'user', surname: 'Meier', userId: '1'})")
                .end().send();

        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Creating a new question in a forum - Return 200', function () {

        var questionId,
            description = 'Warum ist Fleisch essen problematisch?', language = 'de', category = ['environmental'];
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/forum/question', {
                description: description,
                language: language,
                category: category
            }, requestAgent);
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
            question[0].question.category.length.should.equals(1);
            question[0].question.category[0].should.equals('environmental');
        });
    });

});
