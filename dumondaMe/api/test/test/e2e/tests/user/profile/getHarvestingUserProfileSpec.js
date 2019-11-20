'use strict';

let users = require('dumonda-me-server-test-util').user;
let requestHandler = require('dumonda-me-server-test-util').requestHandler;
let should = require('chai').should();
let dbDsl = require('dumonda-me-server-test-util').dbDSL;

describe('Getting profile of an harvesting user', function () {

    beforeEach(async function () {
        await dbDsl.init(3);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get profile of logged in harvesting user', async function () {
        dbDsl.setUserIsHarvestingUser('1', {start: 100, end: 200, link: 'https://www.link.ch', address: 'Milky Way'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile', {guiLanguage: 'de', languages: ['de']});
        res.status.should.equal(200);
        res.body.userId.should.equal('1');
        res.body.forename.should.equal('user');
        res.body.surname.should.equal('Meier');
        res.body.userDescription.should.equal('superman');
        res.body.start.should.equal(100);
        res.body.end.should.equal(200);
        res.body.link.should.equal('https://www.link.ch');
        res.body.address.should.equal('Milky Way');
        res.body.isLoggedInUser.should.equal(true);
        res.body.isOnlineHarvesting.should.equal(false);
        res.body.isHarvestingUser.should.equal(true);
        res.body.profileImage.should.equal('profileImage/1/profile.jpg');
        should.not.exist(res.body.password);
        should.not.exist(res.body.numberOfPeopleOfTrust);
        should.not.exist(res.body.numberOfPeopleTrustUser);
        should.not.exist(res.body.adminOfCommitments);
        should.not.exist(res.body.peopleOfTrust);
        should.not.exist(res.body.peopleTrustUser);
    });

    it('Get profile of logged in harvesting user (online harvesting)', async function () {
        dbDsl.setUserIsHarvestingUser('1', {
            start: 100, end: 200, link: 'https://www.link.ch', onlineHarvesting: true
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile', {guiLanguage: 'de', languages: ['de']});
        res.status.should.equal(200);
        res.body.userId.should.equal('1');
        res.body.forename.should.equal('user');
        res.body.surname.should.equal('Meier');
        res.body.userDescription.should.equal('superman');
        res.body.start.should.equal(100);
        res.body.end.should.equal(200);
        res.body.link.should.equal('https://www.link.ch');
        should.not.exist(res.body.address);
        res.body.isLoggedInUser.should.equal(true);
        res.body.isOnlineHarvesting.should.equal(true);
        res.body.isHarvestingUser.should.equal(true);
        res.body.profileImage.should.equal('profileImage/1/profile.jpg');
        should.not.exist(res.body.password);
        should.not.exist(res.body.numberOfPeopleOfTrust);
        should.not.exist(res.body.numberOfPeopleTrustUser);
        should.not.exist(res.body.adminOfCommitments);
        should.not.exist(res.body.peopleOfTrust);
        should.not.exist(res.body.peopleTrustUser);
    });

    it('Get profile data of not logged in harvesting user', async function () {
        dbDsl.setUserIsHarvestingUser('1', {start: 100, end: 200, link: 'https://www.link.ch', address: 'Milky Way'});
        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/user/profile', {guiLanguage: 'de', languages: ['de']});
        res.status.should.equal(401);
    });

    it('Get profile data of another harvesting user', async function () {
        dbDsl.setUserIsHarvestingUser('2', {start: 100, end: 200, link: 'https://www.link.ch', address: 'Milky Way'});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile', {userId: '2', guiLanguage: 'de', languages: ['de']});
        res.status.should.equal(200);
        res.body.userId.should.equal('2');
        res.body.forename.should.equal('user');
        res.body.surname.should.equal('Meier2');
        res.body.userDescription.should.equal('superman2');
        res.body.start.should.equal(100);
        res.body.end.should.equal(200);
        res.body.link.should.equal('https://www.link.ch');
        res.body.address.should.equal('Milky Way');
        res.body.isLoggedInUser.should.equal(false);
        res.body.isOnlineHarvesting.should.equal(false);
        res.body.isHarvestingUser.should.equal(true);

        should.not.exist(res.body.password);
        should.not.exist(res.body.numberOfPeopleOfTrust);
        should.not.exist(res.body.numberOfPeopleTrustUser);
        should.not.exist(res.body.adminOfCommitments);
        should.not.exist(res.body.peopleOfTrust);
        should.not.exist(res.body.peopleTrustUser);
    });

    it('Get profile data of another harvesting user (online harvesting)', async function () {
        dbDsl.setUserIsHarvestingUser('2', {start: 100, end: 200, link: 'https://www.link.ch', onlineHarvesting: true});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile', {userId: '2', guiLanguage: 'de', languages: ['de']});
        res.status.should.equal(200);
        res.body.userId.should.equal('2');
        res.body.forename.should.equal('user');
        res.body.surname.should.equal('Meier2');
        res.body.userDescription.should.equal('superman2');
        res.body.start.should.equal(100);
        res.body.end.should.equal(200);
        res.body.link.should.equal('https://www.link.ch');
        should.not.exist(res.body.address);
        res.body.isLoggedInUser.should.equal(false);
        res.body.isOnlineHarvesting.should.equal(true);
        res.body.isHarvestingUser.should.equal(true);

        should.not.exist(res.body.password);
        should.not.exist(res.body.numberOfPeopleOfTrust);
        should.not.exist(res.body.numberOfPeopleTrustUser);
        should.not.exist(res.body.adminOfCommitments);
        should.not.exist(res.body.peopleOfTrust);
        should.not.exist(res.body.peopleTrustUser);
    });

    it('Get profile data of a harvesting user (Not logged in)', async function () {
        dbDsl.setUserIsHarvestingUser('2', {start: 100, end: 200, link: 'https://www.link.ch', address: 'Milky Way'});

        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/user/profile', {userId: '2', guiLanguage: 'de', languages: ['de']});
        res.status.should.equal(200);
        res.body.userId.should.equal('2');
        res.body.forename.should.equal('user');
        res.body.surname.should.equal('Meier2');
        res.body.userDescription.should.equal('superman2');
        res.body.start.should.equal(100);
        res.body.end.should.equal(200);
        res.body.link.should.equal('https://www.link.ch');
        res.body.address.should.equal('Milky Way');
        res.body.isLoggedInUser.should.equal(false);
        res.body.isOnlineHarvesting.should.equal(false);
        res.body.isHarvestingUser.should.equal(true);
        res.body.profileImage.should.equal('profileImage/2/profile.jpg');

        should.not.exist(res.body.password);
        should.not.exist(res.body.numberOfPeopleOfTrust);
        should.not.exist(res.body.numberOfPeopleTrustUser);
        should.not.exist(res.body.adminOfCommitments);
        should.not.exist(res.body.peopleOfTrust);
        should.not.exist(res.body.peopleTrustUser);
    });

    it('Get profile data of a harvesting user (Not logged in and online harvesting)', async function () {
        dbDsl.setUserIsHarvestingUser('2', {start: 100, end: 200, link: 'https://www.link.ch', onlineHarvesting: true});

        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/user/profile', {userId: '2', guiLanguage: 'de', languages: ['de']});
        res.status.should.equal(200);
        res.body.userId.should.equal('2');
        res.body.forename.should.equal('user');
        res.body.surname.should.equal('Meier2');
        res.body.userDescription.should.equal('superman2');
        res.body.start.should.equal(100);
        res.body.end.should.equal(200);
        res.body.link.should.equal('https://www.link.ch');
        should.not.exist(res.body.address);
        res.body.isLoggedInUser.should.equal(false);
        res.body.isOnlineHarvesting.should.equal(true);
        res.body.isHarvestingUser.should.equal(true);
        res.body.profileImage.should.equal('profileImage/2/profile.jpg');

        should.not.exist(res.body.password);
        should.not.exist(res.body.numberOfPeopleOfTrust);
        should.not.exist(res.body.numberOfPeopleTrustUser);
        should.not.exist(res.body.adminOfCommitments);
        should.not.exist(res.body.peopleOfTrust);
        should.not.exist(res.body.peopleTrustUser);
    });
});
