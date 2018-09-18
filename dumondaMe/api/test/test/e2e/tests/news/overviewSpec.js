'use strict';

let dbDsl = require('dumonda-me-server-test-util').dbDSL;
let requestHandler = require('dumonda-me-server-test-util').requestHandler;
let moment = require('moment');

describe('Integration Tests to get an overview of the news', function () {

    let startTime;

    beforeEach(function () {
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return dbDsl.init(4, true);
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Get the news overview', function () {

        dbDsl.createNews('1', {created: 500, modified: 602});
        dbDsl.createNews('2', {created: 502, modified: 601, isSent: true});
        dbDsl.createNews('3', {created: 501, modified: 600});
        return dbDsl.sendToDb().then(function () {
            return requestHandler.get('/api/news', {skip: 0, maxItems: 10});
        }).then(function (res) {
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
        });
    });
});
