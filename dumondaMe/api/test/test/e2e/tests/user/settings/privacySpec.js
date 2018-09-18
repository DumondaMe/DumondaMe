'use strict';

let requestHandler = require('elyoos-server-test-util').requestHandler;
let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;

describe('Setting the privacy settings', function () {

    beforeEach(async function () {
        await dbDsl.init(1);
        await dbDsl.sendToDb();
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Change the privacy settings to onlyContact', async function () {
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/settings/privacy', {privacyMode: 'onlyContact'});
        res.status.should.equal(200);
        let user = await db.cypher().match(`(user:User {userId: '1'})`).return('user.privacyMode AS privacyMode').end().send();
        user[0].privacyMode.should.equals('onlyContact');
    });

    it('Change the privacy settings to public', async function () {
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/settings/privacy', {privacyMode: 'public'});
        res.status.should.equal(200);
        let user = await db.cypher().match(`(user:User {userId: '1'})`).return('user.privacyMode AS privacyMode').end().send();
        user[0].privacyMode.should.equals('public');
    });

    it('Change the privacy settings to publicEl', async function () {
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/settings/privacy', {privacyMode: 'publicEl'});
        res.status.should.equal(200);
        let user = await db.cypher().match(`(user:User {userId: '1'})`).return('user.privacyMode AS privacyMode').end().send();
        user[0].privacyMode.should.equals('publicEl');
    });

    it('Invalid privacy mode', async function () {
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/settings/privacy', {privacyMode: 'irgendwas'});
        res.status.should.equal(400);
        let user = await db.cypher().match(`(user:User {userId: '1'})`).return('user.privacyMode AS privacyMode').end().send();
        user[0].privacyMode.should.equals('public');
    });

    it('Not logged in user', async function () {
        let res = await requestHandler.put('/api/user/settings/privacy', {privacyMode: 'irgendwas'});
        res.status.should.equal(401);
        let user = await db.cypher().match(`(user:User {userId: '1'})`).return('user.privacyMode AS privacyMode').end().send();
        user[0].privacyMode.should.equals('public');
    });
});
