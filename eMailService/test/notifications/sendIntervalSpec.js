'use strict';

const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const db = require('dumonda-me-server-test-util').db;
const eMail = require('dumonda-me-server-lib').eMail;
const sinon = require('sinon');
const testee = requireSrc('notifications');
const moment = require('moment');

describe('Send email for unread notifications only after interval expires', function () {

    let stubSendEMail, sandbox, startTime;

    beforeEach(async function () {
        await dbDsl.init(6);
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        sandbox = sinon.sandbox.create();
        stubSendEMail = sandbox.stub(eMail, 'sendEMail');
        stubSendEMail.resolves({});

    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Send unread notification when no lastEmailSent property exists', async function () {
        dbDsl.notificationUserAddedToTrustCircle('101', {
            userId: '2', trustCircleUsers: [{userId: '3', created: 555}, {userId: '4', created: 444}], created: 600
        });
        await dbDsl.sendToDb();

        await testee.sendUnreadNotifications();

        stubSendEMail.calledWith("notification", {
            preview: sinon.match.any, title: sinon.match.any,
            unsubscribeLink: `${process.env.DUMONDA_ME_DOMAIN}unsubscribe/notifications/user2@irgendwo.ch`
        }, 'de', 'user2@irgendwo.ch').should.be.true;

        let notification = await db.cypher().match("(notification:Notification:EmailSent)")
            .return(`notification`).end().send();
        notification.length.should.equals(1);

        let user = await db.cypher().match("(user:User {userId: '2'})")
            .return(`user`).end().send();
        user[0].user.lastEmailSent.should.at.least(startTime);
    });

    it('Send unread notification when lastEmailSent is outside interval', async function () {
        dbDsl.notificationUserAddedToTrustCircle('101', {
            userId: '2', trustCircleUsers: [{userId: '3', created: 555}, {userId: '4', created: 444}], created: 600
        });
        dbDsl.emailNotificationSetUserLastEmailSent('2', {lastEmailSent: startTime - 86401});
        dbDsl.emailNotificationSetEMailInterval('2', {interval: 86400});
        await dbDsl.sendToDb();

        await testee.sendUnreadNotifications();

        stubSendEMail.calledWith("notification", {
            preview: sinon.match.any, title: sinon.match.any,
            unsubscribeLink: `${process.env.DUMONDA_ME_DOMAIN}unsubscribe/notifications/user2@irgendwo.ch`
        }, 'de', 'user2@irgendwo.ch').should.be.true;

        let notification = await db.cypher().match("(notification:Notification:EmailSent)")
            .return(`notification`).end().send();
        notification.length.should.equals(1);

        let user = await db.cypher().match("(user:User {userId: '2'})")
            .return(`user`).end().send();
        user[0].user.lastEmailSent.should.at.least(startTime);
    });

    it('Not send unread notification when lastEmailSent is inside interval', async function () {
        dbDsl.notificationUserAddedToTrustCircle('101', {
            userId: '2', trustCircleUsers: [{userId: '3', created: 555}, {userId: '4', created: 444}], created: 600
        });
        dbDsl.emailNotificationSetUserLastEmailSent('2', {lastEmailSent: startTime - 86395});
        dbDsl.emailNotificationSetEMailInterval('2', {interval: 86400});
        await dbDsl.sendToDb();

        await testee.sendUnreadNotifications();

        stubSendEMail.called.should.be.false;

        let notification = await db.cypher().match("(notification:Notification:EmailSent)")
            .return(`notification`).end().send();
        notification.length.should.equals(0);

        let user = await db.cypher().match("(user:User {userId: '2'})")
            .return(`user`).end().send();
        user[0].user.lastEmailSent.should.equals(startTime - 86395);
    });
});
