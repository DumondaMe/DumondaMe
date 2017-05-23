'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let stubEmailQueue = require('elyoos-server-test-util').stubEmailQueue();
let requestHandler = require('elyoos-server-test-util').requestHandler;
let db = require('elyoos-server-test-util').db;
let moment = require('moment');

describe('Integration Tests edit news', function () {

    let startTime;

    beforeEach(function () {
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return dbDsl.init(4, true);
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Edit news', function () {

        dbDsl.createNews('1', {created: 500, modified: 602});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.put('/api/admin/news', {newsId: '1', title: 'title', text: 'description'});
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.modified.should.be.at.least(startTime);

            stubEmailQueue.createImmediatelyJob.notCalled.should.be.true;

            return db.cypher().match(`(news:News {newsId: '1'})`)
                .return('news').end().send();
        }).then(function (news) {
            news.length.should.equals(1);
            news[0].news.modified.should.be.at.least(startTime);
            news[0].news.created.should.equals(500);
            news[0].news.title.should.equals("title");
            news[0].news.text.should.equals("description");
        });
    });
});
