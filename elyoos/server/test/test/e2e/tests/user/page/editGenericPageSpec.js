'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let should = require('chai').should();
let moment = require('moment');
let stubCDN = require('elyoos-server-test-util').stubCDN();
let sinon = require('sinon');

describe('Integration Tests for editing generic pages', function () {

    let requestAgent, startTime;

    beforeEach(function () {

        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return dbDsl.init(2).then(function () {
            dbDsl.createGenericPage('1', '1', ['de'], ['health', 'personalDevelopment'], 100, null, [{
                description: 'Zuerich',
                lat: 47.376887,
                lng: 8.541694,
                addressId: '1'
            }], 'www.example.org');
            dbDsl.createGenericPage('2', '2', ['de'], ['health', 'personalDevelopment'], 200, null, [{
                description: 'Zuerich',
                lat: 47.376887,
                lng: 8.541694,
                addressId: '2'
            }], 'www.example2.org');

            return dbDsl.sendToDb();
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Edit a generic page without website - Return 200', function () {
        let editPage = {
            genericPage: {
                pageId: '1',
                topic: ['health', 'socialDevelopment'],
                title: 'title',
                description: 'description',
                language: ['en', 'fr']
            }
        };
        stubCDN.uploadFile.reset();

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/edit', editPage, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(page:Page {pageId: '1'})")
                .return(`page`)
                .end().send();
        }).then(function (page) {
            page.length.should.equals(1);
            page[0].page.created.should.equals(100);
            page[0].page.modified.should.be.at.least(startTime);
            page[0].page.pageId.should.equals('1');
            page[0].page.description.should.equals("description");
            page[0].page.title.should.equals("title");
            page[0].page.label.should.equals("Generic");
            should.not.exist(page[0].page.website);

            stubCDN.uploadFile.called.should.be.false;

            page[0].page.topic.length.should.equals(2);
            page[0].page.topic[0].should.equals('health');
            page[0].page.topic[1].should.equals('socialDevelopment');
            page[0].page.language.length.should.equals(2);
            page[0].page.language[0].should.equals('en');
            page[0].page.language[1].should.equals('fr');
        });
    });

    it('Edit a generic page with website - Return 200', function () {
        let editPage = {
            genericPage: {
                pageId: '1',
                topic: ['health', 'socialDevelopment'],
                title: 'title',
                description: 'description',
                language: ['en', 'fr'],
                website: 'www.elyoos.org'
            }
        };
        stubCDN.uploadFile.reset();

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/edit', editPage, requestAgent, './test/test/e2e/tests/user/page/test.jpg');
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(page:Page {pageId: '1'})")
                .return(`page`)
                .end().send();
        }).then(function (page) {
            page.length.should.equals(1);
            page[0].page.website.should.equals('www.elyoos.org');

            stubCDN.uploadFile.calledWith(sinon.match.any, "pages/1/preview.jpg").should.be.true;
            stubCDN.uploadFile.calledWith(sinon.match.any, "pages/1/normal.jpg").should.be.true;
            stubCDN.uploadFile.calledWith(sinon.match.any, "pages/1/thumbnail.jpg").should.be.true;
        });
    });

    it('Edit of generic page without being administrator - Return 400', function () {
        let editPage = {
            genericPage: {
                pageId: '2',
                topic: ['health', 'socialDevelopment'],
                title: 'title',
                description: 'description',
                language: ['en', 'fr']
            }
        };
        stubCDN.uploadFile.reset();

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/edit', editPage, requestAgent, './test/test/e2e/tests/user/page/toSmallWidth.jpg');
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(page:Page {pageId: '2'})")
                .return('page')
                .end().send();
        }).then(function (page) {
            page.length.should.equals(1);
            page[0].page.created.should.equals(200);
            page[0].page.modified.should.equals(200);
            page[0].page.pageId.should.equals('2');
            page[0].page.description.should.equals("page2Description");
            page[0].page.title.should.equals("generic2Title");
            page[0].page.website.should.equals("www.example2.org");
            page[0].page.label.should.equals("Generic");

            stubCDN.uploadFile.called.should.be.false;

            page[0].page.topic.length.should.equals(2);
            page[0].page.topic[0].should.equals('health');
            page[0].page.topic[1].should.equals('personalDevelopment');
            page[0].page.language.length.should.equals(1);
            page[0].page.language[0].should.equals('de');
        });
    });

    it('Edit a generic page with to small width image - Return 400', function () {
        let editPage = {
            genericPage: {
                pageId: '1',
                topic: ['health', 'socialDevelopment'],
                title: 'title',
                description: 'description',
                language: ['en', 'fr']
            }
        };
        stubCDN.uploadFile.reset();

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/edit', editPage, requestAgent, './test/test/e2e/tests/user/page/toSmallWidth.jpg');
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(page:Page {pageId: '1'})")
                .return('page')
                .end().send();
        }).then(function (page) {
            page.length.should.equals(1);
            page[0].page.created.should.equals(100);
            page[0].page.modified.should.equals(100);
            page[0].page.pageId.should.equals('1');
            page[0].page.description.should.equals("page1Description");
            page[0].page.title.should.equals("generic1Title");
            page[0].page.website.should.equals("www.example.org");
            page[0].page.label.should.equals("Generic");

            stubCDN.uploadFile.called.should.be.false;

            page[0].page.topic.length.should.equals(2);
            page[0].page.topic[0].should.equals('health');
            page[0].page.topic[1].should.equals('personalDevelopment');
            page[0].page.language.length.should.equals(1);
            page[0].page.language[0].should.equals('de');
        });
    });

    it('Edit a generic page with to small height image - Return 400', function () {
        let editPage = {
            genericPage: {
                pageId: '1',
                topic: ['health', 'socialDevelopment'],
                title: 'title',
                description: 'description',
                language: ['en', 'fr']
            }
        };
        stubCDN.uploadFile.reset();

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/edit', editPage, requestAgent, './test/test/e2e/tests/user/page/toSmallHeight.jpg');
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(page:Page {pageId: '1'})")
                .return('page')
                .end().send();
        }).then(function (page) {
            page.length.should.equals(1);
            page[0].page.created.should.equals(100);
            page[0].page.modified.should.equals(100);
            page[0].page.pageId.should.equals('1');
            page[0].page.description.should.equals("page1Description");
            page[0].page.title.should.equals("generic1Title");
            page[0].page.website.should.equals("www.example.org");
            page[0].page.label.should.equals("Generic");

            stubCDN.uploadFile.called.should.be.false;

            page[0].page.topic.length.should.equals(2);
            page[0].page.topic[0].should.equals('health');
            page[0].page.topic[1].should.equals('personalDevelopment');
            page[0].page.language.length.should.equals(1);
            page[0].page.language[0].should.equals('de');
        });
    });
});
