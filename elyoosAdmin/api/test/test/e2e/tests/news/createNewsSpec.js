'use strict';

const users = require('elyoos-server-test-util').user;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const stubEmailQueue = require('elyoos-server-test-util').stubEmailQueue();
const requestHandler = require('elyoos-server-test-util').requestHandler;
const db = require('elyoos-server-test-util').db;
const moment = require('moment');

describe('Integration Tests creating news', function () {

    let startTime;

    beforeEach(async function () {
        stubEmailQueue.createImmediatelyJob.reset();
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        await dbDsl.init(4, true);
        await dbDsl.sendToDb();
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Create news', async function () {

        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/news', {title: 'title', text: 'description'});
        res.status.should.equal(200);
        res.body.created.should.be.at.least(startTime);

        stubEmailQueue.createImmediatelyJob.calledWith("sendNews", {
            newsId: res.body.newsId
        }).should.be.true;

        let news = await db.cypher().match(`(news:News {newsId: {newsId}})`)
            .return('news')
            .end({newsId: res.body.newsId}).send();
        news.length.should.equals(1);
        news[0].news.created.should.be.at.least(startTime);
        news[0].news.title.should.equals("title");
        news[0].news.text.should.equals("description");
    });
});
