'use strict';

const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const moment = require('moment');

describe('Getting all admins of an commitment', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(5);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createRegion('international', {de: 'InternationalDe', en: 'InternationalEn'});
        dbDsl.createRegion('region-1', {parentRegionId: 'international', de: 'Region1De', en: 'Region1En'});

        dbDsl.createCommitment('1', {
            adminId: '1', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700,
            website: 'https://www.example.org/', regions: ['region-1']
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Admins of an commitment', async function () {
        dbDsl.addAdminToCommitment({commitmentId: '1', userId: '3'});
        dbDsl.addAdminToCommitment({commitmentId: '1', userId: '4'});

        dbDsl.notificationRequestAdminOfCommitment('11',
            {commitmentId: '1', existingAdminId: '1', newAdminId: '3', created: 500, read: true});
        dbDsl.notificationRequestAdminOfCommitment('11',
            {commitmentId: '1', existingAdminId: '1', newAdminId: '3', created: 500});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/commitment/admin', {commitmentId: '1'});
        res.status.should.equal(200);

        res.body.admin.length.should.equals(3);
        res.body.admin[0].userId.should.equals('1');
        res.body.admin[0].name.should.equals('user Meier');
        res.body.admin[0].slug.should.equals('user-meier');
        res.body.admin[0].profileUrl.should.equal("profileImage/1/thumbnail.jpg");
        res.body.admin[0].isLoggedInUser.should.equal(true);

        res.body.admin[1].userId.should.equals('3');
        res.body.admin[1].name.should.equals('user Meier3');
        res.body.admin[1].slug.should.equals('user-meier3');
        res.body.admin[1].profileUrl.should.equal("profileImage/3/thumbnail.jpg");
        res.body.admin[1].isLoggedInUser.should.equal(false);

        res.body.admin[2].userId.should.equals('4');
        res.body.admin[2].name.should.equals('user Meier4');
        res.body.admin[2].slug.should.equals('user-meier4');
        res.body.admin[2].profileUrl.should.equal("profileImage/4/thumbnail.jpg");
        res.body.admin[2].isLoggedInUser.should.equal(false);

        res.body.adminRequested.length.should.equals(0);
    });

    it('Show user requested to be admin of commitment', async function () {

        dbDsl.notificationRequestAdminOfCommitment('11',
            {commitmentId: '1', existingAdminId: '1', newAdminId: '3', created: 500});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/commitment/admin', {commitmentId: '1'});
        res.status.should.equal(200);

        res.body.admin.length.should.equals(1);
        res.body.admin[0].userId.should.equals('1');

        res.body.adminRequested.length.should.equals(1);
        res.body.adminRequested[0].userId.should.equals('3');
        res.body.adminRequested[0].name.should.equals('user Meier3');
        res.body.adminRequested[0].slug.should.equals('user-meier3');
        res.body.adminRequested[0].profileUrl.should.equal("profileImage/3/thumbnail.jpg");
        res.body.adminRequested[0].isLoggedInUser.should.equal(false);
    });

    it('Hide user requested to be admin of commitment when notification is read', async function () {

        dbDsl.notificationRequestAdminOfCommitment('11',
            {commitmentId: '1', existingAdminId: '1', newAdminId: '3', created: 500, read: true});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/commitment/admin', {commitmentId: '1'});
        res.status.should.equal(200);

        res.body.admin.length.should.equals(1);
        res.body.admin[0].userId.should.equals('1');

        res.body.adminRequested.length.should.equals(0);
    });

    it('Show only admins if user is admin of commitment', async function () {
        dbDsl.createCommitment('2', {
            adminId: '2', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700,
            website: 'https://www.example.org/', regions: ['region-1']
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/commitment/admin', {commitmentId: '2'});
        res.status.should.equal(400);
    });

});
