'use strict';

const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const should = require('chai').should();

describe('Privacy setting for user search', function () {

    beforeEach(async function () {
        await dbDsl.init(2);

        dbDsl.setUserName('2', {name: 'Hans Wurst'});

    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Hide user when privacy setting to publicEl and not logged in', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'publicEl'});
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        let res = await requestHandler.get('/api/search', {query: 'Hans Wurst', lang: 'de'});
        res.status.should.equal(200);
        res.body.users.length.should.equals(0);
    });

    it('Hide user when privacy setting to onlyContact and not logged in', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'onlyContact'});
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        let res = await requestHandler.get('/api/search', {query: 'Hans Wurst', lang: 'de'});
        res.status.should.equal(200);
        res.body.users.length.should.equals(0);
    });

    it('Show user when privacy setting to public and not logged in', async function () {
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        let res = await requestHandler.get('/api/search', {query: 'Hans Wurst', lang: 'de'});
        res.status.should.equal(200);
        res.body.users.length.should.equals(1);
        res.body.users[0].userId.should.equals('2');
        res.body.users[0].name.should.equals('Hans Wurst');
        res.body.users[0].slug.should.equals('hans-wurst');
        res.body.users[0].userImage.should.equals('profileImage/2/profilePreview.jpg');
        res.body.users[0].isLoggedInUser.should.equals(false);
        res.body.users[0].isTrustUser.should.equals(false);
        res.body.users[0].isAnonymous.should.equals(false);
    });

    it('Show user as anonymous when privacy setting to onlyContact', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'onlyContact'});
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/search', {query: 'Hans Wurst', lang: 'de'});
        res.status.should.equal(200);
        res.body.users.length.should.equals(1);
        res.body.users[0].userId.should.equals('2');
        res.body.users[0].name.should.equals('Hans Wurst');
        should.not.exist(res.body.users[0].slug);
        res.body.users[0].userImage.should.equals('profileImage/default/profilePreview.jpg');
        res.body.users[0].isLoggedInUser.should.equals(false);
        res.body.users[0].isTrustUser.should.equals(false);
        res.body.users[0].isAnonymous.should.equals(true);
    });

    it('Show user when privacy setting to onlyContact', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'onlyContact'});
        dbDsl.createContactConnection('2', '1');
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/search', {query: 'Hans Wurst', lang: 'de'});
        res.status.should.equal(200);
        res.body.users.length.should.equals(1);
        res.body.users[0].userId.should.equals('2');
        res.body.users[0].name.should.equals('Hans Wurst');
        res.body.users[0].slug.should.equals('hans-wurst');
        res.body.users[0].userImage.should.equals('profileImage/2/profilePreview.jpg');
        res.body.users[0].isLoggedInUser.should.equals(false);
        res.body.users[0].isTrustUser.should.equals(false);
        res.body.users[0].isAnonymous.should.equals(false);
    });
});
