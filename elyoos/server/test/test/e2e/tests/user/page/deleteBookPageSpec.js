'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let stubCDN = require('elyoos-server-test-util').stubCDN();

describe('Integration Tests for deleting a book page', function () {

    beforeEach(function () {

        return dbDsl.init(2).then(function () {
            dbDsl.createBookPage('0', {adminId: '1',language: ['de'], topic: ['health', 'personalDevelopment'], created: 5090, author: 'HansMuster', publishDate: 1000});
            dbDsl.createBookPage('1', {adminId: '1',language: ['de'], topic: ['health', 'personalDevelopment'], created: 5090, author: 'HansMuster', publishDate: 1000});
            dbDsl.createBookPage('2', {adminId: '2',language: ['de'], topic: ['health', 'personalDevelopment'], created: 5090, author: 'HansMuster', publishDate: 1000});

            dbDsl.crateRecommendationsForPage('0', [{userId: '1', created: 507}]);
            dbDsl.crateRecommendationsForPage('1', [{userId: '2', created: 508}]);
            return dbDsl.sendToDb();
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Delete Successfully a book page', function () {

        stubCDN.deleteFolder.reset();
        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.del('/api/user/page', {pageId: '0'});
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

    it('Delete a book page failed because recommendation of other user exists - Return 400', function () {

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.del('/api/user/page', {pageId: '1'});
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

    it('Delete a book page failed because user is not admin of page - Return 400', function () {

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.del('/api/user/page', {pageId: '2'});
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(page:Page {pageId: '2'})")
                .return('page').end().send();
        }).then(function (page) {
            page.length.should.equals(1);
        });
    });

});
