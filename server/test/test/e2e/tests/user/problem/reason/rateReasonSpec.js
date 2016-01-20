'use strict';

var users = require('../../../util/user');
var db = require('../../../util/db');
var requestHandler = require('../../../util/request');
var moment = require('moment');

describe('Integration Tests for rating a Reason to a Problem', function () {

    var requestAgent, startTime;

    beforeEach(function () {

        var commands = [];
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return db.clearDatabase().then(function () {
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', forename: 'user', surname: 'Meier', userId: '1'})")
                .end().getCommand());

            //Create Problem
            commands.push(db.cypher().create("(:Problem {problemId: '0'})")
                .end().getCommand());

            //Create Reasons and assign to problem
            commands.push(db.cypher().match("(problem:Problem {problemId: '0'})")
                .createUnique("(:Reason {reasonId: '0', title: 'title0', description: 'description0'})-[:BELONGS]->(problem)")
                .end().getCommand());
            commands.push(db.cypher().match("(problem:Problem {problemId: '0'})")
                .createUnique("(:Reason {reasonId: '1', title: 'title1', description: 'description1'})-[:BELONGS]->(problem)")
                .end().getCommand());
            return db.cypher().match("(problem:Problem {problemId: '0'})")
                .createUnique("(:Reason {reasonId: '2', title: 'title2', description: 'description2'})-[:BELONGS]->(problem)")
                .end().send(commands);

        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Positive Rate a Reason - Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/problem/reason', {
                positiveRate: {
                    reasonId: '1'
                }
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(:User {userId: '1'})-[:POSITIVE_RATING]->(reason:Reason {reasonId: {reasonId}})-[:BELONGS]->(:Problem {problemId: '0'})")
                .return('reason')
                .end({reasonId: '1'}).send();
        }).then(function (action) {
            action.length.should.equals(1);
        });
    });

    it('Positive Rate a Reason twice fails - Return 400', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/problem/reason', {
                positiveRate: {
                    reasonId: '1'
                }
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return requestHandler.post('/api/user/problem/reason', {
                positiveRate: {
                    reasonId: '1'
                }
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(:User {userId: '1'})-[:POSITIVE_RATING]->(reason:Reason {reasonId: {reasonId}})-[:BELONGS]->(:Problem {problemId: '0'})")
                .return('reason')
                .end({reasonId: '1'}).send();
        }).then(function (action) {
            action.length.should.equals(1);
        });
    });

    it('Remove positive Rating for Reason - Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/problem/reason', {
                positiveRate: {
                    reasonId: '1'
                }
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return requestHandler.post('/api/user/problem/reason', {
                removePositiveRate: {
                    reasonId: '1'
                }
            }, requestAgent);
        }).then(function (res) {
            res.body.numberOfRatings.should.equals(0);
            res.status.should.equal(200);
            return db.cypher().match("(:User {userId: '1'})-[:POSITIVE_RATING]->(reason:Reason {reasonId: {reasonId}})-[:BELONGS]->(:Problem {problemId: '0'})")
                .return('reason')
                .end({reasonId: '1'}).send();
        }).then(function (action) {
            action.length.should.equals(0);
        });
    });

    it('Remove positive Rating for Reason when not existing - Return 400', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/problem/reason', {
                removePositiveRate: {
                    reasonId: '1'
                }
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });
});
