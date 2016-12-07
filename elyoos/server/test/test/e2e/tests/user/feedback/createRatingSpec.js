'use strict';

var users = requireTestUtil('user');
var dbDsl = requireTestUtil('dbDSL');
var requestHandler = requireTestUtil('request');
var db = requireTestUtil('db');
var moment = require('moment');

describe('Integration Tests ratings for feedback elements', function () {

    var requestAgent, startTime;

    beforeEach(function () {
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return dbDsl.init(4);
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Create rating for bug', function () {

        dbDsl.createFeedbackBug('1', '1', 500);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/feedback/rating', {feedbackId: '1'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match(`(:Feedback:Bug {feedbackId: '1'})<-[:RATING]-(rating:Feedback:Rating)
                                       <-[:RATED_BY]-(:User {userId: '1'})`)
                .return('rating')
                .end().send();
        }).then(function (rating) {
            rating.length.should.equals(1);
            rating[0].rating.created.should.be.at.least(startTime);
        });
    });

    it('Create rating twice for a bug (400)', function () {

        dbDsl.createFeedbackBug('1', '1', 500);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/feedback/rating', {feedbackId: '1'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return requestHandler.post('/api/user/feedback/rating', {feedbackId: '1'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });

    it('Create rating for idea', function () {

        dbDsl.createFeedbackIdea('1', '1', 500);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/feedback/rating', {feedbackId: '1'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match(`(:Feedback:Idea {feedbackId: '1'})<-[:RATING]-(rating:Feedback:Rating)
                                       <-[:RATED_BY]-(:User {userId: '1'})`)
                .return('rating')
                .end().send();
        }).then(function (rating) {
            rating.length.should.equals(1);
            rating[0].rating.created.should.be.at.least(startTime);
        });
    });

    it('Create rating twice for an idea (400)', function () {

        dbDsl.createFeedbackIdea('1', '1', 500);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/feedback/rating', {feedbackId: '1'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return requestHandler.post('/api/user/feedback/rating', {feedbackId: '1'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });

    it('Create rating for discussion idea', function () {

        dbDsl.createFeedbackDiscussion('1', '1', 501);

        dbDsl.createFeedbackDiscussionIdea('2', '1', '1', 501);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/feedback/rating', {feedbackId: '2'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match(`(:Feedback:DiscussionIdea {feedbackId: '2'})<-[:RATING]-(rating:Feedback:Rating)
                                       <-[:RATED_BY]-(:User {userId: '1'})`)
                .return('rating')
                .end().send();
        }).then(function (rating) {
            rating.length.should.equals(1);
            rating[0].rating.created.should.be.at.least(startTime);
        });
    });

    it('Create rating twice for an discussion idea (400)', function () {

        dbDsl.createFeedbackDiscussion('1', '1', 501);

        dbDsl.createFeedbackDiscussionIdea('2', '1', '1', 501);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/feedback/rating', {feedbackId: '2'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return requestHandler.post('/api/user/feedback/rating', {feedbackId: '2'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });

    it('rating discussion not possible (400)', function () {

        dbDsl.createFeedbackDiscussion('1', '1', 501);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/feedback/rating', {feedbackId: '1'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });
});
