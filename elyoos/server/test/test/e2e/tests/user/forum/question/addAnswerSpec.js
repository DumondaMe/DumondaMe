'use strict';

var users = require('elyoos-server-test-util').user;
var db = require('elyoos-server-test-util').db;
var requestHandler = require('elyoos-server-test-util').requestHandler;
var moment = require('moment');

describe('Integration Tests for adding answers to a forum question', function () {

    var requestAgent, startTime;

    beforeEach(function () {
        
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return db.clearDatabase().then(function () {
            var commands = [];
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', forename: 'user', surname: 'Meier', userId: '1'})")
                .end().getCommand());

            commands.push(db.cypher().create("(:Page {title: 'page1Title', label: 'Book', description: 'page1', modified: 5090, pageId: '0'})").end().getCommand());

            return db.cypher().match("(u:User)")
                .create("(u)-[:IS_ADMIN]->(:ForumQuestion {questionId: '0', description: 'forumQuestion', topic: {topic}, language: 'de'})")
                .end({topic: ['environmental']}).send(commands);

        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Creating a new explanation answer for a forum question - Return 200', function () {

        var answerId,
            description = 'Deshalb', title = "title";
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/forum/question/answer', {
                normal: {
                    questionId: '0',
                    title: title,
                    description: description,
                    type: 'explanation'
                }
            }, requestAgent);
        }).then(function (res) {
            answerId = res.body.answerId;
            res.status.should.equal(200);
            return db.cypher().match("(:ForumQuestion {questionId: '0'})-[:IS_ANSWER]->(answer:ForumExplanation:ForumAnswer {answerId: {answerId}})" +
                "<-[:IS_ADMIN]-(:User {userId: '1'})")
                .return('answer')
                .end({answerId: answerId}).send();
        }).then(function (answer) {
            answer.length.should.equals(1);
            answer[0].answer.description.should.equals(description);
            answer[0].answer.title.should.equals(title);
        });
    });

    it('Creating a new solution answer for a forum question - Return 200', function () {

        var answerId,
            description = 'Deshalb', title = "title";
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/forum/question/answer', {
                normal: {
                    questionId: '0',
                    title: title,
                    description: description,
                    type: 'solution'
                }
            }, requestAgent);
        }).then(function (res) {
            answerId = res.body.answerId;
            res.status.should.equal(200);
            return db.cypher().match("(:ForumQuestion {questionId: '0'})-[:IS_ANSWER]->(answer:ForumSolution:ForumAnswer {answerId: {answerId}})" +
                "<-[:IS_ADMIN]-(:User {userId: '1'})")
                .return('answer')
                .end({answerId: answerId}).send();
        }).then(function (answer) {
            answer.length.should.equals(1);
            answer[0].answer.description.should.equals(description);
            answer[0].answer.title.should.equals(title);
        });
    });

    it('Creating a new explanation answer with reference to page for a forum question - Return 200', function () {

        var answerId,
            description = 'Deshalb';
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/forum/question/answer', {
                page: {
                    questionId: '0',
                    pageId: '0',
                    description: description,
                    type: 'explanation'
                }
            }, requestAgent);
        }).then(function (res) {
            answerId = res.body.answerId;
            res.status.should.equal(200);
            return db.cypher().match("(:ForumQuestion {questionId: '0'})-[:IS_ANSWER]->(answer:ForumExplanation:ForumAnswer {answerId: {answerId}})" +
                    "-[:REFERENCE]->(:Page {pageId: '0'})")
                .return('answer')
                .end({answerId: answerId}).send();
        }).then(function (answer) {
            answer.length.should.equals(1);
            answer[0].answer.description.should.equals(description);
        });
    });

    it('Creating a new solution answer with reference to page for a forum question - Return 200', function () {

        var answerId,
            description = 'Deshalb';
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/forum/question/answer', {
                page: {
                    questionId: '0',
                    pageId: '0',
                    description: description,
                    type: 'solution'
                }
            }, requestAgent);
        }).then(function (res) {
            answerId = res.body.answerId;
            res.status.should.equal(200);
            return db.cypher().match("(:ForumQuestion {questionId: '0'})-[:IS_ANSWER]->(answer:ForumSolution:ForumAnswer {answerId: {answerId}})" +
                "-[:REFERENCE]->(:Page {pageId: '0'})")
                .return('answer')
                .end({answerId: answerId}).send();
        }).then(function (answer) {
            answer.length.should.equals(1);
            answer[0].answer.description.should.equals(description);
        });
    });

    it('Creating a new explanation answer fails because of non existing questionId - Return 400', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/forum/question/answer', {
                normal: {
                    questionId: '1',
                    title: 'title',
                    description: 'Deshalb',
                    type: 'explanation'
                }
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(answer:ForumAnswer)")
                .return('answer').end().send();
        }).then(function (answer) {
            answer.length.should.equals(0);
        });
    });

    it('Creating a new solution answer fails because of non existing questionId - Return 400', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/forum/question/answer', {
                normal: {
                    questionId: '1',
                    title: 'title',
                    description: 'Deshalb',
                    type: 'solution'
                }
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(answer:ForumAnswer)")
                .return('answer').end().send();
        }).then(function (answer) {
            answer.length.should.equals(0);
        });
    });

});
