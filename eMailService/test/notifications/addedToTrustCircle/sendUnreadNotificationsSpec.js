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
            userId: '2', trustCircleUsers: [{userId: '3', created: 555}, {userId: '4', created: 444}], created: 600
        });
        await dbDsl.sendToDb();

        await testee.sendUnreadNotifications();

        stubSendEMail.calledWith("notification", {
            preview: sinon.match.any,
            title: 'user Meier3 hat dich zu seinem/ihrem Trust Circle hinzugefügt',
            unsubscribeLink: `${process.env.DUMONDA_ME_DOMAIN}unsubscribe/notifications/user2@irgendwo.ch`
        }, 'de', 'user2@irgendwo.ch').should.be.true;

        let notification = await db.cypher().match("(notification:Notification:EmailSent {notificationId: '50'})")
            .return(`notification`).end().send();
        notification.length.should.equals(1);
    });
});
