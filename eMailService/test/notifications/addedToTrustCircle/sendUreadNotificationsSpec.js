'use strict';

const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const db = require('dumonda-me-server-test-util').db;
const eMail = require('dumonda-me-server-lib').eMail;
const sinon = require('sinon');
const testee = requireSrc('notifications');

describe('Send unread notification when user has been added to trust circle', function () {

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

    it('Send unread notification', async function () {
        dbDsl.notificationUserAddedToTrustCircle('50', {
            userId: '2',
            trustCircleUsers: [{userId: '3', created: 555}, {userId: '4', created: 444}], created: 600
        });
        await dbDsl.sendToDb();

        await testee.sendUnreadNotifications();

        stubSendEMail.calledWith("notification", {
            numberOfNotifications: 1,
            unsubscribeLink: `${process.env.DUMONDA_ME_DOMAIN}unsubscribe/notifications/user2@irgendwo.ch`
        }, 'de', 'user2@irgendwo.ch').should.be.true;

        let notification = await db.cypher().match("(notification:Notification:EmailSent {notificationId: '50'})")
            .return(`notification`).end().send();
        notification.length.should.equals(1);
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
            numberOfNotifications: 1,
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

    it('No notification can be sent to a user who has deactivated email.', async function () {
        dbDsl.notificationUserAddedToTrustCircle('50', {
            userId: '2',
            trustCircleUsers: [{userId: '3', created: 555}, {userId: '4', created: 444}], created: 600
        });
        dbDsl.disableEMailNotification('2');
        await dbDsl.sendToDb();

        await testee.sendUnreadNotifications();

        stubSendEMail.called.should.be.false;
    });

    it('No notification can be sent to a user who has deactivated email for notification.', async function () {
        dbDsl.notificationUserAddedToTrustCircle('50', {
            userId: '2',
            trustCircleUsers: [{userId: '3', created: 555}, {userId: '4', created: 444}], created: 600
        });
        dbDsl.disableNewNotificationEmail('2');
        await dbDsl.sendToDb();

        await testee.sendUnreadNotifications();

        stubSendEMail.called.should.be.false;
    });
});
