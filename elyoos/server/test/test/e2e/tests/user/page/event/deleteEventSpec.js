'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');

describe('Integration Tests for deleting an event of a page', function () {

    let requestAgent, startTime;

    beforeEach(function () {

        startTime = Math.floor(moment.utc().valueOf() / 1000);

        return dbDsl.init(4).then(function () {
            dbDsl.createGenericPage('0', {adminId: '1', language: ['de'], topic: ['health', 'personalDevelopment'], modified: 100}, [{
                address: 'Zuerich',
                lat: 47.376887,
                lng: 8.541694,
                addressId: '1'
            }]);
            dbDsl.createGenericPage('1', {adminId: '2', language: ['en'], topic: ['health', 'personalDevelopment'], modified: 100}, [{
                address: 'Zuerich',
                lat: 47.376887,
                lng: 8.541694,
                addressId: '2'
            }]);
            dbDsl.createPageEventExistingAddress('0', {
                eventId: '10', title: 'Event1', description: 'Super Event1',
                startDate: startTime + 500, endDate: startTime + 550
            }, '1');
            dbDsl.createPageEventExistingAddress('1', {
                eventId: '11', title: 'Event2', description: 'Super Event2',
                startDate: startTime + 501, endDate: startTime + 551
            }, '2');
            dbDsl.createPageEventNewAddress('0', {
                eventId: '12', title: 'Event3', description: 'Super Event3',
                startDate: startTime - 2, endDate: startTime + 600
            }, {addressId: '10', address: 'Urdorf', lat: 48.05642, lng: 8.36542});
            dbDsl.createPageEventNewAddress('0', {
                eventId: '13', title: 'Event4', description: 'Super Event4',
                startDate: startTime + 200, endDate: startTime + 600
            }, {addressId: '11', address: 'Urdorf', lat: 48.05642, lng: 8.36542});
            dbDsl.createPageEventExistingAddress('0', {
                eventId: '14', title: 'Event5', description: 'Super Event5',
                startDate: startTime + 555, endDate: startTime + 566
            }, '11');
            return dbDsl.sendToDb();
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Delete successfully an event of a page (Address belongs to page)- Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.del('/api/user/page/event', {eventId: '10'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(event:Event {eventId: '10'})")
                .return('event').end().send();
        }).then(function (event) {
            event.length.should.equals(0);
            return db.cypher().match("(address:Address {addressId: '1'})")
                .return('address').end().send();
        }).then(function (address) {
            address.length.should.equals(1);
        });

    });

    it('Delete successfully an event of a page (Address belongs to event)- Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.del('/api/user/page/event', {eventId: '12'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(event:Event {eventId: '12'})")
                .return('event').end().send();
        }).then(function (event) {
            event.length.should.equals(0);
            return db.cypher().match("(address:Address {addressId: '10'})")
                .return('address').end().send();
        }).then(function (address) {
            address.length.should.equals(0);
        });

    });

    it('Delete successfully an event of a page (Address belongs to multiple events)- Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.del('/api/user/page/event', {eventId: '13'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(event:Event {eventId: '13'})")
                .return('event').end().send();
        }).then(function (event) {
            event.length.should.equals(0);
            return db.cypher().match("(address:Address {addressId: '11'})")
                .return('address').end().send();
        }).then(function (address) {
            address.length.should.equals(1);
        });

    });

    it('Delete an event failed because user is not admin of event - Return 400', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.del('/api/user/page/event', {eventId: '11'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(event:Event {eventId: '11'})")
                .return('event').end().send();
        }).then(function (event) {
            event.length.should.equals(1);
        });
    });

});
