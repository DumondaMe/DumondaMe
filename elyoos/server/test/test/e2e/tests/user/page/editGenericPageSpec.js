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

    let startTime;

    beforeEach(async function () {

        startTime = Math.floor(moment.utc().valueOf() / 1000);
        await dbDsl.init(2);

        dbDsl.createGenericPage('1', {adminId: '1', language: ['de'], topic: ['health', 'personalDevelopment'], created: 100, website: 'www.example.org'}, [{
            address: 'Zuerich',
            lat: 47.376887,
            lng: 8.541694,
            addressId: '1'
        }]);
        dbDsl.createGenericPage('2', {adminId: '2', language: ['de'], topic: ['health', 'personalDevelopment'], created: 200, website: 'www.example2.org'}, [{
            address: 'Zuerich1',
            lat: 47.376887,
            lng: 8.541694,
            addressId: '2'
        }]);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Edit a generic page without website - Return 200', async function () {
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

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await  requestHandler.post('/api/user/page/edit', editPage);
        res.status.should.equal(200);

        let page = await db.cypher().match("(page:Page {pageId: '1'})")
            .return(`page`)
            .end().send();
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

    it('Edit a generic page with website - Return 200', async function () {
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
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/page/edit', editPage, './test/test/e2e/tests/user/page/test.jpg');
        res.status.should.equal(200);

        let page = await db.cypher().match("(page:Page {pageId: '1'})")
            .where(`NOT (page)<-[:EXPORT_TO_TC_PENDING]-(:TransitionConnectExport)`)
            .return(`page`)
            .end().send();
        page.length.should.equals(1);
        page[0].page.website.should.equals('www.elyoos.org');

        stubCDN.uploadFile.calledWith(sinon.match.any, "pages/1/preview.jpg").should.be.true;
        stubCDN.uploadFile.calledWith(sinon.match.any, "pages/1/normal.jpg").should.be.true;
        stubCDN.uploadFile.calledWith(sinon.match.any, "pages/1/thumbnail.jpg").should.be.true;
    });

    it('Edit a generic page does set EXPORT_TO_TC_PENDING', async function () {
        let editPage = {
            genericPage: {
                pageId: '1',
                topic: ['health', 'socialDevelopment'],
                title: 'title',
                description: 'description',
                language: ['en', 'fr']
            }
        };

        dbDsl.createTransitionConnectExportNode();
        dbDsl.exportOrganizationToTransitionConnect({pageId: '1'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/page/edit', editPage);
        res.status.should.equal(200);

        let page = await db.cypher().match("(page:Page {pageId: '1'})<-[:EXPORT_TO_TC_PENDING]-(:TransitionConnectExport)")
            .return(`page`)
            .end().send();
        page.length.should.equals(1);
        page[0].page.created.should.equals(100);
        page[0].page.modified.should.be.at.least(startTime);
        page[0].page.pageId.should.equals('1');
        page[0].page.description.should.equals("description");
        page[0].page.title.should.equals("title");
        page[0].page.label.should.equals("Generic");
        should.not.exist(page[0].page.website);
        page[0].page.topic.length.should.equals(2);
        page[0].page.topic[0].should.equals('health');
        page[0].page.topic[1].should.equals('socialDevelopment');
        page[0].page.language.length.should.equals(2);
        page[0].page.language[0].should.equals('en');
        page[0].page.language[1].should.equals('fr');
    });

    it('Edit of generic page without being administrator - Return 400', async function () {
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
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/page/edit', editPage, './test/test/e2e/tests/user/page/toSmallWidth.jpg');
        res.status.should.equal(400);

        let page = await db.cypher().match("(page:Page {pageId: '2'})")
            .return('page')
            .end().send();
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

    it('Edit a generic page with to small width image - Return 400', async function () {
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
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/page/edit', editPage, './test/test/e2e/tests/user/page/toSmallWidth.jpg');
        res.status.should.equal(400);

        let page = await db.cypher().match("(page:Page {pageId: '1'})")
            .return('page')
            .end().send();
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

    it('Edit a generic page with to small height image - Return 400', async function () {
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
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/page/edit', editPage, './test/test/e2e/tests/user/page/toSmallHeight.jpg');
        res.status.should.equal(400);

        let page = await db.cypher().match("(page:Page {pageId: '1'})")
            .return('page')
            .end().send();
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
