'use strict';

var users = require('../util/user');
var dbDsl = require('../util/dbDSL');
var requestHandler = require('../util/request');

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
            res.body.keywords.length.should.equals(3);
            res.body.keywords[0].description.should.equals('Organisation');
            res.body.keywords[1].description.should.equals('Shop');
            res.body.keywords[2].description.should.equals('Yoga');
        });
    });
});
