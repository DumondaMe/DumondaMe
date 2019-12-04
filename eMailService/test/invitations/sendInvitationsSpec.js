'use strict';

const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const db = require('dumonda-me-server-test-util').db;
const eMail = require('dumonda-me-server-lib').eMail;
const sinon = require('sinon');
const testee = requireSrc('invitations');
const fs = require('fs');
const tmp = require('tmp');

describe('Send invitations emails', function () {

    let stubSendEMail, sandbox;

    beforeEach(async function () {
        let stubFileSync;
        await dbDsl.init(6);
        sandbox = sinon.sandbox.create();
        stubSendEMail = sandbox.stub(eMail, 'sendEMail');
        stubSendEMail.resolves({});
        stubFileSync = sandbox.stub(tmp, 'fileSync');
        stubFileSync.returns({name: 'test', Body: 'test'});
        sandbox.stub(fs, 'writeFileSync');

    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Sending invitation', async function () {
        dbDsl.invitationSentBeforeRegistration('3',
            [{
                emailOfUserToInvite: 'info@dumonda.me', sendingEmailPending: true,
                text: 'Meine Message', language: 'de'
            }]);
        await dbDsl.sendToDb();

        await testee.sendInvitations();

        stubSendEMail.calledWith("invitePerson", {
            name: `user Meier3`, userImage: sinon.match.any, userMessage: 'Meine Message',
            unsubscribeLink: `${process.env.DUMONDA_ME_DOMAIN}unsubscribe/invitedUser/info@dumonda.me`
        }, 'de', 'info@dumonda.me').should.be.true;

        let notification = await db.cypher()
            .match(`(invitedUser:InvitedUser)<-[:SENDING_EMAIL_PENDING]-(:User {userId: '3'})`)
            .return(`invitedUser`).end().send();
        notification.length.should.equals(0);
    });

    it('Sending multiple invitations from same user', async function () {
        dbDsl.invitationSentBeforeRegistration('3',
            [{emailOfUserToInvite: 'info@dumonda.me', sendingEmailPending: true,
                text: 'Meine Message', language: 'de'}]);
        dbDsl.invitationSentBeforeRegistration('3',
            [{emailOfUserToInvite: 'info2@dumonda.me', sendingEmailPending: true,
                text: 'Meine Message2', language: 'de'}]);
        dbDsl.invitationSentBeforeRegistration('3',
            [{emailOfUserToInvite: 'info3@dumonda.me', sendingEmailPending: true,
                text: 'Meine Message3', language: 'en'}]);
        await dbDsl.sendToDb();

        await testee.sendInvitations();

        stubSendEMail.calledWith("invitePerson", {
            name: `user Meier3`, userImage: sinon.match.any, userMessage: 'Meine Message',
            unsubscribeLink: `${process.env.DUMONDA_ME_DOMAIN}unsubscribe/invitedUser/info@dumonda.me`
        }, 'de', 'info@dumonda.me').should.be.true;

        stubSendEMail.calledWith("invitePerson", {
            name: `user Meier3`, userImage: sinon.match.any, userMessage: 'Meine Message2',
            unsubscribeLink: `${process.env.DUMONDA_ME_DOMAIN}unsubscribe/invitedUser/info2@dumonda.me`
        }, 'de', 'info2@dumonda.me').should.be.true;

        stubSendEMail.calledWith("invitePerson", {
            name: `user Meier3`, userImage: sinon.match.any, userMessage: 'Meine Message3',
            unsubscribeLink: `${process.env.DUMONDA_ME_DOMAIN}unsubscribe/invitedUser/info3@dumonda.me`
        }, 'en', 'info3@dumonda.me').should.be.true;

        let notification = await db.cypher()
            .match(`(invitedUser:InvitedUser)<-[:SENDING_EMAIL_PENDING]-(:User {userId: '3'})`)
            .return(`invitedUser`).end().send();
        notification.length.should.equals(0);
    });
});
