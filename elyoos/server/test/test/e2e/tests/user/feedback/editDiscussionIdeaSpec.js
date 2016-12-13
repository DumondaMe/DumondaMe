'use strict';

var users = require('elyoos-server-test-util').user;
var dbDsl = require('elyoos-server-test-util').dbDSL;
var requestHandler = require('elyoos-server-test-util').requestHandler;
var db = require('elyoos-server-test-util').db;
var moment = require('moment');

describe('Integration Tests edit discussion idea feedback', function () {

    var requestAgent, startTime;

    beforeEach(function () {
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return dbDsl.init(2);
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Edit idea feedback', function () {

        dbDsl.createFeedbackDiscussion('1', '2', 504);
        dbDsl.createFeedbackDiscussionIdea('2', '1', '1', 504);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/feedback/edit', {
                title: 'title',
                description: 'description',
                feedbackId: '2'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.modified.should.be.at.least(startTime);
            return db.cypher().match("(feedback:Feedback:DiscussionIdea {feedbackId: '2'})<-[:IS_CREATOR]-(:User {userId: '1'})")
                .return('feedback').end().send();
        }).then(function (feedback) {
            feedback.length.should.equals(1);
            feedback[0].feedback.created.should.equals(504);
            feedback[0].feedback.modified.should.be.at.least(startTime);
            feedback[0].feedback.title.should.equals("title");
            feedback[0].feedback.description.should.equals("description");
            feedback[0].feedback.status.should.equals("open");
        });
    });

    it('Edit idea of other user fails', function () {

        dbDsl.createFeedbackDiscussion('1', '1', 504);
        dbDsl.createFeedbackDiscussionIdea('2', '1', '2', 504);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/feedback/edit', {
                title: 'title',
                description: 'description',
                feedbackId: '2'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(feedback:DiscussionIdea {feedbackId: '2'})")
                .return('feedback').end().send();
        }).then(function (feedback) {
            feedback.length.should.equals(1);
            feedback[0].feedback.created.should.equals(504);
            feedback[0].feedback.title.should.equals("discussionIdea2Title");
            feedback[0].feedback.description.should.equals("discussionIdea2Description");
            feedback[0].feedback.status.should.equals("open");
        });
    });

    it('Closed idea feedback can not be edited', function () {

        dbDsl.createFeedbackDiscussion('1', '1', 504);
        dbDsl.createFeedbackDiscussionIdea('2', '1', '2', 504, 504, 'closed');

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/feedback/edit', {
                title: 'title',
                description: 'description',
                feedbackId: '2'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(feedback:DiscussionIdea {feedbackId: '2'})")
                .return('feedback').end().send();
        }).then(function (feedback) {
            feedback.length.should.equals(1);
            feedback[0].feedback.created.should.equals(504);
            feedback[0].feedback.title.should.equals("discussionIdea2Title");
            feedback[0].feedback.description.should.equals("discussionIdea2Description");
            feedback[0].feedback.status.should.equals("closed");
        });
    });

    it('Not allowed to edit discussion as normal user', function () {

        dbDsl.createFeedbackDiscussion('1', '1', 504);
        dbDsl.createFeedbackDiscussionIdea('2', '1', '2', 504, 504, 'closed');

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/feedback/edit', {
                title: 'title',
                description: 'description',
                feedbackId: '1'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(feedback:Discussion {feedbackId: '1'})")
                .return('feedback').end().send();
        }).then(function (feedback) {
            feedback.length.should.equals(1);
            feedback[0].feedback.created.should.equals(504);
            feedback[0].feedback.title.should.equals("discussion1Title");
            feedback[0].feedback.description.should.equals("discussion1Description");
            feedback[0].feedback.status.should.equals("open");
        });
    });
});
