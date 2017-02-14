'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let db = require('elyoos-server-test-util').db;
let moment = require('moment');

describe('Integration Tests creating comments for feedback elements', function () {

    let requestAgent, startTime;

    beforeEach(function () {
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return dbDsl.init(4, true);
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Create comment for bug', function () {

        dbDsl.createFeedbackBug('1', {creatorUserId: '1', created: 500});
        dbDsl.createFeedbackBug('2', {creatorUserId: '4', created: 503, status: 'closed'});
        dbDsl.createFeedbackIdea('3', {creatorUserId: '1', created: 504});
        dbDsl.createFeedbackIdea('4', {creatorUserId: '3', created: 506, status: 'closed'});
        dbDsl.createFeedbackDiscussion('5', {creatorUserId: '1', created: 507});
        dbDsl.createFeedbackDiscussion('6', {creatorUserId: '2', created: 508, status: 'closed'});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/admin/feedback/create/comment', {feedbackId: '1', text: 'text'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.created.should.be.at.least(startTime);
            res.body.creator.name.should.equals('user Meier');
            return db.cypher().match(`(:Feedback:Bug {feedbackId: '1'})<-[:COMMENT]-(comment:Feedback:Comment {feedbackId: {feedbackId}})
                                       <-[:IS_CREATOR]-(:User {userId: '1'})`)
                .return('comment')
                .end({feedbackId: res.body.feedbackId}).send();
        }).then(function (comment) {
            comment.length.should.equals(1);
            comment[0].comment.created.should.be.at.least(startTime);
            comment[0].comment.text.should.equals("text");
            comment[0].comment.createdByAdmin.should.equals(true);
        });
    });

    it('Create comment for idea', function () {

        dbDsl.createFeedbackBug('1', {creatorUserId: '1', created: 500});
        dbDsl.createFeedbackBug('2', {creatorUserId: '4', created: 503, status: 'closed'});
        dbDsl.createFeedbackIdea('3', {creatorUserId: '1', created: 504});
        dbDsl.createFeedbackIdea('4', {creatorUserId: '3', created: 506, status: 'closed'});
        dbDsl.createFeedbackDiscussion('5', {creatorUserId: '1', created: 507});
        dbDsl.createFeedbackDiscussion('6', {creatorUserId: '2', created: 508, status: 'closed'});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/admin/feedback/create/comment', {feedbackId: '3', text: 'text'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.created.should.be.at.least(startTime);
            res.body.creator.name.should.equals('user Meier');
            return db.cypher().match(`(:Feedback:Idea {feedbackId: '3'})<-[:COMMENT]-(comment:Feedback:Comment {feedbackId: {feedbackId}})
                                       <-[:IS_CREATOR]-(:User {userId: '1'})`)
                .return('comment')
                .end({feedbackId: res.body.feedbackId}).send();
        }).then(function (comment) {
            comment.length.should.equals(1);
            comment[0].comment.created.should.be.at.least(startTime);
            comment[0].comment.text.should.equals("text");
            comment[0].comment.createdByAdmin.should.equals(true);
        });
    });

    it('Create comment for discussion idea', function () {

        dbDsl.createFeedbackBug('1', {creatorUserId: '1', created: 500});
        dbDsl.createFeedbackBug('2', {creatorUserId: '4', created: 503, status: 'closed'});
        dbDsl.createFeedbackIdea('3', {creatorUserId: '1', created: 504});
        dbDsl.createFeedbackIdea('4', {creatorUserId: '3', created: 506, status: 'closed'});
        dbDsl.createFeedbackDiscussion('5', {creatorUserId: '1', created: 507});
        dbDsl.createFeedbackDiscussion('6', {creatorUserId: '2', created: 508, status: 'closed'});
        dbDsl.createFeedbackDiscussionIdea('7', {creatorUserId: '1', discussionFeedbackId: '5', created: 501});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/admin/feedback/create/comment', {feedbackId: '7', text: 'text'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.created.should.be.at.least(startTime);
            res.body.creator.name.should.equals('user Meier');
            return db.cypher().match(`(:Feedback:DiscussionIdea {feedbackId: '7'})<-[:COMMENT]-(comment:Feedback:Comment {feedbackId: {feedbackId}})
                                       <-[:IS_CREATOR]-(:User {userId: '1'})`)
                .return('comment')
                .end({feedbackId: res.body.feedbackId}).send();
        }).then(function (comment) {
            comment.length.should.equals(1);
            comment[0].comment.created.should.be.at.least(startTime);
            comment[0].comment.text.should.equals("text");
            comment[0].comment.createdByAdmin.should.equals(true);
        });
    });

    it('Create comment for discussion (not allowed 400)', function () {

        dbDsl.createFeedbackDiscussion('5', {creatorUserId: '1', created: 507});
        dbDsl.createFeedbackDiscussion('6', {creatorUserId: '2', created: 508, status: 'closed'});
        dbDsl.createFeedbackDiscussionIdea('7', {creatorUserId: '1', discussionFeedbackId: '5', created: 501});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/admin/feedback/create/comment', {feedbackId: '5', text: 'text'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });

    it('Create comment for not existing bug (400)', function () {

        dbDsl.createFeedbackBug('1', {creatorUserId: '1', created: 500});
        dbDsl.createFeedbackBug('2', {creatorUserId: '4', created: 503, status: 'closed'});
        dbDsl.createFeedbackIdea('3', {creatorUserId: '1', created: 504});
        dbDsl.createFeedbackIdea('4', {creatorUserId: '3', created: 506, status: 'closed'});
        dbDsl.createFeedbackDiscussion('5', {creatorUserId: '1', created: 507});
        dbDsl.createFeedbackDiscussion('6', {creatorUserId: '2', created: 508, status: 'closed'});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/admin/feedback/create/comment', {feedbackId: '8', text: 'text'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });
});
