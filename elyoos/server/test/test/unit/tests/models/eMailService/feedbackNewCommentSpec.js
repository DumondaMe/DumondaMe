'use strict';

let testee = require('elyoos-server-lib').eMailService;
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

        dbDsl.createFeedbackIdea('1', {creatorUserId: '1', created: 505});

        dbDsl.createFeedbackComment('3', {feedbackId: '1', creatorUserId: '2', created: 517});
        dbDsl.createFeedbackComment('4', {feedbackId: '1', creatorUserId: '3', created: 510});
        dbDsl.createFeedbackComment('5', {feedbackId: '1', creatorUserId: '4', created: 511});
        dbDsl.createFeedbackComment('6', {feedbackId: '1', creatorUserId: '4', created: 512});
        dbDsl.createFeedbackComment('7', {feedbackId: '1', creatorUserId: '4', created: 513});

        return dbDsl.sendToDb().then(function () {
            return testee.feedbackNewComment('3');
        }).then(function () {
            let argument = createJob.getCall(0).args[1];
            expect(argument.textComment).to.equal('comment3Text');
            expect(argument.userCommentName).to.equal('user Meier2');
            expect(argument.titleFeedback).to.equal('idea1Title');
            expect(argument.emails.length).to.equal(3);
            expect(argument.emails).to.include('user@irgendwo.ch', 'user4@irgendwo.ch', 'user3@irgendwo.ch');
        });
    });

    it('Send email notification to other users (user has created comment)', function () {

        let createJob = sandbox.stub(emailQueue, 'createImmediatelyJob');

        dbDsl.createFeedbackIdea('1', {creatorUserId: '1', created: 505});

        dbDsl.createFeedbackComment('3', {feedbackId: '1', creatorUserId: '1', created: 517});
        dbDsl.createFeedbackComment('4', {feedbackId: '1', creatorUserId: '3', created: 510});
        dbDsl.createFeedbackComment('5', {feedbackId: '1', creatorUserId: '4', created: 511});
        dbDsl.createFeedbackComment('6', {feedbackId: '1', creatorUserId: '4', created: 512});
        dbDsl.createFeedbackComment('7', {feedbackId: '1', creatorUserId: '4', created: 513});

        return dbDsl.sendToDb().then(function () {
            return testee.feedbackNewComment('3');
        }).then(function () {
            let argument = createJob.getCall(0).args[1];
            expect(argument.textComment).to.equal('comment3Text');
            expect(argument.userCommentName).to.equal('user Meier');
            expect(argument.titleFeedback).to.equal('idea1Title');
            expect(argument.emails.length).to.equal(2);
            expect(argument.emails).to.include('user4@irgendwo.ch', 'user3@irgendwo.ch');
        });
    });

    it('Send no email notification when only creator of feedback is involved', function () {

        let createJob = sandbox.stub(emailQueue, 'createImmediatelyJob');

        dbDsl.createFeedbackIdea('1', {creatorUserId: '1', created: 505});
        dbDsl.createFeedbackComment('3', {feedbackId: '1', creatorUserId: '1', created: 517});

        return dbDsl.sendToDb().then(function () {
            return testee.feedbackNewComment('3');
        }).then(function () {
            expect(createJob.withArgs('feedbackNewComment').called).to.be.false;
        });
    });

    it('Send email notification only to creator of feedback', function () {

        let createJob = sandbox.stub(emailQueue, 'createImmediatelyJob');

        dbDsl.createFeedbackIdea('1', {creatorUserId: '1', created: 505});
        dbDsl.createFeedbackComment('3', {feedbackId: '1', creatorUserId: '2', created: 517});

        return dbDsl.sendToDb().then(function () {
            return testee.feedbackNewComment('3');
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

        dbDsl.createFeedbackBug('1', {creatorUserId: '1', created: 505});

        dbDsl.createFeedbackComment('3', {feedbackId: '1', creatorUserId: '2', created: 517});
        dbDsl.createFeedbackComment('4', {feedbackId: '1', creatorUserId: '3', created: 510});
        dbDsl.createFeedbackComment('5', {feedbackId: '1', creatorUserId: '4', created: 511});

        return dbDsl.sendToDb().then(function () {
            return testee.feedbackNewComment('3');
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

        dbDsl.createFeedbackDiscussion('1', {creatorUserId: '1', created: 500});
        dbDsl.createFeedbackDiscussionIdea('2', {creatorUserId: '1', discussionFeedbackId: '1', created: 501});

        dbDsl.createFeedbackComment('3', {feedbackId: '2', creatorUserId: '2', created: 517});
        dbDsl.createFeedbackComment('4', {feedbackId: '2', creatorUserId: '3', created: 510});
        dbDsl.createFeedbackComment('5', {feedbackId: '2', creatorUserId: '4', created: 511});

        return dbDsl.sendToDb().then(function () {
            return testee.feedbackNewComment('3');
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
