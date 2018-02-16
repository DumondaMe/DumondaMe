'use strict';

let users = require('elyoos-server-test-util').user;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;

describe('Change user profile data', function () {

    beforeEach(async function () {
        await dbDsl.init(8);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Post new user data when not logged in', async function () {
        let user = {
            forename: 'user',
            surname: 'surname'
        };

        await dbDsl.sendToDb();
        let res = await requestHandler.post('/api/user/settings/profile', user, null);
        res.status.should.equal(401);
    });

    it('Post valid user data', async function () {
        let user = {
            forename: 'Hans',
            surname: 'Muster'
        };

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/settings/profile', user);
        res.status.should.equal(200);
        res = await  db.cypher().match("(user:User {userId: '1'})")
            .return('user').end().send();
        res.length.should.equals(1);
        res[0].user.forename.should.equals('Hans');
        res[0].user.surname.should.equals('Muster');
    });
});
