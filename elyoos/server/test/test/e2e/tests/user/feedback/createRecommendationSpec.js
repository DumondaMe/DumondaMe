'use strict';

var users = requireTestUtil('user');
var dbDsl = requireTestUtil('dbDSL');
var requestHandler = requireTestUtil('request');
var db = requireTestUtil('db');
var moment = require('moment');

describe('Integration Tests recommending feedback elements', function () {

    var requestAgent, startTime;

    beforeEach(function () {
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return dbDsl.init(4);
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Create recommendation for a bug', function () {

        dbDsl.createFeedbackBug('1', '2', 500);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/feedback/recommendation', {feedbackId: '1'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match(`(:Feedback:Bug {feedbackId: '1'})<-[:RECOMMENDS]-(recommendation:Feedback:Recommendation {recommendationId: {recommendationId}})
                                       <-[:RECOMMENDED_BY]-(:User {userId: '1'})`)
                .return('recommendation')
                .end({recommendationId: res.body.recommendationId}).send();
        }).then(function (recommendation) {
            recommendation.length.should.equals(1);
            recommendation[0].recommendation.created.should.be.at.least(startTime);
        });
    });

    it('Recommendation for a bug created by the user (400)', function () {

        dbDsl.createFeedbackBug('1', '1', 500);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/feedback/recommendation', {feedbackId: '1'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });

    it('Create recommend a bug twice (400)', function () {

        dbDsl.createFeedbackBug('1', '2', 500);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/feedback/recommendation', {feedbackId: '1'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return requestHandler.post('/api/user/feedback/recommendation', {feedbackId: '1'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });

    it('Create recommendation for an idea', function () {

        dbDsl.createFeedbackIdea('1', '2', 500);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/feedback/recommendation', {feedbackId: '1'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match(`(:Feedback:Idea {feedbackId: '1'})<-[:RECOMMENDS]-(recommendation:Feedback:Recommendation {recommendationId: {recommendationId}})
                                       <-[:RECOMMENDED_BY]-(:User {userId: '1'})`)
                .return('recommendation')
                .end({recommendationId: res.body.recommendationId}).send();
        }).then(function (recommendation) {
            recommendation.length.should.equals(1);
            recommendation[0].recommendation.created.should.be.at.least(startTime);
        });
    });

    it('Create recommendation for an idea created by the user (400)', function () {

        dbDsl.createFeedbackIdea('1', '1', 500);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/feedback/recommendation', {feedbackId: '1'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });

    it('Create recommendation twice for an idea (400)', function () {

        dbDsl.createFeedbackIdea('1', '2', 500);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/feedback/recommendation', {feedbackId: '1'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return requestHandler.post('/api/user/feedback/recommendation', {feedbackId: '1'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });

    it('Create recommendation for discussion idea', function () {

        dbDsl.createFeedbackDiscussion('1', '1', 501);

        dbDsl.createFeedbackDiscussionIdea('2', '1', '2', 501);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/feedback/recommendation', {feedbackId: '2'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match(`(:Feedback:DiscussionIdea {feedbackId: '2'})<-[:RECOMMENDS]-(recommendation:Feedback:Recommendation {recommendationId: {recommendationId}})
                                       <-[:RECOMMENDED_BY]-(:User {userId: '1'})`)
                .return('recommendation')
                .end({recommendationId: res.body.recommendationId}).send();
        }).then(function (recommendation) {
            recommendation.length.should.equals(1);
            recommendation[0].recommendation.created.should.be.at.least(startTime);
        });
    });

    it('Create recommendation for discussion idea created by the user (400)', function () {

        dbDsl.createFeedbackDiscussion('1', '1', 501);

        dbDsl.createFeedbackDiscussionIdea('2', '1', '1', 501);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/feedback/recommendation', {feedbackId: '2'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });

    it('Create recommendation twice for an discussion idea (400)', function () {

        dbDsl.createFeedbackDiscussion('1', '1', 501);

        dbDsl.createFeedbackDiscussionIdea('2', '1', '2', 501);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/feedback/recommendation', {feedbackId: '2'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return requestHandler.post('/api/user/feedback/recommendation', {feedbackId: '2'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });

    it('Recommending a discussion is not possible (400)', function () {

        dbDsl.createFeedbackDiscussion('1', '1', 501);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/feedback/recommendation', {feedbackId: '1'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });
});
