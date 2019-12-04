'use strict';

const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const rp = require('request-promise');
const sinon = require('sinon');
const fs = require('fs');
const path = require('path');
const should = require('chai').should();

describe('Import eMail from google', function () {

    let sandbox;

    beforeEach(async function () {
        await dbDsl.init(3);
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
        return requestHandler.logout();
    });

    it('Import contacts', async function () {
        let stubAccessCodeRequest = sandbox.stub(rp, 'post');
        let stubGetRequest = sandbox.stub(rp, 'get');
        stubAccessCodeRequest.resolves(`{
            "access_token": "1234",
            "expires_in": 3599,
            "scope": "https://www.googleapis.com/auth/contacts.readonly",
            "token_type": "Bearer"
        }`);
        stubGetRequest.resolves(fs.readFileSync(path.resolve(__dirname, 'google.xml')));
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/import/contact/gmail', {code: '1234'});
        res.status.should.equal(200);

        res.body.contacts.length.should.equals(3);
        res.body.contacts[0].email.should.equals('follow@rabbit.de');
        res.body.contacts[0].name.should.equals('Alice im Wunderland');
        should.not.exist(res.body.contacts[0].alreadySentInvitation);
        should.not.exist(res.body.contacts[0].notAllowedToSentInvitation);
        should.not.exist(res.body.contacts[0].userId);
        should.not.exist(res.body.contacts[0].isPlatformUser);
        should.not.exist(res.body.contacts[0].userImage);
        should.not.exist(res.body.contacts[0].isTrustUser);
        should.not.exist(res.body.contacts[0].isAnonymous);

        res.body.contacts[1].userId.should.equals('1');
        res.body.contacts[1].name.should.equals('user Meier');
        res.body.contacts[1].email.should.equals('user@irgendwo.ch');
        res.body.contacts[1].isPlatformUser.should.equals(true);
        res.body.contacts[1].userImage.should.equals('profileImage/1/profilePreview.jpg');
        res.body.contacts[1].isTrustUser.should.equals(false);
        res.body.contacts[1].isAnonymous.should.equals(false);
        res.body.contacts[1].isLoggedInUser.should.equals(true);

        res.body.contacts[2].userId.should.equals('3');
        res.body.contacts[2].name.should.equals('user Meier3');
        res.body.contacts[2].email.should.equals('user3@irgendwo.ch');
        res.body.contacts[2].isPlatformUser.should.equals(true);
        res.body.contacts[2].userImage.should.equals('profileImage/3/profilePreview.jpg');
        res.body.contacts[2].isTrustUser.should.equals(false);
        res.body.contacts[2].isAnonymous.should.equals(false);
        res.body.contacts[2].isLoggedInUser.should.equals(false);
    });

    it('Import not registered user already sent invitation', async function () {
        let stubAccessCodeRequest = sandbox.stub(rp, 'post');
        let stubGetRequest = sandbox.stub(rp, 'get');
        stubAccessCodeRequest.resolves(`{
            "access_token": "1234",
            "expires_in": 3599,
            "scope": "https://www.googleapis.com/auth/contacts.readonly",
            "token_type": "Bearer"
        }`);
        stubGetRequest.resolves(fs.readFileSync(path.resolve(__dirname, 'googleNotRegisteredUser.xml')));
        dbDsl.invitationSentBeforeRegistration('1', [{
            emailOfUserToInvite: 'user10@irgendwo.ch', text: 'Meine Message', language: 'de'
        }]);
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/import/contact/gmail', {code: '1234'});
        res.status.should.equal(200);

        res.body.contacts.length.should.equals(1);
        res.body.contacts[0].email.should.equals('user10@irgendwo.ch');
        res.body.contacts[0].name.should.equals('Alice im Wunderland');
        res.body.contacts[0].alreadySentInvitation.should.equals(true);
        res.body.contacts[0].notAllowedToSentInvitation.should.equals(false);
    });

    it('Import not registered unsubscribed user', async function () {
        let stubAccessCodeRequest = sandbox.stub(rp, 'post');
        let stubGetRequest = sandbox.stub(rp, 'get');
        stubAccessCodeRequest.resolves(`{
            "access_token": "1234",
            "expires_in": 3599,
            "scope": "https://www.googleapis.com/auth/contacts.readonly",
            "token_type": "Bearer"
        }`);
        stubGetRequest.resolves(fs.readFileSync(path.resolve(__dirname, 'googleNotRegisteredUser.xml')));
        dbDsl.invitationSentBeforeRegistration('1', [{
            emailOfUserToInvite: 'user10@irgendwo.ch', text: 'Meine Message', language: 'de'
        }]);
        dbDsl.disableEMailNotificationForInvitedUser('user10@irgendwo.ch');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/import/contact/gmail', {code: '1234'});
        res.status.should.equal(200);

        res.body.contacts.length.should.equals(1);
        res.body.contacts[0].email.should.equals('user10@irgendwo.ch');
        res.body.contacts[0].name.should.equals('Alice im Wunderland');
        res.body.contacts[0].alreadySentInvitation.should.equals(true);
        res.body.contacts[0].notAllowedToSentInvitation.should.equals(true);
    });

});
