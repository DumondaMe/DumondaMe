'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');

describe('Integration Tests for edit address of generic pages', function () {

    let requestAgent, startTime;

    beforeEach(function () {

        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return dbDsl.init(2).then(function () {
            dbDsl.createGenericPage('0', '1', ['de'], ['health', 'personalDevelopment'], 100, null, [{
                address: 'Zuerich',
                description: 'description1',
                lat: 47.376887,
                lng: 8.541694,
                addressId: '1'
            }, {
                address: 'Zuerich10',
                description: 'description2',
                lat: 47.37688734,
                lng: 8.54169456,
                addressId: '2'
            }]);
            dbDsl.createGenericPage('1', '2', ['de'], ['health', 'personalDevelopment'], 100, null, [{
                address: 'Zuerich',
                description: 'description2',
                lat: 47.3768874,
                lng: 8.5416944,
                addressId: '3'
            }]);

            return dbDsl.sendToDb();
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Edit an address - Return 200', function () {

        let editAddress = {
            edit: {
                addressId: '1',
                address: 'ZürichNeu',
                description: 'description',
                lat: 47.37,
                lng: 8.54,
            }
        }, eventId;

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/address', editAddress, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(address:Address {addressId :'1'})<-[:HAS]-(page:Page {pageId: '0'})")
                .return(`address`)
                .end({eventId: eventId}).send();
        }).then(function (resp) {
            resp.length.should.equals(1);

            resp[0].address.address.should.equals("ZürichNeu");
            resp[0].address.description.should.equals("description");
            resp[0].address.latitude.should.equals(47.37);
            resp[0].address.longitude.should.equals(8.54);
        });
    });

    it('Not allowed to edit address of other admin - Return 400', function () {

        let editAddress = {
            edit: {
                addressId: '3',
                address: 'ZürichNeu',
                description: 'description',
                lat: 47.37,
                lng: 8.54,
            }
        };

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/address', editAddress, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });

});
