'use strict';

var users = require('../util/user');
var dbDsl = require('../util/dbDSL');
var requestHandler = require('../util/request');

describe('Integration Tests for getting feedback overview', function () {

    var requestAgent;

    beforeEach(function () {
        return dbDsl.init(4);
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Getting feedback overview', function () {

        dbDsl.createFeedbackBug('1', '1', 500);
        dbDsl.createFeedbackBug('2', '2', 501);
        dbDsl.createFeedbackBug('3', '3', 502);
        dbDsl.createFeedbackBug('4', '4', 503, 503, 'closed');

        dbDsl.createFeedbackIdea('5', '1', 504);
        dbDsl.createFeedbackIdea('6', '2', 505);
        dbDsl.createFeedbackIdea('7', '3', 506, 506, 'closed');

        dbDsl.createFeedbackDiscussion('8', '1', 507);
        dbDsl.createFeedbackDiscussion('9', '2', 508, 508, 'closed');

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

        dbDsl.createFeedbackBug('1', '1', 500);
        dbDsl.createFeedbackBug('2', '2', 501);
        dbDsl.createFeedbackBug('3', '3', 502);
        dbDsl.createFeedbackBug('4', '4', 503, 503, 'closed');

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
