'use strict';

const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const sinon = require('sinon');
const should = require('chai').should();

describe('Add meta data to imported emails', function () {

    let sandbox;

    beforeEach(async function () {
        await dbDsl.init(3);
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
        return requestHandler.logout();
    });

    it('User does not exist', async function () {
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/import/contact/addMetaInfo', {emails: ['follow@rabbit.de']});
        res.status.should.equal(200);

        res.body.contacts.length.should.equals(1);
        res.body.contacts[0].email.should.equals('follow@rabbit.de');
        should.not.exist(res.body.contacts[0].name);
        should.not.exist(res.body.contacts[0].alreadySentInvitation);
        should.not.exist(res.body.contacts[0].notAllowedToSentInvitation);
        should.not.exist(res.body.contacts[0].userId);
        should.not.exist(res.body.contacts[0].isPlatformUser);
        should.not.exist(res.body.contacts[0].userImage);
        should.not.exist(res.body.contacts[0].isTrustUser);
        should.not.exist(res.body.contacts[0].isAnonymous);
    });

    it('Email of logged in user', async function () {
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/import/contact/addMetaInfo', {emails: ['user@irgendwo.ch']});
        res.status.should.equal(200);

        res.body.contacts.length.should.equals(1);
        res.body.contacts[0].userId.should.equals('1');
        res.body.contacts[0].name.should.equals('user Meier');
        res.body.contacts[0].email.should.equals('user@irgendwo.ch');
        res.body.contacts[0].isPlatformUser.should.equals(true);
        res.body.contacts[0].userImage.should.equals('profileImage/1/profilePreview.jpg');
        res.body.contacts[0].isTrustUser.should.equals(false);
        res.body.contacts[0].isAnonymous.should.equals(false);
        res.body.contacts[0].isLoggedInUser.should.equals(true);
    });

    it('Email of trusted user', async function () {
        dbDsl.createContactConnection('1', '2');
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/import/contact/addMetaInfo', {emails: ['user2@irgendwo.ch']});
        res.status.should.equal(200);

        res.body.contacts.length.should.equals(1);
        res.body.contacts[0].userId.should.equals('2');
        res.body.contacts[0].name.should.equals('user Meier2');
        res.body.contacts[0].email.should.equals('user2@irgendwo.ch');
        res.body.contacts[0].isPlatformUser.should.equals(true);
        res.body.contacts[0].userImage.should.equals('profileImage/2/profilePreview.jpg');
        res.body.contacts[0].isTrustUser.should.equals(true);
        res.body.contacts[0].isAnonymous.should.equals(false);
        res.body.contacts[0].isLoggedInUser.should.equals(false);
    });

    it('Email of already invited user', async function () {
        dbDsl.invitationSentBeforeRegistration('1', [{
            emailOfUserToInvite: 'user10@irgendwo.ch'
        }]);
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/import/contact/addMetaInfo', {emails: ['user10@irgendwo.ch']});
        res.status.should.equal(200);

        res.body.contacts.length.should.equals(1);
        res.body.contacts[0].email.should.equals('user10@irgendwo.ch');
        res.body.contacts[0].alreadySentInvitation.should.equals(true);
        res.body.contacts[0].notAllowedToSentInvitation.should.equals(false);
        should.not.exist(res.body.contacts[0].name);
        should.not.exist(res.body.contacts[0].userId);
        should.not.exist(res.body.contacts[0].isPlatformUser);
        should.not.exist(res.body.contacts[0].userImage);
        should.not.exist(res.body.contacts[0].isTrustUser);
        should.not.exist(res.body.contacts[0].isAnonymous);
    });

    it('Email of already invited user with deactivated notification setting', async function () {
        dbDsl.invitationSentBeforeRegistration('2', [{
            emailOfUserToInvite: 'user10@irgendwo.ch'
        }]);
        dbDsl.disableEMailNotificationForInvitedUser('user10@irgendwo.ch');
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/import/contact/addMetaInfo', {emails: ['user10@irgendwo.ch']});
        res.status.should.equal(200);

        res.body.contacts.length.should.equals(1);
        res.body.contacts[0].email.should.equals('user10@irgendwo.ch');
        res.body.contacts[0].alreadySentInvitation.should.equals(false);
        res.body.contacts[0].notAllowedToSentInvitation.should.equals(true);
        should.not.exist(res.body.contacts[0].name);
        should.not.exist(res.body.contacts[0].userId);
        should.not.exist(res.body.contacts[0].isPlatformUser);
        should.not.exist(res.body.contacts[0].userImage);
        should.not.exist(res.body.contacts[0].isTrustUser);
        should.not.exist(res.body.contacts[0].isAnonymous);
    });
});
