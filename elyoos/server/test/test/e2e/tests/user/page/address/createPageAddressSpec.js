'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');

describe('Integration Tests for creating new address for generic pages', function () {

    let requestAgent, startTime;

    beforeEach(function () {

        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return dbDsl.init(5).then(function () {
            dbDsl.createGenericPage('1', '1', ['de'], ['health', 'personalDevelopment'], 100, null, [{
                address: 'Zuerich',
                lat: 47.376887,
                lng: 8.541694,
                addressId: '1'
            }]);
            dbDsl.createGenericPage('2', '2', ['de'], ['health', 'personalDevelopment'], 100, null, [{
                address: 'Zuerich',
                lat: 47.376887,
                lng: 8.541694,
                addressId: '2'
            }]);
            return dbDsl.sendToDb();
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Create a new address with all properties - Return 200', function () {

        let createAddress = {
            create: {
                genericPageId: '1',
                address: 'Zuerich2',
                description: 'description',
                lat: 47.3768871,
                lng: 8.5416941
            }
        }, addressId;

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/address', createAddress, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            addressId = res.body.addressId;
            return db.cypher().match("(address:Address {addressId: {addressId}})<-[:HAS]-(page:Page {pageId: '1'})")
                .return(`address, page`).end({addressId: addressId}).send();
        }).then(function (resp) {
            resp.length.should.equals(1);
            resp[0].page.label.should.equals("Generic");

            resp[0].address.address.should.equals("Zuerich2");
            resp[0].address.description.should.equals("description");
            resp[0].address.latitude.should.equals(47.3768871);
            resp[0].address.longitude.should.equals(8.5416941);
        });
    });

    it('Create a new address with only mandatory properties - Return 200', function () {

        let createAddress = {
            create: {
                genericPageId: '1',
                address: 'Zuerich2',
                lat: 47.3768871,
                lng: 8.5416941
            }
        }, addressId;

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/address', createAddress, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            addressId = res.body.addressId;
            return db.cypher().match("(address:Address {addressId: {addressId}})<-[:HAS]-(page:Page {pageId: '1'})")
                .return(`address, page`).end({addressId: addressId}).send();
        }).then(function (resp) {
            resp.length.should.equals(1);
            resp[0].page.label.should.equals("Generic");

            resp[0].address.address.should.equals("Zuerich2");
            resp[0].address.latitude.should.equals(47.3768871);
            resp[0].address.longitude.should.equals(8.5416941);
        });
    });

    it('Create a new address fails because page does not exist (400)', function () {

        let createAddress = {
            create: {
                genericPageId: '3',
                address: 'Zuerich2',
                description: 'description',
                lat: 47.3768871,
                lng: 8.5416941
            }
        };

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/address', createAddress, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });

    it('Create a new address fails because user is not admin of page (400)', function () {

        let createAddress = {
            create: {
                genericPageId: '2',
                address: 'Zuerich2',
                description: 'description',
                lat: 47.3768871,
                lng: 8.5416941
            }
        };

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/address', createAddress, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });

});
