'use strict';

let users = require('elyoos-server-test-util').user;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let moment = require('moment');

describe('Integration Tests for check if user is authenticated', function () {

    let startTime;

    beforeEach(function () {

        return dbDsl.init(1).then(function () {
            startTime = Math.floor(moment.utc().valueOf() / 1000);
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('User is not authenticated', function () {
        return dbDsl.sendToDb().then(function () {
            return requestHandler.get('/api/user/auth');
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.isLoggedIn.should.equals(false);
        });
    });

    it('User is authenticated and last login is less then 24 hours', function () {
        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return db.cypher().match("(user:User {userId: '1'})").set("user", {lastLogin: startTime - 5000}).end().send();
        }).then(function () {
            return requestHandler.get('/api/user/auth');
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.isLoggedIn.should.equals(true);
            return db.cypher().match("(user:User {userId: '1'})")
                .return('user').end().send();
        }).then(function (user) {
            user[0].user.lastLogin.should.equals(startTime - 5000);
        });
    });

    it('User is authenticated and last login was before 24 hours', function () {
        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return db.cypher().match("(user:User {userId: '1'})").set("user", {lastLogin: startTime - 86500}).end().send();
        }).then(function () {
            return requestHandler.get('/api/user/auth');
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.isLoggedIn.should.equals(true);
            return db.cypher().match("(user:User {userId: '1'})")
                .return('user').end().send();
        }).then(function (user) {
            user[0].user.lastLogin.should.be.at.least(startTime);
            user[0].user.previousLastLogin.should.equals(startTime - 86500);
        });
    });
});
