'use strict';

let app = require('../../../../../server');
let request = require('supertest');
let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;

describe('Integration Tests Login', function () {

    beforeEach(function () {
        return dbDsl.init(1).then(dbDsl.sendToDb);
    });

    it('Login - Return 400 when invalid username', function (done) {
        request(app).post('/api/login').send(users.invalidUsername).expect(400).end(done);
    });
    it('Login - Return 400 when invalid password', function (done) {
        request(app).post('/api/login').send(users.invalidPassword).expect(400).end(done);
    });

    it('Login - Return 200', function (done) {
        request(app).post('/api/login').send(users.validUser).expect(200).end(done);
    });

    it('Logout - Return 200', function (done) {
        request(app).post('/api/logout').send({}).expect(200).end(done);
    });
});