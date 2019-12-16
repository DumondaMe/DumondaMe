'use strict';

const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const db = require('dumonda-me-server-test-util').db;
const eMail = require('dumonda-me-server-lib').eMail;
const sinon = require('sinon');
const testee = requireSrc('notifications');

describe('Send email for unread notifications', function () {

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

    it('Send multiple unread notification', async function () {
        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine FragöÖÄäÜü', description: 'description', topics: ['Spiritual'],
            language: 'de'
        });
        dbDsl.createDefaultAnswer('5', {
            creatorId: '2', questionId:'1', answer: 'Answer'
        });
        dbDsl.createNote('50', {answerId: '5', creatorId: '2', created: 555});

        dbDsl.notificationCreateNote('100', {questionId: '1', answerId: '5', noteId: '50', created: 678});
        dbDsl.notificationUserAddedToTrustCircle('101', {
            userId: '2',
            trustCircleUsers: [{userId: '3', created: 555}, {userId: '4', created: 444}], created: 600
        });
        dbDsl.notificationCreateAnswer('102', {questionId: '1', answerId: '5', created: 678});
        await dbDsl.sendToDb();

        await testee.sendUnreadNotifications();

        stubSendEMail.calledWith("notification", {
            preview: sinon.match.any, title: sinon.match.any,
            unsubscribeLink: `${process.env.DUMONDA_ME_DOMAIN}unsubscribe/notifications/user2@irgendwo.ch`
        }, 'de', 'user2@irgendwo.ch').should.be.true;

        let notification = await db.cypher().match("(notification:Notification:EmailSent)")
            .return(`notification`).end().send();
        notification.length.should.equals(3);
    });

    it('Do not send unread notification for harvesting user', async function () {
        dbDsl.notificationUserAddedToTrustCircle('50', {
            userId: '2', trustCircleUsers: [{userId: '3', created: 555}, {userId: '4', created: 444}], created: 600
        });
        dbDsl.setUserIsHarvestingUser('2', {start: 100, end: 200, link: 'https://www.link.ch', address: 'Milky Way'});
        await dbDsl.sendToDb();

        await testee.sendUnreadNotifications();

        stubSendEMail.called.should.be.false;

        let notification = await db.cypher().match("(notification:Notification:EmailSent)")
            .return(`notification`).end().send();
        notification.length.should.equals(0);
    });

    it('Do not send unread notification with noEmail label', async function () {
        dbDsl.notificationOneTimeWatchQuestion('20', {userId: '1', created: 678});
        await dbDsl.sendToDb();

        await testee.sendUnreadNotifications();

        stubSendEMail.called.should.be.false;

        let notification = await db.cypher().match("(notification:Notification:EmailSent)")
            .return(`notification`).end().send();
        notification.length.should.equals(0);
    });

    it('If an error occurred then remove EmailSent label ', async function () {
        dbDsl.notificationUserAddedToTrustCircle('50', {
            userId: '2',
            trustCircleUsers: [{userId: '3', created: 555}, {userId: '4', created: 444}], created: 600
        });
        await dbDsl.sendToDb();
        stubSendEMail.rejects({});

        await testee.sendUnreadNotifications();

        stubSendEMail.calledWith("notification", {
            preview: sinon.match.any, title: sinon.match.any,
            unsubscribeLink: `${process.env.DUMONDA_ME_DOMAIN}unsubscribe/notifications/user2@irgendwo.ch`
        }, 'de', 'user2@irgendwo.ch').should.be.true;

        let notification = await db.cypher().match("(notification:Notification {notificationId: '50'})")
            .where(`NOT notification:EmailSent`)
            .return(`notification`).end().send();
        notification.length.should.equals(1);
    });

    it('A notification that has already been sent should not be sent again.', async function () {
        dbDsl.notificationUserAddedToTrustCircle('50', {
            emailSent: true,
            userId: '2',
            trustCircleUsers: [{userId: '3', created: 555}, {userId: '4', created: 444}],
            created: 600
        });
        await dbDsl.sendToDb();

        await testee.sendUnreadNotifications();

        stubSendEMail.called.should.be.false;
    });

    it('A read notification should not be sent.', async function () {
        dbDsl.notificationUserAddedToTrustCircle('50', {
            read: true, userId: '2', trustCircleUsers: [{userId: '3', created: 555}, {userId: '4', created: 444}],
            created: 600
        });
        await dbDsl.sendToDb();

        await testee.sendUnreadNotifications();

        stubSendEMail.called.should.be.false;
    });

    it('No notification can be sent to a user who has deactivated email notification.', async function () {
        dbDsl.notificationUserAddedToTrustCircle('50', {
            userId: '2',
            trustCircleUsers: [{userId: '3', created: 555}, {userId: '4', created: 444}], created: 600
        });
        dbDsl.disableEMailNotification('2');
        await dbDsl.sendToDb();

        await testee.sendUnreadNotifications();

        stubSendEMail.called.should.be.false;
    });
});
