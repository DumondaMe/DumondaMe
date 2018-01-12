'use strict';

let app = require('../../../../../../server');
let request = require('supertest');
let users = require('elyoos-server-test-util').user;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');
let db = require('elyoos-server-test-util').db;

describe('Integration Tests Login', function () {

    beforeEach(function () {
        return db.clearDatabase().then(function () {
            return db.cypher().create("(:User {email: 'uSer@irgendwo.ch', emailNormalized: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', " +
                "lastLogin: 100, userId:'1' })")
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

    it('Login with capital letters- Return a 200', function (done) {
        request(app).post('/api/login').send(users.validUser3).expect(200).end(done);
    });

    it('Login and setting the flag last login - Return a 200', function () {
        let startTime = Math.floor(moment.utc().valueOf() / 1000);

        return requestHandler.login(users.validUser).then(function () {
            return db.cypher().match("(user:User {userId: '1'})")
                .return("user.lastLogin AS lastLogin, user.previousLastLogin AS previousLastLogin").end().send();
        }).then(function (user) {
            user.length.should.equals(1);
            user[0].lastLogin.should.least(startTime);
            user[0].previousLastLogin.should.equals(100);
        });
    });

    it('Logout - Return a 200', function (done) {
        request(app).post('/api/logout').send({}).expect(200).end(done);
    });
});