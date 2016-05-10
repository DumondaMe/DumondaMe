'use strict';

var users = require('../../../util/user');
var db = require('../../../util/db');
var requestHandler = require('../../../util/request');
var moment = require('moment');

describe('Integration Tests for adding a explanation to a forum question', function () {

    var requestAgent, startTime;

    beforeEach(function () {
        
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return db.clearDatabase().then(function () {
            var commands = [];
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', forename: 'user', surname: 'Meier', userId: '1'})")
                .end().getCommand());

            commands.push(db.cypher().create("(:Page {title: 'page1Title', label: 'Book', description: 'page1', modified: 5090, pageId: '0'})").end().getCommand());

            return db.cypher().match("(u:User)")
                .create("(u)-[:IS_ADMIN]->(:ForumQuestion {questionId: '0', description: 'forumQuestion', category: {category}, language: 'de'})")
                .end({category: ['environmental']}).send(commands);

        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Creating a new explanation for a forum question - Return 200', function () {

        var explanationId,
            description = 'Deshalb';
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/forum/question/explanation', {
                questionId: '0',
                description: description
            }, requestAgent);
        }).then(function (res) {
            explanationId = res.body.explanationId;
            res.status.should.equal(200);
            return db.cypher().match("(:ForumQuestion {questionId: '0'})-[:HAS_EXPLANATION]->(explanation:ForumExplanation {explanationId: {explanationId}})" +
                "<-[:IS_ADMIN]-(:User {userId: '1'})")
                .return('explanation')
                .end({explanationId: explanationId}).send();
        }).then(function (explanation) {
            explanation.length.should.equals(1);
            explanation[0].explanation.description.should.equals(description);
        });
    });

    it('Creating a new explanation with reference to page for a forum question - Return 200', function () {

        var explanationId,
            description = 'Deshalb';
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/forum/question/explanation', {
                questionId: '0',
                pageId: '0',
                description: description
            }, requestAgent);
        }).then(function (res) {
            explanationId = res.body.explanationId;
            res.status.should.equal(200);
            return db.cypher().match("(:ForumQuestion {questionId: '0'})-[:HAS_EXPLANATION]->(explanation:ForumExplanation {explanationId: {explanationId}})" +
                    "-[:REFERENCE]->(:Page {pageId: '0'})")
                .return('explanation')
                .end({explanationId: explanationId}).send();
        }).then(function (explanation) {
            explanation.length.should.equals(1);
            explanation[0].explanation.description.should.equals(description);
        });
    });

    it('Creating a new explanation fails because of non existing questionId - Return 400', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/forum/question/explanation', {
                questionId: '1',
                description: 'Deshalb'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(explanation:ForumExplanation)")
                .return('explanation').end().send();
        }).then(function (explanation) {
            explanation.length.should.equals(0);
        });
    });

});
