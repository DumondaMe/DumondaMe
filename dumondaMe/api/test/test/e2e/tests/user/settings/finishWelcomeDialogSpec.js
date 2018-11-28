'use strict';

let requestHandler = require('dumonda-me-server-test-util').requestHandler;
let users = require('dumonda-me-server-test-util').user;
let db = require('dumonda-me-server-test-util').db;
let dbDsl = require('dumonda-me-server-test-util').dbDSL;
let should = require('chai').should();

describe('Set the finish welcome dialog property', function () {

    beforeEach(async function () {
        await dbDsl.init(1);
        await dbDsl.sendToDb();
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Change the languages to english and german', async function () {
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/settings/finishWelcome');
        res.status.should.equal(200);
        let user = await db.cypher().match(`(user:User {userId: '1'})`)
            .return('user.infoState AS infoState').end().send();
        user[0].infoState.should.equals(1);
    });

    it('Not logged in user', async function () {
        let res = await requestHandler.post('/api/user/settings/finishWelcome');
        res.status.should.equal(401);
        let user = await db.cypher().match(`(user:User {userId: '1'})`)
            .return('user.infoState AS infoState').end().send();
        should.not.exist(user[0].infoState);
    });
});
