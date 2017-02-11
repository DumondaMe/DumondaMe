'use strict';

let testee = require('../../../../../../models/eMailService/feedback');
let emailQueue = require('elyoos-server-lib').eMailQueue;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let sinon = require('sinon');
let expect = require('chai').expect;

describe('Unit Test eMailService/feedbackStatusChanged', function () {

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

    it('Send email notification to other users when idea closed', function () {

        let createJob = sandbox.stub(emailQueue, 'createImmediatelyJob');

        dbDsl.createFeedbackIdea('1', '1', 505);

        dbDsl.createFeedbackComment('1', '3', '2', 517);
        dbDsl.createFeedbackComment('1', '4', '3', 510);
        dbDsl.createFeedbackComment('1', '5', '4', 511);
        dbDsl.createFeedbackComment('1', '6', '4', 512);
        dbDsl.createFeedbackComment('1', '7', '4', 513);

        dbDsl.closeFeedback('1', '8', '2', 520);

        return dbDsl.sendToDb().then(function () {
            return testee.statusChanged('8');
        }).then(function () {
            let argument = createJob.getCall(0).args[1];
            expect(argument.reasonText).to.equal('closed8Text');
            expect(argument.status).to.equal('closed');
            expect(argument.userChangedStatusFeedback).to.equal('user Meier2');
            expect(argument.titleFeedback).to.equal('idea1Title');
            expect(argument.emails.length).to.equal(3);
            expect(argument.emails).to.include('user@irgendwo.ch', 'user4@irgendwo.ch', 'user3@irgendwo.ch');
        });
    });

    it('Send email notification to other users when idea reopen', function () {

        let createJob = sandbox.stub(emailQueue, 'createImmediatelyJob');

        dbDsl.createFeedbackIdea('1', '1', 505);

        dbDsl.createFeedbackComment('1', '3', '2', 517);
        dbDsl.createFeedbackComment('1', '4', '3', 510);
        dbDsl.createFeedbackComment('1', '5', '4', 511);
        dbDsl.createFeedbackComment('1', '6', '4', 512);
        dbDsl.createFeedbackComment('1', '7', '4', 513);

        dbDsl.closeFeedback('1', '8', '2', 520);
        dbDsl.reopenFeedback('1', '9', '2', 521);

        return dbDsl.sendToDb().then(function () {
            return testee.statusChanged('9');
        }).then(function () {
            let argument = createJob.getCall(0).args[1];
            expect(argument.reasonText).to.equal('reopen9Text');
            expect(argument.status).to.equal('open');
            expect(argument.userChangedStatusFeedback).to.equal('user Meier2');
            expect(argument.titleFeedback).to.equal('idea1Title');
            expect(argument.emails.length).to.equal(3);
            expect(argument.emails).to.include('user@irgendwo.ch', 'user4@irgendwo.ch', 'user3@irgendwo.ch');
        });
    });


    it('Send no email notification when only creator of feedback is involved', function () {

        let createJob = sandbox.stub(emailQueue, 'createImmediatelyJob');

        dbDsl.createFeedbackIdea('1', '1', 505);

        dbDsl.createFeedbackComment('1', '3', '1', 517);

        dbDsl.closeFeedback('1', '4', '1', 520);

        return dbDsl.sendToDb().then(function () {
            return testee.statusChanged('4');
        }).then(function () {
            expect(createJob.withArgs('feedbackNewComment').called).to.be.false;
        });
    });

    it('Send email notification only to creator of feedback', function () {

        let createJob = sandbox.stub(emailQueue, 'createImmediatelyJob');

        dbDsl.createFeedbackIdea('1', '1', 505);

        dbDsl.closeFeedback('1', '2', '2', 520);

        return dbDsl.sendToDb().then(function () {
            return testee.statusChanged('2');
        }).then(function () {
            let argument = createJob.getCall(0).args[1];
            expect(argument.reasonText).to.equal('closed2Text');
            expect(argument.status).to.equal('closed');
            expect(argument.userChangedStatusFeedback).to.equal('user Meier2');
            expect(argument.titleFeedback).to.equal('idea1Title');
            expect(argument.emails.length).to.equal(1);
            expect(argument.emails).to.include('user@irgendwo.ch');
        });
    });

    it('Send email notification to other users when bug cloased', function () {

        let createJob = sandbox.stub(emailQueue, 'createImmediatelyJob');

        dbDsl.createFeedbackBug('1', '1', 505);

        dbDsl.createFeedbackComment('1', '3', '2', 517);
        dbDsl.createFeedbackComment('1', '4', '3', 510);
        dbDsl.createFeedbackComment('1', '5', '4', 511);

        dbDsl.closeFeedback('1', '6', '2', 520);

        return dbDsl.sendToDb().then(function () {
            return testee.statusChanged('6');
        }).then(function () {
            let argument = createJob.getCall(0).args[1];
            expect(argument.reasonText).to.equal('closed6Text');
            expect(argument.status).to.equal('closed');
            expect(argument.userChangedStatusFeedback).to.equal('user Meier2');
            expect(argument.titleFeedback).to.equal('bug1Title');
            expect(argument.emails.length).to.equal(3);
            expect(argument.emails).to.include('user@irgendwo.ch', 'user4@irgendwo.ch', 'user3@irgendwo.ch');
        });
    });

    it('Send email notification to other users when bug reopen', function () {

        let createJob = sandbox.stub(emailQueue, 'createImmediatelyJob');

        dbDsl.createFeedbackBug('1', '1', 505);

        dbDsl.createFeedbackComment('1', '3', '2', 517);
        dbDsl.createFeedbackComment('1', '4', '3', 510);
        dbDsl.createFeedbackComment('1', '5', '4', 511);

        dbDsl.closeFeedback('1', '6', '2', 520);
        dbDsl.reopenFeedback('1', '7', '2', 521);

        return dbDsl.sendToDb().then(function () {
            return testee.statusChanged('7');
        }).then(function () {
            let argument = createJob.getCall(0).args[1];
            expect(argument.reasonText).to.equal('reopen7Text');
            expect(argument.status).to.equal('open');
            expect(argument.userChangedStatusFeedback).to.equal('user Meier2');
            expect(argument.titleFeedback).to.equal('bug1Title');
            expect(argument.emails.length).to.equal(3);
            expect(argument.emails).to.include('user@irgendwo.ch', 'user4@irgendwo.ch', 'user3@irgendwo.ch');
        });
    });

    it('Send email notification to other users when ideaDiscussion closed', function () {

        let createJob = sandbox.stub(emailQueue, 'createImmediatelyJob');

        dbDsl.createFeedbackDiscussion('1', '1', 500);

        dbDsl.createFeedbackDiscussionIdea('2', '1', '1', 501);

        dbDsl.createFeedbackComment('2', '3', '2', 517);
        dbDsl.createFeedbackComment('2', '4', '3', 510);
        dbDsl.createFeedbackComment('2', '5', '4', 511);

        dbDsl.closeFeedback('2', '6', '2', 520);

        return dbDsl.sendToDb().then(function () {
            return testee.statusChanged('6');
        }).then(function () {
            let argument = createJob.getCall(0).args[1];
            expect(argument.reasonText).to.equal('closed6Text');
            expect(argument.status).to.equal('closed');
            expect(argument.userChangedStatusFeedback).to.equal('user Meier2');
            expect(argument.titleFeedback).to.equal('discussionIdea2Title');
            expect(argument.emails.length).to.equal(3);
            expect(argument.emails).to.include('user@irgendwo.ch', 'user4@irgendwo.ch', 'user3@irgendwo.ch');
        });
    });

    it('Send email notification to other users when ideaDiscussion reopen', function () {

        let createJob = sandbox.stub(emailQueue, 'createImmediatelyJob');

        dbDsl.createFeedbackDiscussion('1', '1', 500);

        dbDsl.createFeedbackDiscussionIdea('2', '1', '1', 501);

        dbDsl.createFeedbackComment('2', '3', '2', 517);
        dbDsl.createFeedbackComment('2', '4', '3', 510);
        dbDsl.createFeedbackComment('2', '5', '4', 511);

        dbDsl.closeFeedback('2', '6', '2', 520);
        dbDsl.reopenFeedback('2', '7', '2', 521);

        return dbDsl.sendToDb().then(function () {
            return testee.statusChanged('7');
        }).then(function () {
            let argument = createJob.getCall(0).args[1];
            expect(argument.reasonText).to.equal('reopen7Text');
            expect(argument.status).to.equal('open');
            expect(argument.userChangedStatusFeedback).to.equal('user Meier2');
            expect(argument.titleFeedback).to.equal('discussionIdea2Title');
            expect(argument.emails.length).to.equal(3);
            expect(argument.emails).to.include('user@irgendwo.ch', 'user4@irgendwo.ch', 'user3@irgendwo.ch');
        });
    });
});
