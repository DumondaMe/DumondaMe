'use strict';

var users = require('../../../util/user');
var db = require('../../../util/db');
var requestHandler = require('../../../util/request');
var moment = require('moment');

describe('Integration Tests for handling page references to a Reasons', function () {

    var requestAgent, startTime;

    beforeEach(function () {

        var commands = [];
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return db.clearDatabase().then(function () {
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', forename: 'user', surname: 'Meier', userId: '1'})")
                .end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier2', userId: '2'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier3', userId: '3'})").end().getCommand());

            //Create Page
            commands.push(db.cypher().create("(:Page {title: 'title', label: 'Book', description: 'description', language: 'de', created: 501, modified: 502, pageId: '0'," +
                "author: 'Hans Muster', publishDate: 1000})").end().getCommand());
            commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '1'})")
                .create("(b)-[:IS_ADMIN]->(a)")
                .end().getCommand());

            //Create Problem
            commands.push(db.cypher().create("(:Problem {problemId: '0', description: 'descriptionProblem0', created: 503})")
                .end().getCommand());

            //Create Reasons and assign to problem
            commands.push(db.cypher().match("(problem:Problem {problemId: '0'}), (user:User {userId: '2'})")
                .createUnique("(user)-[:IS_ADMIN]->(:Reason {reasonId: '0', title: 'titleReason0', description: 'descriptionReason0', created: 505})-[:BELONGS]->(problem)")
                .end().getCommand());

            return db.cypher().match("(u:User {userId: '1'}), (problem:Problem {problemId: '0'})")
                .create("(u)-[:IS_ADMIN]->(problem)")
                .end().send(commands);

        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Link a page to a reason - Return 200', function () {

        var id;
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/problem/reason', {
                addPage: {
                    reasonId: '0',
                    pageId: '0'
                }
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            id = res.body.reasonExplanationId;
            return db.cypher().match("(reason:Reason {reasonId: '0'})-[:HAS_EXPLANATION]->(:ReasonExplanation {reasonExplanationId: {reasonExplanationId}})-[:REFERENCES]->(:Page {pageId: '0'})")
                .return('reason')
                .end({reasonExplanationId: id}).send();
        }).then(function (reason) {
            reason.length.should.equals(1);
        });
    });

    it('Page can only be linked once to a reason - Return 400', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/problem/reason', {
                addPage: {
                    reasonId: '0',
                    pageId: '0'
                }
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return requestHandler.post('/api/user/problem/reason', {
                addPage: {
                    reasonId: '0',
                    pageId: '0'
                }
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });

});
