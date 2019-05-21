'use strict';

const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;

describe('Search user for adding to commitment', function () {

    beforeEach(async function () {
        await dbDsl.init(4);

        dbDsl.createRegion('international', {de: 'InternationalDe', en: 'InternationalEn'});
        dbDsl.createRegion('region-1', {parentRegionId: 'international', de: 'Region1De', en: 'Region1En'});

        dbDsl.createCommitment('1', {
            adminId: '2', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700,
            website: 'https://www.example.org/', regions: ['region-1']
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Search user who is already administrator of the commitment', async function () {
        dbDsl.addAdminToCommitment({commitmentId: '1', userId: '1'});
        dbDsl.setUserName('2', {name: 'Hans Wurst'});
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/commitment/search/user',
            {query: 'Hans Wurst', commitmentId: '1', skip: 0, limit: 10});
        res.status.should.equals(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(1);
        res.body.users[0].userId.should.equals('2');
        res.body.users[0].name.should.equals('Hans Wurst');
        res.body.users[0].slug.should.equals('hans-wurst');
        res.body.users[0].userImage.should.equals('profileImage/2/profilePreview.jpg');
        res.body.users[0].isTrustUser.should.equals(false);
        res.body.users[0].isAdminOfCommitment.should.equals(true);
        res.body.users[0].isRequestAdminOfCommitmentActive.should.equals(false);
    });

    it('Search user who is not administrator of the commitment', async function () {
        dbDsl.notificationRequestAdminOfCommitment('10',
            {commitmentId: '1', existingAdminId: '1', newAdminId: '3', created: 500, read: true});
        dbDsl.addAdminToCommitment({commitmentId: '1', userId: '1'});
        dbDsl.setUserName('3', {name: 'Hans Wurst'});
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/commitment/search/user',
            {query: 'Hans Wurst', commitmentId: '1', skip: 0, limit: 10});
        res.status.should.equals(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(1);
        res.body.users[0].userId.should.equals('3');
        res.body.users[0].name.should.equals('Hans Wurst');
        res.body.users[0].slug.should.equals('hans-wurst');
        res.body.users[0].userImage.should.equals('profileImage/3/profilePreview.jpg');
        res.body.users[0].isTrustUser.should.equals(false);
        res.body.users[0].isAdminOfCommitment.should.equals(false);
        res.body.users[0].isRequestAdminOfCommitmentActive.should.equals(false);
    });

    it('Don not show logged in user', async function () {
        dbDsl.addAdminToCommitment({commitmentId: '1', userId: '1'});
        dbDsl.setUserName('1', {name: 'Hans Wurst'});
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/commitment/search/user',
            {query: 'Hans Wurst', commitmentId: '1', skip: 0, limit: 10});
        res.status.should.equals(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(0);
    });

    it('Hide user with privacy set to private where logged in user is not added to trust circle', async function () {
        dbDsl.addAdminToCommitment({commitmentId: '1', userId: '1'});
        dbDsl.setUserName('3', {name: 'Hans Wurst'});
        dbDsl.setUserPrivacy('3', {privacyMode: 'onlyContact'});
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/commitment/search/user',
            {query: 'Hans Wurst', commitmentId: '1', skip: 0, limit: 10});
        res.status.should.equals(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(0);
    });

    it('Show user with privacy set to private where logged in user is added to trust circle', async function () {
        dbDsl.addAdminToCommitment({commitmentId: '1', userId: '1'});
        dbDsl.setUserName('3', {name: 'Hans Wurst'});
        dbDsl.setUserPrivacy('3', {privacyMode: 'onlyContact'});
        dbDsl.createContactConnection('3', '1');
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/commitment/search/user',
            {query: 'Hans Wurst', commitmentId: '1', skip: 0, limit: 10});
        res.status.should.equals(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(1);
        res.body.users[0].userId.should.equals('3');
        res.body.users[0].name.should.equals('Hans Wurst');
        res.body.users[0].slug.should.equals('hans-wurst');
        res.body.users[0].userImage.should.equals('profileImage/3/profilePreview.jpg');
        res.body.users[0].isTrustUser.should.equals(false);
        res.body.users[0].isAdminOfCommitment.should.equals(false);
        res.body.users[0].isRequestAdminOfCommitmentActive.should.equals(false);
    });

    it('Show user with privacy to visible only on platform', async function () {
        dbDsl.addAdminToCommitment({commitmentId: '1', userId: '1'});
        dbDsl.setUserName('3', {name: 'Hans Wurst'});
        dbDsl.setUserPrivacy('3', {privacyMode: 'publicEl'});
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/commitment/search/user',
            {query: 'Hans Wurst', commitmentId: '1', skip: 0, limit: 10});
        res.status.should.equals(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(1);
        res.body.users[0].userId.should.equals('3');
        res.body.users[0].name.should.equals('Hans Wurst');
        res.body.users[0].slug.should.equals('hans-wurst');
        res.body.users[0].userImage.should.equals('profileImage/3/profilePreview.jpg');
        res.body.users[0].isTrustUser.should.equals(false);
        res.body.users[0].isAdminOfCommitment.should.equals(false);
        res.body.users[0].isRequestAdminOfCommitmentActive.should.equals(false);
    });

    it('Show user in trust circle first', async function () {
        dbDsl.addAdminToCommitment({commitmentId: '1', userId: '1'});
        dbDsl.setUserName('3', {name: 'Hans Wurst'});
        dbDsl.setUserName('4', {name: 'Hans Wurst'});
        dbDsl.createContactConnection('1', '4');
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/commitment/search/user',
            {query: 'Hans Wurst', commitmentId: '1', skip: 0, limit: 10});
        res.status.should.equals(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(2);
        res.body.users[0].userId.should.equals('4');
        res.body.users[0].name.should.equals('Hans Wurst');
        res.body.users[0].slug.should.equals('hans-wurst');
        res.body.users[0].userImage.should.equals('profileImage/4/profilePreview.jpg');
        res.body.users[0].isTrustUser.should.equals(true);
        res.body.users[0].isAdminOfCommitment.should.equals(false);
        res.body.users[0].isRequestAdminOfCommitmentActive.should.equals(false);

        res.body.users[1].userId.should.equals('3');
        res.body.users[1].name.should.equals('Hans Wurst');
        res.body.users[1].slug.should.equals('hans-wurst');
        res.body.users[1].userImage.should.equals('profileImage/3/profilePreview.jpg');
        res.body.users[1].isTrustUser.should.equals(false);
        res.body.users[1].isAdminOfCommitment.should.equals(false);
        res.body.users[1].isRequestAdminOfCommitmentActive.should.equals(false);
    });

    it('Show user with already sent add as admin to commitment request', async function () {
        dbDsl.addAdminToCommitment({commitmentId: '1', userId: '1'});
        dbDsl.setUserName('3', {name: 'Hans Wurst'});
        dbDsl.setUserPrivacy('3', {privacyMode: 'publicEl'});
        dbDsl.notificationRequestAdminOfCommitment('10',
            {commitmentId: '1', existingAdminId: '1', newAdminId: '3', created: 500});
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/commitment/search/user',
            {query: 'Hans Wurst', commitmentId: '1', skip: 0, limit: 10});
        res.status.should.equals(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(1);
        res.body.users[0].userId.should.equals('3');
        res.body.users[0].name.should.equals('Hans Wurst');
        res.body.users[0].slug.should.equals('hans-wurst');
        res.body.users[0].userImage.should.equals('profileImage/3/profilePreview.jpg');
        res.body.users[0].isTrustUser.should.equals(false);
        res.body.users[0].isAdminOfCommitment.should.equals(false);
        res.body.users[0].isRequestAdminOfCommitmentActive.should.equals(true);
    });

    it('Abort search when logged in user is not administrator of commitment', async function () {
        dbDsl.setUserName('2', {name: 'Hans Wurst'});
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/commitment/search/user',
            {query: 'Hans Wurst', commitmentId: '1', skip: 0, limit: 10});
        res.status.should.equals(400);
    });

    it('Only logged in user is allowed to use search', async function () {
        dbDsl.setUserName('2', {name: 'Hans Wurst'});
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        let res = await requestHandler.get('/api/user/commitment/search/user',
            {query: 'Hans Wurst', commitmentId: '1', skip: 0, limit: 10});
        res.status.should.equals(401);
    });
});
