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

    it('Send invitation', async function () {
        dbDsl.invitationSentBeforeRegistration('3',
            [{emailOfUserToInvite: 'info@dumonda.me', sendingEmailPending: true}]);
        await dbDsl.sendToDb();

        await testee.sendInvitations();

        stubSendEMail.calledWith("invitePerson", {
            name: `user Meier3`, userImage: sinon.match.any,
            unsubscribeLink: `${process.env.DUMONDA_ME_DOMAIN}unsubscribe/invitedUser/info@dumonda.me`
        }, 'de', 'info@dumonda.me').should.be.true;

        let notification = await db.cypher()
            .match(`(invitedUser:InvitedUser)<-[:SENDING_EMAIL_PENDING]-(:User {userId: '3'})`)
            .return(`invitedUser`).end().send();
        notification.length.should.equals(0);
    });
});