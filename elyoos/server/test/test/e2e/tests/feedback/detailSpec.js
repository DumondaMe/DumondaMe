'use strict';

var users = require('elyoos-server-test-util').user;
var dbDsl = require('elyoos-server-test-util').dbDSL;
var requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for getting feedback detail', function () {

    var requestAgent;

    beforeEach(function () {
        return dbDsl.init(5);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting bug detail', function () {

        dbDsl.createFeedbackBug('1', '1', 400, 600);

        dbDsl.createFeedbackComment('1', '2', '1', 501);
        dbDsl.createFeedbackComment('1', '3', '2', 502);
        dbDsl.createFeedbackComment('1', '4', '1', 503);
        dbDsl.closeFeedback('1', '5', '3', 450);
        dbDsl.reopenFeedback('1', '6', '3', 451);

        dbDsl.createFeedbackRecommendation('1', '7', '2', 504);
        dbDsl.createFeedbackRecommendation('1', '8', '3', 505);
        dbDsl.createFeedbackRecommendation('1', '9', '4', 506);
        dbDsl.createFeedbackRecommendation('1', '10', '5', 506);

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
            res.body.recommendedByUser.should.equals(false);
            res.body.createdByUser.should.equals(true);
        });
    });

    it('Getting idea detail', function () {

        dbDsl.createFeedbackIdea('1', '2', 400, 600);

        dbDsl.createFeedbackComment('1', '2', '1', 501);
        dbDsl.createFeedbackComment('1', '3', '2', 502);
        dbDsl.createFeedbackComment('1', '4', '1', 503);
        dbDsl.closeFeedback('1', '5', '3', 450);
        dbDsl.reopenFeedback('1', '6', '3', 451);

        dbDsl.createFeedbackRecommendation('1', '7', '1', 504);
        dbDsl.createFeedbackRecommendation('1', '8', '3', 505);
        dbDsl.createFeedbackRecommendation('1', '9', '4', 506);
        dbDsl.createFeedbackRecommendation('1', '10', '5', 506);

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
            res.body.creator.name.should.equals('user Meier2');
            res.body.creator.userId.should.equals('2');
            res.body.recommendedByUser.should.equals(true);
            res.body.createdByUser.should.equals(false);
        });
    });

    it('Getting discussion idea detail', function () {

        dbDsl.createFeedbackDiscussion('1', '1', 507, 507, 'closed');
        dbDsl.createFeedbackDiscussionIdea('2', '1', '1', 509, 510);

        dbDsl.createFeedbackComment('2', '3', '1', 501);
        dbDsl.createFeedbackComment('2', '4', '2', 502);
        dbDsl.createFeedbackComment('2', '5', '1', 503);
        dbDsl.closeFeedback('2', '6', '3', 450);
        dbDsl.reopenFeedback('2', '7', '3', 451);

        dbDsl.createFeedbackRecommendation('2', '8', '2', 504);
        dbDsl.createFeedbackRecommendation('2', '9', '3', 505);
        dbDsl.createFeedbackRecommendation('2', '10', '4', 506);
        dbDsl.createFeedbackRecommendation('2', '11', '5', 506);

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
            res.body.recommendedByUser.should.equals(false);
            res.body.createdByUser.should.equals(true);

            res.body.discussion.title.should.equals('discussion1Title');
            res.body.discussion.description.should.equals('discussion1Description');
            res.body.discussion.status.should.equals('closed');
            res.body.discussion.discussionId.should.equals('1');
        });
    });

    it('Getting discussion detail is not a valid operation (400)', function () {

        dbDsl.createFeedbackDiscussion('1', '1', 507, 507, 'closed');
        dbDsl.createFeedbackDiscussionIdea('2', '1', '1', 509, 510);

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
