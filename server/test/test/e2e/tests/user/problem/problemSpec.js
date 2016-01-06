'use strict';

var users = require('../../util/user');
var db = require('../../util/db');
var requestHandler = require('../../util/request');
var moment = require('moment');

describe('Integration Tests for getting Problem Reports', function () {

    var requestAgent, startTime;

    beforeEach(function () {

        var commands = [];
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return db.clearDatabase().then(function () {
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', forename: 'user', surname: 'Meier', userId: '1'})")
                .end().getCommand());

            return db.cypher().match("(u:User {userId: '1'})")
                .create("(u)-[:IS_ADMIN]->(:Problem {problemId: '0', description: 'test', created: 500, tag: {tag}})")
                .end({tag: ['test1', 'test2']}).send(commands);

        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting a specific a Problem Report - Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/problem', {
                id: '0'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.description.should.equals('test');
            res.body.created.should.equals(500);
            res.body.tag.length.should.equals(2);
            res.body.isAdmin.should.equals(true);
        });
    });

    it('Attempt getting a specific a not existing Problem Report  - Return 404', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/problem', {
                id: '1'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(404);
        });
    });

});
