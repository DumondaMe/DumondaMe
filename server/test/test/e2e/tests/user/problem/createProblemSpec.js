'use strict';

var users = require('../../util/user');
var db = require('../../util/db');
var requestHandler = require('../../util/request');
var moment = require('moment');

describe('Integration Tests for creating Problem Reports', function () {

    var requestAgent, startTime;

    beforeEach(function () {

        var commands = [];
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return db.clearDatabase().then(function () {
            return db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', forename: 'user', surname: 'Meier', userId: '1'})")
                .end().send();

        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Creating a new Problem Report - Return 200', function () {

        var problemId,
            description = 'Warum ist Fleisch essen problematisch?';
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/problem', {
                description: description,
                tag: ['health', 'socialChange']
            }, requestAgent);
        }).then(function (res) {
            problemId = res.body.problemId;
            res.status.should.equal(200);
            return db.cypher().match("(:User {userId: '1'})-[:IS_ADMIN]->(problem:Problem {problemId: {problemId}})")
                .return('problem')
                .end({problemId: problemId}).send();
        }).then(function (problem) {
            problem.length.should.equals(1);
            problem[0].problem.description.should.equals(description);
            problem[0].problem.tag.length.should.equals(2);
        });
    });

});
