'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let db = require('elyoos-server-test-util').db;
let moment = require('moment');

describe('Integration Tests recommending feedback elements', function () {

    let startTime;

    beforeEach(function () {
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return dbDsl.init(4);
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Create recommendation for a bug', function () {

        dbDsl.createFeedbackBug('1', {creatorUserId: '2', created: 500});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.post('/api/user/feedback/recommendation', {feedbackId: '1'});
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

        dbDsl.createFeedbackBug('1', {creatorUserId: '1', created: 500});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.post('/api/user/feedback/recommendation', {feedbackId: '1'});
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });

    it('Create recommend a bug twice (400)', function () {

        dbDsl.createFeedbackBug('1', {creatorUserId: '2', created: 500});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.post('/api/user/feedback/recommendation', {feedbackId: '1'});
        }).then(function (res) {
            res.status.should.equal(200);
            return requestHandler.post('/api/user/feedback/recommendation', {feedbackId: '1'});
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });

    it('Create recommendation for an idea', function () {

        dbDsl.createFeedbackIdea('1', {creatorUserId: '2', created: 500});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.post('/api/user/feedback/recommendation', {feedbackId: '1'});
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

        dbDsl.createFeedbackIdea('1', {creatorUserId: '1', created: 500});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.post('/api/user/feedback/recommendation', {feedbackId: '1'});
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });

    it('Create recommendation twice for an idea (400)', function () {

        dbDsl.createFeedbackIdea('1', {creatorUserId: '2', created: 500});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.post('/api/user/feedback/recommendation', {feedbackId: '1'});
        }).then(function (res) {
            res.status.should.equal(200);
            return requestHandler.post('/api/user/feedback/recommendation', {feedbackId: '1'});
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });

    it('Create recommendation for discussion idea', function () {

        dbDsl.createFeedbackDiscussion('1', {creatorUserId: '1', created: 501});
        dbDsl.createFeedbackDiscussionIdea('2', {creatorUserId: '2', discussionFeedbackId: '1', created: 501});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.post('/api/user/feedback/recommendation', {feedbackId: '2'});
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

        dbDsl.createFeedbackDiscussion('1', {creatorUserId: '1', created: 501});
        dbDsl.createFeedbackDiscussionIdea('2', {creatorUserId: '1', discussionFeedbackId: '1', created: 501});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.post('/api/user/feedback/recommendation', {feedbackId: '2'});
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });

    it('Create recommendation twice for an discussion idea (400)', function () {

        dbDsl.createFeedbackDiscussion('1', {creatorUserId: '1', created: 501});
        dbDsl.createFeedbackDiscussionIdea('2', {creatorUserId: '2', discussionFeedbackId: '1', created: 501});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.post('/api/user/feedback/recommendation', {feedbackId: '2'});
        }).then(function (res) {
            res.status.should.equal(200);
            return requestHandler.post('/api/user/feedback/recommendation', {feedbackId: '2'});
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });

    it('Recommending a discussion is not possible (400)', function () {

        dbDsl.createFeedbackDiscussion('1', {creatorUserId: '1', created: 501});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.post('/api/user/feedback/recommendation', {feedbackId: '1'});
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });
});
