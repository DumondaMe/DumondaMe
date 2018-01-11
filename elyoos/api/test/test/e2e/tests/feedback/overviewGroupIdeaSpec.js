'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for getting ideas overview', function () {

    beforeEach(function () {
        return dbDsl.init(4);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('No open ideas for overview', function () {

        dbDsl.createFeedbackDiscussion('1', {creatorUserId: '4', created: 505});

        dbDsl.createFeedbackBug('2', {creatorUserId: '1', created: 503});
        dbDsl.createFeedbackIdea('3', {creatorUserId: '1', created: 504, status: 'closed'});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.get('/api/feedback/overviewGroup', {maxItems: 10, skip: 0, status: 'open', group: 'Idea'});
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.statistic.numberOfOpenFeedbacks.should.equals(0);
            res.body.statistic.numberOfClosedFeedbacks.should.equals(1);
            res.body.feedbacks.length.should.equals(0);
        });
    });

    it('Getting open idea overview', function () {

        dbDsl.createFeedbackIdea('1', {creatorUserId: '1', created: 500});
        dbDsl.createFeedbackIdea('2', {creatorUserId: '2', created: 501});
        dbDsl.createFeedbackIdea('3', {creatorUserId: '3', created: 502});
        dbDsl.createFeedbackIdea('4', {creatorUserId: '4', created: 503, status: 'closed'});

        dbDsl.createFeedbackBug('5', {creatorUserId: '1', created: 504});
        dbDsl.createFeedbackDiscussion('6', {creatorUserId: '1', created: 505});

        dbDsl.createFeedbackComment('7', {feedbackId: '1', creatorUserId: '1', created: 501});
        dbDsl.createFeedbackComment('8', {feedbackId: '1', creatorUserId: '2', created: 502});
        dbDsl.createFeedbackComment('9', {feedbackId: '3', creatorUserId: '1', created: 501});

        dbDsl.createFeedbackRecommendation('10', {feedbackId: '3', creatorUserId: '1', created: 501});
        dbDsl.createFeedbackRecommendation('11', {feedbackId: '3', creatorUserId: '2', created: 501});
        dbDsl.createFeedbackRecommendation('12', {feedbackId: '3', creatorUserId: '4', created: 501});
        dbDsl.createFeedbackRecommendation('13', {feedbackId: '2', creatorUserId: '4', created: 501});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.get('/api/feedback/overviewGroup', {maxItems: 10, skip: 0, status: 'open', group: 'Idea'});
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.statistic.numberOfOpenFeedbacks.should.equals(3);
            res.body.statistic.numberOfClosedFeedbacks.should.equals(1);
            res.body.feedbacks.length.should.equals(3);

            res.body.feedbacks[0].title.should.equals('idea3Title');
            res.body.feedbacks[0].description.should.equals('idea3Description');
            res.body.feedbacks[0].created.should.equals(502);
            res.body.feedbacks[0].feedbackId.should.equals('3');
            res.body.feedbacks[0].creator.userId.should.equals('3');
            res.body.feedbacks[0].creator.name.should.equals('user Meier3');
            res.body.feedbacks[0].numberOfComments.should.equals(1);
            res.body.feedbacks[0].numberOfRecommendations.should.equals(3);
            res.body.feedbacks[0].recommendedByUser.should.equals(true);
            res.body.feedbacks[0].createdByUser.should.equals(false);

            res.body.feedbacks[1].title.should.equals('idea2Title');
            res.body.feedbacks[1].description.should.equals('idea2Description');
            res.body.feedbacks[1].created.should.equals(501);
            res.body.feedbacks[1].feedbackId.should.equals('2');
            res.body.feedbacks[1].creator.userId.should.equals('2');
            res.body.feedbacks[1].creator.name.should.equals('user Meier2');
            res.body.feedbacks[1].numberOfComments.should.equals(0);
            res.body.feedbacks[1].numberOfRecommendations.should.equals(1);
            res.body.feedbacks[1].recommendedByUser.should.equals(false);
            res.body.feedbacks[1].createdByUser.should.equals(false);

            res.body.feedbacks[2].title.should.equals('idea1Title');
            res.body.feedbacks[2].description.should.equals('idea1Description');
            res.body.feedbacks[2].created.should.equals(500);
            res.body.feedbacks[2].feedbackId.should.equals('1');
            res.body.feedbacks[2].creator.userId.should.equals('1');
            res.body.feedbacks[2].creator.name.should.equals('user Meier');
            res.body.feedbacks[2].numberOfComments.should.equals(2);
            res.body.feedbacks[2].numberOfRecommendations.should.equals(0);
            res.body.feedbacks[2].recommendedByUser.should.equals(false);
            res.body.feedbacks[2].createdByUser.should.equals(true);
        });
    });

    it('Getting closed idea overview', function () {

        dbDsl.createFeedbackIdea('1', {creatorUserId: '1', created: 500});
        dbDsl.createFeedbackIdea('2', {creatorUserId: '2', created: 501});
        dbDsl.createFeedbackIdea('3', {creatorUserId: '3', created: 502});
        dbDsl.createFeedbackIdea('4', {creatorUserId: '4', created: 503, status: 'closed'});

        dbDsl.createFeedbackBug('5', {creatorUserId: '1', created: 504});
        dbDsl.createFeedbackDiscussion('6', {creatorUserId: '1', created: 505});

        dbDsl.createFeedbackComment('7', {feedbackId: '4', creatorUserId: '1', created: 501});

        dbDsl.createFeedbackRecommendation('8', {feedbackId: '4', creatorUserId: '1', created: 501});
        dbDsl.createFeedbackRecommendation('9', {feedbackId: '4', creatorUserId: '2', created: 501});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.get('/api/feedback/overviewGroup', {maxItems: 10, skip: 0, status: 'closed', group: 'Idea'});
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.statistic.numberOfOpenFeedbacks.should.equals(3);
            res.body.statistic.numberOfClosedFeedbacks.should.equals(1);
            res.body.feedbacks.length.should.equals(1);

            res.body.feedbacks[0].title.should.equals('idea4Title');
            res.body.feedbacks[0].description.should.equals('idea4Description');
            res.body.feedbacks[0].created.should.equals(503);
            res.body.feedbacks[0].feedbackId.should.equals('4');
            res.body.feedbacks[0].creator.userId.should.equals('4');
            res.body.feedbacks[0].creator.name.should.equals('user Meier4');
            res.body.feedbacks[0].numberOfComments.should.equals(1);
            res.body.feedbacks[0].numberOfRecommendations.should.equals(2);
            res.body.feedbacks[0].recommendedByUser.should.equals(true);
            res.body.feedbacks[0].createdByUser.should.equals(false);
        });
    });
});
