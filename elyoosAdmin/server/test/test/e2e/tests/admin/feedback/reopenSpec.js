'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let db = require('elyoos-server-test-util').db;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');

describe('Integration Tests for reopen a feedback', function () {

    let requestAgent, startTime;

    beforeEach(function () {
        return dbDsl.init(5, true);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Reopen a bug', function () {

        let statusFeedbackId;
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createFeedbackBug('1', '1', 500, 600, 'closed');

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/admin/feedback/reopen', {feedbackId: '1', reasonText: 'So ein Grund'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.closedDate.should.be.at.least(startTime);
            statusFeedbackId = res.body.statusFeedbackId;
            return db.cypher().match("(feedback:Feedback {feedbackId: '1'})<-[]-(status:Feedback:Comment:Status)<-[:IS_CREATOR]-(:User {userId: '1'})")
                .return('feedback, status').end().send();
        }).then(function (feedback) {
            feedback.length.should.equals(1);
            feedback[0].feedback.status.should.equals("open");
            feedback[0].status.created.should.be.at.least(startTime);
            feedback[0].status.text.should.equals("So ein Grund");
            feedback[0].status.status.should.equals("open");
            feedback[0].status.feedbackId.should.equals(statusFeedbackId);
        });
    });

    it('Reopen a idea', function () {

        let statusFeedbackId;
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createFeedbackIdea('1', '1', 500, 600, 'closed');

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/admin/feedback/reopen', {feedbackId: '1', reasonText: 'So ein Grund'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.closedDate.should.be.at.least(startTime);
            statusFeedbackId = res.body.statusFeedbackId;
            return db.cypher().match("(feedback:Feedback {feedbackId: '1'})<-[]-(status:Feedback:Comment:Status)<-[:IS_CREATOR]-(:User {userId: '1'})")
                .return('feedback, status').end().send();
        }).then(function (feedback) {
            feedback.length.should.equals(1);
            feedback[0].feedback.status.should.equals("open");
            feedback[0].status.created.should.be.at.least(startTime);
            feedback[0].status.text.should.equals("So ein Grund");
            feedback[0].status.status.should.equals("open");
            feedback[0].status.feedbackId.should.equals(statusFeedbackId);
        });
    });

    it('Reopen a discussion', function () {

        let statusFeedbackId;
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createFeedbackDiscussion('1', '1', 507, 507, 'closed');
        dbDsl.createFeedbackDiscussionIdea('2', '1', '1', 509);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/admin/feedback/reopen', {feedbackId: '1', reasonText: 'So ein Grund'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.closedDate.should.be.at.least(startTime);
            statusFeedbackId = res.body.statusFeedbackId;
            return db.cypher().match("(feedback:Feedback {feedbackId: '1'})<-[]-(status:Feedback:Comment:Status)<-[:IS_CREATOR]-(:User {userId: '1'})")
                .return('feedback, status').end().send();
        }).then(function (feedback) {
            feedback.length.should.equals(1);
            feedback[0].feedback.status.should.equals("open");
            feedback[0].status.created.should.be.at.least(startTime);
            feedback[0].status.text.should.equals("So ein Grund");
            feedback[0].status.status.should.equals("open");
            feedback[0].status.feedbackId.should.equals(statusFeedbackId);
        });
    });

    it('Reopen a discussion idea', function () {

        let statusFeedbackId;
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createFeedbackDiscussion('1', '1', 507, 507, 'closed');
        dbDsl.createFeedbackDiscussionIdea('2', '1', '1', 509, 509, 'closed');

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/admin/feedback/reopen', {feedbackId: '2', reasonText: 'So ein Grund'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.closedDate.should.be.at.least(startTime);
            statusFeedbackId = res.body.statusFeedbackId;
            return db.cypher().match("(feedback:Feedback {feedbackId: '2'})<-[]-(status:Feedback:Comment:Status)<-[:IS_CREATOR]-(:User {userId: '1'})")
                .return('feedback, status').end().send();
        }).then(function (feedback) {
            feedback.length.should.equals(1);
            feedback[0].feedback.status.should.equals("open");
            feedback[0].status.created.should.be.at.least(startTime);
            feedback[0].status.text.should.equals("So ein Grund");
            feedback[0].status.status.should.equals("open");
            feedback[0].status.feedbackId.should.equals(statusFeedbackId);
        });
    });

    it('Reopen a non existing feedback (400)', function () {

        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createFeedbackDiscussion('1', '1', 507, 507, 'closed');
        dbDsl.createFeedbackDiscussionIdea('2', '1', '1', 509);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/admin/feedback/reopen', {feedbackId: '3', reasonText: 'So ein Grund'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });

    it('Reopen a open feedback is not allowed (400)', function () {

        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createFeedbackDiscussion('1', '1', 507);
        dbDsl.createFeedbackDiscussionIdea('2', '1', '1', 509);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/admin/feedback/reopen', {feedbackId: '1', reasonText: 'So ein Grund'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(feedback:Feedback {feedbackId: '1'})<-[]-(status:Feedback:Comment:Status)<-[:IS_CREATOR]-(:User {userId: '1'})")
                .return('feedback, status').end().send();
        }).then(function (feedback) {
            feedback.length.should.equals(0);
        });
    });
});
