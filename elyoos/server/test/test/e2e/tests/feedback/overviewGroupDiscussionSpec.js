'use strict';

var users = require('../util/user');
var dbDsl = require('../util/dbDSL');
var requestHandler = require('../util/request');

describe('Integration Tests for getting discussion overview', function () {

    var requestAgent;

    beforeEach(function () {
        return dbDsl.init(4);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('No open discussion for overview', function () {

        dbDsl.createFeedbackBug('4', '4', 503);

        dbDsl.createFeedbackIdea('5', '1', 504);
        dbDsl.createFeedbackDiscussion('6', '1', 505, 'closed');

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/feedback/overviewGroup', {maxItems: 10, skip: 0, status: 'open', group: 'Discussion'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.feedbacks.length.should.equals(0);
        });
    });

    it('Getting open discussion overview', function () {

        dbDsl.createFeedbackDiscussion('1', '1', 500);
        dbDsl.createFeedbackDiscussion('2', '2', 501);
        dbDsl.createFeedbackDiscussion('3', '3', 502);
        dbDsl.createFeedbackDiscussion('4', '4', 503, 'closed');

        dbDsl.createFeedbackBug('5', '1', 504);
        dbDsl.createFeedbackIdea('6', '1', 505);

        dbDsl.createFeedbackDiscussionIdea('1', '1', '1', 501);
        dbDsl.createFeedbackDiscussionIdea('1', '2', '2', 502);

        dbDsl.createFeedbackDiscussionIdea('3', '3', '1', 501);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/feedback/overviewGroup', {maxItems: 10, skip: 0, status: 'open', group: 'Discussion'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.feedbacks.length.should.equals(3);

            res.body.feedbacks[0].title.should.equals('discussion1Title');
            res.body.feedbacks[0].description.should.equals('discussion1Description');
            res.body.feedbacks[0].created.should.equals(500);
            res.body.feedbacks[0].feedbackId.should.equals('1');
            res.body.feedbacks[0].creator.userId.should.equals('1');
            res.body.feedbacks[0].creator.name.should.equals('user Meier');
            res.body.feedbacks[0].numberOfIdeas.should.equals(2);

            res.body.feedbacks[1].title.should.equals('discussion3Title');
            res.body.feedbacks[1].description.should.equals('discussion3Description');
            res.body.feedbacks[1].created.should.equals(502);
            res.body.feedbacks[1].feedbackId.should.equals('3');
            res.body.feedbacks[1].creator.userId.should.equals('3');
            res.body.feedbacks[1].creator.name.should.equals('user Meier3');
            res.body.feedbacks[1].numberOfIdeas.should.equals(1);

            res.body.feedbacks[2].title.should.equals('discussion2Title');
            res.body.feedbacks[2].description.should.equals('discussion2Description');
            res.body.feedbacks[2].created.should.equals(501);
            res.body.feedbacks[2].feedbackId.should.equals('2');
            res.body.feedbacks[2].creator.userId.should.equals('2');
            res.body.feedbacks[2].creator.name.should.equals('user Meier2');
            res.body.feedbacks[2].numberOfIdeas.should.equals(0);
        });
    });

    it('Getting closed discussion overview', function () {

        dbDsl.createFeedbackDiscussion('1', '1', 500);
        dbDsl.createFeedbackDiscussion('2', '2', 501);
        dbDsl.createFeedbackDiscussion('3', '3', 502);
        dbDsl.createFeedbackDiscussion('4', '4', 503, 'closed');

        dbDsl.createFeedbackBug('5', '1', 504);
        dbDsl.createFeedbackIdea('6', '1', 505);

        dbDsl.createFeedbackDiscussionIdea('4', '1', '1', 501);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/feedback/overviewGroup', {maxItems: 10, skip: 0, status: 'closed', group: 'Discussion'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.feedbacks.length.should.equals(1);

            res.body.feedbacks[0].title.should.equals('discussion4Title');
            res.body.feedbacks[0].description.should.equals('discussion4Description');
            res.body.feedbacks[0].created.should.equals(503);
            res.body.feedbacks[0].feedbackId.should.equals('4');
            res.body.feedbacks[0].creator.userId.should.equals('4');
            res.body.feedbacks[0].creator.name.should.equals('user Meier4');
            res.body.feedbacks[0].numberOfIdeas.should.equals(1);
        });
    });
});
