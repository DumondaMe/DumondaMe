'use strict';

var app = require('../../../../../server');
var libUser = require('../../../../../lib/user')();
var users = require('../util/user');
var requestHandler = require('../util/request');
var should = require('chai').should();
var db = require('../util/db');

describe('Integration Tests User Profile Data', function () {

    before(function () {

        libUser.removeFromCache('user@irgendwo.ch');
        libUser.removeFromCache('userchange@irgendwo.ch');

        return db.clearDatabase().then(function () {

            return db.cypher().create("(:User {email: {email}, password: {password}, forename: {forename}, surname: {surname}, userId: {userId}})")
                .end({
                    email: 'user@irgendwo.ch',
                    password: '1234',
                    forename: 'user',
                    surname: 'Meier',
                    userId: '0'
                }).send()
                .then(function () {
                    return db.cypher().create("(:User {email: {email}, password: {password}, userId: {userId}})")
                        .end({
                            email: 'userchange@irgendwo.ch',
                            password: '1234',
                            userId: '1'
                        }).send();
                });
        });
    });

    afterEach(function (done) {
        requestHandler.logout(done);
    });

    it('Get User Data when logged in - Return a 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.get('/api/user/profile', agent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.email.should.equal('user@irgendwo.ch');
            res.body.forename.should.equal('user');
            res.body.surname.should.equal('Meier');
        });
    });

    it('Get User Profile Image when logged in - Return a 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.get('/api/user/profile/image', agent);
        }).then(function (res) {
            res.status.should.equal(200);
        });
    });

    it('Get no user data when not logged in - Return a 401', function () {
        return requestHandler.get('/api/user/profile').then(function (res) {
            res.status.should.equal(401);
        });
    });

    it('Post new user data when not logged in- Return a 401', function () {
        var user = {
            forename: 'user',
            surname: 'surname',
            birthday: '1982-06-06',
            country: 'Schweiz',
            female: true
        };

        return requestHandler.post('/api/user/profile', user, null).then(function (res) {
            res.status.should.equal(401);
        });
    });

    it('Post only required valid user data - Return a 200', function () {
        var user = {
            forename: 'user',
            surname: 'surname',
            birthday: '1982-06-06',
            country: 'Schweiz',
            female: true
        };

        return requestHandler.login(users.changeUserData).then(function (agent) {
            return requestHandler.post('/api/user/profile', user, agent);
        }).then(function (res) {
            res.status.should.equal(200);
        });
    });

    it('Post required and optional valid user data - Return a 200', function () {
        var user = {
            forename: 'user',
            surname: 'surname',
            birthday: '1982-06-06',
            country: 'Schweiz',
            female: true,
            street: 'Main Street',
            place: 'Urdorf'
        };

        return requestHandler.login(users.changeUserData).then(function (agent) {
            return requestHandler.post('/api/user/profile', user, agent);
        }).then(function (res) {
            res.status.should.equal(200);
        });
    });
});
