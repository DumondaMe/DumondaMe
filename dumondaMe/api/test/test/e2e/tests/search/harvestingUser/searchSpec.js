'use strict';

const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;

describe('Search for harvesting users with fuzzy match', function () {

    beforeEach(async function () {
        await dbDsl.init(10);
        dbDsl.setUserName('2', {name: 'Hans Wurst'});
        dbDsl.setUserIsHarvestingUser(`2`, {start: 100, end: 200, link: 'https://www.link.ch', address: 'Milky Way'});
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Search harvesting users when not logged in', async function () {
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        let res = await requestHandler.get('/api/search/harvestingUsers', {query: 'Hans Wurst', lang: 'de', skip: 0, limit: 10});
        res.status.should.equal(200);
        res.body.hasMoreHarvestingUsers.should.equals(false);
        res.body.harvestingUsers.length.should.equals(1);
        res.body.harvestingUsers[0].userId.should.equals('2');
        res.body.harvestingUsers[0].name.should.equals('Hans Wurst');
        res.body.harvestingUsers[0].description.should.equals('superman2');
        res.body.harvestingUsers[0].start.should.equals(100);
        res.body.harvestingUsers[0].end.should.equals(200);
        res.body.harvestingUsers[0].slug.should.equals('hans-wurst');
        res.body.harvestingUsers[0].userImage.should.equals('profileImage/2/profilePreview.jpg');
        res.body.harvestingUsers[0].isLoggedInUser.should.equals(false);
    });

    it('Search harvesting users when logged in', async function () {
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/search/harvestingUsers', {query: 'Hans Wurst', lang: 'de', skip: 0, limit: 10});
        res.status.should.equal(200);
        res.body.hasMoreHarvestingUsers.should.equals(false);
        res.body.harvestingUsers.length.should.equals(1);
        res.body.harvestingUsers[0].userId.should.equals('2');
        res.body.harvestingUsers[0].name.should.equals('Hans Wurst');
        res.body.harvestingUsers[0].description.should.equals('superman2');
        res.body.harvestingUsers[0].start.should.equals(100);
        res.body.harvestingUsers[0].end.should.equals(200);
        res.body.harvestingUsers[0].slug.should.equals('hans-wurst');
        res.body.harvestingUsers[0].userImage.should.equals('profileImage/2/profilePreview.jpg');
        res.body.harvestingUsers[0].isLoggedInUser.should.equals(false);
    });

    it('Has more harvesting users', async function () {
        for (let index = 2; index < 10; index++) {
            dbDsl.setUserName(`${index}`, {name: 'Hans Wurst'});
            dbDsl.setUserIsHarvestingUser(`${index}`, {start: 100, end: 200, link: 'https://www.link.ch', address: 'Milky Way'});
        }
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/search/harvestingUsers', {query: 'Hans Wurst', lang: 'de', skip: 1, limit: 4});
        res.status.should.equal(200);
        res.body.hasMoreHarvestingUsers.should.equals(true);
        res.body.harvestingUsers.length.should.equals(4);
    });
});
