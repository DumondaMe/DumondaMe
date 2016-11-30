'use strict';

var db = require('../util/db');
var should = require('chai').should();
var requestHandler = require('../util/request');
var moment = require('moment');
var randomstring = require("randomstring");
var _ = require('lodash');

describe('Integration Tests for verify registering a new user', function () {

    var registerRequestUserValid = {
        email: 'climberwoodi@gmx.ch',
        password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm',
        name: 'user Waldvogel',
        forename: 'user',
        surname: 'Waldvogel',
        birthday: 123546,
        country: 'Schweiz',
        female: true,
        linkId: randomstring.generate(64)
    }, registerRequestUserExpired, startTime = Math.floor(moment.utc().valueOf() / 1000);
    beforeEach(function () {

        return db.clearDatabase().then(function () {
            var commands = [];

            registerRequestUserExpired = _.cloneDeep(registerRequestUserValid);
            registerRequestUserValid.registerDate = startTime;
            registerRequestUserExpired.registerDate = startTime - (60 * 60 * 12) - 1;
            registerRequestUserExpired.linkId = randomstring.generate(64);
            commands.push(db.cypher().create(`(:UserRegisterRequest {data})`).end({data: registerRequestUserValid}).getCommand());
            commands.push(db.cypher().create(`(:UserRegisterRequest {data})`).end({data: registerRequestUserExpired}).getCommand());

            // User 2
            return db.cypher().create("(:User {email: 'user2@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user2 Meier2', userId: '2'})").end().send(commands);
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Verify email address with valid linkId - Return 200', function () {

        return requestHandler.post('/api/register/verify', {linkId: registerRequestUserValid.linkId}).then(function (res) {
            res.status.should.equal(200);
            res.body.email.should.equals(registerRequestUserValid.email);

            return db.cypher().match("(friendPrivacy:Privacy)<-[:HAS_PRIVACY {type: 'Freund'}]-(user:User {email: 'climberwoodi@gmx.ch'})-[:HAS_PRIVACY_NO_CONTACT]->(noContactPrivacy:Privacy)")
                .return('user, friendPrivacy, noContactPrivacy').end().send();
        }).then(function (user) {
            user.length.should.equals(1);
            should.exist(user[0].user.userId);
            user[0].user.name.should.equals('user Waldvogel');
            should.not.exist(user[0].user.linkId);
            user[0].user.forename.should.equals(registerRequestUserValid.forename);
            user[0].user.surname.should.equals(registerRequestUserValid.surname);
            user[0].user.birthday.should.equals(registerRequestUserValid.birthday);
            user[0].user.country.should.equals(registerRequestUserValid.country);
            user[0].user.female.should.equals(registerRequestUserValid.female);
            user[0].user.registerDate.should.equals(startTime);
            user[0].friendPrivacy.profile.should.be.true;
            user[0].friendPrivacy.image.should.be.true;
            user[0].friendPrivacy.contacts.should.be.true;
            user[0].friendPrivacy.profileData.should.be.true;
            user[0].friendPrivacy.pinwall.should.be.true;
            user[0].noContactPrivacy.profile.should.be.true;
            user[0].noContactPrivacy.image.should.be.true;
            user[0].noContactPrivacy.contacts.should.be.true;
            user[0].noContactPrivacy.profileData.should.be.true;
            user[0].noContactPrivacy.pinwall.should.be.true;
            return db.cypher().match("(user:UserRegisterRequest {linkId: {linkId}})")
                .return('user').end({linkId: registerRequestUserValid.linkId}).send();
        }).then(function (user) {
            user.length.should.equals(0);
            return requestHandler.login({
                'username': 'climberwoodi@gmx.ch',
                'password': '1'
            });
        }).then(function (agent) {
            return requestHandler.get('/api/user/userInfo', agent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.name.should.equal('user Waldvogel');
        });
    });

    it('Send Error when linkId has expired - Return 400', function () {

        return requestHandler.post('/api/register/verify', {linkId: registerRequestUserExpired.linkId}).then(function (res) {
            res.status.should.equal(400);

            return db.cypher().match("(user:UserRegisterRequest {linkId: {linkId}})")
                .return('user').end({linkId: registerRequestUserExpired.linkId}).send();
        }).then(function (user) {
            user.length.should.equals(0);
        });
    });

    it('Send Error when linkId does not exist - Return 400', function () {

        return requestHandler.post('/api/register/verify', {linkId: randomstring.generate(64)}).then(function (res) {
            res.status.should.equal(400);

            return db.cypher().match("(user:UserRegisterRequest {linkId: {linkId}})")
                .return('user').end({linkId: registerRequestUserValid.linkId}).send();
        }).then(function (user) {
            user.length.should.equals(1);
        });
    });
});
