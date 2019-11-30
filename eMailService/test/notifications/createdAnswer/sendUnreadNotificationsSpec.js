'use strict';

const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const db = require('dumonda-me-server-test-util').db;
const eMail = require('dumonda-me-server-lib').eMail;
const sinon = require('sinon');
const testee = requireSrc('notifications');

describe('Send email when user has unread notification, created answer', function () {

    let stubSendEMail, sandbox;

    beforeEach(async function () {
        await dbDsl.init(6);
        sandbox = sinon.sandbox.create();
        stubSendEMail = sandbox.stub(eMail, 'sendEMail');
        stubSendEMail.resolves({});

    });

    afterEach(function () {
        sandbox.restore();
    });

    it('User has one unread createdAnswer notification (de)', async function () {
        dbDsl.createQuestion('1', {
            creatorId: '1', question: 'Das ist eine Frage', topics: ['topic1'], language: 'de'
        });
        dbDsl.createBookAnswer('5', {
            creatorId: '2', questionId: '1', created: 555, authors: 'Hans Wurst', googleBookId: '1234',
            hasPreviewImage: true
        });
        dbDsl.notificationCreateAnswer('20', {questionId: '1', answerId: '5', created: 678});
        await dbDsl.sendToDb();

        await testee.sendUnreadNotifications();

        stubSendEMail.calledWith("notification", {
            preview: sinon.match.any,
            title: 'user Meier2 hat die Frage "Das ist eine Frage" beantwortet',
            unsubscribeLink: `${process.env.DUMONDA_ME_DOMAIN}unsubscribe/notifications/user@irgendwo.ch`
        }, 'de', 'user@irgendwo.ch').should.be.true;

        let notification = await db.cypher().match("(notification:Notification:EmailSent)")
            .return(`notification`).end().send();
        notification.length.should.equals(1);
    });

    it('User has one unread createdAnswer notification by anonymous person', async function () {
        dbDsl.createQuestion('1', {
            creatorId: '1', question: 'Das ist eine Frage', topics: ['topic1'], language: 'de'
        });
        dbDsl.createBookAnswer('5', {
            creatorId: '2', questionId: '1', created: 555, authors: 'Hans Wurst', googleBookId: '1234',
            hasPreviewImage: true
        });
        dbDsl.notificationCreateAnswer('20', {questionId: '1', answerId: '5', created: 678});
        dbDsl.setUserPrivacy('2', {privacyMode: 'onlyContact'});
        await dbDsl.sendToDb();

        await testee.sendUnreadNotifications();

        stubSendEMail.calledWith("notification", {
            preview: sinon.match.any,
            title: 'Anonyme Person hat die Frage "Das ist eine Frage" beantwortet',
            unsubscribeLink: `${process.env.DUMONDA_ME_DOMAIN}unsubscribe/notifications/user@irgendwo.ch`
        }, 'de', 'user@irgendwo.ch').should.be.true;

        let notification = await db.cypher().match("(notification:Notification:EmailSent)")
            .return(`notification`).end().send();
        notification.length.should.equals(1);
    });

    it('User has one unread createdAnswer notification (en)', async function () {
        dbDsl.createQuestion('1', {
            creatorId: '1', question: 'Das ist eine Frage', topics: ['topic1'], language: 'de'
        });
        dbDsl.createBookAnswer('5', {
            creatorId: '2', questionId: '1', created: 555, authors: 'Hans Wurst', googleBookId: '1234',
            hasPreviewImage: true
        });
        dbDsl.notificationCreateAnswer('20', {questionId: '1', answerId: '5', created: 678});
        dbDsl.setUserLanguage('1', {language: 'en'});
        await dbDsl.sendToDb();

        await testee.sendUnreadNotifications();

        stubSendEMail.calledWith("notification", {
            preview: sinon.match.any,
            title: 'user Meier2 answered the question "Das ist eine Frage"',
            unsubscribeLink: `${process.env.DUMONDA_ME_DOMAIN}unsubscribe/notifications/user@irgendwo.ch`
        }, 'en', 'user@irgendwo.ch').should.be.true;

        let notification = await db.cypher().match("(notification:Notification:EmailSent)")
            .return(`notification`).end().send();
        notification.length.should.equals(1);
    });

    it('User has multiple unread createdAnswer notification (de)', async function () {
        dbDsl.createQuestion('1', {
            creatorId: '1', question: 'Das ist eine Frage', topics: ['topic1'], language: 'de'
        });
        dbDsl.createBookAnswer('5', {
            creatorId: '2', questionId: '1', created: 555, authors: 'Hans Wurst', googleBookId: '1234',
            hasPreviewImage: true
        });
        dbDsl.createBookAnswer('6', {
            creatorId: '2', questionId: '1', created: 555, authors: 'Hans Wurst', googleBookId: '1234',
            hasPreviewImage: true
        });
        dbDsl.notificationCreateAnswer('20', {questionId: '1', answerId: '5', created: 678});
        dbDsl.notificationCreateAnswer('21', {questionId: '1', answerId: '6', created: 679});
        await dbDsl.sendToDb();

        await testee.sendUnreadNotifications();

        stubSendEMail.calledWith("notification", {
            preview: sinon.match.any,
            title: 'user Meier2 hat die Frage "Das ist eine Frage" beantwortet und weiteres',
            unsubscribeLink: `${process.env.DUMONDA_ME_DOMAIN}unsubscribe/notifications/user@irgendwo.ch`
        }, 'de', 'user@irgendwo.ch').should.be.true;

        let notification = await db.cypher().match("(notification:Notification:EmailSent)")
            .return(`notification`).end().send();
        notification.length.should.equals(2);
    });
});
