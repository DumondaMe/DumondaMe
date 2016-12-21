'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for getting feedback detail comments', function () {

    var requestAgent;

    beforeEach(function () {
        return dbDsl.init(5, true);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting bug detail comments order by latest', function () {

        dbDsl.createFeedbackBug('1', '1', 500);

        dbDsl.createFeedbackComment('1', '2', '1', 501, null, true);
        dbDsl.closeFeedback('1', '3', '3', 502);
        dbDsl.createFeedbackComment('1', '4', '2', 503);
        dbDsl.createFeedbackComment('1', '5', '1', 504, null, true);
        dbDsl.reopenFeedback('1', '6', '1', 505);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/feedback/detailComment', {maxItems: 10, skip: 0, feedbackId: '1', orderBy: 'new'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.comments.length.should.equals(5);

            res.body.comments[0].text.should.equals('reopen6Text');
            res.body.comments[0].created.should.equals(505);
            res.body.comments[0].feedbackId.should.equals('6');
            res.body.comments[0].status.should.equals('open');
            res.body.comments[0].creator.userId.should.equals('1');
            res.body.comments[0].creator.name.should.equals('user Meier');

            res.body.comments[1].text.should.equals('comment5Text');
            res.body.comments[1].created.should.equals(504);
            res.body.comments[1].feedbackId.should.equals('5');
            res.body.comments[1].createdByAdmin.should.equals(true);
            res.body.comments[1].creator.userId.should.equals('1');
            res.body.comments[1].creator.name.should.equals('user Meier');

            res.body.comments[2].text.should.equals('comment4Text');
            res.body.comments[2].created.should.equals(503);
            res.body.comments[2].feedbackId.should.equals('4');
            res.body.comments[2].creator.userId.should.equals('2');
            res.body.comments[2].creator.name.should.equals('user Meier2');

            res.body.comments[3].text.should.equals('closed3Text');
            res.body.comments[3].created.should.equals(502);
            res.body.comments[3].feedbackId.should.equals('3');
            res.body.comments[3].status.should.equals('closed');
            res.body.comments[3].creator.userId.should.equals('3');
            res.body.comments[3].creator.name.should.equals('user Meier3');

            res.body.comments[4].text.should.equals('comment2Text');
            res.body.comments[4].created.should.equals(501);
            res.body.comments[4].feedbackId.should.equals('2');
            res.body.comments[4].createdByAdmin.should.equals(true);
            res.body.comments[4].creator.userId.should.equals('1');
            res.body.comments[4].creator.name.should.equals('user Meier');
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
