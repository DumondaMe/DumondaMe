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

        dbDsl.createFeedbackBug('1', {creatorUserId: '1', created: 500});
        dbDsl.createFeedbackIdea('2', {creatorUserId: '2', created: 505});
        dbDsl.createFeedbackIdea('3', {creatorUserId: '3', created: 506, status: 'closed'});

        dbDsl.createFeedbackDiscussion('4', {creatorUserId: '1', created: 507});
        dbDsl.createFeedbackDiscussion('5', {creatorUserId: '2', created: 508, status: 'closed'});

        dbDsl.createFeedbackDiscussionIdea('6', {creatorUserId: '1', discussionFeedbackId: '4', created: 509});
        dbDsl.createFeedbackDiscussionIdea('7', {creatorUserId: '2', discussionFeedbackId: '5', created: 510});

        dbDsl.createFeedbackComment('8', {feedbackId: '6', creatorUserId: '3', created: 511});
        dbDsl.createFeedbackRecommendation('9', {feedbackId: '1', creatorUserId: '2', created: 512});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            return requestHandler.getWithData('/api/feedback/overviewDetail', {skip: 0, maxItems: 10, type: 'all', status: 'open', order: 'created'}, agent);
        }).then(function (res) {
            res.body.feedback.length.should.equals(3);

            res.body.feedback[0].title.should.equals("discussion4Title");
            res.body.feedback[0].created.should.equals(507);
            res.body.feedback[0].feedbackId.should.equals("4");
            res.body.feedback[0].status.should.equals("open");
            res.body.feedback[0].type.should.equals("Discussion");
            res.body.feedback[0].creator.name.should.equals("user Meier");

            res.body.feedback[1].title.should.equals("idea2Title");
            res.body.feedback[1].created.should.equals(505);
            res.body.feedback[1].feedbackId.should.equals("2");
            res.body.feedback[1].status.should.equals("open");
            res.body.feedback[1].type.should.equals("Idea");
            res.body.feedback[1].creator.name.should.equals("user Meier2");

            res.body.feedback[2].title.should.equals("bug1Title");
            res.body.feedback[2].created.should.equals(500);
            res.body.feedback[2].feedbackId.should.equals("1");
            res.body.feedback[2].status.should.equals("open");
            res.body.feedback[2].type.should.equals("Bug");
            res.body.feedback[2].creator.name.should.equals("user Meier");
        });
    });

    it('Getting open feedback by latest modification detail overview', function () {

        dbDsl.createFeedbackBug('1', {creatorUserId: '1', created: 500});
        dbDsl.createFeedbackBug('2', {creatorUserId: '3', created: 501, modified: 512});
        dbDsl.createFeedbackIdea('3', {creatorUserId: '2', created: 505});
        dbDsl.createFeedbackIdea('4', {creatorUserId: '3', created: 506, status: 'closed'});

        dbDsl.createFeedbackDiscussion('5', {creatorUserId: '1', created: 400});
        dbDsl.createFeedbackDiscussion('6', {creatorUserId: '2', created: 508, status: 'closed'});

        dbDsl.createFeedbackDiscussionIdea('7', {creatorUserId: '1', discussionFeedbackId: '5', created: 450});
        dbDsl.createFeedbackDiscussionIdea('8', {creatorUserId: '1', discussionFeedbackId: '5', created: 509});
        dbDsl.createFeedbackDiscussionIdea('9', {creatorUserId: '2', discussionFeedbackId: '6', created: 510});

        dbDsl.createFeedbackComment('10', {feedbackId: '7', creatorUserId: '3', created: 500});
        dbDsl.createFeedbackComment('11', {feedbackId: '7', creatorUserId: '3', created: 511});
        dbDsl.createFeedbackComment('12', {feedbackId: '1', creatorUserId: '3', created: 505});

        dbDsl.createFeedbackRecommendation('13', {feedbackId: '1', creatorUserId: '2', created: 513});
        dbDsl.createFeedbackRecommendation('14', {feedbackId: '1', creatorUserId: '2', created: 400});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            return requestHandler.getWithData('/api/feedback/overviewDetail', {skip: 0, maxItems: 10, type: 'all', status: 'open', order: 'newestModification'}, agent);
        }).then(function (res) {
            res.body.feedback.length.should.equals(4);

            res.body.feedback[0].title.should.equals("bug1Title");
            res.body.feedback[0].created.should.equals(500);
            res.body.feedback[0].lastModified.should.equals(513);
            res.body.feedback[0].feedbackId.should.equals("1");
            res.body.feedback[0].status.should.equals("open");
            res.body.feedback[0].type.should.equals("Bug");
            res.body.feedback[0].creator.name.should.equals("user Meier");
            res.body.feedback[0].numberOfRecommendations.should.equals(2);
            res.body.feedback[0].numberOfComments.should.equals(1);

            res.body.feedback[1].title.should.equals("bug2Title");
            res.body.feedback[1].created.should.equals(501);
            res.body.feedback[1].lastModified.should.equals(512);
            res.body.feedback[1].feedbackId.should.equals("2");
            res.body.feedback[1].status.should.equals("open");
            res.body.feedback[1].type.should.equals("Bug");
            res.body.feedback[1].creator.name.should.equals("user Meier3");
            res.body.feedback[1].numberOfRecommendations.should.equals(0);
            res.body.feedback[1].numberOfComments.should.equals(0);

            res.body.feedback[2].title.should.equals("discussion5Title");
            res.body.feedback[2].created.should.equals(400);
            res.body.feedback[2].lastModified.should.equals(511);
            res.body.feedback[2].feedbackId.should.equals("5");
            res.body.feedback[2].status.should.equals("open");
            res.body.feedback[2].type.should.equals("Discussion");
            res.body.feedback[2].creator.name.should.equals("user Meier");
            res.body.feedback[2].numberOfRecommendations.should.equals(0);
            res.body.feedback[2].numberOfComments.should.equals(0);
            res.body.feedback[2].numberOfIdeas.should.equals(2);

            res.body.feedback[3].title.should.equals("idea3Title");
            res.body.feedback[3].created.should.equals(505);
            res.body.feedback[3].lastModified.should.equals(505);
            res.body.feedback[3].feedbackId.should.equals("3");
            res.body.feedback[3].status.should.equals("open");
            res.body.feedback[3].type.should.equals("Idea");
            res.body.feedback[3].creator.name.should.equals("user Meier2");
            res.body.feedback[3].numberOfRecommendations.should.equals(0);
            res.body.feedback[3].numberOfComments.should.equals(0);
        });
    });

    it('Getting open bug by latest modification detail overview', function () {

        dbDsl.createFeedbackBug('1', {creatorUserId: '1', created: 500});
        dbDsl.createFeedbackBug('2', {creatorUserId: '3', created: 501, modified: 512});
        dbDsl.createFeedbackIdea('3', {creatorUserId: '2', created: 504});
        dbDsl.createFeedbackIdea('4', {creatorUserId: '2', created: 505});
        dbDsl.createFeedbackIdea('5', {creatorUserId: '3', created: 506, status: 'closed'});

        dbDsl.createFeedbackDiscussion('6', {creatorUserId: '1', created: 400});

        dbDsl.createFeedbackDiscussionIdea('7', {creatorUserId: '1', discussionFeedbackId: '6', created: 450});

        dbDsl.createFeedbackComment('8', {feedbackId: '1', creatorUserId: '3', created: 505});

        dbDsl.createFeedbackRecommendation('9', {feedbackId: '1', creatorUserId: '2', created: 513});
        dbDsl.createFeedbackRecommendation('10', {feedbackId: '1', creatorUserId: '2', created: 400});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            return requestHandler.getWithData('/api/feedback/overviewDetail', {skip: 0, maxItems: 10, type: 'bug', status: 'open', order: 'newestModification'}, agent);
        }).then(function (res) {
            res.body.feedback.length.should.equals(2);

            res.body.feedback[0].title.should.equals("bug1Title");
            res.body.feedback[0].created.should.equals(500);
            res.body.feedback[0].lastModified.should.equals(513);
            res.body.feedback[0].feedbackId.should.equals("1");
            res.body.feedback[0].status.should.equals("open");
            res.body.feedback[0].type.should.equals("Bug");
            res.body.feedback[0].creator.name.should.equals("user Meier");
            res.body.feedback[0].numberOfRecommendations.should.equals(2);
            res.body.feedback[0].numberOfComments.should.equals(1);

            res.body.feedback[1].title.should.equals("bug2Title");
            res.body.feedback[1].created.should.equals(501);
            res.body.feedback[1].lastModified.should.equals(512);
            res.body.feedback[1].feedbackId.should.equals("2");
            res.body.feedback[1].status.should.equals("open");
            res.body.feedback[1].type.should.equals("Bug");
            res.body.feedback[1].creator.name.should.equals("user Meier3");
            res.body.feedback[1].numberOfRecommendations.should.equals(0);
            res.body.feedback[1].numberOfComments.should.equals(0);
        });
    });

    it('Getting open idea', function () {

        dbDsl.createFeedbackBug('1', {creatorUserId: '1', created: 500});
        dbDsl.createFeedbackBug('2', {creatorUserId: '3', created: 501, modified: 512});
        dbDsl.createFeedbackIdea('3', {creatorUserId: '2', created: 504});
        dbDsl.createFeedbackIdea('4', {creatorUserId: '3', created: 505});
        dbDsl.createFeedbackIdea('5', {creatorUserId: '3', created: 506, status: 'closed'});

        dbDsl.createFeedbackDiscussion('6', {creatorUserId: '1', created: 400});

        dbDsl.createFeedbackDiscussionIdea('7', {creatorUserId: '1', discussionFeedbackId: '6', created: 450});

        dbDsl.createFeedbackComment('8', {feedbackId: '3', creatorUserId: '3', created: 505});

        dbDsl.createFeedbackRecommendation('9', {feedbackId: '3', creatorUserId: '2', created: 513});
        dbDsl.createFeedbackRecommendation('10', {feedbackId: '3', creatorUserId: '2', created: 400});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            return requestHandler.getWithData('/api/feedback/overviewDetail', {skip: 0, maxItems: 10, type: 'idea', status: 'open', order: 'created'}, agent);
        }).then(function (res) {
            res.body.feedback.length.should.equals(2);

            res.body.feedback[0].title.should.equals("idea4Title");
            res.body.feedback[0].created.should.equals(505);
            res.body.feedback[0].lastModified.should.equals(505);
            res.body.feedback[0].feedbackId.should.equals("4");
            res.body.feedback[0].status.should.equals("open");
            res.body.feedback[0].type.should.equals("Idea");
            res.body.feedback[0].creator.name.should.equals("user Meier3");
            res.body.feedback[0].numberOfRecommendations.should.equals(0);
            res.body.feedback[0].numberOfComments.should.equals(0);

            res.body.feedback[1].title.should.equals("idea3Title");
            res.body.feedback[1].created.should.equals(504);
            res.body.feedback[1].lastModified.should.equals(513);
            res.body.feedback[1].feedbackId.should.equals("3");
            res.body.feedback[1].status.should.equals("open");
            res.body.feedback[1].type.should.equals("Idea");
            res.body.feedback[1].creator.name.should.equals("user Meier2");
            res.body.feedback[1].numberOfRecommendations.should.equals(2);
            res.body.feedback[1].numberOfComments.should.equals(1);
        });
    });

    it('Getting open discussion', function () {

        dbDsl.createFeedbackBug('1', {creatorUserId: '1', created: 500});
        dbDsl.createFeedbackIdea('2', {creatorUserId: '2', created: 505});
        dbDsl.createFeedbackIdea('3', {creatorUserId: '3', created: 506, status: 'closed'});

        dbDsl.createFeedbackDiscussion('4', {creatorUserId: '1', created: 400, modified: 401});
        dbDsl.createFeedbackDiscussion('5', {creatorUserId: '2', created: 402});

        dbDsl.createFeedbackDiscussionIdea('6', {creatorUserId: '1', discussionFeedbackId: '4', created: 450});
        dbDsl.createFeedbackDiscussionIdea('7', {creatorUserId: '2', discussionFeedbackId: '4', created: 451});

        dbDsl.createFeedbackComment('8', {feedbackId: '2', creatorUserId: '3', created: 511});
        dbDsl.createFeedbackRecommendation('9', {feedbackId: '1', creatorUserId: '2', created: 512});
        dbDsl.createFeedbackRecommendation('10', {feedbackId: '1', creatorUserId: '2', created: 400});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            return requestHandler.getWithData('/api/feedback/overviewDetail', {skip: 0, maxItems: 10, type: 'discussion', status: 'open', order: 'created'}, agent);
        }).then(function (res) {
            res.body.feedback.length.should.equals(2);

            res.body.feedback[0].title.should.equals("discussion5Title");
            res.body.feedback[0].created.should.equals(402);
            res.body.feedback[0].lastModified.should.equals(402);
            res.body.feedback[0].feedbackId.should.equals("5");
            res.body.feedback[0].status.should.equals("open");
            res.body.feedback[0].type.should.equals("Discussion");
            res.body.feedback[0].creator.name.should.equals("user Meier2");
            res.body.feedback[0].numberOfRecommendations.should.equals(0);
            res.body.feedback[0].numberOfComments.should.equals(0);
            res.body.feedback[0].numberOfIdeas.should.equals(0);

            res.body.feedback[1].title.should.equals("discussion4Title");
            res.body.feedback[1].created.should.equals(400);
            res.body.feedback[1].lastModified.should.equals(451);
            res.body.feedback[1].feedbackId.should.equals("4");
            res.body.feedback[1].status.should.equals("open");
            res.body.feedback[1].type.should.equals("Discussion");
            res.body.feedback[1].creator.name.should.equals("user Meier");
            res.body.feedback[1].numberOfRecommendations.should.equals(0);
            res.body.feedback[1].numberOfComments.should.equals(0);
            res.body.feedback[1].numberOfIdeas.should.equals(2);
        });
    });

    it('Getting closed feedback detail overview', function () {

        dbDsl.createFeedbackBug('1', {creatorUserId: '1', created: 500});
        dbDsl.createFeedbackIdea('2', {creatorUserId: '2', created: 505});
        dbDsl.createFeedbackIdea('3', {creatorUserId: '3', created: 506, status: 'closed'});

        dbDsl.createFeedbackDiscussion('4', {creatorUserId: '1', created: 507});
        dbDsl.createFeedbackDiscussion('5', {creatorUserId: '2', created: 508, status: 'closed'});

        dbDsl.createFeedbackDiscussionIdea('6', {creatorUserId: '1', discussionFeedbackId: '4', created: 509});
        dbDsl.createFeedbackDiscussionIdea('7', {creatorUserId: '2', discussionFeedbackId: '5', created: 510});

        dbDsl.createFeedbackComment('8', {feedbackId: '6', creatorUserId: '3', created: 511});
        dbDsl.createFeedbackRecommendation('9', {feedbackId: '1', creatorUserId: '2', created: 512});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            return requestHandler.getWithData('/api/feedback/overviewDetail', {skip: 0, maxItems: 10, type: 'all', status: 'closed', order: 'created'}, agent);
        }).then(function (res) {
            res.body.feedback.length.should.equals(2);

            res.body.feedback[0].title.should.equals("discussion5Title");
            res.body.feedback[0].created.should.equals(508);
            res.body.feedback[0].feedbackId.should.equals("5");
            res.body.feedback[0].status.should.equals("closed");
            res.body.feedback[0].type.should.equals("Discussion");
            res.body.feedback[0].creator.name.should.equals("user Meier2");

            res.body.feedback[1].title.should.equals("idea3Title");
            res.body.feedback[1].created.should.equals(506);
            res.body.feedback[1].feedbackId.should.equals("3");
            res.body.feedback[1].status.should.equals("closed");
            res.body.feedback[1].type.should.equals("Idea");
            res.body.feedback[1].creator.name.should.equals("user Meier3");
        });
    });
});
