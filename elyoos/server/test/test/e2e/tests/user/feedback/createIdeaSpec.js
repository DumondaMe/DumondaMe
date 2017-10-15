'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let db = require('elyoos-server-test-util').db;
let moment = require('moment');

describe('Integration Tests creating idea feedback', function () {

    let startTime;

    beforeEach(function () {
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return dbDsl.init(4);
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Create idea feedback', function () {

        dbDsl.createFeedbackBug('1', {creatorUserId: '1', created: 500});
        dbDsl.createFeedbackBug('2', {creatorUserId: '4', created: 503, status: 'closed'});
        dbDsl.createFeedbackIdea('3', {creatorUserId: '1', created: 504});
        dbDsl.createFeedbackIdea('4', {creatorUserId: '3', created: 506, status: 'closed'});
        dbDsl.createFeedbackDiscussion('5', {creatorUserId: '1', created: 507});
        dbDsl.createFeedbackDiscussion('6', {creatorUserId: '2', created: 508, status: 'closed'});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.post('/api/user/feedback/create/idea', {
                title: 'title',
                description: 'description'
            });
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.created.should.be.at.least(startTime);
            res.body.creator.name.should.equals('user Meier');
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
