'use strict';

var users = require('../../../util/user');
var db = require('../../../util/db');
var requestHandler = require('../../../util/request');
var moment = require('moment');

describe('Integration Tests for getting Reasons to a Problem', function () {

    var requestAgent, startTime;

    beforeEach(function () {

        var commands = [];
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return db.clearDatabase().then(function () {
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', forename: 'user', surname: 'Meier', userId: '1'})")
                .end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier2', userId: '2'})")
                .end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier3', userId: '3'})")
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
            commands.push(db.cypher().match("(problem:Problem {problemId: '0'})")
                .createUnique("(:Reason {reasonId: '2', title: 'title2', description: 'description2'})-[:BELONGS]->(problem)")
                .end().getCommand());

            //Create positive rated
            commands.push(db.cypher().match("(reason:Reason {reasonId: '1'}), (user:User {userId: '1'})")
                .createUnique("(user)-[:POSITIVE_RATING]->(reason)")
                .end().getCommand());
            commands.push(db.cypher().match("(reason:Reason {reasonId: '1'}), (user:User {userId: '2'})")
                .createUnique("(user)-[:POSITIVE_RATING]->(reason)")
                .end().getCommand());
            commands.push(db.cypher().match("(reason:Reason {reasonId: '1'}), (user:User {userId: '3'})")
                .createUnique("(user)-[:POSITIVE_RATING]->(reason)")
                .end().getCommand());
            return db.cypher().match("(reason:Reason {reasonId: '0'}), (user:User {userId: '1'})")
                .createUnique("(user)-[:POSITIVE_RATING]->(reason)")
                .end().send(commands);
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting all Reasons to a existing Problem - Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/problem/reason', {
                problemId: '0',
                limit: 10,
                skip: 0
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.length.should.equals(3);
            res.body[0].reasonId.should.equals('1');
            res.body[0].title.should.equals('title1');
            res.body[0].description.should.equals('description1');
            res.body[0].ratedByUser.should.equals(true);
            res.body[0].numberOfRatings.should.equals(3);

            res.body[1].reasonId.should.equals('0');
            res.body[1].title.should.equals('title0');
            res.body[1].description.should.equals('description0');
            res.body[1].ratedByUser.should.equals(true);
            res.body[1].numberOfRatings.should.equals(1);

            res.body[2].reasonId.should.equals('2');
            res.body[2].title.should.equals('title2');
            res.body[2].description.should.equals('description2');
            res.body[2].ratedByUser.should.equals(false);
            res.body[2].numberOfRatings.should.equals(0);
        });
    });

    it('Getting only one Reason to a existing Problem - Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/problem/reason', {
                problemId: '0',
                limit: 1,
                skip: 1
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.length.should.equals(1);
            res.body[0].reasonId.should.equals('0');
            res.body[0].title.should.equals('title0');
            res.body[0].description.should.equals('description0');
            res.body[0].ratedByUser.should.equals(true);
            res.body[0].numberOfRatings.should.equals(1);
        });
    });

});
