'use strict';

let users = require('dumonda-me-server-test-util').user;
let requestHandler = require('dumonda-me-server-test-util').requestHandler;
let dbDsl = require('dumonda-me-server-test-util').dbDSL;

describe('Getting user profile image', function () {

    beforeEach(async function () {
        await dbDsl.init(3);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get profile image of logged in user', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile/image');
        res.body.profileImage.should.equal('profileImage/1/profile.jpg');
    });

    it('Get profile image of not logged in user', async function () {
        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/user/profile/image');
        res.status.should.equal(401);
    });
});
