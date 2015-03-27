'use strict';

var app = require('../../../../../../server');
var users = require('../../util/user');
var db = require('../../util/db');
var requestHandler = require('../../util/request');
var should = require('chai').should();
var moment = require('moment');

describe('Integration Tests for changing password of a user', function () {

    var requestAgent, startTime;

    beforeEach(function () {

        return db.clearDatabase().then(function () {
            var commands = [];
            startTime = Math.floor(moment.utc().valueOf() / 1000);

            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', userId: '1'})").end().getCommand());
            return db.cypher().match("(u:User {userId: '1'})")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false})")
                .end({}).send(commands);

        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Change the password - Return 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/password', {
                actualPassword: '1',
                newPassword: 'abzBzae1'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return requestHandler.logout();
        }).then(function () {
            return requestHandler.login({
                'username': 'user@irgendwo.ch',
                'password': 'abzBzae1'
            });
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.get('/api/user/userInfo', agent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.name.should.equal('user Meier');
        });
    });

    it('Change the password fails because actual password is wrong - Return 400', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/password', {
                actualPassword: '2',
                newPassword: 'abz1Bzae'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });

    it('Change the password fails because capital letter is missing - Return 400', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/password', {
                actualPassword: '1',
                newPassword: 'abz1bzae'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });

    it('Change the password fails because number letter is missing - Return 400', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/password', {
                actualPassword: '1',
                newPassword: 'abzvBzae'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });
});
