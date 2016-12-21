'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for getting feedback overview', function () {

    beforeEach(function () {
        return dbDsl.init(3, true);
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Getting feedback overview', function () {

        dbDsl.createFeedbackBug('1', '1', 500);
        dbDsl.createFeedbackIdea('2', '3', 506, 506, 'closed');

        dbDsl.createFeedbackDiscussion('3', '1', 499);
        dbDsl.createFeedbackDiscussion('4', '2', 508, 508, 'closed');

        dbDsl.createFeedbackDiscussionIdea('5', '3', '1', 509);
        dbDsl.createFeedbackDiscussionIdea('6', '4', '2', 510);

        dbDsl.createFeedbackComment('6', '7', '3', 511);

        dbDsl.createFeedbackRecommendation('1', '8', '2', 512);

        dbDsl.closeFeedback('1', '9', '3', 502);
        dbDsl.reopenFeedback('1', '10', '1', 505);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            return requestHandler.getWithData('/api/feedback/overview', {skip: 0, maxItems: 10}, agent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.numberOfOpenFeedback.should.equals(2);

            res.body.feedback.length.should.equals(6);

            res.body.feedback[0].title.should.equals("bug1Title");
            res.body.feedback[0].created.should.equals(512);
            res.body.feedback[0].feedbackId.should.equals("1");
            res.body.feedback[0].status.should.equals("open");
            res.body.feedback[0].type.should.equals("recommendation");
            res.body.feedback[0].creator.name.should.equals("user Meier2");

            res.body.feedback[1].title.should.equals("discussionIdea6Title");
            res.body.feedback[1].text.should.equals("comment7Text");
            res.body.feedback[1].created.should.equals(511);
            res.body.feedback[1].feedbackId.should.equals("6");
            res.body.feedback[1].status.should.equals("closed");
            res.body.feedback[1].type.should.equals("comment");
            res.body.feedback[1].creator.name.should.equals("user Meier3");

            res.body.feedback[2].title.should.equals("discussionIdea6Title");
            res.body.feedback[2].created.should.equals(510);
            res.body.feedback[2].feedbackId.should.equals("6");
            res.body.feedback[2].status.should.equals("closed");
            res.body.feedback[2].type.should.equals("idea");
            res.body.feedback[2].creator.name.should.equals("user Meier2");

            res.body.feedback[3].title.should.equals("discussionIdea5Title");
            res.body.feedback[3].created.should.equals(509);
            res.body.feedback[3].feedbackId.should.equals("5");
            res.body.feedback[3].status.should.equals("open");
            res.body.feedback[3].type.should.equals("idea");
            res.body.feedback[3].creator.name.should.equals("user Meier");

            res.body.feedback[4].title.should.equals("idea2Title");
            res.body.feedback[4].created.should.equals(506);
            res.body.feedback[4].feedbackId.should.equals("2");
            res.body.feedback[4].status.should.equals("closed");
            res.body.feedback[4].type.should.equals("idea");
            res.body.feedback[4].creator.name.should.equals("user Meier3");

            res.body.feedback[5].title.should.equals("bug1Title");
            res.body.feedback[5].created.should.equals(500);
            res.body.feedback[5].feedbackId.should.equals("1");
            res.body.feedback[5].status.should.equals("open");
            res.body.feedback[5].type.should.equals("bug");
            res.body.feedback[5].creator.name.should.equals("user Meier");
        });
    });
});
