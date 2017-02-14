'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let db = require('elyoos-server-test-util').db;
let moment = require('moment');

describe('Integration Tests for deleting a feedback recommendation', function () {

    var requestAgent, startTime;

    beforeEach(function () {
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return dbDsl.init(4);
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Deleting feedback recommendation', function () {

        dbDsl.createFeedbackIdea('1', {creatorUserId: '2', created: 504});
        dbDsl.createFeedbackRecommendation('2', {feedbackId: '1', creatorUserId: '1', created: 510});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.del('/api/user/feedback/recommendation', {
                recommendationId: '2'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(feedback:Feedback {recommendationId: '2'})")
                .return('feedback').end().send();
        }).then(function (feedback) {
            feedback.length.should.equals(0);
        });
    });

    it('Not allowed to delete feedback recommendation of other user (400)', function () {

        dbDsl.createFeedbackIdea('1', {creatorUserId: '2', created: 504});
        dbDsl.createFeedbackRecommendation('2', {feedbackId: '1', creatorUserId: '2', created: 510});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.del('/api/user/feedback/recommendation', {
                recommendationId: '2'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(feedback:Feedback {recommendationId: '2'})")
                .return('feedback').end().send();
        }).then(function (feedback) {
            feedback.length.should.equals(1);
        });
    });

    it('Try to delete non existing recommendation (400)', function () {

        dbDsl.createFeedbackIdea('1', {creatorUserId: '2', created: 504});
        dbDsl.createFeedbackRecommendation('2', {feedbackId: '1', creatorUserId: '1', created: 510});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.del('/api/user/feedback/recommendation', {
                recommendationId: '3'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(feedback:Feedback {recommendationId: '2'})")
                .return('feedback').end().send();
        }).then(function (feedback) {
            feedback.length.should.equals(1);
        });
    });
});
