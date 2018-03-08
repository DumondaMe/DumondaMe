'use strict';

let users = require('elyoos-server-test-util').user;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let should = require('chai').should();
let dbDsl = require('elyoos-server-test-util').dbDSL;

describe('Getting user profile data', function () {

    beforeEach(async function () {
        await dbDsl.init(8);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get profile data of logged in user', async function () {
        dbDsl.createContactConnection('1', '2');
        dbDsl.createContactConnection('1', '3');

        dbDsl.createContactConnection('7', '1');

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile');
        res.status.should.equal(200);
        res.body.forename.should.equal('user');
        res.body.surname.should.equal('Meier');
        res.body.isLoggedInUser.should.equal(true);
        should.not.exist(res.body.password);
        res.body.profileImage.should.equal('profileImage/1/profile.jpg');
        res.body.numberOfContacts.should.equal(2);

        res.body.contacts.length.should.equal(2);
        res.body.contacts[0].userId.should.equal('2');
        res.body.contacts[0].name.should.equal('user Meier2');
        res.body.contacts[0].isContactOfLoggedInUser.should.equal(true);
        res.body.contacts[0].profileUrl.should.equal('profileImage/2/thumbnail.jpg');

        res.body.contacts[1].userId.should.equal('3');
        res.body.contacts[1].name.should.equal('user Meier3');
        res.body.contacts[1].isContactOfLoggedInUser.should.equal(true);
        res.body.contacts[1].profileUrl.should.equal('profileImage/3/thumbnail.jpg');
    });

    it('Get profile data of not logged in user', async function () {
        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/user/profile');
        res.status.should.equal(401);
    });

    it('Get profile data of another user (PrivacyMode public)', async function () {
        dbDsl.createContactConnection('2', '3');
        dbDsl.createContactConnection('2', '4');

        dbDsl.createContactConnection('7', '2');

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile', {userId: '2'});
        res.status.should.equal(200);
        res.body.forename.should.equal('user');
        res.body.surname.should.equal('Meier2');
        res.body.isLoggedInUser.should.equal(false);
    });

    it('Get profile data of another user (PrivacyMode publicEl)', async function () {
        dbDsl.createContactConnection('2', '3');
        dbDsl.createContactConnection('2', '4');

        dbDsl.createContactConnection('7', '2');
        dbDsl.setUserPrivacy('2', {privacyMode: 'publicEl'});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile', {userId: '2'});
        res.status.should.equal(200);
        res.body.forename.should.equal('user');
        res.body.surname.should.equal('Meier2');
        res.body.isLoggedInUser.should.equal(false);
    });

    it('Get profile data of another user (PrivacyMode onlyContact)', async function () {
        dbDsl.createContactConnection('2', '1');
        dbDsl.setUserPrivacy('2', {privacyMode: 'onlyContact'});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile', {userId: '2'});
        res.status.should.equal(200);
        res.body.forename.should.equal('user');
        res.body.surname.should.equal('Meier2');
        res.body.isLoggedInUser.should.equal(false);
    });

    it('Get profile data of a user (Not logged in)', async function () {
        dbDsl.createContactConnection('2', '3');
        dbDsl.createContactConnection('2', '4');

        dbDsl.createContactConnection('7', '2');

        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/user/profile', {userId: '2'});
        res.status.should.equal(200);
        res.body.forename.should.equal('user');
        res.body.surname.should.equal('Meier2');
        res.body.isLoggedInUser.should.equal(false);
        should.not.exist(res.body.password);
        res.body.profileImage.should.equal('profileImage/2/profile.jpg');
        res.body.numberOfContacts.should.equal(2);

        res.body.contacts.length.should.equal(2);
        res.body.contacts[0].userId.should.equal('3');
        res.body.contacts[0].name.should.equal('user Meier3');
        res.body.contacts[0].isContactOfLoggedInUser.should.equal(false);
        res.body.contacts[0].profileUrl.should.equal('profileImage/3/thumbnail.jpg');

        res.body.contacts[1].userId.should.equal('4');
        res.body.contacts[1].name.should.equal('user Meier4');
        res.body.contacts[1].isContactOfLoggedInUser.should.equal(false);
        res.body.contacts[1].profileUrl.should.equal('profileImage/4/thumbnail.jpg');
    });

    it('Deny access to profile when not logged in (PrivacyMode publicEl)', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'publicEl'});
        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/user/profile', {userId: '2'});
        res.status.should.equal(401);
    });

    it('Deny access to profile when not logged in (PrivacyMode contactOnly)', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'onlyContact'});
        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/user/profile', {userId: '2'});
        res.status.should.equal(401);
    });
});
