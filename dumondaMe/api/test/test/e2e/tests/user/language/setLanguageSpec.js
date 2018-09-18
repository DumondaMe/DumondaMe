'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let should = require('chai').should();
let moment = require('moment');

describe('Setting the language of the user', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(3);
        startTime = Math.floor(moment.utc().valueOf() / 1000);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Setting language when user is logged out', async function () {
        await dbDsl.sendToDb();
        let res = await requestHandler.put('/api/user/language/de');
        res.status.should.equal(200);
    });

    it('Setting language when user is logged in', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/language/en');
        res.status.should.equal(200);

        let resp = await db.cypher().match("(user:User {userId: '1'})")
            .return(`user`).end().send();
        resp.length.should.equals(1);
        resp[0].user.language.should.equals('en');
    });
});
