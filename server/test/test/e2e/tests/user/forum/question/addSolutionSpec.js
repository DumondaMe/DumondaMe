'use strict';

var users = require('../../../util/user');
var db = require('../../../util/db');
var requestHandler = require('../../../util/request');
var moment = require('moment');

describe('Integration Tests for adding a solution to a forum question', function () {

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

    it('Creating a new solution for a forum question - Return 200', function () {

        var solutionId,
            description = 'Deshalb';
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/forum/question/solution', {
                questionId: '0',
                description: description
            }, requestAgent);
        }).then(function (res) {
            solutionId = res.body.solutionId;
            res.status.should.equal(200);
            return db.cypher().match("(:ForumQuestion {questionId: '0'})-[:HAS_SOLUTION]->(solution:ForumSolution {solutionId: {solutionId}})" +
                "<-[:IS_ADMIN]-(:User {userId: '1'})")
                .return('solution')
                .end({solutionId: solutionId}).send();
        }).then(function (solution) {
            solution.length.should.equals(1);
            solution[0].solution.description.should.equals(description);
        });
    });

    it('Creating a new solution with reference to page for a forum question - Return 200', function () {

        var solutionId,
            description = 'Deshalb';
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/forum/question/solution', {
                questionId: '0',
                pageId: '0',
                description: description
            }, requestAgent);
        }).then(function (res) {
            solutionId = res.body.solutionId;
            res.status.should.equal(200);
            return db.cypher().match("(:ForumQuestion {questionId: '0'})-[:HAS_SOLUTION]->(solution:ForumSolution {solutionId: {solutionId}})" +
                    "-[:REFERENCE]->(:Page {pageId: '0'})")
                .return('solution')
                .end({solutionId: solutionId}).send();
        }).then(function (solution) {
            solution.length.should.equals(1);
            solution[0].solution.description.should.equals(description);
        });
    });
    

    it('Creating a new solution fails because of non existing questionId - Return 400', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/forum/question/solution', {
                questionId: '1',
                description: 'Deshalb'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(solution:ForumSolution)")
                .return('solution').end().send();
        }).then(function (solution) {
            solution.length.should.equals(0);
        });
    });

});
