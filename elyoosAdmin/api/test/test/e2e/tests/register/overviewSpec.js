'use strict';

const users = require('elyoos-server-test-util').user;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const requestHandler = require('elyoos-server-test-util').requestHandler;
const moment = require('moment');

describe('Integration Tests for getting registered user overview', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(3, true);
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Getting registered user overview', async function () {

        startTime = Math.floor(moment.utc().valueOf() / 1000);
        dbDsl.setUserRegisteredDate('1', startTime - 600);
        dbDsl.setUserRegisteredDate('2', startTime - 500);
        dbDsl.setUserRegisteredDate('3', startTime - 499);

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/register/overview', {skip: 0, maxItems: 10});
        res.status.should.equal(200);
        res.body.numberOfUser.should.equals(3);

        res.body.user.length.should.equals(3);
        res.body.user[0].name.should.equals("user Meier3");
        res.body.user[0].registerDate.should.equals(startTime - 499);
        res.body.user[0].userId.should.equals("3");
        res.body.user[0].url.should.equals("profileImage/3/thumbnail.jpg");

        res.body.user[1].name.should.equals("user Meier2");
        res.body.user[1].registerDate.should.equals(startTime - 500);
        res.body.user[1].userId.should.equals("2");
        res.body.user[1].url.should.equals("profileImage/2/thumbnail.jpg");

        res.body.user[2].name.should.equals("user Meier");
        res.body.user[2].registerDate.should.equals(startTime - 600);
        res.body.user[2].userId.should.equals("1");
        res.body.user[2].url.should.equals("profileImage/1/thumbnail.jpg");
    });
});
