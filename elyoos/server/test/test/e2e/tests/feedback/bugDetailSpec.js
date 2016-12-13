'use strict';

var users = require('elyoos-server-test-util').user;
var dbDsl = require('elyoos-server-test-util').dbDSL;
var requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for getting bug detail', function () {

    var requestAgent;

    beforeEach(function () {
        return dbDsl.init(5);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting bug detail', function () {

        dbDsl.createFeedbackBug('1', '1', 500, 600);

        dbDsl.createFeedbackComment('1', '2', '1', 501);
        dbDsl.createFeedbackComment('1', '3', '2', 502);
        dbDsl.createFeedbackComment('1', '4', '1', 503);

        dbDsl.createFeedbackRecommendation('1', '5', '2', 504);
        dbDsl.createFeedbackRecommendation('1', '6', '3', 505);
        dbDsl.createFeedbackRecommendation('1', '7', '4', 506);
        dbDsl.createFeedbackRecommendation('1', '8', '5', 506);

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
            res.body.created.should.equals(500);
            res.body.modified.should.equals(600);
            res.body.creator.name.should.equals('user Meier');
            res.body.creator.userId.should.equals('1');
            res.body.recommendedByUser.should.equals(false);
            res.body.createdByUser.should.equals(true);
        });
    });
});
