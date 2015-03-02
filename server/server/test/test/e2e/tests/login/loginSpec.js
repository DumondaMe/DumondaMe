'use strict';

var app = require('../../../../../server');
var request = require('supertest');
var users = require('../util/user');
var db = require('../util/db');

describe('Integration Tests Login', function () {

    before(function () {
        return db.clearDatabase().then(function () {
            return db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '1234', userId:'1' })")
                .end().send();
        });
    });

    it('Login - Return a 400 when invalid username', function (done) {
        request(app).post('/api/login').send(users.invalidUsername).expect(400).end(done);
    });
    it('Login - Return a 400 when invalid password', function (done) {
        request(app).post('/api/login').send(users.invalidPassword).expect(400).end(done);
    });

    it('Login - Return a 200', function (done) {
        request(app).post('/api/login').send(users.validUser).expect(200).end(done);
    });

    it('Logout - Return a 200', function (done) {
        request(app).post('/api/logout').expect(200, done);
    });
});