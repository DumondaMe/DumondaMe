'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Get all contacts of a user', function () {

    beforeEach(async function () {
        await dbDsl.init(9);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get all contacts of another user (all public)', async function () {

        dbDsl.createContactConnection('2', '3');
        dbDsl.createContactConnection('2', '4');
        dbDsl.createContactConnection('1', '4');

        dbDsl.createContactConnection('6', '2');

        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile/contact', {
            contactOfUserId: '2',
            maxItems: 10,
            skip: 0
        });
        res.status.should.equal(200);
        res.body.contacts.length.should.equal(2);
        res.body.contacts[0].userId.should.equal("3");
        res.body.contacts[0].name.should.equal("user Meier3");
        res.body.contacts[0].isContactOfLoggedInUser.should.equal(false);
        res.body.contacts[0].profileUrl.should.equal("profileImage/3/thumbnail.jpg");

        res.body.contacts[1].userId.should.equal("4");
        res.body.contacts[1].name.should.equal("user Meier4");
        res.body.contacts[1].isContactOfLoggedInUser.should.equal(true);
        res.body.contacts[1].profileUrl.should.equal("profileImage/4/thumbnail.jpg");

        res.body.numberOfContacts.should.equal(2);
        res.body.numberOfInvisibleContacts.should.equal(0);
    });

    it('Get all contacts of another user (User profile visible for Elyoos accounts)', async function () {

        dbDsl.createContactConnection('2', '3');
        dbDsl.setUserPrivacy('3', {privacyMode: 'publicEl'});

        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile/contact', {
            contactOfUserId: '2',
            maxItems: 10,
            skip: 0
        });
        res.status.should.equal(200);
        res.body.contacts.length.should.equal(1);
        res.body.contacts[0].userId.should.equal("3");
        res.body.contacts[0].name.should.equal("user Meier3");
        res.body.contacts[0].isContactOfLoggedInUser.should.equal(false);
        res.body.contacts[0].profileUrl.should.equal("profileImage/3/thumbnail.jpg");

        res.body.numberOfContacts.should.equal(1);
        res.body.numberOfInvisibleContacts.should.equal(0);
    });

    it('Get all contacts of another user (Contact profile only visible for contacts)', async function () {

        dbDsl.createContactConnection('2', '3');
        dbDsl.setUserPrivacy('3', {privacyMode: 'onlyContact'});

        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile/contact', {
            contactOfUserId: '2',
            maxItems: 10,
            skip: 0
        });
        res.status.should.equal(200);
        res.body.contacts.length.should.equal(0);

        res.body.numberOfContacts.should.equal(0);
        res.body.numberOfInvisibleContacts.should.equal(1);
    });

    it('Get all contacts of another user (User profile only visible for contacts)', async function () {

        dbDsl.createContactConnection('2', '3');
        dbDsl.setUserPrivacy('2', {privacyMode: 'onlyContact'});

        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile/contact', {
            contactOfUserId: '2',
            maxItems: 10,
            skip: 0
        });
        res.status.should.equal(200);
        res.body.contacts.length.should.equal(0);

        res.body.numberOfContacts.should.equal(0);
        res.body.numberOfInvisibleContacts.should.equal(0);
    });

    it('Get all contacts of logged in user (all public)', async function () {

        dbDsl.createContactConnection('1', '3', null, 666);
        dbDsl.createContactConnection('1', '4', null, 777);
        dbDsl.createContactConnection('4', '1');

        dbDsl.createContactConnection('6', '1');

        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile/contact', {
            contactOfUserId: '1',
            maxItems: 10,
            skip: 0
        });
        res.status.should.equal(200);
        res.body.contacts.length.should.equal(2);
        res.body.contacts[0].userId.should.equal("3");
        res.body.contacts[0].name.should.equal("user Meier3");
        res.body.contacts[0].isContactSince.should.equal(666);
        res.body.contacts[0].isContactOfLoggedInUser.should.equal(true);
        res.body.contacts[0].profileUrl.should.equal("profileImage/3/thumbnail.jpg");

        res.body.contacts[1].userId.should.equal("4");
        res.body.contacts[1].name.should.equal("user Meier4");
        res.body.contacts[1].isContactSince.should.equal(777);
        res.body.contacts[1].isContactOfLoggedInUser.should.equal(true);
        res.body.contacts[1].profileUrl.should.equal("profileImage/4/thumbnail.jpg");

        res.body.numberOfContacts.should.equal(2);
        res.body.numberOfInvisibleContacts.should.equal(0);
    });

    it('Get all contacts of logged in user (User profile visible for Elyoos accounts)', async function () {

        dbDsl.createContactConnection('1', '3', null, 666);
        dbDsl.setUserPrivacy('3', {privacyMode: 'publicEl'});

        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile/contact', {
            contactOfUserId: '1',
            maxItems: 10,
            skip: 0
        });
        res.status.should.equal(200);
        res.body.contacts.length.should.equal(1);
        res.body.contacts[0].userId.should.equal("3");
        res.body.contacts[0].name.should.equal("user Meier3");
        res.body.contacts[0].isContactSince.should.equal(666);
        res.body.contacts[0].isContactOfLoggedInUser.should.equal(true);
        res.body.contacts[0].profileUrl.should.equal("profileImage/3/thumbnail.jpg");

        res.body.numberOfContacts.should.equal(1);
        res.body.numberOfInvisibleContacts.should.equal(0);
    });

    it('Get all contacts of logged in user (Contact profile only visible for contacts)', async function () {

        dbDsl.createContactConnection('1', '3');
        dbDsl.setUserPrivacy('3', {privacyMode: 'onlyContact'});

        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile/contact', {
            contactOfUserId: '1',
            maxItems: 10,
            skip: 0
        });
        res.status.should.equal(200);
        res.body.contacts.length.should.equal(0);

        res.body.numberOfContacts.should.equal(0);
        res.body.numberOfInvisibleContacts.should.equal(1);
    });

    it('Get all contacts of a user requested with a public user (all public)', async function () {

        dbDsl.createContactConnection('1', '3');
        dbDsl.createContactConnection('1', '4');
        dbDsl.createContactConnection('4', '1');

        dbDsl.createContactConnection('6', '1');

        await dbDsl.sendToDb();

        let res = await requestHandler.get('/api/user/profile/contact', {
            contactOfUserId: '1',
            maxItems: 10,
            skip: 0
        });
        res.status.should.equal(200);
        res.body.contacts.length.should.equal(2);
        res.body.contacts[0].userId.should.equal("3");
        res.body.contacts[0].name.should.equal("user Meier3");
        res.body.contacts[0].isContactOfLoggedInUser.should.equal(false);
        res.body.contacts[0].profileUrl.should.equal("profileImage/3/thumbnail.jpg");

        res.body.contacts[1].userId.should.equal("4");
        res.body.contacts[1].name.should.equal("user Meier4");
        res.body.contacts[1].isContactOfLoggedInUser.should.equal(false);
        res.body.contacts[1].profileUrl.should.equal("profileImage/4/thumbnail.jpg");

        res.body.numberOfContacts.should.equal(2);
        res.body.numberOfInvisibleContacts.should.equal(0);
    });

    it('Get all contacts of a user requested with a public user (Contact profile only visible for Elyoos accounts)', async function () {

        dbDsl.createContactConnection('1', '3');
        dbDsl.setUserPrivacy('3', {privacyMode: 'publicEl'});

        await dbDsl.sendToDb();

        let res = await requestHandler.get('/api/user/profile/contact', {
            contactOfUserId: '1',
            maxItems: 10,
            skip: 0
        });
        res.status.should.equal(200);
        res.body.contacts.length.should.equal(0);

        res.body.numberOfContacts.should.equal(0);
        res.body.numberOfInvisibleContacts.should.equal(1);
    });

    it('Get all contacts of a user requested with a public user (User profile only visible for Elyoos accounts)', async function () {

        dbDsl.createContactConnection('1', '3');
        dbDsl.setUserPrivacy('1', {privacyMode: 'publicEl'});

        await dbDsl.sendToDb();

        let res = await requestHandler.get('/api/user/profile/contact', {
            contactOfUserId: '1',
            maxItems: 10,
            skip: 0
        });
        res.status.should.equal(200);
        res.body.contacts.length.should.equal(0);

        res.body.numberOfContacts.should.equal(0);
        res.body.numberOfInvisibleContacts.should.equal(0);
    });

    it('Get all contacts of a user requested with a public user (Contact profile only visible for contacts)', async function () {

        dbDsl.createContactConnection('1', '3');
        dbDsl.setUserPrivacy('3', {privacyMode: 'onlyContact'});

        await dbDsl.sendToDb();

        let res = await requestHandler.get('/api/user/profile/contact', {
            contactOfUserId: '1',
            maxItems: 10,
            skip: 0
        });
        res.status.should.equal(200);
        res.body.contacts.length.should.equal(0);

        res.body.numberOfContacts.should.equal(0);
        res.body.numberOfInvisibleContacts.should.equal(1);
    });

    it('Get all contacts of a user requested with a public user (User profile only visible for contacts)', async function () {

        dbDsl.createContactConnection('1', '3');
        dbDsl.setUserPrivacy('1', {privacyMode: 'onlyContact'});

        await dbDsl.sendToDb();

        let res = await requestHandler.get('/api/user/profile/contact', {
            contactOfUserId: '1',
            maxItems: 10,
            skip: 0
        });
        res.status.should.equal(200);
        res.body.contacts.length.should.equal(0);

        res.body.numberOfContacts.should.equal(0);
        res.body.numberOfInvisibleContacts.should.equal(0);
    });
});
