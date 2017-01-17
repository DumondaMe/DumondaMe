'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');
let stubCDN = require('elyoos-server-test-util').stubCDN();
let should = require('chai').should();
let sinon = require('sinon');

describe('Integration Tests for creating new generic pages', function () {

    let startTime;

    beforeEach(function () {

        stubCDN.uploadFile.reset();
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return dbDsl.init(5).then(function () {
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
                places: [{description: 'addressName', lat: -5.00, lng: 6.00}, {description: 'addressName2', lat: -4.00, lng: 7.00}]
            }
        }, pageId;

        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.post('/api/user/page/create', createPage, agent, './test/test/e2e/tests/user/page/test.jpg');
        }).then(function (res) {
            res.status.should.equal(200);
            pageId = res.body.pageId;
            res.body.previewImage.should.equals(`pages/${pageId}/preview.jpg`);
            return db.cypher().match("(address:Address)<-[:HAS]-(page:Page {title: 'title'})<-[:IS_ADMIN]-(user:User {userId: '1'})")
                .optionalMatch("(user)-[:RECOMMENDS]->(recommendation:Recommendation:PinwallElement)-[:RECOMMENDS]->(page:Page {title: 'title'})")
                .with("page, address, recommendation")
                .match(`(recommendation)-[pinwallData:PINWALL_DATA]->(page)`)
                .return(`page, collect(address) as addresses, recommendation, pinwallData`)
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

            page[0].addresses.length.should.equals(2);
            page[0].addresses.sort(function (a, b) {
                return b.latitude - a.latitude;
            });
            page[0].addresses[0].description.should.equals("addressName2");
            page[0].addresses[0].latitude.should.equals(-4.00);
            page[0].addresses[0].longitude.should.equals(7.00);
            should.exist(page[0].addresses[0].addressId);
            page[0].addresses[1].description.should.equals("addressName");
            page[0].addresses[1].latitude.should.equals(-5.00);
            page[0].addresses[1].longitude.should.equals(6.00);
            should.exist(page[0].addresses[1].addressId);

            page[0].page.topic.length.should.equals(2);
            page[0].page.topic[0].should.equals('health');
            page[0].page.topic[1].should.equals('spiritual');
            page[0].page.language.length.should.equals(2);
            page[0].page.language[0].should.equals('en');
            page[0].page.language[1].should.equals('de');

            page[0].recommendation.created.should.be.at.least(startTime);
            should.exist(page[0].recommendation.recommendationId);
            should.exist(page[0].pinwallData);

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
            return requestHandler.post('/api/user/page/create', createPage, agent);
        }).then(function (res) {
            res.status.should.equal(200);
            pageId = res.body.pageId;
            res.body.previewImage.should.equals(`pages/${pageId}/preview.jpg`);
            return db.cypher().match(`(:User {userId: '1'})-[:RECOMMENDS]->(recommendation:Recommendation:PinwallElement)-[:RECOMMENDS]->
                                      (page:Page {title: 'title'})<-[:IS_ADMIN]-(:User {userId: '1'})`)
                .optionalMatch(`(recommendation)-[pinwallData:PINWALL_DATA]->(page)`)
                .return(`page, recommendation, pinwallData`)
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

            page[0].recommendation.created.should.be.at.least(startTime);
            should.exist(page[0].recommendation.recommendationId);
            should.exist(page[0].pinwallData);

            stubCDN.copyFile.calledWith('pages/default/landscape/preview.jpg', `pages/${pageId}/preview.jpg`).should.be.true;
            stubCDN.copyFile.calledWith('pages/default/landscape/normal.jpg', `pages/${pageId}/normal.jpg`).should.be.true;
            stubCDN.copyFile.calledWith('pages/default/landscape/thumbnail.jpg', `pages/${pageId}/thumbnail.jpg`).should.be.true;
        });
    });
});
