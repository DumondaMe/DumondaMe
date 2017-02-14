'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for getting discussion overview', function () {

    beforeEach(function () {
        return dbDsl.init(3, true);
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Getting open discussion overview', function () {

        dbDsl.createFeedbackDiscussion('1', {creatorUserId: '1', created: 507});
        dbDsl.createFeedbackDiscussion('2', {creatorUserId: '2', created: 508, status: 'closed'});

        dbDsl.createFeedbackDiscussionIdea('3', {creatorUserId: '1', discussionFeedbackId: '1', created: 509});
        dbDsl.createFeedbackDiscussionIdea('4', {creatorUserId: '2', discussionFeedbackId: '1', created: 510});
        dbDsl.createFeedbackDiscussionIdea('5', {creatorUserId: '2', discussionFeedbackId: '2', created: 511});

        dbDsl.createFeedbackComment('6', {feedbackId: '3', creatorUserId: '3', created: 512});
        dbDsl.closeFeedback('10', {feedbackId: '3', creatorUserId: '1', created: 502});
        dbDsl.reopenFeedback('11', {feedbackId: '3', creatorUserId: '1', created: 511});
        dbDsl.closeFeedback('12', {feedbackId: '3', creatorUserId: '1', created: 513});

        dbDsl.createFeedbackRecommendation('7', {feedbackId: '4', creatorUserId: '2', created: 513});
        dbDsl.createFeedbackRecommendation('8', {feedbackId: '4', creatorUserId: '3', created: 514});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            return requestHandler.getWithData('/api/feedback/overviewDiscussion', {skip: 0, maxItems: 10, discussionId: '1', order: 'rated'}, agent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.discussion.title.should.equals("discussion1Title");
            res.body.discussion.description.should.equals("discussion1Description");
            res.body.discussion.created.should.equals(507);
            res.body.discussion.lastModified.should.equals(514);
            res.body.discussion.creator.name.should.equals('user Meier');
            res.body.discussion.numberOfIdeas.should.equals(2);
            res.body.discussion.status.should.equals('open');
            res.body.feedback.length.should.equals(2);

            res.body.feedback[0].title.should.equals("discussionIdea4Title");
            res.body.feedback[0].created.should.equals(510);
            res.body.feedback[0].lastModified.should.equals(514);
            res.body.feedback[0].feedbackId.should.equals("4");
            res.body.feedback[0].type.should.equals("DiscussionIdea");
            res.body.feedback[0].status.should.equals("open");
            res.body.feedback[0].creator.name.should.equals("user Meier2");
            res.body.feedback[0].numberOfRecommendations.should.equals(2);
            res.body.feedback[0].numberOfComments.should.equals(0);

            res.body.feedback[1].title.should.equals("discussionIdea3Title");
            res.body.feedback[1].created.should.equals(509);
            res.body.feedback[1].lastModified.should.equals(513);
            res.body.feedback[1].feedbackId.should.equals("3");
            res.body.feedback[1].type.should.equals("DiscussionIdea");
            res.body.feedback[1].status.should.equals("closed");
            res.body.feedback[1].creator.name.should.equals("user Meier");
            res.body.feedback[1].numberOfRecommendations.should.equals(0);
            res.body.feedback[1].numberOfComments.should.equals(1);
        });
    });

    it('Getting closed discussion by latest modification overview', function () {

        dbDsl.createFeedbackDiscussion('1', {creatorUserId: '1', created: 400, modified: 402, status: 'closed'});

        dbDsl.createFeedbackDiscussionIdea('2', {creatorUserId: '1', discussionFeedbackId: '1', created: 450});
        dbDsl.createFeedbackDiscussionIdea('3', {creatorUserId: '3', discussionFeedbackId: '1', created: 509});
        dbDsl.createFeedbackDiscussionIdea('4', {creatorUserId: '2', discussionFeedbackId: '1', created: 510, status: 'closed'});

        dbDsl.createFeedbackComment('5', {feedbackId: '2', creatorUserId: '3', created: 500});
        dbDsl.createFeedbackComment('6', {feedbackId: '2', creatorUserId: '3', created: 505});
        dbDsl.createFeedbackComment('7', {feedbackId: '4', creatorUserId: '3', created: 505});
        dbDsl.closeFeedback('10', {feedbackId: '2', creatorUserId: '1', created: 502});
        dbDsl.reopenFeedback('11', {feedbackId: '2', creatorUserId: '1', created: 514});

        dbDsl.createFeedbackRecommendation('8', {feedbackId: '3', creatorUserId: '2', created: 513});
        dbDsl.createFeedbackRecommendation('9', {feedbackId: '3', creatorUserId: '3', created: 400});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            return requestHandler.getWithData('/api/feedback/overviewDiscussion', {skip: 0, maxItems: 10, discussionId: '1', order: 'newestModification'}, agent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.discussion.title.should.equals("discussion1Title");
            res.body.discussion.description.should.equals("discussion1Description");
            res.body.discussion.created.should.equals(400);
            res.body.discussion.lastModified.should.equals(514);
            res.body.discussion.creator.name.should.equals('user Meier');
            res.body.discussion.numberOfIdeas.should.equals(3);
            res.body.discussion.status.should.equals('closed');
            res.body.feedback.length.should.equals(3);

            res.body.feedback[0].title.should.equals("discussionIdea2Title");
            res.body.feedback[0].created.should.equals(450);
            res.body.feedback[0].lastModified.should.equals(514);
            res.body.feedback[0].feedbackId.should.equals("2");
            res.body.feedback[0].type.should.equals("DiscussionIdea");
            res.body.feedback[0].status.should.equals("open");
            res.body.feedback[0].creator.name.should.equals("user Meier");
            res.body.feedback[0].numberOfRecommendations.should.equals(0);
            res.body.feedback[0].numberOfComments.should.equals(2);

            res.body.feedback[1].title.should.equals("discussionIdea3Title");
            res.body.feedback[1].created.should.equals(509);
            res.body.feedback[1].lastModified.should.equals(513);
            res.body.feedback[1].feedbackId.should.equals("3");
            res.body.feedback[1].type.should.equals("DiscussionIdea");
            res.body.feedback[1].status.should.equals("open");
            res.body.feedback[1].creator.name.should.equals("user Meier3");
            res.body.feedback[1].numberOfRecommendations.should.equals(2);
            res.body.feedback[1].numberOfComments.should.equals(0);

            res.body.feedback[2].title.should.equals("discussionIdea4Title");
            res.body.feedback[2].created.should.equals(510);
            res.body.feedback[2].lastModified.should.equals(510);
            res.body.feedback[2].feedbackId.should.equals("4");
            res.body.feedback[2].type.should.equals("DiscussionIdea");
            res.body.feedback[2].status.should.equals("closed");
            res.body.feedback[2].creator.name.should.equals("user Meier2");
            res.body.feedback[2].numberOfRecommendations.should.equals(0);
            res.body.feedback[2].numberOfComments.should.equals(1);
        });
    });

    it('Getting discussion with no ideas', function () {

        dbDsl.createFeedbackDiscussion('1', {creatorUserId: '1', created: 507, modified: 511});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            return requestHandler.getWithData('/api/feedback/overviewDiscussion', {skip: 0, maxItems: 10, discussionId: '1', order: 'rated'}, agent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.discussion.title.should.equals("discussion1Title");
            res.body.discussion.description.should.equals("discussion1Description");
            res.body.discussion.created.should.equals(507);
            res.body.discussion.creator.name.should.equals('user Meier');
            res.body.discussion.numberOfIdeas.should.equals(0);
            res.body.discussion.status.should.equals('open');
            res.body.feedback.length.should.equals(0);
        });
    });
});
