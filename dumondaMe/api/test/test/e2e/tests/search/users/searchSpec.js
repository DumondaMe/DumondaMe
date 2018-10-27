'use strict';

const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;

describe('Search for users with fuzzy match', function () {

    beforeEach(async function () {
        await dbDsl.init(10);
        dbDsl.setUserName('2', {name: 'Hans Wurst'});
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Search users when not logged in', async function () {
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        let res = await requestHandler.get('/api/search/users', {query: 'Hans Wurst', lang: 'de', skip: 0, limit: 10});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(1);
        res.body.users[0].userId.should.equals('2');
        res.body.users[0].name.should.equals('Hans Wurst');
        res.body.users[0].slug.should.equals('hans-wurst');
        res.body.users[0].userImage.should.equals('profileImage/2/profilePreview.jpg');
        res.body.users[0].isLoggedInUser.should.equals(false);
        res.body.users[0].isTrustUser.should.equals(false);
        res.body.users[0].isAnonymous.should.equals(false);
    });

    it('Search users when logged in', async function () {
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/search/users', {query: 'Hans Wurst', lang: 'de', skip: 0, limit: 10});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(1);
        res.body.users[0].userId.should.equals('2');
        res.body.users[0].name.should.equals('Hans Wurst');
        res.body.users[0].slug.should.equals('hans-wurst');
        res.body.users[0].userImage.should.equals('profileImage/2/profilePreview.jpg');
        res.body.users[0].isLoggedInUser.should.equals(false);
        res.body.users[0].isTrustUser.should.equals(false);
        res.body.users[0].isAnonymous.should.equals(false);
    });

    it('Has more users', async function () {
        for (let index = 2; index < 9; index++) {
            dbDsl.setUserName(`${index}`, {name: 'Hans Wurst'});
        }
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/search/users', {query: 'Hans Wurst', lang: 'de', skip: 1, limit: 4});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(true);
        res.body.users.length.should.equals(4);
    });
});
