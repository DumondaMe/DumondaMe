'use strict';

const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const should = require('chai').should();
const requestHandler = require('dumonda-me-server-test-util').requestHandler;

describe('Search user to invite to answer a question by email', function () {

    beforeEach(async function () {
        await dbDsl.init(4);
        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});

        dbDsl.createQuestion('10', {
            creatorId: '4', question: 'Das ist eine Frage', topics: ['topic1'], language: 'de'
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Search registered users allowed to send E-Mail', async function () {
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/question/invite/search',
            {query: 'user2@irgendwo.ch', skip: 0, limit: 10, questionId: '10'});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(1);
        res.body.users[0].userId.should.equals('2');
        res.body.users[0].name.should.equals('user Meier2');
        res.body.users[0].userImage.should.equals('profileImage/2/profilePreview.jpg');
        res.body.users[0].isTrustUser.should.equals(false);
        res.body.users[0].sendingEmailAllowed.should.equals(true);
    });

    it('Search invited users allowed to send E-Mail', async function () {
        dbDsl.invitationSentBeforeRegistration('2', [{
            emailOfUserToInvite: 'invited.user@test.me'
        }]);

        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/question/invite/search',
            {query: 'invited.user@test.me', skip: 0, limit: 10, questionId: '10'});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(1);
        should.not.exist(res.body.users[0].userId);
        should.not.exist(res.body.users[0].name);
        should.not.exist(res.body.users[0].userImage);
        should.not.exist(res.body.users[0].isTrustUser);
        res.body.users[0].email.should.equals('invited.user@test.me');
        res.body.users[0].sendingEmailAllowed.should.equals(true);
    });

    it('Unknown users allowed to send E-Mail', async function () {
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/question/invite/search',
            {query: 'invited.user@te-st.me', skip: 0, limit: 10, questionId: '10'});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(1);
        should.not.exist(res.body.users[0].userId);
        should.not.exist(res.body.users[0].name);
        should.not.exist(res.body.users[0].userImage);
        should.not.exist(res.body.users[0].isTrustUser);
        res.body.users[0].email.should.equals('invited.user@te-st.me');
        res.body.users[0].sendingEmailAllowed.should.equals(true);
    });

    it('Search registered user not allowed to send E-Mail because E-Mail has already been sent for this question', async function () {
        dbDsl.inviteRegisteredUserToAnswerQuestion({userId: '1', userIdOfUserToInvite: '2', questionId: '10'});

        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/question/invite/search',
            {query: 'user2@irgendwo.ch', skip: 0, limit: 10, questionId: '10'});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(1);
        res.body.users[0].userId.should.equals('2');
        res.body.users[0].name.should.equals('user Meier2');
        res.body.users[0].userImage.should.equals('profileImage/2/profilePreview.jpg');
        res.body.users[0].isTrustUser.should.equals(false);
        res.body.users[0].sendingEmailAllowed.should.equals(false);
    });

    it('Search invited user not allowed to send E-Mail because E-Mail has already been sent for this question', async function () {
        dbDsl.invitationSentBeforeRegistration('2', [{
            emailOfUserToInvite: 'invited.user@test.me',
        }]);

        dbDsl.invitePreviouslyInvitedUserToAnswerQuestion(
            {userId: '1', emailOfUserToInvite: 'invited.user@test.me', questionId: '10'});

        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/question/invite/search',
            {query: 'invited.User@test.me', skip: 0, limit: 10, questionId: '10'});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(1);
        should.not.exist(res.body.users[0].userId);
        should.not.exist(res.body.users[0].name);
        should.not.exist(res.body.users[0].userImage);
        should.not.exist(res.body.users[0].isTrustUser);
        res.body.users[0].email.should.equals('invited.User@test.me');
        res.body.users[0].sendingEmailAllowed.should.equals(false);
    });

    it('Search registered user not allowed to send E-Mail because user has deactivated email notifications', async function () {
        dbDsl.disableEMailNotification('2');
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/question/invite/search',
            {query: 'user2@irgendwo.ch', skip: 0, limit: 10, questionId: '10'});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(1);
        res.body.users[0].userId.should.equals('2');
        res.body.users[0].name.should.equals('user Meier2');
        res.body.users[0].userImage.should.equals('profileImage/2/profilePreview.jpg');
        res.body.users[0].isTrustUser.should.equals(false);
        res.body.users[0].sendingEmailAllowed.should.equals(false);
    });

    it('Search registered user not allowed to send E-Mail because user has deactivated invitation', async function () {
        dbDsl.disableInviteAnswerQuestionNotification('2');
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/question/invite/search',
            {query: 'user2@irgendwo.ch', skip: 0, limit: 10, questionId: '10'});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(1);
        res.body.users[0].userId.should.equals('2');
        res.body.users[0].name.should.equals('user Meier2');
        res.body.users[0].userImage.should.equals('profileImage/2/profilePreview.jpg');
        res.body.users[0].isTrustUser.should.equals(false);
        res.body.users[0].sendingEmailAllowed.should.equals(false);
    });

    it('Search invited user not allowed to send E-Mail because invited user has deactivated email notifications', async function () {
        dbDsl.invitationSentBeforeRegistration('2', [{
            emailOfUserToInvite: 'invited.user@test.me'
        }]);
        dbDsl.disableEMailNotificationForInvitedUser('invited.user@test.me');
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/question/invite/search',
            {query: 'invited.user@test.me', skip: 0, limit: 10, questionId: '10'});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(1);
        should.not.exist(res.body.users[0].userId);
        should.not.exist(res.body.users[0].name);
        should.not.exist(res.body.users[0].userImage);
        should.not.exist(res.body.users[0].isTrustUser);
        res.body.users[0].email.should.equals('invited.user@test.me');
        res.body.users[0].sendingEmailAllowed.should.equals(false);
    });

    it('Not allowed to send to logged in user email address', async function () {
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/question/invite/search',
            {query: 'user@irgendwo.ch', skip: 0, limit: 10, questionId: '10'});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(1);
        res.body.users[0].userId.should.equals('1');
        res.body.users[0].name.should.equals('user Meier');
        res.body.users[0].userImage.should.equals('profileImage/1/profilePreview.jpg');
        res.body.users[0].isTrustUser.should.equals(false);
        res.body.users[0].sendingEmailAllowed.should.equals(false);
    });

    it('Not allowed to send to user with privacy onlyContact and logged in user is not in trust circle', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'onlyContact'});

        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/question/invite/search',
            {query: 'user2@irgendwo.ch', skip: 0, limit: 10, questionId: '10'});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(1);
        res.body.users[0].userId.should.equals('2');
        res.body.users[0].name.should.equals('user Meier2');
        res.body.users[0].userImage.should.equals('profileImage/default/profilePreview.jpg');
        res.body.users[0].isTrustUser.should.equals(false);
        res.body.users[0].sendingEmailAllowed.should.equals(false);
    });

    it('Allowed to send to user with privacy onlyContact when logged in user is in trust circle', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'onlyContact'});
        dbDsl.createContactConnection('2', '1');

        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/question/invite/search',
            {query: 'user2@irgendwo.ch', skip: 0, limit: 10, questionId: '10'});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(1);
        res.body.users[0].userId.should.equals('2');
        res.body.users[0].name.should.equals('user Meier2');
        res.body.users[0].userImage.should.equals('profileImage/2/profilePreview.jpg');
        res.body.users[0].isTrustUser.should.equals(false);
        res.body.users[0].sendingEmailAllowed.should.equals(true);
    });
});
