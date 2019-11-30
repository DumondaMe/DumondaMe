'use strict';

const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const db = require('dumonda-me-server-test-util').db;
const eMail = require('dumonda-me-server-lib').eMail;
const sinon = require('sinon');
const testee = requireSrc('notifications');

describe('Send email for unread notifications with no preview', function () {

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

    it('Send one unread notification', async function () {
        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine FragöÖÄäÜü', description: 'description', topics: ['Spiritual'],
            language: 'de'
        });
        dbDsl.createDefaultAnswer('5', {
            creatorId: '2', questionId:'1', answer: 'Answer'
        });
        dbDsl.createNote('50', {answerId: '5', creatorId: '2', created: 555});

        dbDsl.notificationCreateNote('100', {questionId: '1', answerId: '5', noteId: '50', created: 678});
        await dbDsl.sendToDb();

        await testee.sendUnreadNotifications();

        stubSendEMail.calledWith("notification", {
            preview: sinon.match.any, title: "Du hast eine neue Benachrichtigung",
            unsubscribeLink: `${process.env.DUMONDA_ME_DOMAIN}unsubscribe/notifications/user2@irgendwo.ch`
        }, 'de', 'user2@irgendwo.ch').should.be.true;

        let notification = await db.cypher().match("(notification:Notification:EmailSent)")
            .return(`notification`).end().send();
        notification.length.should.equals(1);
    });

    it('Send two unread notification', async function () {
        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine FragöÖÄäÜü', description: 'description', topics: ['Spiritual'],
            language: 'de'
        });
        dbDsl.createDefaultAnswer('5', {
            creatorId: '2', questionId:'1', answer: 'Answer'
        });
        dbDsl.createNote('50', {answerId: '5', creatorId: '2', created: 555});
        dbDsl.createNote('51', {answerId: '5', creatorId: '2', created: 555});

        dbDsl.notificationCreateNote('100', {questionId: '1', answerId: '5', noteId: '50', created: 678});
        dbDsl.notificationCreateNote('101', {questionId: '1', answerId: '5', noteId: '51', created: 679});
        await dbDsl.sendToDb();

        await testee.sendUnreadNotifications();

        stubSendEMail.calledWith("notification", {
            preview: sinon.match.any, title: "Du hast neue Benachrichtigungen",
            unsubscribeLink: `${process.env.DUMONDA_ME_DOMAIN}unsubscribe/notifications/user2@irgendwo.ch`
        }, 'de', 'user2@irgendwo.ch').should.be.true;

        let notification = await db.cypher().match("(notification:Notification:EmailSent)")
            .return(`notification`).end().send();
        notification.length.should.equals(2);
    });
});
