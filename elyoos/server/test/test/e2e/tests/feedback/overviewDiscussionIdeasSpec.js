'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for getting discussion ideas overview', function () {

    let requestAgent;

    beforeEach(function () {
        return dbDsl.init(4);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting discussion ideas overview', function () {

        dbDsl.createFeedbackDiscussion('1', '1', 500);

        dbDsl.createFeedbackBug('2', '1', 504);
        dbDsl.createFeedbackIdea('3', '1', 505);

        dbDsl.createFeedbackDiscussionIdea('4', '1', '1', 501);
        dbDsl.createFeedbackDiscussionIdea('5', '1', '2', 502);
        dbDsl.createFeedbackDiscussionIdea('6', '1', '3', 503, 513);
        dbDsl.createFeedbackDiscussionIdea('16', '1', '3', 503, 503, 'closed');

        dbDsl.createFeedbackComment('4', '7', '1', 517);
        dbDsl.createFeedbackComment('4', '8', '2', 510);
        dbDsl.createFeedbackComment('6', '9', '3', 511);

        dbDsl.createFeedbackRecommendation('6', '10', '1', 512);
        dbDsl.createFeedbackRecommendation('6', '11', '2', 511);
        dbDsl.createFeedbackRecommendation('6', '12', '4', 510);
        dbDsl.createFeedbackRecommendation('5', '13', '2', 515);
        dbDsl.createFeedbackRecommendation('5', '14', '3', 516);
        dbDsl.createFeedbackRecommendation('4', '15', '3', 501);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/feedback/overviewDiscussionIdea',
                {maxItems: 10, skip: 0, status: 'open', discussionId: '1'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.discussion.title.should.equals('discussion1Title');
            res.body.discussion.description.should.equals('discussion1Description');
            res.body.discussion.feedbackId.should.equals('1');

            res.body.statistic.numberOfOpenFeedbacks.should.equals(3);
            res.body.statistic.numberOfClosedFeedbacks.should.equals(1);
            res.body.feedbacks.length.should.equals(3);

            res.body.feedbacks[0].title.should.equals('discussionIdea6Title');
            res.body.feedbacks[0].description.should.equals('discussionIdea6Description');
            res.body.feedbacks[0].created.should.equals(503);
            res.body.feedbacks[0].lastModified.should.equals(513);
            res.body.feedbacks[0].feedbackId.should.equals('6');
            res.body.feedbacks[0].creator.userId.should.equals('3');
            res.body.feedbacks[0].creator.name.should.equals('user Meier3');
            res.body.feedbacks[0].numberOfComments.should.equals(1);
            res.body.feedbacks[0].numberOfRecommendations.should.equals(3);
            res.body.feedbacks[0].recommendedByUser.should.equals(true);
            res.body.feedbacks[0].createdByUser.should.equals(false);

            res.body.feedbacks[1].title.should.equals('discussionIdea5Title');
            res.body.feedbacks[1].description.should.equals('discussionIdea5Description');
            res.body.feedbacks[1].created.should.equals(502);
            res.body.feedbacks[1].lastModified.should.equals(516);
            res.body.feedbacks[1].feedbackId.should.equals('5');
            res.body.feedbacks[1].creator.userId.should.equals('2');
            res.body.feedbacks[1].creator.name.should.equals('user Meier2');
            res.body.feedbacks[1].numberOfComments.should.equals(0);
            res.body.feedbacks[1].numberOfRecommendations.should.equals(2);
            res.body.feedbacks[1].recommendedByUser.should.equals(false);
            res.body.feedbacks[1].createdByUser.should.equals(false);

            res.body.feedbacks[2].title.should.equals('discussionIdea4Title');
            res.body.feedbacks[2].description.should.equals('discussionIdea4Description');
            res.body.feedbacks[2].created.should.equals(501);
            res.body.feedbacks[2].lastModified.should.equals(517);
            res.body.feedbacks[2].feedbackId.should.equals('4');
            res.body.feedbacks[2].creator.userId.should.equals('1');
            res.body.feedbacks[2].creator.name.should.equals('user Meier');
            res.body.feedbacks[2].numberOfComments.should.equals(2);
            res.body.feedbacks[2].numberOfRecommendations.should.equals(1);
            res.body.feedbacks[2].recommendedByUser.should.equals(false);
            res.body.feedbacks[2].createdByUser.should.equals(true);
        });
    });

    it('Attempt to get ideas of not existing discussion ', function () {

        dbDsl.createFeedbackDiscussion('1', '1', 500);

        dbDsl.createFeedbackBug('2', '1', 504);
        dbDsl.createFeedbackIdea('3', '1', 505);

        dbDsl.createFeedbackDiscussionIdea('4', '1', '1', 501);
        dbDsl.createFeedbackDiscussionIdea('5', '1', '2', 502);
        dbDsl.createFeedbackDiscussionIdea('6', '1', '3', 503);
        dbDsl.createFeedbackDiscussionIdea('7', '1', '3', 503, 503, 'closed');

        dbDsl.createFeedbackRecommendation('4', '8', '1', 501);
        dbDsl.createFeedbackRecommendation('4', '9', '2', 501);
        dbDsl.createFeedbackRecommendation('6', '10', '3', 501);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/feedback/overviewDiscussionIdea',
                {maxItems: 10, skip: 0, status: 'open', discussionId: '2'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });
});
