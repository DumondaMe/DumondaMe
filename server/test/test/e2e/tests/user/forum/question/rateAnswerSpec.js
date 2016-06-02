'use strict';

var users = require('../../../util/user');
var db = require('../../../util/db');
var requestHandler = require('../../../util/request');
var moment = require('moment');

describe('Integration Tests for rating answers of a forum question', function () {

    var requestAgent, startTime;

    beforeEach(function () {

        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return db.clearDatabase().then(function () {
            var commands = [];
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', forename: 'user', surname: 'Meier', userId: '1'})")
                .end().getCommand());

            commands.push(db.cypher().match("(u:User {userId: '1'})")
                .create("(u)-[:IS_ADMIN]->(:ForumQuestion {questionId: '0', description: 'forumQuestion', topic: {topic}, language: 'de'})")
                .end({topic: ['environmental']}).getCommand());

            return db.cypher().match("(u:User {userId: '1'}), (forumQuestion:ForumQuestion {questionId: '0'})")
                .create("(u)-[:IS_ADMIN]->(:ForumAnswer:ForumExplanation {answerId: '0', description: 'forumAnswer'})<-[:IS_ANSWER]-(forumQuestion)")
                .end().send(commands);

        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Positive rate a answer - Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/forum/question/answer/rate', {
                answerId: '0'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(answer:ForumAnswer {answerId: '0'})" +
                "<-[:RATE_POSITIVE]-(:User {userId: '1'})")
                .return('answer').end().send();
        }).then(function (answer) {
            answer.length.should.equals(1);
        });
    });

    it('Delete positive rate a answer - Return 200', function () {

        return db.cypher().match("(u:User {userId: '1'}), (answer:ForumAnswer {answerId: '0'})")
            .create("(u)-[:RATE_POSITIVE]->(answer)")
            .end().send().then(function () {
                return requestHandler.login(users.validUser).then(function (agent) {
                    requestAgent = agent;
                    return requestHandler.del('/api/user/forum/question/answer/rate', {
                        answerId: '0'
                    }, requestAgent);
                }).then(function (res) {
                    res.status.should.equal(200);
                    return db.cypher().match("(answer:ForumAnswer {answerId: '0'})" +
                        "<-[:RATE_POSITIVE]-(:User {userId: '1'})")
                        .return('answer').end().send();
                }).then(function (answer) {
                    answer.length.should.equals(0);
                });
            });
    });

    it('Positive rate a answer twice. Second rate is dismissed- Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/forum/question/answer/rate', {
                answerId: '0'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return requestHandler.post('/api/user/forum/question/answer/rate', {
                answerId: '0'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(answer:ForumAnswer {answerId: '0'})" +
                "<-[:RATE_POSITIVE]-(:User {userId: '1'})")
                .return('answer').end().send();
        }).then(function (answer) {
            answer.length.should.equals(1);
        });
    });

});
