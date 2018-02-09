'use strict';

let testee = require('../../../../../../../models/eMailService/jobs/sendNewsJob');
let email = require('elyoos-server-lib').eMail;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let sinon = require('sinon');
let expect = require('chai').expect;
let bluebird = require('bluebird');
let Promise = bluebird.Promise;

describe('Unit Test eMailService/jobs/sendNewsJob', function () {

    let sandbox;

    before(function () {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(function () {
        return dbDsl.init(3).then(function () {
            dbDsl.createNews('1', {created: 500});
            dbDsl.createNews('2', {created: 501, isSent: true});
            dbDsl.createNews('3', {created: 502});
            return dbDsl.sendToDb();
        });
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Send news to all users', function (done) {

        let finished, sendEMail = sandbox.stub(email, 'sendEMail');
        sendEMail.returns(Promise.resolve());

        finished = function () {
            expect(sendEMail.callCount).to.equals(3);

            expect(sendEMail.withArgs('sendNews', {
                    title: 'news1Title', text: 'news1Text', forename: 'user',
                    unsubscribeLink: `${process.env.ELYOOS_DOMAIN}unsubscribe/news/user@irgendwo.ch`
                },
                'user@irgendwo.ch').calledOnce).to.equal(true);
            expect(sendEMail.withArgs('sendNews', {
                    title: 'news1Title', text: 'news1Text', forename: 'user',
                    unsubscribeLink: `${process.env.ELYOOS_DOMAIN}unsubscribe/news/user2@irgendwo.ch`
                },
                'user2@irgendwo.ch').calledOnce).to.equal(true);
            expect(sendEMail.withArgs('sendNews', {
                    title: 'news1Title', text: 'news1Text', forename: 'user',
                    unsubscribeLink: `${process.env.ELYOOS_DOMAIN}unsubscribe/news/user3@irgendwo.ch`
                },
                'user3@irgendwo.ch').calledOnce).to.equal(true);

            db.cypher().match(`(news:News {newsId: '1'})`)
                .where("news.isSent = true").return("news")
                .end().send().then(function (resp) {
                expect(resp.length).to.equal(1);
                expect(resp[0].news.newsId).to.equal('1');
                done();
            });
        };
        testee.processDefinition({
            newsId: '1'
        }, finished);
    });

    it('News not sending when already sent', function (done) {

        let finished, sendEMail = sandbox.stub(email, 'sendEMail');
        sendEMail.returns(Promise.resolve());

        finished = function () {
            expect(sendEMail.callCount).to.equals(0);
            done();
        };
        testee.processDefinition({
            newsId: '2'
        }, finished);
    });
});
