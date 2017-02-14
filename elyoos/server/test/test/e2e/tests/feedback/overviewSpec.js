'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for getting feedback overview', function () {

    let requestAgent;

    beforeEach(function () {
        return dbDsl.init(4);
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Getting feedback overview', function () {

        dbDsl.createFeedbackBug('1', {creatorUserId: '1', created: 500});
        dbDsl.createFeedbackBug('2', {creatorUserId: '2', created: 501});
        dbDsl.createFeedbackBug('3', {creatorUserId: '3', created: 502});
        dbDsl.createFeedbackBug('4', {creatorUserId: '4', created: 503, status: 'closed'});

        dbDsl.createFeedbackIdea('5', {creatorUserId: '1', created: 504});
        dbDsl.createFeedbackIdea('6', {creatorUserId: '2', created: 505});
        dbDsl.createFeedbackIdea('7', {creatorUserId: '3', created: 506, status: 'closed'});

        dbDsl.createFeedbackDiscussion('8', {creatorUserId: '1', created: 507});
        dbDsl.createFeedbackDiscussion('9', {creatorUserId: '1', created: 508, status: 'closed'});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.get('/api/feedback/overview', requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.bug.numberOfBugs.should.equals(3);
            res.body.idea.numberOfIdeas.should.equals(2);
            res.body.discussion.numberOfDiscussions.should.equals(1);
        });
    });

    it('Getting feedback overview only bugs existing', function () {

        dbDsl.createFeedbackBug('1', {creatorUserId: '1', created: 500});
        dbDsl.createFeedbackBug('2', {creatorUserId: '2', created: 501});
        dbDsl.createFeedbackBug('3', {creatorUserId: '3', created: 502});
        dbDsl.createFeedbackBug('4', {creatorUserId: '4', created: 503, status: 'closed'});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.get('/api/feedback/overview', requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.bug.numberOfBugs.should.equals(3);
            res.body.idea.numberOfIdeas.should.equals(0);
            res.body.discussion.numberOfDiscussions.should.equals(0);
        });
    });

    it('Getting feedback overview where no feedback exists', function () {

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.get('/api/feedback/overview', requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.bug.numberOfBugs.should.equals(0);
            res.body.idea.numberOfIdeas.should.equals(0);
            res.body.discussion.numberOfDiscussions.should.equals(0);
        });
    });
});
