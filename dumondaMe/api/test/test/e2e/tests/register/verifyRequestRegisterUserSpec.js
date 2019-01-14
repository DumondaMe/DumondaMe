'use strict';

const db = require('dumonda-me-server-test-util').db;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const should = require('chai').should();
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const moment = require('moment');
const uuidv4 = require('uuid/v4');
const _ = require('lodash');

describe('Integration Tests for verify registering a new user', function () {

    let registerRequestUserValid = {
            email: 'inFo@duMonda.me',
            emailNormalized: 'info@dumonda.me',
            password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm',
            name: 'user Waldvogel',
            forename: 'user',
            surname: 'Waldvogel',
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
        registerRequestUserValidCaseSensitiveEmail.email = 'info@dumonda.me';
        registerRequestUserExpired.registerDate = startTime - (60 * 60 * 12) - 1;
        registerRequestUserExpired.linkId = uuidv4();
        registerRequestUserExpired.email = 'INFO2@dumonda.me';
        registerRequestUserExpired.emailNormalized = 'info2@dumonda.me';
        registerRequestUserValidWithInvitation.email = 'info3@DUMONDA.me';
        registerRequestUserValidWithInvitation.emailNormalized = 'info3@dumonda.me';
        registerRequestUserValidWithInvitation.registerDate = startTime;
        registerRequestUserValidWithInvitation.linkId = uuidv4();
        dbDsl.createUserRegisterRequest(registerRequestUserValid);
        dbDsl.createUserRegisterRequest(registerRequestUserValidCaseSensitiveEmail);
        dbDsl.createUserRegisterRequest(registerRequestUserExpired);
        dbDsl.createUserRegisterRequest(registerRequestUserValidWithInvitation);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Verify email address with valid linkId and create account', async function () {

        await dbDsl.sendToDb();
        let res = await requestHandler.post('/api/register/verify', {linkId: registerRequestUserValid.linkId});
        res.status.should.equal(200);
        res.body.email.should.equals(registerRequestUserValid.email);

        let user = await db.cypher().match("(user:User:EMailNotificationEnabled {email: 'inFo@duMonda.me'})")
            .return('user').end().send();

        user.length.should.equals(1);
        should.exist(user[0].user.userId);
        user[0].user.emailNormalized.should.equals('info@dumonda.me');
        user[0].user.name.should.equals('user Waldvogel');
        should.not.exist(user[0].user.linkId);
        user[0].user.forename.should.equals(registerRequestUserValid.forename);
        user[0].user.surname.should.equals(registerRequestUserValid.surname);
        user[0].user.registerDate.should.equals(startTime);
        user[0].user.privacyMode.should.equals('publicEl');
        user[0].user.showProfileActivity.should.equals(true);
        user[0].user.languages.length.should.equals(2);
        user[0].user.languages.should.includes('de');
        user[0].user.languages.should.includes('en');

        user = await db.cypher().match("(user:UserRegisterRequest {linkId: {linkId}})")
            .return('user').end({linkId: registerRequestUserValid.linkId}).send();
        user.length.should.equals(0);

        res = await requestHandler.login({
            'username': 'info@dumonda.me',
            'password': '1'
        });
        res.status.should.equal(200);
    });

    it('Verify email address with valid linkId and create account with invitations', async function () {
        dbDsl.invitationSentBeforeRegistration('2', [{emailOfUserToInvite: 'info3@dumonda.me'}]);
        dbDsl.invitationSentBeforeRegistration('3', [{emailOfUserToInvite: 'info3@dumonda.me'}]);
        dbDsl.invitationSentBeforeRegistration('4', [{emailOfUserToInvite: 'info3@dumonda.me'}]);
        await dbDsl.sendToDb();

        let res = await requestHandler.post('/api/register/verify',
            {linkId: registerRequestUserValidWithInvitation.linkId});
        res.status.should.equal(200);
        res.body.email.should.equals(registerRequestUserValidWithInvitation.email);

        let user = await db.cypher().match("(user:User:EMailNotificationEnabled {email: 'info3@DUMONDA.me'})")
            .return('user').end().send();
        user.length.should.equals(1);
        should.exist(user[0].user.userId);
        user[0].user.emailNormalized.should.equals('info3@dumonda.me');
        user[0].user.name.should.equals('user Waldvogel');
        should.not.exist(user[0].user.linkId);
        user[0].user.forename.should.equals(registerRequestUserValidWithInvitation.forename);
        user[0].user.surname.should.equals(registerRequestUserValidWithInvitation.surname);
        user[0].user.registerDate.should.equals(startTime);
        user[0].user.privacyMode.should.equals('publicEl');
        user[0].user.showProfileActivity.should.equals(true);
        user[0].user.languages.length.should.equals(2);
        user[0].user.languages.should.includes('de');
        user[0].user.languages.should.includes('en');

        let notifications = await db.cypher()
            .match(`(user:User)<-[:NOTIFIED]-(n:Notification:Unread {type: 'invitedUserHasRegistered'})
                    -[:ORIGINATOR_OF_NOTIFICATION ]->(:User {emailNormalized: 'info3@dumonda.me'})`)
            .return('user').orderBy("user.userId").end().send();
        notifications.length.should.equals(3);
        notifications[0].user.userId.should.equals('2');
        notifications[1].user.userId.should.equals('3');
        notifications[2].user.userId.should.equals('4');

        let invitedUser = await db.cypher().match("(user:InvitedUser)")
            .return('user').end().send();
        invitedUser.length.should.equals(0);

        user = await db.cypher().match("(user:UserRegisterRequest {linkId: {linkId}})")
            .return('user').end({linkId: registerRequestUserValidWithInvitation.linkId}).send();
        user.length.should.equals(0);
        await requestHandler.login({
            'username': 'infO3@dumonda.me',
            'password': '1'
        });
    });

    it('With invitation to answer one question', async function () {
        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});
        dbDsl.createQuestion('10', {
            creatorId: '2', question: 'Das ist eine Frage', topics: ['topic1'], language: 'de'
        });
        dbDsl.invitePreviouslyInvitedUserToAnswerQuestion(
            {questionId: '10', emailOfUserToInvite: 'info@dumonda.me', userId: '3'});
        await dbDsl.sendToDb();

        let res = await requestHandler.post('/api/register/verify', {linkId: registerRequestUserValid.linkId});
        res.status.should.equal(200);
        res.body.email.should.equals(registerRequestUserValid.email);

        let user = await db.cypher().match("(user:User:EMailNotificationEnabled {email: 'inFo@duMonda.me'})")
            .return('user').end().send();
        user.length.should.equals(1);
        should.exist(user[0].user.userId);
        user[0].user.emailNormalized.should.equals('info@dumonda.me');

        user = await db.cypher()
            .match(`(:User {emailNormalized: 'info@dumonda.me'})<-[:ASKED]-(asked:AskedToAnswerQuestion)
                     -[:QUESTION_TO_ANSWER]->(:Question {questionId: '10'})`)
            .with('asked')
            .match(`(asked)<-[:ASKED_TO_ANSWER_QUESTION]-(user:User {email: 'user3@irgendwo.ch'})`)
            .return('user').end().send();
        user.length.should.equals(1);

        let notifications = await db.cypher()
            .match(`(:User {userId: '3'})<-[:NOTIFIED]-(n:Notification:Unread {type: 'invitedUserHasRegistered'})
                    -[:ORIGINATOR_OF_NOTIFICATION ]->(:User {emailNormalized: 'info@dumonda.me'})`)
        .return('n').end().send();
        notifications.length.should.equals(1);

        let invitedUser = await db.cypher().match("(user:InvitedUser {emailNormalized: 'info@dumonda.me'})")
            .return('user').end().send();
        invitedUser.length.should.equals(0);

        user = await db.cypher().match("(user:UserRegisterRequest {linkId: {linkId}})")
            .return('user').end({linkId: registerRequestUserValid.linkId}).send();
        user.length.should.equals(0);

        res = await requestHandler.login({
            'username': 'info@duMonda.me',
            'password': '1'
        });
        res.status.should.equal(200);
    });

    it('With invitation from two persons to answer one question', async function () {
        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});
        dbDsl.createQuestion('10', {
            creatorId: '2', question: 'Das ist eine Frage', topics: ['topic1'], language: 'de'
        });
        dbDsl.invitePreviouslyInvitedUserToAnswerQuestion(
            {questionId: '10', emailOfUserToInvite: 'info@dumonda.me', userId: '3'});
        dbDsl.invitePreviouslyInvitedUserToAnswerQuestion(
            {questionId: '10', emailOfUserToInvite: 'info@dumonda.me', userId: '2'});
        await dbDsl.sendToDb();

        let res = await requestHandler.post('/api/register/verify', {linkId: registerRequestUserValid.linkId});
        res.status.should.equal(200);
        res.body.email.should.equals(registerRequestUserValid.email);

        let user = await db.cypher().match("(user:User:EMailNotificationEnabled {email: 'inFo@duMonda.me'})")
            .return('user').end().send();
        user.length.should.equals(1);
        should.exist(user[0].user.userId);
        user[0].user.emailNormalized.should.equals('info@dumonda.me');

        user = await db.cypher()
            .match(`(:User {emailNormalized: 'info@dumonda.me'})<-[:ASKED]-(asked:AskedToAnswerQuestion)
                     -[:QUESTION_TO_ANSWER]->(:Question {questionId: '10'})`)
            .with('asked')
            .match(`(asked)<-[:ASKED_TO_ANSWER_QUESTION]-(user:User)`)
            .return('user').end().send();
        user.length.should.equals(2);

        let notifications = await db.cypher()
            .match(`(user:User)<-[:NOTIFIED]-(n:Notification:Unread {type: 'invitedUserHasRegistered'})
                    -[:ORIGINATOR_OF_NOTIFICATION ]->(:User {emailNormalized: 'info@dumonda.me'})`)
            .return('user').orderBy("user.userId").end().send();
        notifications.length.should.equals(2);
        notifications[0].user.userId.should.equals('2');
        notifications[1].user.userId.should.equals('3');

        let invitedUser = await db.cypher().match("(user:InvitedUser {emailNormalized: 'info@dumonda.me'})")
            .return('user').end().send();
        invitedUser.length.should.equals(0);

        user = await db.cypher().match("(user:UserRegisterRequest {linkId: {linkId}})")
            .return('user').end({linkId: registerRequestUserValid.linkId}).send();
        user.length.should.equals(0);

        res = await requestHandler.login({
            'username': 'info@duMonda.me',
            'password': '1'
        });
        res.status.should.equal(200);
    });

    it('With invitation from two persons to answer tow question', async function () {
        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});
        dbDsl.createQuestion('10', {
            creatorId: '4', question: 'Das ist eine Frage', topics: ['topic1'], language: 'de'
        });
        dbDsl.createQuestion('11', {
            creatorId: '4', question: 'Das ist eine Frage', topics: ['topic1'], language: 'de'
        });
        dbDsl.invitePreviouslyInvitedUserToAnswerQuestion(
            {questionId: '10', emailOfUserToInvite: 'info@dumonda.me', userId: '3'});
        dbDsl.invitePreviouslyInvitedUserToAnswerQuestion(
            {questionId: '11', emailOfUserToInvite: 'info@dumonda.me', userId: '2'});
        await dbDsl.sendToDb();

        let res = await requestHandler.post('/api/register/verify', {linkId: registerRequestUserValid.linkId});
        res.status.should.equal(200);
        res.body.email.should.equals(registerRequestUserValid.email);

        let user = await db.cypher().match("(user:User:EMailNotificationEnabled {email: 'inFo@duMonda.me'})")
            .return('user').end().send();
        user.length.should.equals(1);
        should.exist(user[0].user.userId);
        user[0].user.emailNormalized.should.equals('info@dumonda.me');

        user = await db.cypher()
            .match(`(:User {emailNormalized: 'info@dumonda.me'})<-[:ASKED]-(asked:AskedToAnswerQuestion)
                     -[:QUESTION_TO_ANSWER]->(:Question)`)
            .with('asked')
            .match(`(asked)<-[:ASKED_TO_ANSWER_QUESTION]-(user:User)`)
            .return('user').end().send();
        user.length.should.equals(2);

        let notifications = await db.cypher()
            .match(`(user:User)<-[:NOTIFIED]-(n:Notification:Unread {type: 'invitedUserHasRegistered'})
                    -[:ORIGINATOR_OF_NOTIFICATION ]->(:User {emailNormalized: 'info@dumonda.me'})`)
            .return('user').orderBy("user.userId").end().send();
        notifications.length.should.equals(2);
        notifications[0].user.userId.should.equals('2');
        notifications[1].user.userId.should.equals('3');

        let invitedUser = await db.cypher().match("(user:InvitedUser {emailNormalized: 'info@dumonda.me'})")
            .return('user').end().send();
        invitedUser.length.should.equals(0);

        user = await db.cypher().match("(user:UserRegisterRequest {linkId: {linkId}})")
            .return('user').end({linkId: registerRequestUserValid.linkId}).send();
        user.length.should.equals(0);

        res = await requestHandler.login({
            'username': 'info@duMonda.me',
            'password': '1'
        });
        res.status.should.equal(200);
    });

    it('First verify is success. Second verify fails because of same normalized email', async function () {

        await dbDsl.sendToDb();
        let res = await requestHandler.post('/api/register/verify', {linkId: registerRequestUserValid.linkId});
        res.status.should.equal(200);
        res.body.email.should.equals(registerRequestUserValid.email);

        let user = await db.cypher().match("(user:User:EMailNotificationEnabled {email: 'inFo@duMonda.me'})")
            .return('user').end().send();
        user.length.should.equals(1);

        res = await requestHandler.post('/api/register/verify', {linkId: registerRequestUserValidCaseSensitiveEmail.linkId});
        res.status.should.equal(400);

        user = await db.cypher().match("(user:User {email: 'info@dumonda.me'})")
            .return('user').end().send();
        user.length.should.equals(0);

        user = await db.cypher().match("(user:UserRegisterRequest {linkId: {linkId}})")
            .return('user').end({linkId: registerRequestUserValidCaseSensitiveEmail.linkId}).send();
        user.length.should.equals(0);
        await requestHandler.login({
            'username': 'info@dumonda.me',
            'password': '1'
        });
    });

    it('Send Error when linkId does not exist', async function () {

        await dbDsl.sendToDb();
        let res = await requestHandler.post('/api/register/verify', {linkId: uuidv4()});
        res.status.should.equal(400);

        let user = await db.cypher().match("(user:UserRegisterRequest {linkId: {linkId}})")
            .return('user').end({linkId: registerRequestUserValid.linkId}).send();
        user.length.should.equals(1);
    });
});
