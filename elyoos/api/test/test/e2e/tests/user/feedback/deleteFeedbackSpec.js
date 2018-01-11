'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let db = require('elyoos-server-test-util').db;
let moment = require('moment');

describe('Integration Tests for deleting a feedback', function () {

    let startTime;

    beforeEach(function () {
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return dbDsl.init(4);
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Deleting idea feedback', function () {

        dbDsl.createFeedbackIdea('1', {creatorUserId: '1', created: 504});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.del('/api/user/feedback', {
                feedbackId: '1'
            });
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(feedback:Feedback {feedbackId: '1'})<-[:IS_CREATOR]-(:User {userId: '1'})")
                .return('feedback').end().send();
        }).then(function (feedback) {
            feedback.length.should.equals(0);
        });
    });

    it('Deleting bug feedback', function () {

        dbDsl.createFeedbackBug('1', {creatorUserId: '1', created: 504});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.del('/api/user/feedback', {
                feedbackId: '1'
            });
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(feedback:Feedback {feedbackId: '1'})<-[:IS_CREATOR]-(:User {userId: '1'})")
                .return('feedback').end().send();
        }).then(function (feedback) {
            feedback.length.should.equals(0);
        });
    });

    it('Deleting discussionIdea feedback', function () {

        dbDsl.createFeedbackDiscussion('1', {creatorUserId: '2', created: 501});
        dbDsl.createFeedbackDiscussionIdea('2', {creatorUserId: '1', discussionFeedbackId: '1', created: 501});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.del('/api/user/feedback', {
                feedbackId: '2'
            });
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(feedback:Feedback {feedbackId: '2'})<-[:IS_CREATOR]-(:User {userId: '1'})")
                .return('feedback').end().send();
        }).then(function (feedback) {
            feedback.length.should.equals(0);
        });
    });

    it('Not allowed to delete feedback of other user (400)', function () {

        dbDsl.createFeedbackIdea('1', {creatorUserId: '2', created: 504});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.del('/api/user/feedback', {
                feedbackId: '1'
            });
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(feedback:Feedback {feedbackId: '1'})")
                .return('feedback').end().send();
        }).then(function (feedback) {
            feedback.length.should.equals(1);
        });
    });

    it('Not allowed to delete closed feedback (400)', function () {

        dbDsl.createFeedbackIdea('1', {creatorUserId: '1', created: 504, status: 'closed'});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.del('/api/user/feedback', {
                feedbackId: '1'
            });
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(feedback:Feedback {feedbackId: '1'})")
                .return('feedback').end().send();
        }).then(function (feedback) {
            feedback.length.should.equals(1);
        });
    });

    it('Not allowed to delete discussion (400)', function () {

        dbDsl.createFeedbackDiscussion('1', {creatorUserId: '1', created: 501});
        dbDsl.createFeedbackDiscussionIdea('2', {creatorUserId: '1', discussionFeedbackId: '1', created: 501});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.del('/api/user/feedback', {
                feedbackId: '1'
            });
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(feedback:Feedback {feedbackId: '1'})")
                .return('feedback').end().send();
        }).then(function (feedback) {
            feedback.length.should.equals(1);
        });
    });

    it('Not allowed to delete feedback with comments (400)', function () {

        dbDsl.createFeedbackIdea('1', {creatorUserId: '1', created: 504});
        dbDsl.createFeedbackComment('2', {feedbackId: '1', creatorUserId: '1', created: 501});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.del('/api/user/feedback', {
                feedbackId: '1'
            });
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(feedback:Feedback {feedbackId: '1'})")
                .return('feedback').end().send();
        }).then(function (feedback) {
            feedback.length.should.equals(1);
        });
    });

    it('Not allowed to delete feedback with recommendation (400)', function () {

        dbDsl.createFeedbackIdea('1', {creatorUserId: '1', created: 504});
        dbDsl.createFeedbackRecommendation('2', {feedbackId: '1', creatorUserId: '1', created: 501});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.del('/api/user/feedback', {
                feedbackId: '1'
            });
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(feedback:Feedback {feedbackId: '1'})")
                .return('feedback').end().send();
        }).then(function (feedback) {
            feedback.length.should.equals(1);
        });
    });
});
