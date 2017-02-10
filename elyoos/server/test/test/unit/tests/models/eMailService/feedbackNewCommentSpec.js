'use strict';

let testee = require('../../../../../../models/eMailService/feedback');
let emailQueue = require('elyoos-server-lib').eMailQueue;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let sinon = require('sinon');
let expect = require('chai').expect;

describe('Unit Test eMailService/feedbackNewComment', function () {

    let sandbox;

    before(function () {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(function () {
        return dbDsl.init(4);
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Send email notification to other users (idea)', function () {

        let createJob = sandbox.stub(emailQueue, 'createImmediatelyJob');

        dbDsl.createFeedbackIdea('1', '1', 505);

        dbDsl.createFeedbackComment('1', '3', '2', 517);
        dbDsl.createFeedbackComment('1', '4', '3', 510);
        dbDsl.createFeedbackComment('1', '5', '4', 511);
        dbDsl.createFeedbackComment('1', '6', '4', 512);
        dbDsl.createFeedbackComment('1', '7', '4', 513);

        return dbDsl.sendToDb().then(function () {
            return testee.newComment('3');
        }).then(function () {
            let argument = createJob.getCall(0).args[1];
            expect(argument.textComment).to.equal('comment3Text');
            expect(argument.userCommentName).to.equal('user Meier2');
            expect(argument.titleFeedback).to.equal('idea1Title');
            expect(argument.emails.length).to.equal(3);
            expect(argument.emails).to.include('user@irgendwo.ch', 'user4@irgendwo.ch', 'user3@irgendwo.ch');
        });
    });

    it('Send no email notification when only creator of feedback is involved', function () {

        let createJob = sandbox.stub(emailQueue, 'createImmediatelyJob');

        dbDsl.createFeedbackIdea('1', '1', 505);

        dbDsl.createFeedbackComment('1', '3', '1', 517);

        return dbDsl.sendToDb().then(function () {
            return testee.newComment('3');
        }).then(function () {
            expect(createJob.withArgs('feedbackNewComment').called).to.be.false;
        });
    });

    it('Send email notification only to creator of feedback', function () {

        let createJob = sandbox.stub(emailQueue, 'createImmediatelyJob');

        dbDsl.createFeedbackIdea('1', '1', 505);

        dbDsl.createFeedbackComment('1', '3', '2', 517);

        return dbDsl.sendToDb().then(function () {
            return testee.newComment('3');
        }).then(function () {
            let argument = createJob.getCall(0).args[1];
            expect(argument.textComment).to.equal('comment3Text');
            expect(argument.userCommentName).to.equal('user Meier2');
            expect(argument.titleFeedback).to.equal('idea1Title');
            expect(argument.emails.length).to.equal(1);
            expect(argument.emails).to.include('user@irgendwo.ch');
        });
    });

    it('Send email notification to other users (bug)', function () {

        let createJob = sandbox.stub(emailQueue, 'createImmediatelyJob');

        dbDsl.createFeedbackBug('1', '1', 505);

        dbDsl.createFeedbackComment('1', '3', '2', 517);
        dbDsl.createFeedbackComment('1', '4', '3', 510);
        dbDsl.createFeedbackComment('1', '5', '4', 511);

        return dbDsl.sendToDb().then(function () {
            return testee.newComment('3');
        }).then(function () {
            let argument = createJob.getCall(0).args[1];
            expect(argument.textComment).to.equal('comment3Text');
            expect(argument.userCommentName).to.equal('user Meier2');
            expect(argument.titleFeedback).to.equal('bug1Title');
            expect(argument.emails.length).to.equal(3);
            expect(argument.emails).to.include('user@irgendwo.ch', 'user4@irgendwo.ch', 'user3@irgendwo.ch');
        });
    });

    it('Send email notification to other users (ideaDiscussion)', function () {

        let createJob = sandbox.stub(emailQueue, 'createImmediatelyJob');

        dbDsl.createFeedbackDiscussion('1', '1', 500);

        dbDsl.createFeedbackDiscussionIdea('2', '1', '1', 501);

        dbDsl.createFeedbackComment('2', '3', '2', 517);
        dbDsl.createFeedbackComment('2', '4', '3', 510);
        dbDsl.createFeedbackComment('2', '5', '4', 511);

        return dbDsl.sendToDb().then(function () {
            return testee.newComment('3');
        }).then(function () {
            let argument = createJob.getCall(0).args[1];
            expect(argument.textComment).to.equal('comment3Text');
            expect(argument.userCommentName).to.equal('user Meier2');
            expect(argument.titleFeedback).to.equal('discussionIdea2Title');
            expect(argument.emails.length).to.equal(3);
            expect(argument.emails).to.include('user@irgendwo.ch', 'user4@irgendwo.ch', 'user3@irgendwo.ch');
        });
    });
});
