'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let geoCoderWrapper = require('./../../../../../models/util/geocoderWrapper');
let Promise = require('bluebird').Promise;
let sinon = require('sinon');

describe('Integration Tests for getting address suggestion', function () {

    let sandbox;
    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        return dbDsl.init(1).then(function () {
            return dbDsl.sendToDb();
        });
    });

    afterEach(function () {
        sandbox.restore();
        return requestHandler.logout();
    });

    it('Get suggestion for address - Return 200', function () {
        let stubGeoCode = sandbox.stub(geoCoderWrapper, 'geocode');
        stubGeoCode.returns(Promise.resolve({
            raw: {
                results: [{formatted: 'Zürich', geometry: {lat: 1, lng: 2}}, {formatted: 'Urdorf', geometry: {lat: 3, lng: 4}}]
            }
        }));
        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.get('/api/address/suggestion', {address: 'test'}, agent);
        }).then(function (res) {
            res.status.should.equal(200);

            stubGeoCode.withArgs('test').calledOnce.should.equals(true);

            res.body.length.should.equals(2);
            res.body[0].address.should.equals('Zürich');
            res.body[0].latitude.should.equals(1);
            res.body[0].longitude.should.equals(2);
            res.body[1].address.should.equals('Urdorf');
            res.body[1].latitude.should.equals(3);
            res.body[1].longitude.should.equals(4);
        });
    });
});
