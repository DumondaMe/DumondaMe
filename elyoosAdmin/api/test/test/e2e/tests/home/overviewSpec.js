'use strict';

const users = require('elyoos-server-test-util').user;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const requestHandler = require('elyoos-server-test-util').requestHandler;
const moment = require('moment');

describe('Getting initial home screen', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(3, true);

        startTime = Math.floor(moment.utc().valueOf() / 1000);
        dbDsl.setUserRegisteredDate('1', startTime - 600);
        dbDsl.setUserRegisteredDate('2', startTime - 500);
        dbDsl.setUserRegisteredDate('3', startTime - 499);

        dbDsl.createNews('1', {created: 500, modified: 602});
        dbDsl.createNews('2', {created: 502, modified: 601, isSent: true});
        dbDsl.createNews('3', {created: 501, modified: 600});
        await dbDsl.sendToDb();
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Get the home elements', async function () {

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/home');
        res.status.should.equal(200);

        res.body.news.length.should.equals(3);
        res.body.news[0].title.should.equals('news2Title');
        res.body.news[0].text.should.equals('news2Text');
        res.body.news[0].created.should.equals(502);
        res.body.news[0].modified.should.equals(601);

        res.body.news[1].title.should.equals('news3Title');
        res.body.news[1].text.should.equals('news3Text');
        res.body.news[1].created.should.equals(501);
        res.body.news[1].modified.should.equals(600);

        res.body.news[2].title.should.equals('news1Title');
        res.body.news[2].text.should.equals('news1Text');
        res.body.news[2].created.should.equals(500);
        res.body.news[2].modified.should.equals(602);

        res.body.users.length.should.equals(3);
        res.body.users[0].name.should.equals("user Meier3");
        res.body.users[0].registerDate.should.equals(startTime - 499);
        res.body.users[0].userId.should.equals("3");
        res.body.users[0].url.should.equals("profileImage/3/thumbnail.jpg");

        res.body.users[1].name.should.equals("user Meier2");
        res.body.users[1].registerDate.should.equals(startTime - 500);
        res.body.users[1].userId.should.equals("2");
        res.body.users[1].url.should.equals("profileImage/2/thumbnail.jpg");

        res.body.users[2].name.should.equals("user Meier");
        res.body.users[2].registerDate.should.equals(startTime - 600);
        res.body.users[2].userId.should.equals("1");
        res.body.users[2].url.should.equals("profileImage/1/thumbnail.jpg");
    });
});
