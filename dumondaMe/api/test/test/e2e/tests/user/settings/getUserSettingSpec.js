'use strict';

let users = require('dumonda-me-server-test-util').user;
let requestHandler = require('dumonda-me-server-test-util').requestHandler;
let dbDsl = require('dumonda-me-server-test-util').dbDSL;

describe('Getting user setting', function () {

    beforeEach(async function () {
        await dbDsl.init(8);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get user settings when logged in', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/settings');
        res.status.should.equal(200);
        res.body.privacyMode.should.equal('public');
    });

    it('Get no user settings when not logged in', async function () {
        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/user/settings');
        res.status.should.equal(401);
    });
});
