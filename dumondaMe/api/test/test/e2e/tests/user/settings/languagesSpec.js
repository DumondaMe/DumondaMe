'use strict';

let requestHandler = require('dumonda-me-server-test-util').requestHandler;
let users = require('dumonda-me-server-test-util').user;
let db = require('dumonda-me-server-test-util').db;
let dbDsl = require('dumonda-me-server-test-util').dbDSL;

describe('Set the languages the user understands', function () {

    beforeEach(async function () {
        await dbDsl.init(1);
        await dbDsl.sendToDb();
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Change the languages to english and german', async function () {
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/settings/languages',
            {languages: ['en', 'de']});
        res.status.should.equal(200);
        let user = await db.cypher().match(`(user:User {userId: '1'})`)
            .return('user.languages AS languages').end().send();
        user[0].languages.length.should.equals(2);
        user[0].languages.should.include('en');
        user[0].languages.should.include('de');
    });

    it('Not logged in user', async function () {
        let res = await requestHandler.put('/api/user/settings/languages',
            {languages: ['en', 'de']});
        res.status.should.equal(401);
        let user = await db.cypher().match(`(user:User {userId: '1'})`)
            .return('user.languages AS languages').end().send();
        user[0].languages.length.should.equals(1);
        user[0].languages.should.include('de');
    });
});
