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

        dbDsl.createFeedbackBug('1', {creatorUserId: '1', created: 500});
        dbDsl.createFeedbackIdea('2', {creatorUserId: '3', created: 506, status: 'closed'});

        dbDsl.createFeedbackDiscussion('3', {creatorUserId: '1', created: 499});
        dbDsl.createFeedbackDiscussion('4', {creatorUserId: '2', created: 508, status: 'closed'});

        dbDsl.createFeedbackDiscussionIdea('5', {creatorUserId: '1', discussionFeedbackId: '3', created: 509});
        dbDsl.createFeedbackDiscussionIdea('6', {creatorUserId: '2', discussionFeedbackId: '4', created: 510});

        dbDsl.createFeedbackComment('7', {feedbackId: '6', creatorUserId: '3', created: 511});
        dbDsl.createFeedbackRecommendation('8', {feedbackId: '1', creatorUserId: '2', created: 512});
        dbDsl.closeFeedback('9', {feedbackId: '1', creatorUserId: '3', created: 502});
        dbDsl.reopenFeedback('10', {feedbackId: '1', creatorUserId: '1', created: 505});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            return requestHandler.get('/api/feedback/overview', {skip: 0, maxItems: 10}, agent);
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
