'use strict';

var app = require('../../../../../server');
var libUser = require('../../../../../lib/user')();
var users = require('../util/user');
var requestHandler = require('../util/request');
var should = require('chai').should();
var db = require('../util/db');

describe('Integration Tests User Name', function () {

    beforeEach(function () {

        libUser.removeFromCache('user@irgendwo.ch');

        return db.clearDatabase().then(function () {

            return db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', userId:'1'})")
                .end().send();
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get User Name when logged in - Return a 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.get('/api/user/userInfo', agent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.name.should.equal('user Meier');
            res.body.profileImage.should.equal('1/thumbnail.jpg');
        });
    });
});
