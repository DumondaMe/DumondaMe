'use strict';

var users = requireTestUtil('user');
var dbDsl = requireTestUtil('dbDSL');
var requestHandler = requireTestUtil('request');
var db = requireTestUtil('db');
var moment = require('moment');

describe('Integration Tests creating comments for feedback elements', function () {

    var requestAgent, startTime;

    beforeEach(function () {
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return dbDsl.init(4);
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Create comment for bug', function () {

        dbDsl.createFeedbackBug('1', '1', 500);
        dbDsl.createFeedbackBug('2', '4', 503, 'closed');

        dbDsl.createFeedbackIdea('3', '1', 504);
        dbDsl.createFeedbackIdea('4', '3', 506, 'closed');

        dbDsl.createFeedbackDiscussion('5', '1', 507);
        dbDsl.createFeedbackDiscussion('6', '2', 508, 'closed');

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/feedback/comment', {feedbackId: '1', text: 'text'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match(`(:Feedback:Bug {feedbackId: '1'})<-[:COMMENT]-(comment:Feedback:Comment {feedbackId: {feedbackCommentId}})
                                       <-[:IS_CREATOR]-(:User {userId: '1'})`)
                .return('comment')
                .end({feedbackCommentId: res.body.feedbackCommentId}).send();
        }).then(function (comment) {
            comment.length.should.equals(1);
            comment[0].comment.created.should.be.at.least(startTime);
            comment[0].comment.text.should.equals("text");
        });
    });

    it('Create comment for idea', function () {

        dbDsl.createFeedbackBug('1', '1', 500);
        dbDsl.createFeedbackBug('2', '4', 503, 'closed');

        dbDsl.createFeedbackIdea('3', '1', 504);
        dbDsl.createFeedbackIdea('4', '3', 506, 'closed');

        dbDsl.createFeedbackDiscussion('5', '1', 507);
        dbDsl.createFeedbackDiscussion('6', '2', 508, 'closed');

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/feedback/comment', {feedbackId: '3', text: 'text'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match(`(:Feedback:Idea {feedbackId: '3'})<-[:COMMENT]-(comment:Feedback:Comment {feedbackId: {feedbackCommentId}})
                                       <-[:IS_CREATOR]-(:User {userId: '1'})`)
                .return('comment')
                .end({feedbackCommentId: res.body.feedbackCommentId}).send();
        }).then(function (comment) {
            comment.length.should.equals(1);
            comment[0].comment.created.should.be.at.least(startTime);
            comment[0].comment.text.should.equals("text");
        });
    });

    it('Create comment for discussion idea', function () {

        dbDsl.createFeedbackBug('1', '1', 500);
        dbDsl.createFeedbackBug('2', '4', 503, 'closed');

        dbDsl.createFeedbackIdea('3', '1', 504);
        dbDsl.createFeedbackIdea('4', '3', 506, 'closed');

        dbDsl.createFeedbackDiscussion('5', '1', 507);
        dbDsl.createFeedbackDiscussion('6', '2', 508, 'closed');

        dbDsl.createFeedbackDiscussionIdea('7', '5', '1', 501);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/feedback/comment', {feedbackId: '7', text: 'text'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match(`(:Feedback:DiscussionIdea {feedbackId: '7'})<-[:COMMENT]-(comment:Feedback:Comment {feedbackId: {feedbackCommentId}})
                                       <-[:IS_CREATOR]-(:User {userId: '1'})`)
                .return('comment')
                .end({feedbackCommentId: res.body.feedbackCommentId}).send();
        }).then(function (comment) {
            comment.length.should.equals(1);
            comment[0].comment.created.should.be.at.least(startTime);
            comment[0].comment.text.should.equals("text");
        });
    });

    it('Create comment for discussion (not allowed 400)', function () {

        dbDsl.createFeedbackDiscussion('5', '1', 507);
        dbDsl.createFeedbackDiscussion('6', '2', 508, 'closed');

        dbDsl.createFeedbackDiscussionIdea('7', '5', '1', 501);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/feedback/comment', {feedbackId: '5', text: 'text'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });

    it('Create comment for not existing bug (400)', function () {

        dbDsl.createFeedbackBug('1', '1', 500);
        dbDsl.createFeedbackBug('2', '4', 503, 'closed');

        dbDsl.createFeedbackIdea('3', '1', 504);
        dbDsl.createFeedbackIdea('4', '3', 506, 'closed');

        dbDsl.createFeedbackDiscussion('5', '1', 507);
        dbDsl.createFeedbackDiscussion('6', '2', 508, 'closed');

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/feedback/comment', {feedbackId: '8', text: 'text'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });
});
