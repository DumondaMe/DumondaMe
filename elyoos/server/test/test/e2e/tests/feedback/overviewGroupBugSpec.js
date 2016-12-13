'use strict';

var users = require('elyoos-server-test-util').user;
var dbDsl = require('elyoos-server-test-util').dbDSL;
var requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for getting bugs overview', function () {

    var requestAgent;

    beforeEach(function () {
        return dbDsl.init(4);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('No open bugs for overview', function () {

        dbDsl.createFeedbackBug('4', '4', 503, 503, 'closed');

        dbDsl.createFeedbackIdea('5', '1', 504);
        dbDsl.createFeedbackDiscussion('6', '1', 505);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/feedback/overviewGroup', {maxItems: 10, skip: 0, status: 'open', group: 'Bug'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.feedbacks.length.should.equals(0);
        });
    });

    it('Getting open bugs overview', function () {

        dbDsl.createFeedbackBug('1', '1', 500);
        dbDsl.createFeedbackBug('2', '2', 501);
        dbDsl.createFeedbackBug('3', '3', 502);
        dbDsl.createFeedbackBug('4', '4', 503, 503, 'closed');

        dbDsl.createFeedbackIdea('5', '1', 504);
        dbDsl.createFeedbackDiscussion('6', '1', 505);

        dbDsl.createFeedbackComment('1', '7', '1', 501);
        dbDsl.createFeedbackComment('1', '8', '2', 502);
        dbDsl.createFeedbackComment('2', '9', '1', 501);

        dbDsl.createFeedbackRecommendation('3', '10', '1', 501);
        dbDsl.createFeedbackRecommendation('3', '11', '2', 501);
        dbDsl.createFeedbackRecommendation('3', '12', '4', 501);
        dbDsl.createFeedbackRecommendation('2', '13', '4', 501);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/feedback/overviewGroup', {maxItems: 10, skip: 0, status: 'open', group: 'Bug'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.statistic.numberOfOpenFeedbacks.should.equals(3);
            res.body.statistic.numberOfClosedFeedbacks.should.equals(1);
            res.body.feedbacks.length.should.equals(3);

            res.body.feedbacks[0].title.should.equals('bug3Title');
            res.body.feedbacks[0].description.should.equals('bug3Description');
            res.body.feedbacks[0].created.should.equals(502);
            res.body.feedbacks[0].feedbackId.should.equals('3');
            res.body.feedbacks[0].creator.userId.should.equals('3');
            res.body.feedbacks[0].creator.name.should.equals('user Meier3');
            res.body.feedbacks[0].numberOfComments.should.equals(0);
            res.body.feedbacks[0].numberOfRecommendations.should.equals(3);
            res.body.feedbacks[0].recommendedByUser.should.equals(true);

            res.body.feedbacks[1].title.should.equals('bug2Title');
            res.body.feedbacks[1].description.should.equals('bug2Description');
            res.body.feedbacks[1].created.should.equals(501);
            res.body.feedbacks[1].feedbackId.should.equals('2');
            res.body.feedbacks[1].creator.userId.should.equals('2');
            res.body.feedbacks[1].creator.name.should.equals('user Meier2');
            res.body.feedbacks[1].numberOfComments.should.equals(1);
            res.body.feedbacks[1].numberOfRecommendations.should.equals(1);
            res.body.feedbacks[1].recommendedByUser.should.equals(false);

            res.body.feedbacks[2].title.should.equals('bug1Title');
            res.body.feedbacks[2].description.should.equals('bug1Description');
            res.body.feedbacks[2].created.should.equals(500);
            res.body.feedbacks[2].feedbackId.should.equals('1');
            res.body.feedbacks[2].creator.userId.should.equals('1');
            res.body.feedbacks[2].creator.name.should.equals('user Meier');
            res.body.feedbacks[2].numberOfComments.should.equals(2);
            res.body.feedbacks[2].numberOfRecommendations.should.equals(0);
            res.body.feedbacks[2].recommendedByUser.should.equals(false);
        });
    });

    it('Getting closed bugs overview', function () {

        dbDsl.createFeedbackBug('1', '1', 500);
        dbDsl.createFeedbackBug('2', '2', 501);
        dbDsl.createFeedbackBug('3', '3', 502);
        dbDsl.createFeedbackBug('4', '4', 503, 503, 'closed');

        dbDsl.createFeedbackIdea('5', '1', 504);
        dbDsl.createFeedbackDiscussion('6', '1', 505);

        dbDsl.createFeedbackComment('4', '7', '1', 501);

        dbDsl.createFeedbackRecommendation('4', '8', '1', 501);
        dbDsl.createFeedbackRecommendation('4', '9', '2', 501);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/feedback/overviewGroup', {maxItems: 10, skip: 0, status: 'closed', group: 'Bug'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.statistic.numberOfOpenFeedbacks.should.equals(3);
            res.body.statistic.numberOfClosedFeedbacks.should.equals(1);
            res.body.feedbacks.length.should.equals(1);

            res.body.feedbacks[0].title.should.equals('bug4Title');
            res.body.feedbacks[0].description.should.equals('bug4Description');
            res.body.feedbacks[0].created.should.equals(503);
            res.body.feedbacks[0].feedbackId.should.equals('4');
            res.body.feedbacks[0].creator.userId.should.equals('4');
            res.body.feedbacks[0].creator.name.should.equals('user Meier4');
            res.body.feedbacks[0].numberOfComments.should.equals(1);
            res.body.feedbacks[0].numberOfRecommendations.should.equals(2);
            res.body.feedbacks[0].recommendedByUser.should.equals(true);
        });
    });
});
