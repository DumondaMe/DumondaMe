'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let stubEmailQueue = require('elyoos-server-test-util').stubEmailQueue();
let requestHandler = require('elyoos-server-test-util').requestHandler;
let db = require('elyoos-server-test-util').db;
let moment = require('moment');

describe('Integration Tests creating news', function () {

    let requestAgent, startTime;

    beforeEach(function () {
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return dbDsl.init(4, true);
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Create news', function () {

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/admin/news', {create: {title: 'title', text: 'description'}}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.created.should.be.at.least(startTime);

            stubEmailQueue.createImmediatelyJob.calledWith("sendNews", {
                newsId: res.body.newsId
            }).should.be.true;

            return db.cypher().match(`(news:News {newsId: {newsId}})`)
                .return('news')
                .end({newsId: res.body.newsId}).send();
        }).then(function (news) {
            news.length.should.equals(1);
            news[0].news.created.should.be.at.least(startTime);
            news[0].news.title.should.equals("title");
            news[0].news.text.should.equals("description");
        });
    });
});
