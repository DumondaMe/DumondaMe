'use strict';

var users = require('elyoos-server-test-util').user;
var db = require('elyoos-server-test-util').db;
var dbDsl = require('elyoos-server-test-util').dbDSL;
var requestHandler = require('elyoos-server-test-util').requestHandler;
var moment = require('moment');
var stubCDN = require('elyoos-server-test-util').stubCDN();
var sinon = require('sinon');

describe('Integration Tests for creating new place pages', function () {

    var requestAgent, startTime;

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

    it('Create a new place page - Return 200', function () {

        var createPage = {
            placePage: {
                title: 'title',
                topic: ['health', 'spiritual'],
                language: ['en', 'de'],
                description: 'description',
                website: 'www.elyoos.com',
                places: [{description: 'addressName', lat: -5.00, lng: 6.00}],
                keywords: ['Yoga', 'Meditation']
            }
        }, pageId;

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/create', createPage, requestAgent, './test/test/e2e/tests/user/page/test.jpg');
        }).then(function (res) {
            res.status.should.equal(200);
            pageId = res.body.pageId;
            res.body.titlePreviewUrl.should.equals(`pages/${pageId}/preview.jpg`);
            return db.cypher().match("(address:Address)<-[:HAS]-(page:Page {title: 'title'})<-[:IS_ADMIN]-(:User {userId: '1'})")
                .optionalMatch("(page)-[:HAS_KEYWORD]->(keyword:Keyword)")
                .return(`page AS page, address.description AS address, address.latitude AS latitude, address.longitude AS longitude, collect(keyword) AS keywords`)
                .end().send();
        }).then(function (page) {
            page.length.should.equals(1);
            page[0].page.created.should.be.at.least(startTime);
            page[0].page.modified.should.be.at.least(startTime);
            page[0].page.label.should.equals("Place");
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
            page[0].keywords.length.should.equals(2);
            page[0].keywords.should.include({de: 'Meditation'});
            page[0].keywords.should.include({de: 'Yoga'});

            stubCDN.uploadFile.calledWith(sinon.match.any, `pages/${pageId}/preview.jpg`).should.be.true;
            stubCDN.uploadFile.calledWith(sinon.match.any, `pages/${pageId}/normal.jpg`).should.be.true;
            stubCDN.uploadFile.calledWith(sinon.match.any, `pages/${pageId}/thumbnail.jpg`).should.be.true;
        });
    });

    it('Create a new place page with only mandatory properties - Return 200', function () {

        var createPage = {
            placePage: {
                title: 'title',
                topic: ['health', 'spiritual'],
                language: ['en', 'de'],
                description: 'description',
                places: [{description: 'addressName', lat: -5.00, lng: 6.00}],
                keywords: ['Yoga', 'Meditation']
            }
        }, pageId;

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/create', createPage, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            pageId = res.body.pageId;
            res.body.titlePreviewUrl.should.equals(`pages/${pageId}/preview.jpg`);
            return db.cypher().match("(address:Address)<-[:HAS]-(page:Page {title: 'title'})<-[:IS_ADMIN]-(:User {userId: '1'})")
                .optionalMatch("(page)-[:HAS_KEYWORD]->(keyword:Keyword)")
                .return(`page AS page, address.description AS address, address.latitude AS latitude, address.longitude AS longitude, collect(keyword) AS keywords`)
                .end().send();
        }).then(function (page) {
            page.length.should.equals(1);
            page[0].page.created.should.be.at.least(startTime);
            page[0].page.modified.should.be.at.least(startTime);
            page[0].page.label.should.equals("Place");
            page[0].page.title.should.equals("title");
            page[0].page.description.should.equals("description");
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
            page[0].keywords.length.should.equals(2);
            page[0].keywords.should.include({de: 'Meditation'});
            page[0].keywords.should.include({de: 'Yoga'});

            stubCDN.copyFile.calledWith('pages/default/landscape/preview.jpg', `pages/${pageId}/preview.jpg`).should.be.true;
            stubCDN.copyFile.calledWith('pages/default/landscape/normal.jpg', `pages/${pageId}/normal.jpg`).should.be.true;
            stubCDN.copyFile.calledWith('pages/default/landscape/thumbnail.jpg', `pages/${pageId}/thumbnail.jpg`).should.be.true;
        });
    });

    it('Keyword is not existing - Return 400', function () {

        var createPage = {
            placePage: {
                title: 'title',
                topic: ['health', 'spiritual'],
                language: ['en', 'de'],
                description: 'description',
                places: [{description: 'addressName', lat: -5.00, lng: 6.00}],
                keywords: ['Yoga', 'Meditation', 'Irgendwas']
            }
        };

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/create', createPage, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });
});
