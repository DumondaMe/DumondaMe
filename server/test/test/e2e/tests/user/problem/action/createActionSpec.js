'use strict';

var users = require('../../../util/user');
var db = require('../../../util/db');
var requestHandler = require('../../../util/request');
var moment = require('moment');

describe('Integration Tests for creating Actions to a Problem', function () {

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

    it('Creating a new Action to a existing Problem - Return 200', function () {

        var actionId,
            title = "testTitleAction",
            description = 'testAction';
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/problem/action', {
                createAction: {
                    problemId: '0',
                    title: title,
                    description: description,
                    type: 'userAction'
                }
            }, requestAgent);
        }).then(function (res) {
            actionId = res.body.actionId;
            res.status.should.equal(200);
            return db.cypher().match("(:User {userId: '1'})-[:IS_ADMIN]->(action:Action {actionId: {actionId}})-[:BELONGS]->(:Problem {problemId: '0'})")
                .return('action')
                .end({actionId: actionId}).send();
        }).then(function (action) {
            action.length.should.equals(1);
            action[0].action.title.should.equals(title);
            action[0].action.description.should.equals(description);
            action[0].action.type.should.equals('userAction');
        });
    });

    it('Not creating a new Action for a non existing Problem - Return 404', function () {

        var title = "testTitleAction",
            description = 'testAction';
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/problem/action', {
                createAction: {
                    problemId: '100',
                    title: title,
                    description: description,
                    type: 'userAction'
                }
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(404);
            return db.cypher().match("(:User {userId: '1'})-[:IS_ADMIN]->(action:Action)-[:BELONGS]->(:Problem {problemId: '0'})")
                .return('action')
                .end().send();
        }).then(function (action) {
            action.length.should.equals(0);
        });
    });

});
