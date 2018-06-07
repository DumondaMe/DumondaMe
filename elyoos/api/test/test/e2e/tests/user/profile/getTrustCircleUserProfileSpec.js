'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Get other users from the trust circle of a user', function () {

    beforeEach(async function () {
        await dbDsl.init(9);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get all users in the trust circle of another user (all public)', async function () {

        dbDsl.createContactConnection('2', '3');
        dbDsl.createContactConnection('2', '4');
        dbDsl.createContactConnection('1', '4');

        dbDsl.createContactConnection('6', '2');

        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile/trustCircle', {
            userId: '2', maxItems: 10, skip: 0
        });
        res.status.should.equal(200);
        res.body.peopleOfTrust.length.should.equal(2);
        res.body.peopleOfTrust[0].userId.should.equal("3");
        res.body.peopleOfTrust[0].name.should.equal("user Meier3");
        res.body.peopleOfTrust[0].isPersonOfTrust.should.equal(false);
        res.body.peopleOfTrust[0].profileUrl.should.equal("profileImage/3/thumbnail.jpg");

        res.body.peopleOfTrust[1].userId.should.equal("4");
        res.body.peopleOfTrust[1].name.should.equal("user Meier4");
        res.body.peopleOfTrust[1].isPersonOfTrust.should.equal(true);
        res.body.peopleOfTrust[1].profileUrl.should.equal("profileImage/4/thumbnail.jpg");

        res.body.numberOfPeopleOfTrust.should.equal(2);
        res.body.numberOfInvisiblePeopleOfTrust.should.equal(0);
    });

    it('Get all users in the trust circle of another user (User profile visible for Elyoos accounts)', async function () {

        dbDsl.createContactConnection('2', '3');
        dbDsl.setUserPrivacy('3', {privacyMode: 'publicEl'});

        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile/trustCircle', {
            userId: '2', maxItems: 10, skip: 0
        });
        res.status.should.equal(200);
        res.body.peopleOfTrust.length.should.equal(1);
        res.body.peopleOfTrust[0].userId.should.equal("3");
        res.body.peopleOfTrust[0].name.should.equal("user Meier3");
        res.body.peopleOfTrust[0].isPersonOfTrust.should.equal(false);
        res.body.peopleOfTrust[0].profileUrl.should.equal("profileImage/3/thumbnail.jpg");

        res.body.numberOfPeopleOfTrust.should.equal(1);
        res.body.numberOfInvisiblePeopleOfTrust.should.equal(0);
    });

    it('Get all users in the trust circle of another user (Contact profile only visible for persons of trust)', async function () {

        dbDsl.createContactConnection('2', '3');
        dbDsl.setUserPrivacy('3', {privacyMode: 'onlyContact'});

        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile/trustCircle', {
            userId: '2', maxItems: 10, skip: 0
        });
        res.status.should.equal(200);
        res.body.peopleOfTrust.length.should.equal(0);

        res.body.numberOfPeopleOfTrust.should.equal(0);
        res.body.numberOfInvisiblePeopleOfTrust.should.equal(1);
    });

    it('Get all users in the trust circle of another user (User profile only visible for persons of trust)', async function () {

        dbDsl.createContactConnection('2', '3');
        dbDsl.setUserPrivacy('2', {privacyMode: 'onlyContact'});

        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile/trustCircle', {
            userId: '2', maxItems: 10, skip: 0
        });
        res.status.should.equal(200);
        res.body.peopleOfTrust.length.should.equal(0);

        res.body.numberOfPeopleOfTrust.should.equal(0);
        res.body.numberOfInvisiblePeopleOfTrust.should.equal(0);
    });

    it('Get all users in the trust circle of logged in user (all public)', async function () {

        dbDsl.createContactConnection('1', '3', null, 666);
        dbDsl.createContactConnection('1', '4', null, 777);
        dbDsl.createContactConnection('4', '1');

        dbDsl.createContactConnection('6', '1');

        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile/trustCircle', {
            userId: '1', maxItems: 10, skip: 0
        });
        res.status.should.equal(200);
        res.body.peopleOfTrust.length.should.equal(2);
        res.body.peopleOfTrust[0].userId.should.equal("3");
        res.body.peopleOfTrust[0].name.should.equal("user Meier3");
        res.body.peopleOfTrust[0].personOfTrustSince.should.equal(666);
        res.body.peopleOfTrust[0].isPersonOfTrust.should.equal(true);
        res.body.peopleOfTrust[0].profileUrl.should.equal("profileImage/3/thumbnail.jpg");

        res.body.peopleOfTrust[1].userId.should.equal("4");
        res.body.peopleOfTrust[1].name.should.equal("user Meier4");
        res.body.peopleOfTrust[1].personOfTrustSince.should.equal(777);
        res.body.peopleOfTrust[1].isPersonOfTrust.should.equal(true);
        res.body.peopleOfTrust[1].profileUrl.should.equal("profileImage/4/thumbnail.jpg");

        res.body.numberOfPeopleOfTrust.should.equal(2);
        res.body.numberOfInvisiblePeopleOfTrust.should.equal(0);
    });

    it('Get all users in the trust circle of logged in user (User profile visible for Elyoos accounts)', async function () {

        dbDsl.createContactConnection('1', '3', null, 666);
        dbDsl.setUserPrivacy('3', {privacyMode: 'publicEl'});

        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile/trustCircle', {
            userId: '1', maxItems: 10, skip: 0
        });
        res.status.should.equal(200);
        res.body.peopleOfTrust.length.should.equal(1);
        res.body.peopleOfTrust[0].userId.should.equal("3");
        res.body.peopleOfTrust[0].name.should.equal("user Meier3");
        res.body.peopleOfTrust[0].personOfTrustSince.should.equal(666);
        res.body.peopleOfTrust[0].isPersonOfTrust.should.equal(true);
        res.body.peopleOfTrust[0].profileUrl.should.equal("profileImage/3/thumbnail.jpg");

        res.body.numberOfPeopleOfTrust.should.equal(1);
        res.body.numberOfInvisiblePeopleOfTrust.should.equal(0);
    });

    it('Get all users in the trust circle of logged in user (Contact profile only visible for persons of trust)', async function () {

        dbDsl.createContactConnection('1', '3');
        dbDsl.setUserPrivacy('3', {privacyMode: 'onlyContact'});

        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile/trustCircle', {
            userId: '1', maxItems: 10, skip: 0
        });
        res.status.should.equal(200);
        res.body.peopleOfTrust.length.should.equal(0);

        res.body.numberOfPeopleOfTrust.should.equal(0);
        res.body.numberOfInvisiblePeopleOfTrust.should.equal(1);
    });

    it('Get all users in the trust circle of a user requested with a public user (all public)', async function () {

        dbDsl.createContactConnection('1', '3');
        dbDsl.createContactConnection('1', '4');
        dbDsl.createContactConnection('4', '1');

        dbDsl.createContactConnection('6', '1');

        await dbDsl.sendToDb();

        let res = await requestHandler.get('/api/user/profile/trustCircle', {
            userId: '1', maxItems: 10, skip: 0
        });
        res.status.should.equal(200);
        res.body.peopleOfTrust.length.should.equal(2);
        res.body.peopleOfTrust[0].userId.should.equal("3");
        res.body.peopleOfTrust[0].name.should.equal("user Meier3");
        res.body.peopleOfTrust[0].isPersonOfTrust.should.equal(false);
        res.body.peopleOfTrust[0].profileUrl.should.equal("profileImage/3/thumbnail.jpg");

        res.body.peopleOfTrust[1].userId.should.equal("4");
        res.body.peopleOfTrust[1].name.should.equal("user Meier4");
        res.body.peopleOfTrust[1].isPersonOfTrust.should.equal(false);
        res.body.peopleOfTrust[1].profileUrl.should.equal("profileImage/4/thumbnail.jpg");

        res.body.numberOfPeopleOfTrust.should.equal(2);
        res.body.numberOfInvisiblePeopleOfTrust.should.equal(0);
    });

    it('Get all users in the trust circle of a user requested with a public user (Contact profile only visible for Elyoos accounts)', async function () {

        dbDsl.createContactConnection('1', '3');
        dbDsl.setUserPrivacy('3', {privacyMode: 'publicEl'});

        await dbDsl.sendToDb();

        let res = await requestHandler.get('/api/user/profile/trustCircle', {
            userId: '1', maxItems: 10, skip: 0
        });
        res.status.should.equal(200);
        res.body.peopleOfTrust.length.should.equal(0);

        res.body.numberOfPeopleOfTrust.should.equal(0);
        res.body.numberOfInvisiblePeopleOfTrust.should.equal(1);
    });

    it('Get all users in the trust circle of a user requested with a public user (User profile only visible for Elyoos accounts)', async function () {

        dbDsl.createContactConnection('1', '3');
        dbDsl.setUserPrivacy('1', {privacyMode: 'publicEl'});

        await dbDsl.sendToDb();

        let res = await requestHandler.get('/api/user/profile/trustCircle', {
            userId: '1', maxItems: 10, skip: 0
        });
        res.status.should.equal(200);
        res.body.peopleOfTrust.length.should.equal(0);

        res.body.numberOfPeopleOfTrust.should.equal(0);
        res.body.numberOfInvisiblePeopleOfTrust.should.equal(0);
    });

    it('Get all users in the trust circle of a user requested with a public user (Contact profile only visible for persons of trust)', async function () {

        dbDsl.createContactConnection('1', '3');
        dbDsl.setUserPrivacy('3', {privacyMode: 'onlyContact'});

        await dbDsl.sendToDb();

        let res = await requestHandler.get('/api/user/profile/trustCircle', {
            userId: '1', maxItems: 10, skip: 0
        });
        res.status.should.equal(200);
        res.body.peopleOfTrust.length.should.equal(0);

        res.body.numberOfPeopleOfTrust.should.equal(0);
        res.body.numberOfInvisiblePeopleOfTrust.should.equal(1);
    });

    it('Get all users in the trust circle of a user requested with a public user (User profile only visible for persons of trust)', async function () {

        dbDsl.createContactConnection('1', '3');
        dbDsl.setUserPrivacy('1', {privacyMode: 'onlyContact'});

        await dbDsl.sendToDb();

        let res = await requestHandler.get('/api/user/profile/trustCircle', {
            userId: '1', maxItems: 10, skip: 0
        });
        res.status.should.equal(200);
        res.body.peopleOfTrust.length.should.equal(0);

        res.body.numberOfPeopleOfTrust.should.equal(0);
        res.body.numberOfInvisiblePeopleOfTrust.should.equal(0);
    });
});
