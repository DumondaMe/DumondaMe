'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Get people who trust user', function () {

    beforeEach(async function () {
        await dbDsl.init(9);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get people who trust user (all public)', async function () {

        dbDsl.createContactConnection('3', '2');
        dbDsl.createContactConnection('4', '2');
        dbDsl.createContactConnection('1', '4');

        dbDsl.createContactConnection('2', '6');

        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile/peopleTrustUser', {
            userId: '2', maxItems: 10, skip: 0
        });
        res.status.should.equal(200);
        res.body.peopleTrustUser.length.should.equal(2);
        res.body.peopleTrustUser[0].userId.should.equal("3");
        res.body.peopleTrustUser[0].name.should.equal("user Meier3");
        res.body.peopleTrustUser[0].isPersonOfTrust.should.equal(false);
        res.body.peopleTrustUser[0].profileUrl.should.equal("profileImage/3/thumbnail.jpg");

        res.body.peopleTrustUser[1].userId.should.equal("4");
        res.body.peopleTrustUser[1].name.should.equal("user Meier4");
        res.body.peopleTrustUser[1].isPersonOfTrust.should.equal(true);
        res.body.peopleTrustUser[1].profileUrl.should.equal("profileImage/4/thumbnail.jpg");

        res.body.numberOfPeopleTrustUser.should.equal(2);
        res.body.numberOfInvisiblePeopleTrustUser.should.equal(0);
    });

    it('Get people who trust user (Profile visible for Elyoos accounts, visible)', async function () {

        dbDsl.createContactConnection('3', '2');
        dbDsl.setUserPrivacy('3', {privacyMode: 'publicEl'});

        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile/peopleTrustUser', {
            userId: '2', maxItems: 10, skip: 0
        });
        res.status.should.equal(200);
        res.body.peopleTrustUser.length.should.equal(1);
        res.body.peopleTrustUser[0].userId.should.equal("3");
        res.body.peopleTrustUser[0].name.should.equal("user Meier3");
        res.body.peopleTrustUser[0].isPersonOfTrust.should.equal(false);
        res.body.peopleTrustUser[0].profileUrl.should.equal("profileImage/3/thumbnail.jpg");

        res.body.numberOfPeopleTrustUser.should.equal(1);
        res.body.numberOfInvisiblePeopleTrustUser.should.equal(0);
    });

    it('Get people who trust user (Profile visible for Elyoos accounts, invisible)', async function () {

        dbDsl.createContactConnection('3', '2');
        dbDsl.setUserPrivacy('3', {privacyMode: 'publicEl'});

        await dbDsl.sendToDb();

        let res = await requestHandler.get('/api/user/profile/peopleTrustUser', {
            userId: '2', maxItems: 10, skip: 0
        });
        res.status.should.equal(200);
        res.body.peopleTrustUser.length.should.equal(0);

        res.body.numberOfPeopleTrustUser.should.equal(0);
        res.body.numberOfInvisiblePeopleTrustUser.should.equal(1);
    });

    it('Get people who trust user (Profile is only visible for persons of trust, visible)', async function () {

        dbDsl.createContactConnection('3', '2');
        dbDsl.createContactConnection('3', '1');
        dbDsl.setUserPrivacy('3', {privacyMode: 'onlyContact'});

        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile/peopleTrustUser', {
            userId: '2', maxItems: 10, skip: 0
        });
        res.status.should.equal(200);
        res.body.peopleTrustUser.length.should.equal(1);
        res.body.peopleTrustUser[0].userId.should.equal("3");
        res.body.peopleTrustUser[0].name.should.equal("user Meier3");
        res.body.peopleTrustUser[0].isPersonOfTrust.should.equal(false);
        res.body.peopleTrustUser[0].profileUrl.should.equal("profileImage/3/thumbnail.jpg");

        res.body.numberOfPeopleTrustUser.should.equal(1);
        res.body.numberOfInvisiblePeopleTrustUser.should.equal(0);
    });

    it('Get people who trust user (Profile is only visible for persons of trust, invisible)', async function () {

        dbDsl.createContactConnection('3', '2');
        dbDsl.setUserPrivacy('3', {privacyMode: 'onlyContact'});

        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile/peopleTrustUser', {
            userId: '2', maxItems: 10, skip: 0
        });
        res.status.should.equal(200);
        res.body.peopleTrustUser.length.should.equal(0);

        res.body.numberOfPeopleTrustUser.should.equal(0);
        res.body.numberOfInvisiblePeopleTrustUser.should.equal(1);
    });

    it('Get people who trust user (User profile only visible for persons of trust)', async function () {

        dbDsl.createContactConnection('3', '2');
        dbDsl.setUserPrivacy('2', {privacyMode: 'onlyContact'});

        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile/peopleTrustUser', {
            userId: '2', maxItems: 10, skip: 0
        });
        res.status.should.equal(401);
    });
});
