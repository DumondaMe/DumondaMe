'use strict';

var app = require('../../../../../server');
var request = require('supertest');
var requestHandler = require('../util/request');
var users = require('../util/user');
var db = require('../util/db');

describe('Integration Tests if user is authenticated', function () {

    var requestAgent;

    before(function () {
        return db.clearDatabase().then(function () {
            return db.cypher().create("(:User {email: {email}, password: {password}})")
                .end({email: 'user@irgendwo.ch', password: '1234'}).send();
        });
    });

    it('Login and check if user is authenticated - Return a 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.get('/api/auth', requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
        });
    });
    it('User is not authenticated  - Return a 401', function (done) {
        request(app).get('/api/auth').send().expect(401).end(done);
    });

});