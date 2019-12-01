'use strict';

const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const db = require('dumonda-me-server-test-util').db;
const eMail = require('dumonda-me-server-lib').eMail;
const sinon = require('sinon');
const testee = requireSrc('notifications');

describe('Send unread notification when user is requested to be admin of commitment', function () {

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
        dbDsl.createCommitment('1', {
            adminId: '1', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700, modified: 701,
            website: 'https://www.example.org/', regions: ['region-1'], title: 'Das ist ein Test'
        });

        dbDsl.notificationRequestAdminOfCommitment('50',
            {commitmentId: '1', existingAdminId: '1', newAdminId: '2', created: 500, read: false});
        await dbDsl.sendToDb();

        await testee.sendUnreadNotifications();

        stubSendEMail.calledWith("notification", {
            preview: sinon.match.any,
            title: 'Anfrage um dich als Adminstorator von "Das ist ein Test" hinzuzufügen',
            unsubscribeLink: `${process.env.DUMONDA_ME_DOMAIN}unsubscribe/notifications/user2@irgendwo.ch`
        }, 'de', 'user2@irgendwo.ch').should.be.true;

        let notification = await db.cypher().match("(notification:Notification:EmailSent {notificationId: '50'})")
            .return(`notification`).end().send();
        notification.length.should.equals(1);
    });
});
