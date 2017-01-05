'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');
let stubCDN = require('elyoos-server-test-util').stubCDN();
let sinon = require('sinon');

describe('Integration Tests for creating new generic pages', function () {

    let requestAgent, startTime;

    beforeEach(function () {

        stubCDN.uploadFile.reset();
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return dbDsl.init(5).then(function () {
            dbDsl.createKeywords('Yoga');
            dbDsl.createKeywords('Meditation');
            dbDsl.createKeywords('Shop');
            return dbDsl.sendToDb();
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Create a new generic page - Return 200', function () {

        let createPage = {
            genericPage: {
                title: 'title',
                topic: ['health', 'spiritual'],
                language: ['en', 'de'],
                description: 'description',
                website: 'www.elyoos.com',
                places: [{description: 'addressName', lat: -5.00, lng: 6.00}]
            }
        }, pageId;

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/create', createPage, requestAgent, './test/test/e2e/tests/user/page/test.jpg');
        }).then(function (res) {
            res.status.should.equal(200);
            pageId = res.body.pageId;
            res.body.previewImage.should.equals(`pages/${pageId}/preview.jpg`);
            return db.cypher().match("(address:Address)<-[:HAS]-(page:Page {title: 'title'})<-[:IS_ADMIN]-(:User {userId: '1'})")
                .return(`page AS page, address.description AS address, address.latitude AS latitude, address.longitude AS longitude`)
                .end().send();
        }).then(function (page) {
            page.length.should.equals(1);
            page[0].page.created.should.be.at.least(startTime);
            page[0].page.modified.should.be.at.least(startTime);
            page[0].page.label.should.equals("Generic");
            page[0].page.title.should.equals("title");
            page[0].page.description.should.equals("description");
            page[0].page.website.should.equals("www.elyoos.com");
            page[0].page.pageId.should.equals(pageId);
            page[0].address.should.equals("addressName");
            page[0].latitude.should.equals(-5.00);
            page[0].longitude.should.equals(6.00);

            page[0].page.topic.length.should.equals(2);
            page[0].page.topic[0].should.equals('health');
            page[0].page.topic[1].should.equals('spiritual');
            page[0].page.language.length.should.equals(2);
            page[0].page.language[0].should.equals('en');
            page[0].page.language[1].should.equals('de');

            stubCDN.uploadFile.calledWith(sinon.match.any, `pages/${pageId}/preview.jpg`).should.be.true;
            stubCDN.uploadFile.calledWith(sinon.match.any, `pages/${pageId}/normal.jpg`).should.be.true;
            stubCDN.uploadFile.calledWith(sinon.match.any, `pages/${pageId}/thumbnail.jpg`).should.be.true;
        });
    });

    it('Create a new generic page with only mandatory properties - Return 200', function () {

        let createPage = {
            genericPage: {
                title: 'title',
                topic: ['health', 'spiritual'],
                language: ['en', 'de'],
                description: 'description'
            }
        }, pageId;

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/create', createPage, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            pageId = res.body.pageId;
            res.body.previewImage.should.equals(`pages/${pageId}/preview.jpg`);
            return db.cypher().match("(page:Page {title: 'title'})<-[:IS_ADMIN]-(:User {userId: '1'})")
                .return(`page AS page`)
                .end().send();
        }).then(function (page) {
            page.length.should.equals(1);
            page[0].page.created.should.be.at.least(startTime);
            page[0].page.modified.should.be.at.least(startTime);
            page[0].page.label.should.equals("Generic");
            page[0].page.title.should.equals("title");
            page[0].page.description.should.equals("description");
            page[0].page.pageId.should.equals(pageId);

            page[0].page.topic.length.should.equals(2);
            page[0].page.topic[0].should.equals('health');
            page[0].page.topic[1].should.equals('spiritual');
            page[0].page.language.length.should.equals(2);
            page[0].page.language[0].should.equals('en');
            page[0].page.language[1].should.equals('de');

            stubCDN.copyFile.calledWith('pages/default/landscape/preview.jpg', `pages/${pageId}/preview.jpg`).should.be.true;
            stubCDN.copyFile.calledWith('pages/default/landscape/normal.jpg', `pages/${pageId}/normal.jpg`).should.be.true;
            stubCDN.copyFile.calledWith('pages/default/landscape/thumbnail.jpg', `pages/${pageId}/thumbnail.jpg`).should.be.true;
        });
    });
});
