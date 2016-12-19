'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let db = require('elyoos-server-test-util').db;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');

describe('Integration Tests for creating a discussion', function () {

    let requestAgent, startTime;

    beforeEach(function () {
        return dbDsl.init(5, true);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Create a discussion', function () {

        let feedbackId;
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/admin/feedback/create/discussion', {title: 'title', description: 'description'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.created.should.be.at.least(startTime);
            res.body.creator.name.should.equals('user Meier');
            res.body.creator.userId.should.equals('1');
            feedbackId = res.body.feedbackId;
            return db.cypher().match("(feedback:Feedback:Discussion {feedbackId: {feedbackId}})<-[:IS_CREATOR]-(:User {userId: '1'})")
                .return('feedback').end({feedbackId: feedbackId}).send();
        }).then(function (feedback) {
            feedback.length.should.equals(1);
            feedback[0].feedback.status.should.equals("open");
            feedback[0].feedback.created.should.be.at.least(startTime);
            feedback[0].feedback.title.should.equals("title");
            feedback[0].feedback.description.should.equals("description");
        });
    });
});
