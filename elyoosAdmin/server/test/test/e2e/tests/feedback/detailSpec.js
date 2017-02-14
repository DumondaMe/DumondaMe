'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for getting feedback detail', function () {

    let requestAgent;

    beforeEach(function () {
        return dbDsl.init(5, true);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting bug detail', function () {

        dbDsl.createFeedbackBug('1', {creatorUserId: '1', created: 400, modified: 600});

        dbDsl.createFeedbackComment('2', {feedbackId: '1', creatorUserId: '1', created: 501});
        dbDsl.createFeedbackComment('3', {feedbackId: '1', creatorUserId: '2', created: 502});
        dbDsl.createFeedbackComment('4', {feedbackId: '1', creatorUserId: '1', created: 503});
        dbDsl.closeFeedback('5', {feedbackId: '1', creatorUserId: '3', created: 450});
        dbDsl.reopenFeedback('6', {feedbackId: '1', creatorUserId: '3', created: 451});

        dbDsl.createFeedbackRecommendation('7', {feedbackId: '1', creatorUserId: '2', created: 504});
        dbDsl.createFeedbackRecommendation('8', {feedbackId: '1', creatorUserId: '3', created: 505});
        dbDsl.createFeedbackRecommendation('9', {feedbackId: '1', creatorUserId: '4', created: 506});
        dbDsl.createFeedbackRecommendation('10', {feedbackId: '1', creatorUserId: '5', created: 506});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/feedback/detail', {feedbackId: '1'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.numberOfComments.should.equals(3);
            res.body.numberOfRecommendations.should.equals(4);
            res.body.title.should.equals('bug1Title');
            res.body.description.should.equals('bug1Description');
            res.body.status.should.equals('open');
            res.body.type.should.equals('Bug');
            res.body.operatingSystem.should.equals('linux');
            res.body.screen.should.equals('desktop');
            res.body.browser.should.equals('firefox');
            res.body.created.should.equals(400);
            res.body.modified.should.equals(600);
            res.body.creator.name.should.equals('user Meier');
            res.body.creator.userId.should.equals('1');
        });
    });

    it('Getting idea detail', function () {

        dbDsl.createFeedbackIdea('1', {creatorUserId: '1', created: 400, modified: 600});

        dbDsl.createFeedbackComment('2', {feedbackId: '1', creatorUserId: '1', created: 501});
        dbDsl.createFeedbackComment('3', {feedbackId: '1', creatorUserId: '2', created: 502});
        dbDsl.createFeedbackComment('4', {feedbackId: '1', creatorUserId: '1', created: 503});
        dbDsl.closeFeedback('5', {feedbackId: '1', creatorUserId: '3', created: 450});
        dbDsl.reopenFeedback('6', {feedbackId: '1', creatorUserId: '3', created: 451});

        dbDsl.createFeedbackRecommendation('7', {feedbackId: '1', creatorUserId: '2', created: 504});
        dbDsl.createFeedbackRecommendation('8', {feedbackId: '1', creatorUserId: '3', created: 505});
        dbDsl.createFeedbackRecommendation('9', {feedbackId: '1', creatorUserId: '4', created: 506});
        dbDsl.createFeedbackRecommendation('10', {feedbackId: '1', creatorUserId: '5', created: 506});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/feedback/detail', {feedbackId: '1'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.numberOfComments.should.equals(3);
            res.body.numberOfRecommendations.should.equals(4);
            res.body.title.should.equals('idea1Title');
            res.body.description.should.equals('idea1Description');
            res.body.status.should.equals('open');
            res.body.type.should.equals('Idea');
            res.body.created.should.equals(400);
            res.body.modified.should.equals(600);
            res.body.creator.name.should.equals('user Meier');
            res.body.creator.userId.should.equals('1');
        });
    });

    it('Getting discussion idea detail', function () {


        dbDsl.createFeedbackDiscussion('1', {creatorUserId: '1', status: 'closed', created: 507});
        dbDsl.createFeedbackDiscussionIdea('2', {creatorUserId: '1', discussionFeedbackId: '1', created: 509, modified: 510});

        dbDsl.createFeedbackComment('3', {feedbackId: '2', creatorUserId: '1', created: 501});
        dbDsl.createFeedbackComment('4', {feedbackId: '2', creatorUserId: '2', created: 502});
        dbDsl.createFeedbackComment('5', {feedbackId: '2', creatorUserId: '1', created: 503});
        dbDsl.closeFeedback('6', {feedbackId: '2', creatorUserId: '3', created: 450});
        dbDsl.reopenFeedback('7', {feedbackId: '2', creatorUserId: '3', created: 451});

        dbDsl.createFeedbackRecommendation('8', {feedbackId: '2', creatorUserId: '2', created: 504});
        dbDsl.createFeedbackRecommendation('9', {feedbackId: '2', creatorUserId: '3', created: 505});
        dbDsl.createFeedbackRecommendation('10', {feedbackId: '2', creatorUserId: '4', created: 506});
        dbDsl.createFeedbackRecommendation('11', {feedbackId: '2', creatorUserId: '5', created: 506});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/feedback/detail', {feedbackId: '2'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.numberOfComments.should.equals(3);
            res.body.numberOfRecommendations.should.equals(4);
            res.body.title.should.equals('discussionIdea2Title');
            res.body.description.should.equals('discussionIdea2Description');
            res.body.status.should.equals('open');
            res.body.type.should.equals('DiscussionIdea');
            res.body.created.should.equals(509);
            res.body.modified.should.equals(510);
            res.body.creator.name.should.equals('user Meier');
            res.body.creator.userId.should.equals('1');
            res.body.discussion.title.should.equals('discussion1Title');
            res.body.discussion.description.should.equals('discussion1Description');
            res.body.discussion.status.should.equals('closed');
            res.body.discussion.discussionId.should.equals('1');
        });
    });

    it('Getting discussion detail is not a valid operation (400)', function () {

        dbDsl.createFeedbackDiscussion('1', {creatorUserId: '1', status: 'closed', created: 507});
        dbDsl.createFeedbackDiscussionIdea('2', {creatorUserId: '1', discussionFeedbackId: '1', created: 509, modified: 510});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/feedback/detail', {feedbackId: '1'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });
});
