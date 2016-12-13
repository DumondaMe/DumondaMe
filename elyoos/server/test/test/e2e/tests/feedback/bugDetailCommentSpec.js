'use strict';

var users = require('elyoos-server-test-util').user;
var dbDsl = require('elyoos-server-test-util').dbDSL;
var requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for getting bug detail comments', function () {

    var requestAgent;

    beforeEach(function () {
        return dbDsl.init(5);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting bug detail comments order by latest', function () {

        dbDsl.createFeedbackBug('1', '1', 500);

        dbDsl.createFeedbackComment('1', '2', '1', 501);
        dbDsl.createFeedbackComment('1', '3', '2', 502);
        dbDsl.createFeedbackComment('1', '4', '1', 503);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/feedback/detailComment', {maxItems: 10, skip: 0, feedbackId: '1', orderBy: 'new'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.comments.length.should.equals(3);

            res.body.comments[0].text.should.equals('comment4Text');
            res.body.comments[0].created.should.equals(503);
            res.body.comments[0].feedbackId.should.equals('4');
            res.body.comments[0].creator.userId.should.equals('1');
            res.body.comments[0].creator.name.should.equals('user Meier');

            res.body.comments[1].text.should.equals('comment3Text');
            res.body.comments[1].created.should.equals(502);
            res.body.comments[1].feedbackId.should.equals('3');
            res.body.comments[1].creator.userId.should.equals('2');
            res.body.comments[1].creator.name.should.equals('user Meier2');

            res.body.comments[2].text.should.equals('comment2Text');
            res.body.comments[2].created.should.equals(501);
            res.body.comments[2].feedbackId.should.equals('2');
            res.body.comments[2].creator.userId.should.equals('1');
            res.body.comments[2].creator.name.should.equals('user Meier');
        });
    });

    it('Getting bug detail comments order by oldest', function () {

        dbDsl.createFeedbackBug('1', '1', 500);

        dbDsl.createFeedbackComment('1', '2', '1', 501);
        dbDsl.createFeedbackComment('1', '3', '2', 502);
        dbDsl.createFeedbackComment('1', '4', '1', 503);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/feedback/detailComment', {maxItems: 10, skip: 0, feedbackId: '1', orderBy: 'old'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.comments.length.should.equals(3);

            res.body.comments[0].text.should.equals('comment2Text');
            res.body.comments[0].created.should.equals(501);
            res.body.comments[0].feedbackId.should.equals('2');
            res.body.comments[0].creator.userId.should.equals('1');
            res.body.comments[0].creator.name.should.equals('user Meier');

            res.body.comments[1].text.should.equals('comment3Text');
            res.body.comments[1].created.should.equals(502);
            res.body.comments[1].feedbackId.should.equals('3');
            res.body.comments[1].creator.userId.should.equals('2');
            res.body.comments[1].creator.name.should.equals('user Meier2');

            res.body.comments[2].text.should.equals('comment4Text');
            res.body.comments[2].created.should.equals(503);
            res.body.comments[2].feedbackId.should.equals('4');
            res.body.comments[2].creator.userId.should.equals('1');
            res.body.comments[2].creator.name.should.equals('user Meier');
        });
    });

    it('No comments created so far', function () {

        dbDsl.createFeedbackBug('1', '1', 500);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/feedback/detailComment', {maxItems: 10, skip: 0, feedbackId: '1', orderBy: 'old'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.comments.length.should.equals(0);
        });
    });
});
