'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let db = require('elyoos-server-test-util').db;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');

describe('Integration Tests for edit a discussion', function () {

    let startTime;

    beforeEach(function () {
        return dbDsl.init(5, true);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Edit a discussion', function () {

        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createFeedbackDiscussion('1', {creatorUserId: '1', created: 507});
        dbDsl.createFeedbackDiscussionIdea('2', {creatorUserId: '1', discussionFeedbackId: '1', created: 509});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.post('/api/admin/feedback/edit/discussion', {
                title: 'title',
                description: 'description',
                discussionId: '1'
            });
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.modified.should.be.at.least(startTime);
            return db.cypher().match("(feedback:Feedback:Discussion {feedbackId: '1'})<-[:IS_CREATOR]-(:User {userId: '1'})")
                .return('feedback').end().send();
        }).then(function (feedback) {
            feedback.length.should.equals(1);
            feedback[0].feedback.status.should.equals("open");
            feedback[0].feedback.created.should.equals(507);
            feedback[0].feedback.modified.should.be.at.least(startTime);
            feedback[0].feedback.title.should.equals("title");
            feedback[0].feedback.description.should.equals("description");
        });
    });

    it('Edit non existing discussion (400)', function () {

        dbDsl.createFeedbackDiscussion('1', {creatorUserId: '1', created: 507});
        dbDsl.createFeedbackDiscussionIdea('2', {creatorUserId: '1', discussionFeedbackId: '1', created: 509});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.post('/api/admin/feedback/edit/discussion', {
                title: 'title',
                description: 'description',
                discussionId: '3'
            });
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(feedback:Feedback:Discussion {feedbackId: '3'})")
                .return('feedback').end().send();
        }).then(function (feedback) {
            feedback.length.should.equals(0);
        });
    });
});
