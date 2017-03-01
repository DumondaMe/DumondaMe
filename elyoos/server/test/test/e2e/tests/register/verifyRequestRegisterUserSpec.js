'use strict';

let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let should = require('chai').should();
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');
let randomstring = require("randomstring");
let _ = require('lodash');
let libUser = require('elyoos-server-lib').user();

describe('Integration Tests for verify registering a new user', function () {

    let registerRequestUserValid = {
        email: 'info@elyoos.org',
        password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm',
        name: 'user Waldvogel',
        forename: 'user',
        surname: 'Waldvogel',
        linkId: randomstring.generate(64)
    }, registerRequestUserExpired, startTime = Math.floor(moment.utc().valueOf() / 1000);
    beforeEach(function () {
        libUser.removeFromCache('info@elyoos.org');
        return dbDsl.init(2).then(function () {
            registerRequestUserExpired = _.cloneDeep(registerRequestUserValid);
            registerRequestUserValid.registerDate = startTime;
            registerRequestUserExpired.registerDate = startTime - (60 * 60 * 12) - 1;
            registerRequestUserExpired.linkId = randomstring.generate(64);
            registerRequestUserExpired.email = 'info2@elyoos.org';
            dbDsl.createUserRegisterRequest(registerRequestUserValid);
            dbDsl.createUserRegisterRequest(registerRequestUserExpired);
            return dbDsl.sendToDb();
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Verify email address with valid linkId - Return 200', function () {

        return requestHandler.post('/api/register/verify', {linkId: registerRequestUserValid.linkId}).then(function (res) {
            res.status.should.equal(200);
            res.body.email.should.equals(registerRequestUserValid.email);

            return db.cypher().match("(friendPrivacy:Privacy)<-[:HAS_PRIVACY {type: 'Freund'}]-(user:User {email: 'info@elyoos.org'})-[:HAS_PRIVACY_NO_CONTACT]->(noContactPrivacy:Privacy)")
                .return('user, friendPrivacy, noContactPrivacy').end().send();
        }).then(function (user) {
            user.length.should.equals(1);
            should.exist(user[0].user.userId);
            user[0].user.name.should.equals('user Waldvogel');
            should.not.exist(user[0].user.linkId);
            user[0].user.forename.should.equals(registerRequestUserValid.forename);
            user[0].user.surname.should.equals(registerRequestUserValid.surname);
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
                'username': 'info@elyoos.org',
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
