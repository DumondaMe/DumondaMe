'use strict';

var users = require('../../../../util/user');
var db = require('../../../../util/db');
var requestHandler = require('../../../../util/request');
var moment = require('moment');

describe('Integration Tests for getting Reason Detail', function () {

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
            commands.push(db.cypher().create("(:Problem {problemId: '0', description: 'descriptionProblem0', created: 503})")
                .end().getCommand());

            //Create Reasons and assign to problem
            commands.push(db.cypher().match("(problem:Problem {problemId: '0'}), (user:User {userId: '2'})")
                .createUnique("(user)-[:IS_ADMIN]->(:Reason {reasonId: '0', title: 'titleReason0', description: 'descriptionReason0', created: 505})-[:BELONGS]->(problem)")
                .end().getCommand());

            //Create positive rated Reason
            commands.push(db.cypher().match("(reason:Reason {reasonId: '0'}), (user:User {userId: '1'})")
                .createUnique("(user)-[:POSITIVE_RATING]->(reason)")
                .end().getCommand());

            //Create Reason Explanation
            commands.push(db.cypher().match("(reason:Reason {reasonId: '0'}), (user:User {userId: '1'})")
                .createUnique("(user)-[:IS_ADMIN]->(:ReasonExplanation {reasonExplanationId: '1', created: 505})<-[:HAS_EXPLANATION]-(reason)")
                .end().getCommand());
            commands.push(db.cypher().match("(reason:Reason {reasonId: '0'}), (user:User {userId: '2'})")
                .createUnique("(user)-[:IS_ADMIN]->(:ReasonExplanation {reasonExplanationId: '2', created: 506})<-[:HAS_EXPLANATION]-(reason)")
                .end().getCommand());

            //Create Links
            commands.push(db.cypher().match("(reasonExplanation:ReasonExplanation {reasonExplanationId: '1'}), (user:User {userId: '1'})")
                .createUnique("(user)-[:IS_ADMIN]->(:Link {linkId: '1', link: 'www.link.com', title: 'titleLink1', description: 'descriptionLink1'})<-[:REFERENCES]-(reasonExplanation)")
                .end().getCommand());
            commands.push(db.cypher().match("(reasonExplanation:ReasonExplanation {reasonExplanationId: '2'}), (user:User {userId: '1'})")
                .createUnique("(user)-[:IS_ADMIN]->(:Link {linkId: '2', link: 'www.link2.com', title: 'titleLink2', description: 'descriptionLink2'})<-[:REFERENCES]-(reasonExplanation)")
                .end().getCommand());

            //Create positive rated Explanations
            commands.push(db.cypher().match("(reasonExplanation:ReasonExplanation {reasonExplanationId: '1'}), (user:User {userId: '1'})")
                .createUnique("(user)-[:POSITIVE_RATING]->(reasonExplanation)")
                .end().getCommand());
            commands.push(db.cypher().match("(reasonExplanation:ReasonExplanation {reasonExplanationId: '1'}), (user:User {userId: '2'})")
                .createUnique("(user)-[:POSITIVE_RATING]->(reasonExplanation)")
                .end().getCommand());
            return db.cypher().match("(reasonExplanation:ReasonExplanation {reasonExplanationId: '2'}), (user:User {userId: '2'})")
                .createUnique("(user)-[:POSITIVE_RATING]->(reasonExplanation)")
                .end().send(commands);
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting detail of Reason - Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/problem/reason/detail', {
                reasonId: '0'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.reason.title.should.equals('titleReason0');
            res.body.reason.description.should.equals('descriptionReason0');
            res.body.reason.created.should.equals(505);
            res.body.reason.ratedByUser.should.equals(true);
            res.body.reason.isAdmin.should.equals(false);
            res.body.reason.problem.problemId.should.equals('0');
            res.body.reason.problem.description.should.equals('descriptionProblem0');
            res.body.reason.problem.created.should.equals(503);

            //getting all links
            res.body.links.length.should.equals(2);
            res.body.links[0].created.should.equals(505);
            res.body.links[0].link.linkId.should.equals('1');
            res.body.links[0].link.link.should.equals('www.link.com');
            res.body.links[0].link.title.should.equals('titleLink1');
            res.body.links[0].link.description.should.equals('descriptionLink1');
            res.body.links[0].numberOfRatings.should.equals(2);
            res.body.links[0].ratedByUser.should.equals(true);
            res.body.links[0].isAdmin.should.equals(true);

            res.body.links[1].created.should.equals(506);
            res.body.links[1].link.linkId.should.equals('2');
            res.body.links[1].link.link.should.equals('www.link2.com');
            res.body.links[1].link.title.should.equals('titleLink2');
            res.body.links[1].link.description.should.equals('descriptionLink2');
            res.body.links[1].numberOfRatings.should.equals(1);
            res.body.links[1].ratedByUser.should.equals(false);
            res.body.links[1].isAdmin.should.equals(false);
        });
    });

});
