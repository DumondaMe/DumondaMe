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

        dbDsl.createFeedbackDiscussion('1', {creatorUserId: '1', created: 507});

        dbDsl.createFeedbackBug('2', {creatorUserId: '1', created: 504});
        dbDsl.createFeedbackIdea('3', {creatorUserId: '1', created: 505});

        dbDsl.createFeedbackDiscussionIdea('4', {creatorUserId: '1', discussionFeedbackId: '1', created: 501});
        dbDsl.createFeedbackDiscussionIdea('5', {creatorUserId: '2', discussionFeedbackId: '1', created: 502});
        dbDsl.createFeedbackDiscussionIdea('6', {creatorUserId: '3', discussionFeedbackId: '1', created: 503, modified: 513});
        dbDsl.createFeedbackDiscussionIdea('16', {creatorUserId: '3', discussionFeedbackId: '1', created: 503, status: 'closed'});

        dbDsl.createFeedbackComment('7', {feedbackId: '4', creatorUserId: '1', created: 517});
        dbDsl.createFeedbackComment('8', {feedbackId: '4', creatorUserId: '2', created: 510});
        dbDsl.createFeedbackComment('9', {feedbackId: '6', creatorUserId: '3', created: 511});

        dbDsl.createFeedbackRecommendation('10', {feedbackId: '6', creatorUserId: '1', created: 512});
        dbDsl.createFeedbackRecommendation('11', {feedbackId: '6', creatorUserId: '2', created: 511});
        dbDsl.createFeedbackRecommendation('12', {feedbackId: '6', creatorUserId: '4', created: 510});
        dbDsl.createFeedbackRecommendation('13', {feedbackId: '5', creatorUserId: '2', created: 515});
        dbDsl.createFeedbackRecommendation('14', {feedbackId: '5', creatorUserId: '3', created: 516});
        dbDsl.createFeedbackRecommendation('15', {feedbackId: '4', creatorUserId: '3', created: 501});

        dbDsl.createFeedbackDiscussion('50', {creatorUserId: '1', created: 500});
        dbDsl.createFeedbackDiscussionIdea('51', {creatorUserId: '1', discussionFeedbackId: '50', created: 501});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.get('/api/feedback/overviewDiscussionIdea',
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

        dbDsl.createFeedbackIdea('3', {creatorUserId: '1', created: 505});

        dbDsl.createFeedbackBug('2', {creatorUserId: '1', created: 504});
        dbDsl.createFeedbackIdea('3', {creatorUserId: '1', created: 505});

        dbDsl.createFeedbackDiscussionIdea('4', {creatorUserId: '1', discussionFeedbackId: '1', created: 501});
        dbDsl.createFeedbackDiscussionIdea('5', {creatorUserId: '2', discussionFeedbackId: '1', created: 502});
        dbDsl.createFeedbackDiscussionIdea('6', {creatorUserId: '3', discussionFeedbackId: '1', created: 503});
        dbDsl.createFeedbackDiscussionIdea('7', {creatorUserId: '3', discussionFeedbackId: '1', created: 503, status: 'closed'});

        dbDsl.createFeedbackRecommendation('8', {feedbackId: '4', creatorUserId: '1', created: 501});
        dbDsl.createFeedbackRecommendation('9', {feedbackId: '4', creatorUserId: '2', created: 501});
        dbDsl.createFeedbackRecommendation('10', {feedbackId: '6', creatorUserId: '3', created: 501});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.get('/api/feedback/overviewDiscussionIdea',
                {maxItems: 10, skip: 0, status: 'open', discussionId: '2'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });
});
