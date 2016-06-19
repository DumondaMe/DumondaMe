'use strict';

var users = require('../../util/user');
var db = require('../../util/db');
var requestHandler = require('../../util/request');
var moment = require('moment');

describe('Integration Tests for adding and deleting user blog recommendations', function () {

    var requestAgent, startTime;

    beforeEach(function () {

        var commands = [];
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return db.clearDatabase().then(function () {
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', surname: 'Meier', forename:'user', userId: '1'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier2', userId: '2'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier3', userId: '3'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier4', userId: '4'})").end().getCommand());

            commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User)")
                .where("b.userId IN ['2','3']").create("(a)-[:IS_CONTACT]->(b)").end().getCommand());

            commands.push(db.cypher().create("(:Blog:PinwallElement {text: 'blogText1', created: 501, blogId: '1', heightPreviewImage: 200, " +
                "topic: {topic}})").end({topic: ['health', 'personalDevelopment']}).getCommand());
            commands.push(db.cypher().match("(a:Blog {blogId: '1'}), (b:User {userId: '1'})")
                .createUnique("(b)-[:WRITTEN]->(a)").end().getCommand());
            commands.push(db.cypher().create("(:Blog:PinwallElement {text: 'blogText2', created: 502, blogId: '2', heightPreviewImage: 201, " +
                "topic: {topic}})").end({topic: ['health', 'personalDevelopment']}).getCommand());
            commands.push(db.cypher().match("(a:Blog {blogId: '2'}), (b:User {userId: '2'})")
                .createUnique("(b)-[:WRITTEN]->(a)").end().getCommand());

            commands.push(db.cypher().create("(:Recommendation {created: 500, recommendationId: '0'})")
                .end().getCommand());
            commands.push(db.cypher().match("(a:Blog {blogId: '1'}), (b:Recommendation {recommendationId: '0'}), (c:User {userId: '2'})")
                .create("(c)-[:RECOMMENDS]->(b)-[:RECOMMENDS]->(a), (b)-[:PINWALL_DATA]->(a)")
                .end().getCommand());

            commands.push(db.cypher().create("(:Recommendation {created: 501, recommendationId: '1'})")
                .end().getCommand());
            commands.push(db.cypher().create("(:Recommendation {created: 499, recommendationId: '2'})")
                .end().getCommand());
            commands.push(db.cypher().match("(a:Blog {blogId: '2'}), (b:Recommendation {recommendationId: '1'}), (c:User {userId: '3'})")
                .create("(c)-[:RECOMMENDS]->(b)-[:RECOMMENDS]->(a), (b)-[:PINWALL_DATA]->(a)").end().getCommand());
            return db.cypher().match("(a:Blog {blogId: '1'}), (b:Recommendation {recommendationId: '2'}), (c:User {userId: '4'})")
                .create("(c)-[:RECOMMENDS]->(b)-[:RECOMMENDS]->(a), (b)-[:PINWALL_DATA]->(a)").end().send(commands);

        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Adding a new blog recommendation - Return 200', function () {

        var recommendationId, created;
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/recommendation/blog', {
                blogId: '2'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.profileUrl.should.equals('profileImage/1/thumbnail.jpg');
            res.body.recommendation.contact.numberOfRecommendations.should.equals(1);
            res.body.recommendation.all.numberOfRecommendations.should.equals(2);
            recommendationId = res.body.recommendationId;
            created = res.body.created;
            return db.cypher().match("(:User {userId: '1'})-[:RECOMMENDS]->(recommendation:Recommendation)-[:RECOMMENDS]->(:Blog {blogId: '2'})")
                .return('recommendation.created AS created, recommendation.recommendationId AS recommendationId')
                .end().send();
        }).then(function (resp) {
            resp.length.should.equals(1);
            resp[0].created.should.equals(created);
            resp[0].recommendationId.should.equals(recommendationId);
            return db.cypher().match("(:Recommendation:PinwallElement {recommendationId: {recommendationId}})-[:PINWALL_DATA]->(blog:Blog)")
                .return('blog')
                .end({recommendationId: recommendationId}).send();
        }).then(function (resp) {
            resp.length.should.equals(1);
        });
    });

    it('Blog can only be rated once by a user - Return 400', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/recommendation/blog', {
                blogId: '2'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return requestHandler.post('/api/user/recommendation/blog', {
                blogId: '2'
            }, requestAgent);
        }).then(function (resp) {
            resp.status.should.equal(400);
            return db.cypher().match("(:User {userId: '1'})-[:RECOMMENDS]->(recommendation:Recommendation)-[:RECOMMENDS]->(:Blog {blogId: '2'})")
                .return('recommendation.created AS created')
                .end().send();
        }).then(function (resp) {
            resp.length.should.equals(1);
            resp[0].created.should.be.at.least(startTime);
        });
    });

    it('Blog can not be recommended by user who has written the blog - Return 400', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/recommendation/blog', {
                blogId: '1'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(:User {userId: '1'})-[:RECOMMENDS]->(recommendation:Recommendation)-[:RECOMMENDS]->(:Blog {blogId: '1'})")
                .return('recommendation.created AS created')
                .end().send();
        }).then(function (resp) {
            resp.length.should.equals(0);
        });
    });

    it('Deleting a blog recommendation - Return 200', function () {

        var recommendationId;
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/recommendation/blog', {
                blogId: '2'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            recommendationId = res.body.recommendationId;
            return requestHandler.del('/api/user/recommendation/blog', {
                recommendationId: recommendationId,
                blogId: '2'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.recommendation.contact.numberOfRecommendations.should.equals(1);
            res.body.recommendation.all.numberOfRecommendations.should.equals(1);
            return db.cypher().match(`(recommendation:Recommendation {recommendationId: '${recommendationId}'})`)
                .return('recommendation.created AS created')
                .end().send();
        }).then(function (resp) {
            resp.length.should.equals(0);
        });
    });

    it('Deleting a blog recommendation of an other user- Return 400', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.del('/api/user/recommendation/blog', {
                recommendationId: '0',
                blogId: '1'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });
});
