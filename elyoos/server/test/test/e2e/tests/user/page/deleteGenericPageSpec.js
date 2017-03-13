'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let stubCDN = require('elyoos-server-test-util').stubCDN();

describe('Integration Tests for deleting a generic page', function () {

    beforeEach(function () {

        return dbDsl.init(4).then(function () {

            dbDsl.createGenericPage('0', {adminId: '1', language: ['en'], topic: ['spiritual'], created: 100}, [
                {addressId: '0', description: 'Zuerich', lat: 47.376887, lng: 8.541694},
                {addressId: '1', description: 'Zuerich2', lat: 47.376887, lng: 8.541694}]);
            dbDsl.createGenericPage('1', {adminId: '1', language: ['en'], topic: ['spiritual'], created: 100}, [
                {addressId: '2', description: 'Zuerich', lat: 47.376887, lng: 8.541694},
                {addressId: '3', description: 'Zuerich2', lat: 47.376887, lng: 8.541694}]);
            dbDsl.createGenericPage('2', {adminId: '2', language: ['en'], topic: ['spiritual'], created: 100}, [
                {addressId: '4', description: 'Zuerich', lat: 47.376887, lng: 8.541694},
                {addressId: '5', description: 'Zuerich2', lat: 47.376887, lng: 8.541694}]);

            dbDsl.createPageEventNewAddress('0', {
                eventId: '1', title: 'Event', description: 'Super Event',
                startDate: 500, endDate: 600
            }, {addressId: '13', address: 'Urdorf', lat: 48.05642, lng: 8.36542});

            dbDsl.createPageEventExistingAddress('0', {
                eventId: '2', title: 'Event2', description: 'Super Event2',
                startDate: 500, endDate: 550
            }, '1');

            dbDsl.crateRecommendationsForPage('0', [{userId: '1', created: 507}]);
            dbDsl.crateRecommendationsForPage('1', [{userId: '2', created: 508}]);
            return dbDsl.sendToDb();
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Delete Successfully a generic page - Return 200', function () {

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

    it('Delete a generic page failed because recommendation of other user exists - Return 400', function () {

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

    it('Delete a generic page failed because user is not admin of page - Return 400', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.del('/api/user/page', {pageId: '1'}, agent);
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(page:Page {pageId: '1'})")
                .return('page').end().send();
        }).then(function (page) {
            page.length.should.equals(1);
        });
    });

});
