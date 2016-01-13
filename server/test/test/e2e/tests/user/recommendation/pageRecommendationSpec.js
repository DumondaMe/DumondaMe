'use strict';

var users = require('../../util/user');
var db = require('../../util/db');
var requestHandler = require('../../util/request');
var moment = require('moment');

describe('Integration Tests for adding and deleting user page recommendations', function () {

    var requestAgent, startTime;

    beforeEach(function () {

        var commands = [];
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return db.clearDatabase().then(function () {
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', surname: 'Meier', forename:'user', userId: '1'})").end().getCommand());
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo2.ch', name: 'user Meier', userId: '2'})").end().getCommand());
            commands.push(db.cypher().create("(:Page {title: 'bookPage1Title', label: 'Book', description: 'bookPage1', created: 501, pageId: '0'," +
            "author: 'Hans Muster'})").end().getCommand());
            commands.push(db.cypher().create("(:Page {title: 'page2Title', label: 'Youtube', description: 'page2', link: 'www.link.com', created: 500, pageId: '1', actor: 'Hans Muster'})").end().getCommand());

            commands.push(db.cypher().create("(:Recommendation {created: 500, rating: 3, comment: 'irgendwas', recommendationId: '0'})")
                .end().getCommand());
            commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:Recommendation {recommendationId: '0'}), (c:User {userId: '2'})")
                .create("(c)-[:RECOMMENDS]->(b)-[:RECOMMENDS]->(a), (b)-[:PINWALL_DATA]->(a)")
                .end().getCommand());
            commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '2'})")
                .create("(a)-[:IS_CONTACT]->(b)")
                .end().getCommand());

            commands.push(db.cypher().create("(:Recommendation {created: 499, rating: 4, comment: 'irgendwas2', recommendationId: '1'})")
                .end().getCommand());
            return db.cypher().match("(a:Page {pageId: '1'}), (b:Recommendation {recommendationId: '1'}), (c:User {userId: '1'})")
                .create("(c)-[:RECOMMENDS]->(b)-[:RECOMMENDS]->(a), (b)-[:PINWALL_DATA]->(a)")
                .end().send(commands);

        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Adding a new book page recommendation - Return 200', function () {

        var recommendationId, created;
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/recommendation/page', {
                pageId: '0',
                comment: 'irgendwas',
                rating: 5
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.profileUrl.should.equals('profileImage/1/thumbnail.jpg');
            res.body.recommendation.contact.numberOfRatings.should.equals(1);
            res.body.recommendation.contact.rating.should.equals(3);
            res.body.recommendation.all.numberOfRatings.should.equals(2);
            res.body.recommendation.all.rating.should.equals(4);
            recommendationId = res.body.recommendationId;
            created = res.body.created;
            return db.cypher().match("(:User {userId: '1'})-[:RECOMMENDS]->(recommendation:Recommendation)-[:RECOMMENDS]->(:Page {pageId: '0'})")
                .return('recommendation.created AS created, recommendation.rating AS rating, recommendation.comment AS comment, recommendation.recommendationId AS recommendationId')
                .end().send();
        }).then(function (resp) {
            resp.length.should.equals(1);
            resp[0].created.should.equals(created);
            resp[0].rating.should.equals(5);
            resp[0].comment.should.equals('irgendwas');
            resp[0].recommendationId.should.equals(recommendationId);
            return db.cypher().match("(:Recommendation:PinwallElement {recommendationId: {recommendationId}})-[:PINWALL_DATA]->(page:Page)")
                .return('page')
                .end({recommendationId: recommendationId}).send();
        }).then(function (resp) {
            resp.length.should.equals(1);
        });
    });

    it('Page can only be rated once by a user - Return 400', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/recommendation/page', {
                pageId: '0',
                comment: 'irgendwas',
                rating: 5
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return requestHandler.post('/api/user/recommendation/page', {
                pageId: '0',
                comment: 'irgendwa',
                rating: 4
            }, requestAgent);
        }).then(function (resp) {
            resp.status.should.equal(400);
            return db.cypher().match("(:User {userId: '1'})-[:RECOMMENDS]->(recommendation:Recommendation)-[:RECOMMENDS]->(:Page {pageId: '0'})")
                .return('recommendation.created AS created, recommendation.rating AS rating, recommendation.comment AS comment')
                .end().send();
        }).then(function (resp) {
            resp.length.should.equals(1);
            resp[0].created.should.be.at.least(startTime);
            resp[0].rating.should.equals(5);
            resp[0].comment.should.equals('irgendwas');
        });
    });

    it('Deleting a page recommendation - Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.del('/api/user/recommendation/page', {
                recommendationId: '1',
                pageId: '1'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.recommendation.contact.numberOfRatings.should.equals(0);
            res.body.recommendation.all.numberOfRatings.should.equals(0);
            return db.cypher().match("(recommendation:Recommendation {recommendationId: '1'})")
                .return('recommendation.created AS created, recommendation.rating AS rating, recommendation.comment AS comment')
                .end().send();
        }).then(function (resp) {
            resp.length.should.equals(0);
        });
    });

    it('Deleting a page recommendation of an other user- Return 400', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.del('/api/user/recommendation/page', {
                recommendationId: '0',
                pageId: '0'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });
});
