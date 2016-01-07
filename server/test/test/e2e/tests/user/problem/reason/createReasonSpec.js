'use strict';

var users = require('../../../util/user');
var db = require('../../../util/db');
var requestHandler = require('../../../util/request');
var moment = require('moment');

describe('Integration Tests for creating Reasons to a Problem', function () {

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

    it('Creating a new Reason to a existing Problem - Return 200', function () {

        var reasonId,
            title = "testTitleAction",
            description = 'testAction';
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/problem/reason', {
                createReason: {
                    problemId: '0',
                    title: title,
                    description: description
                }
            }, requestAgent);
        }).then(function (res) {
            reasonId = res.body.reasonId;
            res.status.should.equal(200);
            return db.cypher().match("(:User {userId: '1'})-[:IS_ADMIN]->(reason:Reason {reasonId: {reasonId}})-[:BELONGS]->(:Problem {problemId: '0'})")
                .return('reason')
                .end({reasonId: reasonId}).send();
        }).then(function (action) {
            action.length.should.equals(1);
            action[0].reason.title.should.equals(title);
            action[0].reason.description.should.equals(description);
        });
    });

    it('Not creating a new Reason for a non existing Problem - Return 404', function () {

        var title = "testTitleAction",
            description = 'testAction';
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/problem/reason', {
                createReason: {
                    problemId: '100',
                    title: title,
                    description: description
                }
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(404);
            return db.cypher().match("(:User {userId: '1'})-[:IS_ADMIN]->(reason:Reason)-[:BELONGS]->(:Problem)")
                .return('reason')
                .end().send();
        }).then(function (action) {
            action.length.should.equals(0);
        });
    });

});
