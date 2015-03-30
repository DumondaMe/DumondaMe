'use strict';

var app = require('../../../../../server');
var libUser = require('../../../../../lib/user')();
var users = require('../util/user');
var db = require('../util/db');
var requestHandler = require('../util/request');
var should = require('chai').should();
var moment = require('moment');

describe('Integration Tests for register a new user', function () {

    var requestAgent;

    beforeEach(function () {

        libUser.removeFromCache('user@irgendwo.ch');

        return db.clearDatabase().then(function () {
            var commands = [];

            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', userId: '0'})").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '0'})")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false})")
                .end({}).getCommand());

            // User 2
            return db.cypher().create("(:User {email: 'user2@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user2 Meier2', userId: '2'})").end().send(commands);
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Register a valid new user - Return 200', function () {
        var newUser = {
            email: 'climberwoodi@gmx.ch',
            forename: 'user',
            surname: 'Waldvogel',
            birthday: 123546,
            country: 'Schweiz',
            female: true,
            password: '12345678'
        }, startTime = Math.floor(moment.utc().valueOf() / 1000);

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/register', newUser, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(friendPrivacy:Privacy)<-[:HAS_PRIVACY {type: 'Freund'}]-(user:User {email: 'climberwoodi@gmx.ch'})-[:HAS_PRIVACY_NO_CONTACT]->(noContactPrivacy:Privacy)")
                .return('user.name AS name, user.forename AS forename, user.surname AS surname, user.birthday AS birthday, user.country AS country, user.female AS female,' +
                'friendPrivacy.profile AS friendProfile, friendPrivacy.image AS friendImage, friendPrivacy.contacts AS friendContacts, friendPrivacy.profileData AS friendProfileData,' +
                'noContactPrivacy.profile AS noContactProfile, noContactPrivacy.image AS noContactImage, noContactPrivacy.contacts AS noContactContacts, noContactPrivacy.profileData AS noContactProfileData, ' +
                'user.registerDate AS registerDate')
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
            user[0].friendProfile.should.be.true;
            user[0].friendImage.should.be.true;
            user[0].friendContacts.should.be.true;
            user[0].friendProfileData.should.be.true;
            user[0].noContactProfile.should.be.true;
            user[0].noContactImage.should.be.true;
            user[0].noContactContacts.should.be.true;
            user[0].noContactProfileData.should.be.true;
            return requestHandler.logout();
        }).then(function () {
            return requestHandler.login({
                'username': 'climberwoodi@gmx.ch',
                'password': newUser.password
            });
        }).then(function (agent) {
            return requestHandler.get('/api/user/userInfo', agent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.name.should.equal('user Waldvogel');
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
            password: '12345678'
        };

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/register', newUser, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
            res.body.errorCode.should.equal(1);
        });
    });

    //This will be only temporary
    it('Register a new user is only possible for userId 0 - Return 400', function () {
        var newUser = {
            email: 'climberwoodi@gmx.ch',
            forename: 'user',
            surname: 'Waldvogel',
            birthday: 123546,
            country: 'Schweiz',
            female: true,
            password: '12345678'
        };

        return requestHandler.login(users.validUser2).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/register', newUser, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });

});
