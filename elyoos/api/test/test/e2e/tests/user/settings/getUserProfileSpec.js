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

    it('Get user data when logged in', async function () {
        dbDsl.createContactConnection('1', '2');
        dbDsl.createContactConnection('1', '3');
        dbDsl.createContactConnection('1', '4');
        dbDsl.createContactConnection('1', '5');

        dbDsl.createContactConnection('6', '1');
        dbDsl.createContactConnection('7', '1');

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/settings/profile');
        res.status.should.equal(200);
        res.body.email.should.equal('user@irgendwo.ch');
        res.body.forename.should.equal('user');
        res.body.surname.should.equal('Meier');
        should.not.exist(res.body.password);
        res.body.profileImage.should.equal('profileImage/1/profile.jpg');
        res.body.numberOfContacts.should.equal(4);
        res.body.numberOfContacting.should.equal(2);
    });

    it('Get no user data when not logged in', async function () {
        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/user/settings/profile');
        res.status.should.equal(401);
    });
});
