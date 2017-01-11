'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');
let stubCDN = require('elyoos-server-test-util').stubCDN();

describe('Integration Tests for deleting a page', function () {

    let requestAgent, startTime;

    beforeEach(function () {

        startTime = Math.floor(moment.utc().valueOf() / 1000);

        return dbDsl.init(4).then(function () {
            dbDsl.createBookPage('0', ['de'], ['health', 'personalDevelopment'], 5090, 'HansMuster', 1000);
            dbDsl.createYoutubePage('1', ['de'], ['health', 'personalDevelopment'], 5091, 'https://www.youtube.com/watch?v=hTarMdJub0M',
                'https://www.youtube.com/embed/hTarMdJub0M', 'youtubePage1Title');
            dbDsl.createYoutubePage('2', ['de'], ['health', 'personalDevelopment'], 5092, 'https://www.youtube.com/watch?v=hTarMdJub0M',
                'https://www.youtube.com/embed/hTarMdJub0M', 'youtubePage2Title');

            dbDsl.createGenericPage('3', '1', ['en', 'de'], ['environmental', 'spiritual'], 100, 'Test1Place',
                [{description: 'Zuerich', lat: 47.376887, lng: 8.541694}],
                [{description: 'Zuerich2', lat: 47.376887, lng: 8.541694}]);

            dbDsl.addAdminToPage('1', '0');
            dbDsl.addAdminToPage('1', '1');
            dbDsl.addAdminToPage('2', '2');

            dbDsl.crateRecommendationsForPage('0', [{userId: '1', created: 507}]);
            dbDsl.crateRecommendationsForPage('1', [{userId: '2', created: 508}]);
            dbDsl.crateRecommendationsForPage('3', [{userId: '1', created: 508}]);
            return dbDsl.sendToDb();
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Delete Successfully a page - Return 200', function () {

        stubCDN.deleteFolder.reset();
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.del('/api/user/page', {pageId: '0'}, requestAgent);
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

    it('Delete Successfully a generic page - Return 200', function () {

        stubCDN.deleteFolder.reset();
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.del('/api/user/page', {pageId: '3'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            stubCDN.deleteFolder.calledWith("pages/3/").should.be.true;
            return db.cypher().match("(page:Page {pageId: '3'})")
                .return('page').end().send();
        }).then(function (page) {
            page.length.should.equals(0);
            return db.cypher().match("(recommendation:Recommendation {recommendationId: '2'})")
                .return('recommendation').end().send();
        }).then(function (page) {
            page.length.should.equals(0);
        });
    });

    it('Delete a page failed because recommendation of other user exists - Return 400', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.del('/api/user/page', {pageId: '1'}, requestAgent);
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

    it('Delete a page failed because user is not admin of page - Return 400', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.del('/api/user/page', {pageId: '2'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(page:Page {pageId: '2'})")
                .return('page').end().send();
        }).then(function (page) {
            page.length.should.equals(1);
        });
    });

});
