'use strict';

const db = require('elyoos-server-test-util').db;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const should = require('chai').should();
const requestHandler = require('elyoos-server-test-util').requestHandler;
const moment = require('moment');
const uuidv4 = require('uuid/v4');
const _ = require('lodash');

describe('Integration Tests for verify registering a new user', function () {

    let registerRequestUserValid = {
            email: 'inFo@elYoos.org',
            emailNormalized: 'info@elyoos.org',
            password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm',
            name: 'user Waldvogel',
            forename: 'user',
            surname: 'Waldvogel',
            latitude: 0,
            longitude: 0,
            linkId: uuidv4()
        }, registerRequestUserExpired, startTime = Math.floor(moment.utc().valueOf() / 1000),
        registerRequestUserValidWithInvitation, registerRequestUserValidCaseSensitiveEmail;

    beforeEach(async function () {
        await dbDsl.init(4);
        registerRequestUserExpired = _.cloneDeep(registerRequestUserValid);
        registerRequestUserValidWithInvitation = _.cloneDeep(registerRequestUserValid);
        registerRequestUserValidCaseSensitiveEmail = _.cloneDeep(registerRequestUserValid);
        registerRequestUserValid.registerDate = startTime;
        registerRequestUserValidCaseSensitiveEmail.registerDate = startTime;
        registerRequestUserValidCaseSensitiveEmail.linkId = uuidv4();
        registerRequestUserValidCaseSensitiveEmail.email = 'info@elyoos.org';
        registerRequestUserExpired.registerDate = startTime - (60 * 60 * 12) - 1;
        registerRequestUserExpired.linkId = uuidv4();
        registerRequestUserExpired.email = 'INFO2@elyoos.org';
        registerRequestUserExpired.emailNormalized = 'info2@elyoos.org';
        registerRequestUserValidWithInvitation.email = 'info3@ELYOOS.org';
        registerRequestUserValidWithInvitation.emailNormalized = 'info3@elyoos.org';
        registerRequestUserValidWithInvitation.registerDate = startTime;
        registerRequestUserValidWithInvitation.linkId = uuidv4();
        dbDsl.createUserRegisterRequest(registerRequestUserValid);
        dbDsl.createUserRegisterRequest(registerRequestUserValidCaseSensitiveEmail);
        dbDsl.createUserRegisterRequest(registerRequestUserExpired);
        dbDsl.createUserRegisterRequest(registerRequestUserValidWithInvitation);

        dbDsl.invitationSentBeforeRegistration('2', [{email: 'info3@ELYOOS.org', emailNormalized: 'info3@elyoos.org'}]);
        dbDsl.invitationSentBeforeRegistration('3', [{email: 'INFO3@elyoos.org', emailNormalized: 'info3@elyoos.org'}]);
        dbDsl.invitationSentBeforeRegistration('4', [{email: 'info3@elyoos.org', emailNormalized: 'info3@elyoos.org'}]);
        await dbDsl.sendToDb();
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Verify email address with valid linkId and create account', async function () {

        let res = await requestHandler.post('/api/register/verify', {linkId: registerRequestUserValid.linkId});
        res.status.should.equal(200);
        res.body.email.should.equals(registerRequestUserValid.email);

        let user = await db.cypher().match("(user:User {email: 'inFo@elYoos.org'})")
            .return('user').end().send();

        user.length.should.equals(1);
        should.exist(user[0].user.userId);
        user[0].user.emailNormalized.should.equals('info@elyoos.org');
        user[0].user.name.should.equals('user Waldvogel');
        should.not.exist(user[0].user.linkId);
        user[0].user.forename.should.equals(registerRequestUserValid.forename);
        user[0].user.surname.should.equals(registerRequestUserValid.surname);
        user[0].user.latitude.should.equals(registerRequestUserValid.latitude);
        user[0].user.longitude.should.equals(registerRequestUserValid.longitude);
        user[0].user.registerDate.should.equals(startTime);
        user[0].user.privacyMode.should.equals('publicEl');

        user = await db.cypher().match("(user:UserRegisterRequest {linkId: {linkId}})")
            .return('user').end({linkId: registerRequestUserValid.linkId}).send();
        user.length.should.equals(0);

        await requestHandler.login({
            'username': 'info@elyoos.org',
            'password': '1'
        });
    });

    it('Verify email address with valid linkId and create account with invitations', async function () {

        let res = await requestHandler.post('/api/register/verify', {linkId: registerRequestUserValidWithInvitation.linkId});
        res.status.should.equal(200);
        res.body.email.should.equals(registerRequestUserValidWithInvitation.email);

        let user = await db.cypher().match("(user:User {email: 'info3@ELYOOS.org'})")
            .return('user').end().send();
        user.length.should.equals(1);
        should.exist(user[0].user.userId);
        user[0].user.emailNormalized.should.equals('info3@elyoos.org');
        user[0].user.name.should.equals('user Waldvogel');
        should.not.exist(user[0].user.linkId);
        user[0].user.forename.should.equals(registerRequestUserValidWithInvitation.forename);
        user[0].user.surname.should.equals(registerRequestUserValidWithInvitation.surname);
        user[0].user.latitude.should.equals(registerRequestUserValid.latitude);
        user[0].user.longitude.should.equals(registerRequestUserValid.longitude);
        user[0].user.registerDate.should.equals(startTime);
        user[0].user.privacyMode.should.equals('publicEl');

        user = await db.cypher().match("(:User {email: 'info3@ELYOOS.org'})<-[:HAS_INVITED]-(user:User)")
            .return('user').orderBy("user.userId").end().send();
        user.length.should.equals(3);
        user[0].user.userId.should.equals('2');
        user[1].user.userId.should.equals('3');
        user[2].user.userId.should.equals('4');

        let invitedUser = await db.cypher().match("(user:InvitedUser)")
            .return('user').end().send();
        invitedUser.length.should.equals(0);

        user = await db.cypher().match("(user:UserRegisterRequest {linkId: {linkId}})")
            .return('user').end({linkId: registerRequestUserValidWithInvitation.linkId}).send();
        user.length.should.equals(0);
        await requestHandler.login({
            'username': 'infO3@elyoos.org',
            'password': '1'
        });
    });

    it('First verify is success. Second verify fails because of same normalized email', async function () {

        let res = await requestHandler.post('/api/register/verify', {linkId: registerRequestUserValid.linkId});
        res.status.should.equal(200);
        res.body.email.should.equals(registerRequestUserValid.email);

        let user = await db.cypher().match("(user:User {email: 'inFo@elYoos.org'})")
            .return('user').end().send();
        user.length.should.equals(1);

        res = await requestHandler.post('/api/register/verify', {linkId: registerRequestUserValidCaseSensitiveEmail.linkId});
        res.status.should.equal(400);

        user = await db.cypher().match("(user:User {email: 'info@elyoos.org'})")
            .return('user').end().send();
        user.length.should.equals(0);

        user = await db.cypher().match("(user:UserRegisterRequest {linkId: {linkId}})")
            .return('user').end({linkId: registerRequestUserValidCaseSensitiveEmail.linkId}).send();
        user.length.should.equals(0);
        await requestHandler.login({
            'username': 'info@elyoos.org',
            'password': '1'
        });
    });

    it('Send Error when linkId does not exist', async function () {

        let res = await requestHandler.post('/api/register/verify', {linkId: uuidv4()});
        res.status.should.equal(400);

        let user = await db.cypher().match("(user:UserRegisterRequest {linkId: {linkId}})")
            .return('user').end({linkId: registerRequestUserValid.linkId}).send();
        user.length.should.equals(1);
    });
});
