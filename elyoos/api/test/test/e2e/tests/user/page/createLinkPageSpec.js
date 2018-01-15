'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');
let should = require('chai').should();
let stubCDN = require('elyoos-server-test-util').stubCDN();
let sinon = require('sinon');

describe('Integration Tests for creating new link pages', function () {

    let startTime;

    beforeEach(function () {

        startTime = Math.floor(moment.utc().valueOf() / 1000);
        stubCDN.uploadFile.reset();
        return dbDsl.init(1).then(function () {
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Create a new link page - Return 200', function () {

        let createPage = {
            linkPage: {
                topic: ['health', 'spiritual'],
                title: 'title',
                description: 'description',
                link: 'www.example.com/weiter/link',
                language: ['en', 'de']
            }
        }, pageId;

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.post('/api/user/page/create', createPage, `${__dirname}/test.jpg`);
        }).then(function (res) {
            res.status.should.equal(200);
            pageId = res.body.pageId;
            res.body.linkPreviewUrl.should.equals(`pages/${pageId}/preview.jpg`);
            res.body.hostname.should.equals(`www.example.com`);
            return db.cypher().match(`(:User {userId: '1'})-[:RECOMMENDS]->(recommendation:Recommendation:PinwallElement)-[:RECOMMENDS]->
                                      (page:Page {pageId: {pageId}})<-[:IS_ADMIN]-(:User {userId: '1'})`)
                .optionalMatch(`(recommendation)-[pinwallData:PINWALL_DATA]->(page)`)
                .return(`page.pageId AS pageId, page.label AS label, page.topic AS topic, page.description AS description, page.title AS title, 
                         page.modified AS modified, page.created AS created, page.link AS link, page.hostname AS hostname, page.heightPreviewImage AS heightPreviewImage,
                         page.language AS language, recommendation, pinwallData`)
                .end({pageId: pageId}).send();
        }).then(function (page) {
            page.length.should.equals(1);
            page[0].created.should.be.at.least(startTime);
            page[0].modified.should.be.at.least(startTime);
            page[0].label.should.equals("Link");
            page[0].pageId.should.equals(pageId);
            page[0].description.should.equals("description");
            page[0].title.should.equals("title");
            page[0].link.should.equals("www.example.com/weiter/link");
            page[0].hostname.should.equals("www.example.com");
            page[0].heightPreviewImage.should.equals(720);

            page[0].recommendation.created.should.be.at.least(startTime);
            should.exist(page[0].recommendation.recommendationId);
            should.exist(page[0].pinwallData);

            page[0].topic.length.should.equals(2);
            page[0].topic[0].should.equals('health');
            page[0].topic[1].should.equals('spiritual');
            page[0].language.length.should.equals(2);
            page[0].language[0].should.equals('en');
            page[0].language[1].should.equals('de');

            stubCDN.uploadFile.calledWith(sinon.match.any, `pages/${pageId}/preview.jpg`).should.be.true;
            stubCDN.uploadFile.calledWith(sinon.match.any, `pages/${pageId}/normal.jpg`).should.be.true;
        });
    });

    it('Create a new link page without a uploaded image- Return 200', function () {

        let createPage = {
            linkPage: {
                topic: ['health', 'spiritual'],
                title: 'title',
                description: 'description',
                link: 'www.example.com/weiter/link',
                language: ['en', 'de']
            }
        }, pageId;

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.post('/api/user/page/create', createPage);
        }).then(function (res) {
            res.status.should.equal(200);
            pageId = res.body.pageId;
            res.body.hostname.should.equals(`www.example.com`);
            return db.cypher().match(`(:User {userId: '1'})-[:RECOMMENDS]->(recommendation:Recommendation:PinwallElement)-[:RECOMMENDS]->
                                      (page:Page {pageId: {pageId}})<-[:IS_ADMIN]-(:User {userId: '1'})`)
                .optionalMatch(`(recommendation)-[pinwallData:PINWALL_DATA]->(page)`)
                .return(`page.pageId AS pageId, page.label AS label, page.topic AS topic, page.description AS description, page.title AS title, 
                         page.modified AS modified, page.created AS created, page.link AS link, page.hostname AS hostname, page.heightPreviewImage AS heightPreviewImage,
                         page.language AS language, recommendation, pinwallData`)
                .end({pageId: pageId}).send();
        }).then(function (page) {
            page.length.should.equals(1);
            page[0].created.should.be.at.least(startTime);
            page[0].modified.should.be.at.least(startTime);
            page[0].label.should.equals("Link");
            page[0].pageId.should.equals(pageId);
            page[0].description.should.equals("description");
            page[0].title.should.equals("title");
            page[0].link.should.equals("www.example.com/weiter/link");
            page[0].hostname.should.equals("www.example.com");
            should.not.exist(page[0].heightPreviewImage);

            page[0].recommendation.created.should.be.at.least(startTime);
            should.exist(page[0].recommendation.recommendationId);
            should.exist(page[0].pinwallData);

            page[0].topic.length.should.equals(2);
            page[0].topic[0].should.equals('health');
            page[0].topic[1].should.equals('spiritual');
            page[0].language.length.should.equals(2);
            page[0].language[0].should.equals('en');
            page[0].language[1].should.equals('de');

            stubCDN.uploadFile.called.should.be.false;
        });
    });

    it('Create a new Link page with to small width image - Return 400', function () {

        let createPage = {
            linkPage: {
                topic: ['health', 'spiritual'],
                title: 'title',
                description: 'description',
                link: 'www.example.com/weiter/link',
                language: ['en', 'de']
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

    it('Create a new Link page with to small height image - Return 400', function () {

        let createPage = {
            linkPage: {
                topic: ['health', 'spiritual'],
                title: 'title',
                description: 'description',
                link: 'www.example.com/weiter/link',
                language: ['en', 'de']
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

    it('Create a new link page with youtube url- Return 400', function () {

        let createPage = {
            linkPage: {
                topic: ['health', 'spiritual'],
                title: 'title',
                description: 'description',
                link: 'https://www.youtube.com/weiter/link',
                language: ['en', 'de']
            }
        };

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.post('/api/user/page/create', createPage);
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(page:Page {title: 'title'})")
                .return('page.pageId AS pageId')
                .end().send();
        }).then(function (page) {
            page.length.should.equals(0);
            stubCDN.uploadFile.called.should.be.false;
        });
    });
});