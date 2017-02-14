'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');
let should = require('chai').should();

describe('Integration Tests for deleting an address of a page', function () {

    let requestAgent, startTime;

    beforeEach(function () {

        startTime = Math.floor(moment.utc().valueOf() / 1000);

        return dbDsl.init(4).then(function () {

            dbDsl.createGenericPage('0', {adminId: '1', language: ['de'], topic: ['health', 'personalDevelopment'], modified: 100}, [{
                address: 'Zuerich',
                description: 'ZuerichEvent',
                lat: 47.376887,
                lng: 8.541694,
                addressId: '1'
            }, {
                address: 'Zuerich2',
                description: 'Zuerich2Event',
                lat: 47.37,
                lng: 8.52,
                addressId: '2'
            }]);
            dbDsl.createGenericPage('1', {adminId: '2', language: ['de'], topic: ['health', 'personalDevelopment'], modified: 100}, [{
                address: 'Zuerich3',
                description: 'Zuerich3Event',
                lat: 47.376887,
                lng: 8.541694,
                addressId: '3'
            }]);

            dbDsl.createPageEventExistingAddress('0', {
                eventId: '1', title: 'Event1', description: 'Super Event1',
                startDate: startTime + 500, endDate: startTime + 550
            }, '2');

            dbDsl.createPageEventExistingAddress('0', {
                eventId: '2', title: 'Event2', description: 'Super Event2',
                startDate: startTime + 550, endDate: startTime + 570
            }, '2');

            return dbDsl.sendToDb();
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Delete Successfully an address of a page - Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.del('/api/user/page/address', {addressId: '1'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(address:Address {addressId: '1'})")
                .return('address').end().send();
        }).then(function (address) {
            address.length.should.equals(0);
        });

    });

    it('Delete only link to address from page when an event exists- Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.del('/api/user/page/address', {addressId: '2'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(:Event {eventId: '1'})-[:HAS]->(address:Address {addressId: '2'})")
                .optionalMatch("(address)<-[rel:HAS]-(:Page)")
                .return('address, rel').end().send();
        }).then(function (resp) {
            resp.length.should.equals(1);
            resp[0].address.addressId.should.equals('2');
            should.not.exist(resp[0].rel);
        });

    });

    it('Delete an address failed because user is not admin of page - Return 400', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.del('/api/user/page/address', {addressId: '3'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(address:Address {addressId: '3'})")
                .return('address').end().send();
        }).then(function (address) {
            address.length.should.equals(1);
        });
    });

});
