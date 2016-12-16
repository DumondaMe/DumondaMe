'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for getting feedback detail overview', function () {

    beforeEach(function () {
        return dbDsl.init(3, true);
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Getting open feedback detail overview', function () {

        dbDsl.createFeedbackBug('1', '1', 500);
        dbDsl.createFeedbackIdea('2', '2', 505);
        dbDsl.createFeedbackIdea('3', '3', 506, 506, 'closed');

        dbDsl.createFeedbackDiscussion('4', '1', 507);
        dbDsl.createFeedbackDiscussion('5', '2', 508, 508, 'closed');

        dbDsl.createFeedbackDiscussionIdea('6', '4', '1', 509);
        dbDsl.createFeedbackDiscussionIdea('7', '5', '2', 510);

        dbDsl.createFeedbackComment('6', '8', '3', 511);

        dbDsl.createFeedbackRecommendation('1', '9', '2', 512);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            return requestHandler.getWithData('/api/feedback/overviewDetail', {skip: 0, maxItems: 10, status: 'open', order: 'created'}, agent);
        }).then(function (res) {
            res.body.feedback.length.should.equals(3);

            res.body.feedback[0].title.should.equals("discussion4Title");
            res.body.feedback[0].created.should.equals(507);
            res.body.feedback[0].feedbackId.should.equals("4");
            res.body.feedback[0].status.should.equals("open");
            res.body.feedback[0].type.should.equals("discussion");
            res.body.feedback[0].creator.name.should.equals("user Meier");

            res.body.feedback[1].title.should.equals("idea2Title");
            res.body.feedback[1].created.should.equals(505);
            res.body.feedback[1].feedbackId.should.equals("2");
            res.body.feedback[1].status.should.equals("open");
            res.body.feedback[1].type.should.equals("idea");
            res.body.feedback[1].creator.name.should.equals("user Meier2");

            res.body.feedback[2].title.should.equals("bug1Title");
            res.body.feedback[2].created.should.equals(500);
            res.body.feedback[2].feedbackId.should.equals("1");
            res.body.feedback[2].status.should.equals("open");
            res.body.feedback[2].type.should.equals("bug");
            res.body.feedback[2].creator.name.should.equals("user Meier");
        });
    });

    it('Getting open feedback by latest modification detail overview', function () {

        dbDsl.createFeedbackBug('1', '1', 500);
        dbDsl.createFeedbackBug('2', '3', 501, 512);
        dbDsl.createFeedbackIdea('3', '2', 505);
        dbDsl.createFeedbackIdea('4', '3', 506, 506, 'closed');

        dbDsl.createFeedbackDiscussion('5', '1', 400);
        dbDsl.createFeedbackDiscussion('6', '2', 508, 508, 'closed');

        dbDsl.createFeedbackDiscussionIdea('7', '5', '1', 450);
        dbDsl.createFeedbackDiscussionIdea('8', '5', '1', 509);
        dbDsl.createFeedbackDiscussionIdea('9', '6', '2', 510);

        dbDsl.createFeedbackComment('7', '10', '3', 500);
        dbDsl.createFeedbackComment('7', '11', '3', 511);

        dbDsl.createFeedbackRecommendation('1', '12', '2', 513);
        dbDsl.createFeedbackRecommendation('1', '13', '2', 400);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            return requestHandler.getWithData('/api/feedback/overviewDetail', {skip: 0, maxItems: 10, status: 'open', order: 'newestModification'}, agent);
        }).then(function (res) {
            res.body.feedback.length.should.equals(4);

            res.body.feedback[0].title.should.equals("bug1Title");
            res.body.feedback[0].created.should.equals(500);
            res.body.feedback[0].lastModified.should.equals(513);
            res.body.feedback[0].feedbackId.should.equals("1");
            res.body.feedback[0].status.should.equals("open");
            res.body.feedback[0].type.should.equals("bug");
            res.body.feedback[0].creator.name.should.equals("user Meier");

            res.body.feedback[1].title.should.equals("bug2Title");
            res.body.feedback[1].created.should.equals(501);
            res.body.feedback[1].lastModified.should.equals(512);
            res.body.feedback[1].feedbackId.should.equals("2");
            res.body.feedback[1].status.should.equals("open");
            res.body.feedback[1].type.should.equals("bug");
            res.body.feedback[1].creator.name.should.equals("user Meier3");

            res.body.feedback[2].title.should.equals("discussion5Title");
            res.body.feedback[2].created.should.equals(400);
            res.body.feedback[2].lastModified.should.equals(511);
            res.body.feedback[2].feedbackId.should.equals("5");
            res.body.feedback[2].status.should.equals("open");
            res.body.feedback[2].type.should.equals("discussion");
            res.body.feedback[2].creator.name.should.equals("user Meier");

            res.body.feedback[3].title.should.equals("idea3Title");
            res.body.feedback[3].created.should.equals(505);
            res.body.feedback[3].lastModified.should.equals(505);
            res.body.feedback[3].feedbackId.should.equals("3");
            res.body.feedback[3].status.should.equals("open");
            res.body.feedback[3].type.should.equals("idea");
            res.body.feedback[3].creator.name.should.equals("user Meier2");
        });
    });

    it('Getting closed feedback detail overview', function () {

        dbDsl.createFeedbackBug('1', '1', 500);
        dbDsl.createFeedbackIdea('2', '2', 505);
        dbDsl.createFeedbackIdea('3', '3', 506, 506, 'closed');

        dbDsl.createFeedbackDiscussion('4', '1', 507);
        dbDsl.createFeedbackDiscussion('5', '2', 508, 508, 'closed');

        dbDsl.createFeedbackDiscussionIdea('6', '4', '1', 509);
        dbDsl.createFeedbackDiscussionIdea('7', '5', '2', 510);

        dbDsl.createFeedbackComment('6', '8', '3', 511);

        dbDsl.createFeedbackRecommendation('1', '9', '2', 512);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            return requestHandler.getWithData('/api/feedback/overviewDetail', {skip: 0, maxItems: 10, status: 'closed', order: 'created'}, agent);
        }).then(function (res) {
            res.body.feedback.length.should.equals(2);

            res.body.feedback[0].title.should.equals("discussion5Title");
            res.body.feedback[0].created.should.equals(508);
            res.body.feedback[0].feedbackId.should.equals("5");
            res.body.feedback[0].status.should.equals("closed");
            res.body.feedback[0].type.should.equals("discussion");
            res.body.feedback[0].creator.name.should.equals("user Meier2");

            res.body.feedback[1].title.should.equals("idea3Title");
            res.body.feedback[1].created.should.equals(506);
            res.body.feedback[1].feedbackId.should.equals("3");
            res.body.feedback[1].status.should.equals("closed");
            res.body.feedback[1].type.should.equals("idea");
            res.body.feedback[1].creator.name.should.equals("user Meier3");
        });
    });
});
