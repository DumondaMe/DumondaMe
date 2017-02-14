'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let db = require('elyoos-server-test-util').db;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');

describe('Integration Tests for deleting a discussion', function () {

    let requestAgent, startTime;

    beforeEach(function () {
        return dbDsl.init(5, true);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Delete a discussion', function () {

        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createFeedbackDiscussion('1', {creatorUserId: '1', created: 507});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.del('/api/admin/feedback/delete/discussion', {
                discussionId: '1'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(feedback:Feedback:Discussion {feedbackId: '1'})")
                .return('feedback').end().send();
        }).then(function (feedback) {
            feedback.length.should.equals(0);
        });
    });

    it('Delete a discussion fails when ideas present (400)', function () {

        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createFeedbackDiscussion('1', {creatorUserId: '1', created: 507});
        dbDsl.createFeedbackDiscussionIdea('2', {creatorUserId: '1', discussionFeedbackId: '1', created: 509});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.del('/api/admin/feedback/delete/discussion', {
                discussionId: '1'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(feedback:Feedback:Discussion {feedbackId: '1'})")
                .return('feedback').end().send();
        }).then(function (feedback) {
            feedback.length.should.equals(1);
            feedback[0].feedback.status.should.equals("open");
            feedback[0].feedback.created.should.equals(507);
            feedback[0].feedback.modified.should.equals(507);
            feedback[0].feedback.title.should.equals("discussion1Title");
            feedback[0].feedback.description.should.equals("discussion1Description");
        });
    });

    it('Delete non existing discussion (400)', function () {

        dbDsl.createFeedbackDiscussion('1', {creatorUserId: '1', created: 507});
        dbDsl.createFeedbackDiscussionIdea('2', {creatorUserId: '1', discussionFeedbackId: '1', created: 509});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.del('/api/admin/feedback/delete/discussion', {
                discussionId: '3'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(feedback:Feedback:Discussion {feedbackId: '3'})")
                .return('feedback').end().send();
        }).then(function (feedback) {
            feedback.length.should.equals(0);
        });
    });
});
