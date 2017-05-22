'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for getting discussion overview', function () {

    let requestAgent;

    beforeEach(function () {
        return dbDsl.init(4);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('No open discussion for overview', function () {

        dbDsl.createFeedbackBug('4', {creatorUserId: '4', created: 503});
        dbDsl.createFeedbackIdea('5', {creatorUserId: '1', created: 504});
        dbDsl.createFeedbackDiscussion('6', {creatorUserId: '1', created: 505, status: 'closed'});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.get('/api/feedback/overviewGroup', {maxItems: 10, skip: 0, status: 'open', group: 'Discussion'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.feedbacks.length.should.equals(0);
        });
    });

    it('Getting open discussion overview', function () {

        dbDsl.createFeedbackDiscussion('1', {creatorUserId: '1', created: 500});
        dbDsl.createFeedbackDiscussion('2', {creatorUserId: '2', created: 501, modified: 520});
        dbDsl.createFeedbackDiscussion('3', {creatorUserId: '3', created: 502});
        dbDsl.createFeedbackDiscussion('4', {creatorUserId: '4', created: 503, status: 'closed'});

        dbDsl.createFeedbackBug('5', {creatorUserId: '1', created: 504});
        dbDsl.createFeedbackIdea('6', {creatorUserId: '1', created: 505});

        dbDsl.createFeedbackDiscussionIdea('7', {creatorUserId: '1', discussionFeedbackId: '1', created: 501, modified: 503});
        dbDsl.createFeedbackDiscussionIdea('8', {creatorUserId: '2', discussionFeedbackId: '1', created: 502, modified: 510});

        dbDsl.createFeedbackComment('9', {feedbackId: '7', creatorUserId: '1', created: 511});

        dbDsl.createFeedbackDiscussionIdea('10', {creatorUserId: '1', discussionFeedbackId: '3', created: 501, modified: 511});
        dbDsl.createFeedbackRecommendation('11', {feedbackId: '10', creatorUserId: '2', created: 512});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.get('/api/feedback/overviewGroup', {maxItems: 10, skip: 0, status: 'open', group: 'Discussion'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.feedbacks.length.should.equals(3);

            res.body.feedbacks[0].title.should.equals('discussion1Title');
            res.body.feedbacks[0].description.should.equals('discussion1Description');
            res.body.feedbacks[0].created.should.equals(500);
            res.body.feedbacks[0].lastModified.should.equals(511);
            res.body.feedbacks[0].feedbackId.should.equals('1');
            res.body.feedbacks[0].creator.userId.should.equals('1');
            res.body.feedbacks[0].creator.name.should.equals('user Meier');
            res.body.feedbacks[0].numberOfIdeas.should.equals(2);

            res.body.feedbacks[1].title.should.equals('discussion3Title');
            res.body.feedbacks[1].description.should.equals('discussion3Description');
            res.body.feedbacks[1].created.should.equals(502);
            res.body.feedbacks[1].lastModified.should.equals(512);
            res.body.feedbacks[1].feedbackId.should.equals('3');
            res.body.feedbacks[1].creator.userId.should.equals('3');
            res.body.feedbacks[1].creator.name.should.equals('user Meier3');
            res.body.feedbacks[1].numberOfIdeas.should.equals(1);

            res.body.feedbacks[2].title.should.equals('discussion2Title');
            res.body.feedbacks[2].description.should.equals('discussion2Description');
            res.body.feedbacks[2].created.should.equals(501);
            res.body.feedbacks[2].lastModified.should.equals(520);
            res.body.feedbacks[2].feedbackId.should.equals('2');
            res.body.feedbacks[2].creator.userId.should.equals('2');
            res.body.feedbacks[2].creator.name.should.equals('user Meier2');
            res.body.feedbacks[2].numberOfIdeas.should.equals(0);
        });
    });

    it('Getting closed discussion overview', function () {

        dbDsl.createFeedbackDiscussion('1', {creatorUserId: '1', created: 500});
        dbDsl.createFeedbackDiscussion('2', {creatorUserId: '2', created: 501});
        dbDsl.createFeedbackDiscussion('3', {creatorUserId: '3', created: 502});
        dbDsl.createFeedbackDiscussion('4', {creatorUserId: '4', created: 503, modified: 511, status: 'closed'});

        dbDsl.createFeedbackBug('5', {creatorUserId: '1', created: 504});
        dbDsl.createFeedbackIdea('6', {creatorUserId: '1', created: 505});

        dbDsl.createFeedbackDiscussionIdea('7', {creatorUserId: '1', discussionFeedbackId: '4', created: 501});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.get('/api/feedback/overviewGroup', {maxItems: 10, skip: 0, status: 'closed', group: 'Discussion'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.feedbacks.length.should.equals(1);

            res.body.feedbacks[0].title.should.equals('discussion4Title');
            res.body.feedbacks[0].description.should.equals('discussion4Description');
            res.body.feedbacks[0].created.should.equals(503);
            res.body.feedbacks[0].lastModified.should.equals(511);
            res.body.feedbacks[0].feedbackId.should.equals('4');
            res.body.feedbacks[0].creator.userId.should.equals('4');
            res.body.feedbacks[0].creator.name.should.equals('user Meier4');
            res.body.feedbacks[0].numberOfIdeas.should.equals(1);
        });
    });
});
