'use strict';

var users = require('../../../util/user');
var db = require('../../../util/db');
var requestHandler = require('../../../util/request');
var moment = require('moment');

describe('Integration Tests for deleting answers of a forum question', function () {

    var requestAgent, startTime;

    beforeEach(function () {

        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return db.clearDatabase().then(function () {
            var commands = [];
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', forename: 'user', surname: 'Meier', userId: '1'})")
                .end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier2', forename: 'user', surname: 'Meier2', userId: '2'})")
                .end().getCommand());

            commands.push(db.cypher().match("(u:User {userId: '1'})")
                .create("(u)-[:IS_ADMIN]->(:ForumQuestion {questionId: '0', description: 'forumQuestion', topic: {topic}, language: 'de'})")
                .end({topic: ['environmental']}).getCommand());

            commands.push(db.cypher().match("(u:User {userId: '1'}), (u2:User {userId: '2'})")
                .create("(u)-[:IS_ADMIN]->(:ForumAnswer:ForumExplanation {answerId: '0'})<-[:RATE_POSITIVE]-(u2)").end().getCommand());
            commands.push(db.cypher().match("(answer:ForumAnswer {answerId: '0'}), (question:ForumQuestion {questionId: '0'})")
                .create("(question)-[:IS_ANSWER]->(answer)").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '2'})")
                .create("(u)-[:IS_ADMIN]->(:ForumAnswer:ForumExplanation {answerId: '1'})<-[:RATE_POSITIVE]-(u)").end().getCommand());
            return db.cypher().match("(answer:ForumAnswer {answerId: '1'}), (question:ForumQuestion {questionId: '0'})")
                .create("(question)-[:IS_ANSWER]->(answer)").end().send(commands);

        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Delete a forum answer - Return 200', function () {
        
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.del('/api/user/forum/question/answer', {
                answerId: '0'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(answer:ForumAnswer {answerId: '0'})")
                .return('answer').end().send();
        }).then(function (answer) {
            answer.length.should.equals(0);
        });
    });

    it('Delete a forum answer of another user is not allowed - Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.del('/api/user/forum/question/answer', {
                answerId: '1'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(answer:ForumAnswer {answerId: '1'})")
                .return('answer').end().send();
        }).then(function (answer) {
            answer.length.should.equals(1);
        });
    });

});
