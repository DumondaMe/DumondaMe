'use strict';

var users = requireTestUtil('user');
var dbDsl = requireTestUtil('dbDSL');
var requestHandler = requireTestUtil('request');
var db = requireTestUtil('db');
var moment = require('moment');

describe('Integration Tests creating idea feedback', function () {

    var requestAgent, startTime;

    beforeEach(function () {
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return dbDsl.init(4);
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Create idea feedback', function () {

        dbDsl.createFeedbackBug('1', '1', 500);
        dbDsl.createFeedbackBug('2', '4', 503, 'closed');

        dbDsl.createFeedbackIdea('3', '1', 504);
        dbDsl.createFeedbackIdea('4', '3', 506, 'closed');

        dbDsl.createFeedbackDiscussion('5', '1', 507);
        dbDsl.createFeedbackDiscussion('6', '2', 508, 'closed');

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/feedback/create', {
                normal: {
                    title: 'title',
                    description: 'description',
                    group: 'Idea'
                }
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(feedback:Feedback:Idea {feedbackId: {feedbackId}})<-[:IS_CREATOR]-(:User {userId: '1'})")
                .return('feedback')
                .end({feedbackId: res.body.feedbackId}).send();
        }).then(function (feedback) {
            feedback.length.should.equals(1);
            feedback[0].feedback.created.should.be.at.least(startTime);
            feedback[0].feedback.title.should.equals("title");
            feedback[0].feedback.description.should.equals("description");
            feedback[0].feedback.status.should.equals("open");
        });
    });
});
