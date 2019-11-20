'use strict';

const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const moment = require('moment');

describe('Get actual harvesting events', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(6);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.setUserIsHarvestingUser('2', {start: startTime - 200, end: startTime - 100, link: 'https://www.link.ch', address: 'Milky Way'});
        dbDsl.setUserIsHarvestingUser('3', {start: startTime - 150, end: startTime - 120, link: 'https://www.link2.ch', address: 'Milky Way2'});
        dbDsl.setUserIsHarvestingUser('4', {start: startTime + 150, end: startTime + 200, link: 'https://www.link3.ch', address: 'Milky Way3'});
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get actual harvesting events as logged in user', async function () {

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/harvesting/actualEvents');
        res.status.should.equal(200);
        res.body.events.length.should.equals(3);

        res.body.events[0].userId.should.equals('4');
        res.body.events[0].name.should.equals('user Meier4');
        res.body.events[0].slug.should.equals('user-meier4');
        res.body.events[0].image.should.equals('profileImage/4/profile.jpg');
        res.body.events[0].startDate.should.equals(startTime + 150);
        res.body.events[0].endDate.should.equals(startTime + 200);

        res.body.events[1].userId.should.equals('2');
        res.body.events[1].name.should.equals('user Meier2');
        res.body.events[1].slug.should.equals('user-meier2');
        res.body.events[1].image.should.equals('profileImage/2/profile.jpg');
        res.body.events[1].startDate.should.equals(startTime - 200);
        res.body.events[1].endDate.should.equals(startTime - 100);

        res.body.events[2].userId.should.equals('3');
        res.body.events[2].name.should.equals('user Meier3');
        res.body.events[2].slug.should.equals('user-meier3');
        res.body.events[2].image.should.equals('profileImage/3/profile.jpg');
        res.body.events[2].startDate.should.equals(startTime - 150);
        res.body.events[2].endDate.should.equals(startTime - 120);
    });

    it('Get actual harvesting events as public user', async function () {

        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/harvesting/actualEvents');
        res.status.should.equal(200);

        res.body.events.length.should.equals(3);
        res.body.events[0].userId.should.equals('4');
        res.body.events[0].name.should.equals('user Meier4');
        res.body.events[0].slug.should.equals('user-meier4');
        res.body.events[0].image.should.equals('profileImage/4/profile.jpg');
        res.body.events[0].startDate.should.equals(startTime + 150);
        res.body.events[0].endDate.should.equals(startTime + 200);

        res.body.events[1].userId.should.equals('2');
        res.body.events[1].name.should.equals('user Meier2');
        res.body.events[1].slug.should.equals('user-meier2');
        res.body.events[1].image.should.equals('profileImage/2/profile.jpg');
        res.body.events[1].startDate.should.equals(startTime - 200);
        res.body.events[1].endDate.should.equals(startTime - 100);

        res.body.events[2].userId.should.equals('3');
        res.body.events[2].name.should.equals('user Meier3');
        res.body.events[2].slug.should.equals('user-meier3');
        res.body.events[2].image.should.equals('profileImage/3/profile.jpg');
        res.body.events[2].startDate.should.equals(startTime - 150);
        res.body.events[2].endDate.should.equals(startTime - 120);
    });
});
