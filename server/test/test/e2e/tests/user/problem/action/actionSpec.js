'use strict';

var users = require('../../../util/user');
var db = require('../../../util/db');
var requestHandler = require('../../../util/request');
var moment = require('moment');

describe('Integration Tests for getting Actions to a Problem', function () {

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

            //Create Actions and assign to problem
            commands.push(db.cypher().match("(problem:Problem {problemId: '0'})")
                .createUnique("(:Action {actionId: '0', title: 'title0', description: 'description0', type: 'userAction'})-[:BELONGS]->(problem)")
                .end().getCommand());
            commands.push(db.cypher().match("(problem:Problem {problemId: '0'})")
                .createUnique("(:Action {actionId: '1', title: 'title1', description: 'description1', type: 'userAction'})-[:BELONGS]->(problem)")
                .end().getCommand());
            commands.push(db.cypher().match("(problem:Problem {problemId: '0'})")
                .createUnique("(:Action {actionId: '2', title: 'title2', description: 'description2', type: 'userAction'})-[:BELONGS]->(problem)")
                .end().getCommand());

            //Create implemented connections
            commands.push(db.cypher().match("(action:Action {actionId: '1'}), (user:User {userId: '1'})")
                .createUnique("(user)-[:IMPLEMENTS]->(action)")
                .end().getCommand());
            commands.push(db.cypher().match("(action:Action {actionId: '1'}), (user:User {userId: '2'})")
                .createUnique("(user)-[:IMPLEMENTS]->(action)")
                .end().getCommand());
            commands.push(db.cypher().match("(action:Action {actionId: '1'}), (user:User {userId: '3'})")
                .createUnique("(user)-[:IMPLEMENTS]->(action)")
                .end().getCommand());
            return db.cypher().match("(action:Action {actionId: '0'}), (user:User {userId: '1'})")
                .createUnique("(user)-[:IMPLEMENTS]->(action)")
                .end().send(commands);
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting all Actions to a existing Problem - Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/problem/action', {
                problemId: '0',
                limit: 10,
                skip: 0
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.length.should.equals(3);
            res.body[0].actionId.should.equals('1');
            res.body[0].title.should.equals('title1');
            res.body[0].description.should.equals('description1');
            res.body[0].type.should.equals('userAction');
            res.body[0].implementedByUser.should.equals(true);
            res.body[0].numberOfImplementations.should.equals(3);

            res.body[1].actionId.should.equals('0');
            res.body[1].title.should.equals('title0');
            res.body[1].description.should.equals('description0');
            res.body[1].type.should.equals('userAction');
            res.body[1].implementedByUser.should.equals(true);
            res.body[1].numberOfImplementations.should.equals(1);

            res.body[2].actionId.should.equals('2');
            res.body[2].title.should.equals('title2');
            res.body[2].description.should.equals('description2');
            res.body[2].type.should.equals('userAction');
            res.body[2].implementedByUser.should.equals(false);
            res.body[2].numberOfImplementations.should.equals(0);
        });
    });

    it('Getting only one Actions to a existing Problem - Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/problem/action', {
                problemId: '0',
                limit: 1,
                skip: 1
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.length.should.equals(1);

            res.body[0].actionId.should.equals('0');
            res.body[0].title.should.equals('title0');
            res.body[0].description.should.equals('description0');
            res.body[0].type.should.equals('userAction');
            res.body[0].implementedByUser.should.equals(true);
            res.body[0].numberOfImplementations.should.equals(1);

        });
    });

});
