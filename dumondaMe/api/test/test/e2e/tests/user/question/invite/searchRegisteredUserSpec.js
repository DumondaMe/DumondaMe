'use strict';

const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;

describe('Search registered user to invite to answer a question', function () {

    beforeEach(async function () {
        await dbDsl.init(4);
        dbDsl.setUserName('2', {name: 'Hans Wurst'});

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
            {query: 'Hans Wurst', skip: 0, limit: 10, questionId: '10'});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(1);
        res.body.users[0].userId.should.equals('2');
        res.body.users[0].name.should.equals('Hans Wurst');
        res.body.users[0].userImage.should.equals('profileImage/2/profilePreview.jpg');
        res.body.users[0].isTrustUser.should.equals(false);
        res.body.users[0].sendingEmailAllowed.should.equals(true);
    });

    it('Show trust circle user first', async function () {
        dbDsl.setUserName('3', {name: 'Hans Wur'});
        dbDsl.createContactConnection('1', '3');
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/question/invite/search',
            {query: 'Hans Wurst', skip: 0, limit: 10, questionId: '10'});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(2);
        res.body.users[0].userId.should.equals('3');
        res.body.users[0].name.should.equals('Hans Wur');
        res.body.users[0].userImage.should.equals('profileImage/3/profilePreview.jpg');
        res.body.users[0].isTrustUser.should.equals(true);
        res.body.users[0].sendingEmailAllowed.should.equals(true);

        res.body.users[1].userId.should.equals('2');
        res.body.users[1].name.should.equals('Hans Wurst');
        res.body.users[1].userImage.should.equals('profileImage/2/profilePreview.jpg');
        res.body.users[1].isTrustUser.should.equals(false);
        res.body.users[1].sendingEmailAllowed.should.equals(true);
    });

    it('Do not show logged in user', async function () {
        dbDsl.setUserName('1', {name: 'Alice im Wunderland'});
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/question/invite/search',
            {query: 'Alice im Wunderland', skip: 0, limit: 10, questionId: '10'});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(0);
    });

    it('Do not show user with privacy contactOnly and logged in user is not in trust circle', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'onlyContact'});
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/question/invite/search',
            {query: 'Hans Wurst', skip: 0, limit: 10, questionId: '10'});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(0);
    });

    it('Show user with privacy contactOnly and logged in user is in trust circle', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'onlyContact'});
        dbDsl.createContactConnection('2', '1');
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/question/invite/search',
            {query: 'Hans Wurst', skip: 0, limit: 10, questionId: '10'});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(1);
        res.body.users[0].userId.should.equals('2');
        res.body.users[0].name.should.equals('Hans Wurst');
        res.body.users[0].userImage.should.equals('profileImage/2/profilePreview.jpg');
        res.body.users[0].isTrustUser.should.equals(false);
        res.body.users[0].sendingEmailAllowed.should.equals(true);
    });

    it('Search registered user not allowed to send E-Mail because E-Mail has already been sent for this question', async function () {
        dbDsl.inviteRegisteredUserToAnswerQuestion({userId: '1', userIdOfUserToInvite: '2', questionId: '10'});

        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/question/invite/search',
            {query: 'Hans Wurst', skip: 0, limit: 10, questionId: '10'});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(1);
        res.body.users[0].userId.should.equals('2');
        res.body.users[0].name.should.equals('Hans Wurst');
        res.body.users[0].userImage.should.equals('profileImage/2/profilePreview.jpg');
        res.body.users[0].isTrustUser.should.equals(false);
        res.body.users[0].sendingEmailAllowed.should.equals(false);
    });

    it('Search registered user allowed to send E-Mail because E-Mail has been sent for other question', async function () {
        dbDsl.createQuestion('11', {
            creatorId: '4', question: 'Das ist eine Frage', topics: ['topic1'], language: 'de'
        });
        dbDsl.createQuestion('12', {
            creatorId: '4', question: 'Das ist eine Frage', topics: ['topic1'], language: 'de'
        });
        dbDsl.inviteRegisteredUserToAnswerQuestion({userId: '1', userIdOfUserToInvite: '2', questionId: '11'});
        dbDsl.inviteRegisteredUserToAnswerQuestion({userId: '1', userIdOfUserToInvite: '2', questionId: '12'});

        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/question/invite/search',
            {query: 'Hans Wurst', skip: 0, limit: 10, questionId: '10'});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(1);
        res.body.users[0].userId.should.equals('2');
        res.body.users[0].name.should.equals('Hans Wurst');
        res.body.users[0].userImage.should.equals('profileImage/2/profilePreview.jpg');
        res.body.users[0].isTrustUser.should.equals(false);
        res.body.users[0].sendingEmailAllowed.should.equals(true);
    });

    it('Search registered user not allowed to send E-Mail because user has deactivated email notifications', async function () {
        dbDsl.disableEMailNotification('2');

        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/question/invite/search',
            {query: 'Hans Wurst', skip: 0, limit: 10, questionId: '10'});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(1);
        res.body.users[0].userId.should.equals('2');
        res.body.users[0].name.should.equals('Hans Wurst');
        res.body.users[0].userImage.should.equals('profileImage/2/profilePreview.jpg');
        res.body.users[0].isTrustUser.should.equals(false);
        res.body.users[0].sendingEmailAllowed.should.equals(false);
    });

    it('Not allowed to send E-Mail to administrator of question', async function () {
        dbDsl.setUserName('4', {name: 'Alice im Wunderland'});
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/question/invite/search',
            {query: 'Alice im Wunderland', skip: 0, limit: 10, questionId: '10'});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(1);
        res.body.users[0].userId.should.equals('4');
        res.body.users[0].name.should.equals('Alice im Wunderland');
        res.body.users[0].userImage.should.equals('profileImage/4/profilePreview.jpg');
        res.body.users[0].isTrustUser.should.equals(false);
        res.body.users[0].sendingEmailAllowed.should.equals(false);
    });

    it('Not allowed to send E-Mail to user who has answered question', async function () {
        dbDsl.createBookAnswer('5', {
            creatorId: '2', questionId: '10', created: 555, authors: 'Hans Wurst', googleBookId: '1234',
            hasPreviewImage: true
        });
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/question/invite/search',
            {query: 'Hans Wurst', skip: 0, limit: 10, questionId: '10'});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(1);
        res.body.users[0].userId.should.equals('2');
        res.body.users[0].name.should.equals('Hans Wurst');
        res.body.users[0].userImage.should.equals('profileImage/2/profilePreview.jpg');
        res.body.users[0].isTrustUser.should.equals(false);
        res.body.users[0].sendingEmailAllowed.should.equals(false);
    });
});
