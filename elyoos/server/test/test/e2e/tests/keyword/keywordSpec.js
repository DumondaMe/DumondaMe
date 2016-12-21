'use strict';

var users = require('elyoos-server-test-util').user;
var dbDsl = require('elyoos-server-test-util').dbDSL;
var requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for getting a list of keywords', function () {

    var requestAgent;

    beforeEach(function () {

        return dbDsl.init(1).then(function () {
            dbDsl.createKeywords('Yoga');
            dbDsl.createKeywords('Yoga Nidra');
            dbDsl.createKeywords('Meditation');
            dbDsl.createKeywords('Shop');
            dbDsl.createKeywords('Organisation');
            return dbDsl.sendToDb();
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Search a keyword- Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/keyword', {skip: 1, maxItems: 3}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.elements.length.should.equals(3);
            res.body.elements[0].description.should.equals('Organisation');
            res.body.elements[1].description.should.equals('Shop');
            res.body.elements[2].description.should.equals('Yoga');
        });
    });
});
