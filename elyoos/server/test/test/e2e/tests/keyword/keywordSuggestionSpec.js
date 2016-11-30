'use strict';

var users = require('../util/user');
var dbDsl = require('../util/dbDSL');
var requestHandler = require('../util/request');

describe('Integration Tests for getting keyword suggestions', function () {

    var requestAgent;

    beforeEach(function () {

        return dbDsl.init(1).then(function () {
            dbDsl.createKeywords('Yoga');
            dbDsl.createKeywords('Yoga Nidra');
            dbDsl.createKeywords('Meditation');
            dbDsl.createKeywords('Shop');
            return dbDsl.sendToDb();
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Search a keyword- Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/keyword/suggestion', {search: 'yo'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.elements.length.should.equals(2);
            res.body.elements.should.include({description: 'Yoga'});
            res.body.elements.should.include({description: 'Yoga Nidra'});
        });
    });
});
