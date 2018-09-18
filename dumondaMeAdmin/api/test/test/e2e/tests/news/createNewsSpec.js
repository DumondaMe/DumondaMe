'use strict';

const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const eMail = require('dumonda-me-server-lib').eMail;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const db = require('dumonda-me-server-test-util').db;
const moment = require('moment');
const sinon = require('sinon');

describe('Integration Tests creating news', function () {

    let startTime, sandbox, stubSendEMail;

    beforeEach(async function () {
        sandbox = sinon.sandbox.create();
        stubSendEMail = sandbox.stub(eMail, 'sendEMail');
        stubSendEMail.resolves({});
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        await dbDsl.init(4, true);
        await dbDsl.sendToDb();
    });

    afterEach(function () {
        sandbox.restore();
        return requestHandler.logout();
    });


    it('Create news', async function () {

        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/news', {title: 'title', text: 'description'});
        res.status.should.equal(200);
        res.body.created.should.be.at.least(startTime);

        stubSendEMail.callCount.should.equals(4);

        let news = await db.cypher().match(`(news:News {newsId: {newsId}})`)
            .return('news')
            .end({newsId: res.body.newsId}).send();
        news.length.should.equals(1);
        news[0].news.created.should.be.at.least(startTime);
        news[0].news.title.should.equals("title");
        news[0].news.text.should.equals("description");
    });
});
