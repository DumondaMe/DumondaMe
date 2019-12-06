'use strict';

const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
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

    it('Search registered users', async function () {
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/question/invite/search',
            {email: 'user2@irgendwo.ch', questionId: '10'});
        res.status.should.equal(200);
        res.body.user.email.should.equals('user2@irgendwo.ch');
        res.body.user.isRegisteredUser.should.equals(true);
        res.body.user.alreadySent.should.equals(false);
        res.body.user.unsubscribed.should.equals(false);
    });

    it('Search invited users allowed to send E-Mail', async function () {
        dbDsl.invitationSentBeforeRegistration('2', [{
            emailOfUserToInvite: 'invited.user@test.me'
        }]);

        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/question/invite/search',
            {email: 'invited.user@test.me', questionId: '10'});
        res.status.should.equal(200);
        res.body.user.email.should.equals('invited.user@test.me');
        res.body.user.isRegisteredUser.should.equals(false);
        res.body.user.alreadySent.should.equals(false);
        res.body.user.unsubscribed.should.equals(false);
    });

    it('Unknown users allowed to send E-Mail', async function () {
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/question/invite/search',
            {email: 'invited.user@te-st.me', questionId: '10'});
        res.status.should.equal(200);
        res.body.user.email.should.equals('invited.user@te-st.me');
        res.body.user.isRegisteredUser.should.equals(false);
        res.body.user.alreadySent.should.equals(false);
        res.body.user.unsubscribed.should.equals(false);
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
            {email: 'invited.User@test.me', questionId: '10'});
        res.status.should.equal(200);
        res.body.user.email.should.equals('invited.User@test.me');
        res.body.user.isRegisteredUser.should.equals(false);
        res.body.user.alreadySent.should.equals(true);
        res.body.user.unsubscribed.should.equals(false);
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
            {email: 'invited.user@test.me', questionId: '10'});
        res.status.should.equal(200);
        res.body.user.email.should.equals('invited.user@test.me');
        res.body.user.isRegisteredUser.should.equals(false);
        res.body.user.alreadySent.should.equals(false);
        res.body.user.unsubscribed.should.equals(true);
    });
});
