'use strict';

const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const db = require('dumonda-me-server-test-util').db;
const eMail = require('dumonda-me-server-lib').eMail;
const sinon = require('sinon');
const testee = requireSrc('notifications');

describe('Send unread notification when invited user has registered', function () {

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
        dbDsl.notificationInvitedUserHasRegistered('50', {
            userId: '1', created: 678, invitedUserId: '2'
        });
        await dbDsl.sendToDb();

        await testee.sendUnreadNotifications();

        stubSendEMail.calledWith("notification", {
            preview: sinon.match.any,
            title: 'user Meier2 hat einen Account auf DumondaMe erstellt',
            unsubscribeLink: `${process.env.DUMONDA_ME_DOMAIN}unsubscribe/notifications/user@irgendwo.ch`
        }, 'de', 'user@irgendwo.ch').should.be.true;

        let notification = await db.cypher().match("(notification:Notification:EmailSent {notificationId: '50'})")
            .return(`notification`).end().send();
        notification.length.should.equals(1);
    });
});
