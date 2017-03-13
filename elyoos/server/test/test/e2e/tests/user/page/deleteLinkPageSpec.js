'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let stubCDN = require('elyoos-server-test-util').stubCDN();

describe('Integration Tests for deleting a link page', function () {

    beforeEach(function () {

        return dbDsl.init(2).then(function () {
            dbDsl.createLinkPage('0', {language: ['de'], topic: ['health', 'personalDevelopment'], created: 501, link: 'www.host.com/test', heightPreviewImage: 200});
            dbDsl.createLinkPage('1', {language: ['de'], topic: ['health', 'personalDevelopment'], created: 502, link: 'www.host.com/test', heightPreviewImage: 201});
            dbDsl.createLinkPage('2', {adminId: '2', language: ['de'], topic: ['health', 'personalDevelopment'], created: 503, link: 'www.host.com/test', heightPreviewImage: 202});

            dbDsl.crateRecommendationsForPage('0', [{userId: '1', created: 507}]);
            dbDsl.crateRecommendationsForPage('1', [{userId: '2', created: 508}]);
            return dbDsl.sendToDb();
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Delete Successfully a link page', function () {

        stubCDN.deleteFolder.reset();
        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.del('/api/user/page', {pageId: '0'}, agent);
        }).then(function (res) {
            res.status.should.equal(200);
            stubCDN.deleteFolder.calledWith("pages/0/").should.be.true;
            return db.cypher().match("(page:Page {pageId: '0'})")
                .return('page').end().send();
        }).then(function (page) {
            page.length.should.equals(0);
            return db.cypher().match("(recommendation:Recommendation {recommendationId: '0'})")
                .return('recommendation').end().send();
        }).then(function (page) {
            page.length.should.equals(0);
        });
    });

    it('Delete a link page failed because recommendation of other user exists - Return 400', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.del('/api/user/page', {pageId: '1'}, agent);
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(page:Page {pageId: '1'})")
                .return('page').end().send();
        }).then(function (page) {
            page.length.should.equals(1);
            return db.cypher().match("(recommendation:Recommendation {recommendationId: '1'})")
                .return('recommendation').end().send();
        }).then(function (page) {
            page.length.should.equals(1);
        });
    });

    it('Delete a link page failed because user is not admin of page - Return 400', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.del('/api/user/page', {pageId: '2'}, agent);
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(page:Page {pageId: '2'})")
                .return('page').end().send();
        }).then(function (page) {
            page.length.should.equals(1);
        });
    });

});
