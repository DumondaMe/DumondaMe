'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let geocoder = require('./../../../../../models/util/geocoder');
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
        let stubGeoCode = sandbox.stub(geocoder, 'geocode');
        stubGeoCode.returns([{formatted: 'Zürich'}, {formatted: 'Urdorf'}]);
        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.getWithData('/api/address/suggestion', {address: 'test'}, agent);
        }).then(function (res) {
            res.status.should.equal(200);

            stubGeoCode.withArgs('test').calledOnce.should.equals(true);

            res.body.length.should.equals(2);
            res.body[0].formatted.should.equals('Zürich');
            res.body[1].formatted.should.equals('Urdorf');
        });
    });
});
