'use strict';

var libUser = require('../../../../../lib/user')();
var db = require('../util/db');
var requestHandler = require('../util/request');
var moment = require('moment');
var stubEmailQueue = require('../util/stubEmailQueue');
var sinon = require('sinon');

describe('Integration Tests for request to register a new user', function () {

    beforeEach(function () {

        libUser.removeFromCache('user@irgendwo.ch');

        return db.clearDatabase().then(function () {
            var commands = [];

            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', userId: '0'})").end().getCommand());

            // User 2
            return db.cypher().create("(:User {email: 'user2@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user2 Meier2', userId: '2'})").end().send(commands);
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Start a register request for a valid new user (only mandatory fields) - Return 200', function () {
        var newUser = {
            email: 'climberwoodi@gmx.ch',
            forename: 'user',
            surname: 'Waldvogel',
            birthday: 123546,
            country: 'Schweiz',
            female: true,
            password: '12345678',
            response: '12'
        }, startTime = Math.floor(moment.utc().valueOf() / 1000);

        return requestHandler.post('/api/register', newUser).then(function (res) {
            res.status.should.equal(200);
            stubEmailQueue.createImmediatelyJob.calledWith("registerUserRequest", {
                email: 'climberwoodi@gmx.ch',
                linkId: sinon.match.any
            }).should.be.true;
            return db.cypher().match("(user:UserRegisterRequest {email: 'climberwoodi@gmx.ch'})")
                .return(`user.userId AS userId, user.name AS name, user.forename AS forename, user.surname AS surname, user.birthday AS birthday, 
                         user.country AS country, user.female AS female, user.registerDate AS registerDate`)
                .end().send();
        }).then(function (user) {
            user.length.should.equals(1);
            user[0].name.should.equals('user Waldvogel');
            user[0].forename.should.equals(newUser.forename);
            user[0].surname.should.equals(newUser.surname);
            user[0].birthday.should.equals(newUser.birthday);
            user[0].country.should.equals(newUser.country);
            user[0].female.should.equals(newUser.female);
            user[0].registerDate.should.be.at.least(startTime);
            return requestHandler.logout();
        });
    });

    it('Start a register request for a valid new user (all fields) - Return 200', function () {
        var newUser = {
            email: 'climberwoodi@gmx.ch',
            forename: 'user',
            surname: 'Waldvogel',
            birthday: 123546,
            country: 'Schweiz',
            female: true,
            password: '12345678',
            street: 'irgendwo',
            place: 'Urdorf',
            response: '12'
        }, startTime = Math.floor(moment.utc().valueOf() / 1000);

        return requestHandler.post('/api/register', newUser).then(function (res) {
            res.status.should.equal(200);
            stubEmailQueue.createImmediatelyJob.calledWith("registerUserRequest", {
                email: 'climberwoodi@gmx.ch',
                linkId: sinon.match.any
            }).should.be.true;
            return db.cypher().match("(user:UserRegisterRequest {email: 'climberwoodi@gmx.ch'})")
                .return(`user.userId AS userId, user.name AS name, user.forename AS forename, user.surname AS surname, user.birthday AS birthday, 
                         user.country AS country, user.female AS female, user.street AS street,  user.place AS place, user.registerDate AS registerDate`)
                .end().send();
        }).then(function (user) {
            user.length.should.equals(1);
            user[0].name.should.equals('user Waldvogel');
            user[0].forename.should.equals(newUser.forename);
            user[0].surname.should.equals(newUser.surname);
            user[0].birthday.should.equals(newUser.birthday);
            user[0].country.should.equals(newUser.country);
            user[0].female.should.equals(newUser.female);
            user[0].street.should.equals(newUser.street);
            user[0].place.should.equals(newUser.place);
            user[0].registerDate.should.be.at.least(startTime);
            return requestHandler.logout();
        });
    });

    it('Register a user for a email does already exists fails - Return 400', function () {
        var newUser = {
            email: 'user@irgendwo.ch',
            forename: 'user',
            surname: 'Waldvogel',
            birthday: 123546,
            country: 'Schweiz',
            female: true,
            password: '12345678',
            response: '12'
        };

        return requestHandler.post('/api/register', newUser).then(function (res) {
            res.status.should.equal(400);
            res.body.errorCode.should.equal(2);
        });
    });
});
