'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let should = require('chai').should();
let moment = require('moment');
let stubCDN = require('elyoos-server-test-util').stubCDN();
let sinon = require('sinon');

describe('Integration Tests for creating new book pages', function () {

    let startTime;

    beforeEach(function () {

        stubCDN.uploadFile.reset();
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return dbDsl.init(1).then(function () {
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Create a new book page - Return 200', function () {

        let createPage = {
            bookPage: {
                topic: ['health', 'spiritual'],
                title: 'title',
                description: 'description',
                author: 'Hans Muster',
                publishDate: 500,
                language: 'de'
            }
        }, pageId;

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.post('/api/user/page/create', createPage, `${__dirname}/test.jpg`);
        }).then(function (res) {
            res.status.should.equal(200);
            pageId = res.body.pageId;
            res.body.bookPreviewUrl.should.equals(`pages/${pageId}/pagePreview.jpg`);
            return db.cypher().match(`(user:User {userId: '1'})-[:RECOMMENDS]->(recommendation:Recommendation:PinwallElement)-[:RECOMMENDS]->
                                      (page:Page {title: 'title'})<-[:IS_ADMIN]-(:User {userId: '1'})`)
                .optionalMatch(`(recommendation)-[pinwallData:PINWALL_DATA]->(page)`)
                .return('page.pageId AS pageId, page.label AS label, page.topic AS topic, page.description AS description, page.author AS author, ' +
                'page.modified AS modified, page.created AS created, page.publishDate AS publishDate, page.language AS language, recommendation, pinwallData')
                .end().send();
        }).then(function (page) {
            page.length.should.equals(1);
            page[0].created.should.be.at.least(startTime);
            page[0].modified.should.be.at.least(startTime);
            page[0].label.should.equals("Book");
            page[0].pageId.should.equals(pageId);
            page[0].description.should.equals("description");
            page[0].author.should.equals("Hans Muster");
            page[0].publishDate.should.equals(500);

            page[0].topic.length.should.equals(2);
            page[0].topic[0].should.equals('health');
            page[0].topic[1].should.equals('spiritual');
            page[0].language.length.should.equals(1);
            page[0].language[0].should.equals('de');

            page[0].recommendation.created.should.be.at.least(startTime);
            should.exist(page[0].recommendation.recommendationId);
            should.exist(page[0].pinwallData);

            stubCDN.uploadFile.calledWith(sinon.match.any, `pages/${pageId}/pagePreview.jpg`).should.be.true;
            stubCDN.uploadFile.calledWith(sinon.match.any, `pages/${pageId}/pageTitlePicture.jpg`).should.be.true;
            stubCDN.uploadFile.calledWith(sinon.match.any, `pages/${pageId}/original.jpg`).should.be.true;
        });
    });

    it('Create a new book page without publish date - Return 200', function () {

        let createPage = {
            bookPage: {
                topic: ['health', 'spiritual'],
                title: 'title',
                description: 'description',
                author: 'Hans Muster',
                language: 'en'
            }
        }, pageId;

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.post('/api/user/page/create', createPage, `${__dirname}/test.jpg`);
        }).then(function (res) {
            res.status.should.equal(200);
            pageId = res.body.pageId;
            res.body.bookPreviewUrl.should.equals(`pages/${pageId}/pagePreview.jpg`);
            return db.cypher().match(`(user:User {userId: '1'})-[:RECOMMENDS]->(recommendation:Recommendation:PinwallElement)-[:RECOMMENDS]->
                                      (page:Page {title: 'title'})<-[:IS_ADMIN]-(:User {userId: '1'})`)
                .optionalMatch(`(recommendation)-[pinwallData:PINWALL_DATA]->(page)`)
                .return('page.pageId AS pageId, page.label AS label, page.topic AS topic, page.description AS description, page.author AS author, ' +
                'page.modified AS modified, page.created AS created, page.publishDate AS publishDate, page.language AS language, recommendation, pinwallData')
                .end().send();
        }).then(function (page) {
            page.length.should.equals(1);
            page[0].created.should.be.at.least(startTime);
            page[0].modified.should.be.at.least(startTime);
            page[0].label.should.equals("Book");
            page[0].pageId.should.equals(pageId);
            page[0].description.should.equals("description");
            page[0].author.should.equals("Hans Muster");
            should.not.exist(page[0].publishDate);

            page[0].topic.length.should.equals(2);
            page[0].topic[0].should.equals('health');
            page[0].topic[1].should.equals('spiritual');
            page[0].language.length.should.equals(1);
            page[0].language[0].should.equals('en');

            page[0].recommendation.created.should.be.at.least(startTime);
            should.exist(page[0].recommendation.recommendationId);
            should.exist(page[0].pinwallData);

            stubCDN.uploadFile.calledWith(sinon.match.any, `pages/${pageId}/pagePreview.jpg`).should.be.true;
            stubCDN.uploadFile.calledWith(sinon.match.any, `pages/${pageId}/pageTitlePicture.jpg`).should.be.true;
            stubCDN.uploadFile.calledWith(sinon.match.any, `pages/${pageId}/original.jpg`).should.be.true;
        });
    });

    it('Create a new book page without a uploaded image- Return 200', function () {

        let createPage = {
            bookPage: {
                topic: ['health', 'spiritual'],
                title: 'title',
                description: 'description',
                author: 'Hans Muster',
                publishDate: 500,
                language: 'fr'
            }
        }, pageId;

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.post('/api/user/page/create', createPage);
        }).then(function (res) {
            res.status.should.equal(200);
            pageId = res.body.pageId;
            res.body.bookPreviewUrl.should.equals(`pages/${pageId}/pagePreview.jpg`);
            return db.cypher().match(`(:User {userId: '1'})-[:RECOMMENDS]->(recommendation:Recommendation:PinwallElement)-[:RECOMMENDS]->
                                      (page:Page {title: 'title'})<-[:IS_ADMIN]-(:User {userId: '1'})`)
                .optionalMatch(`(recommendation)-[pinwallData:PINWALL_DATA]->(page)`)
                .return('page.pageId AS pageId, page.label AS label, page.topic AS topic, page.description AS description, page.author AS author, ' +
                'page.modified AS modified, page.created AS created, page.publishDate AS publishDate, page.language AS language, recommendation, pinwallData')
                .end().send();
        }).then(function (page) {
            page.length.should.equals(1);
            page[0].created.should.be.at.least(startTime);
            page[0].modified.should.be.at.least(startTime);
            page[0].label.should.equals("Book");
            page[0].pageId.should.equals(pageId);
            page[0].description.should.equals("description");
            page[0].author.should.equals("Hans Muster");
            page[0].publishDate.should.equals(500);

            page[0].topic.length.should.equals(2);
            page[0].topic[0].should.equals('health');
            page[0].topic[1].should.equals('spiritual');
            page[0].language.length.should.equals(1);
            page[0].language[0].should.equals('fr');

            page[0].recommendation.created.should.be.at.least(startTime);
            should.exist(page[0].recommendation.recommendationId);
            should.exist(page[0].pinwallData);

            stubCDN.uploadFile.called.should.be.false;
        });
    });

    it('Create a new book page with to small width image - Return 400', function () {

        let createPage = {
            bookPage: {
                topic: ['health', 'spiritual'],
                title: 'title',
                description: 'description',
                author: 'Hans Muster',
                publishDate: 500,
                language: 'en'
            }
        };

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.post('/api/user/page/create', createPage, `${__dirname}/toSmallWidth.jpg`);
        }).then(function (res) {
            res.status.should.equal(400);
            res.body.errorCode.should.equal(2);
            return db.cypher().match("(page:Page {title: 'title'})")
                .return('page.pageId AS pageId')
                .end().send();
        }).then(function (page) {
            page.length.should.equals(0);
            stubCDN.uploadFile.called.should.be.false;
        });
    });

    it('Create a new book page with to small height image - Return 400', function () {

        let createPage = {
            bookPage: {
                topic: ['health', 'spiritual'],
                title: 'title',
                description: 'description',
                author: 'Hans Muster',
                publishDate: 500,
                language: 'en'
            }
        };

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.post('/api/user/page/create', createPage, `${__dirname}/toSmallHeight.jpg`);
        }).then(function (res) {
            res.status.should.equal(400);
            res.body.errorCode.should.equal(2);
            return db.cypher().match("(page:Page {title: 'title'})")
                .return('page.pageId AS pageId')
                .end().send();
        }).then(function (page) {
            page.length.should.equals(0);
            stubCDN.uploadFile.called.should.be.false;
        });
    });
});
