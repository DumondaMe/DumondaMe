'use strict';

const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const should = require('chai').should();
const moment = require('moment');

describe('Get the invitations already sent to answer a question', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(6);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});

        dbDsl.createQuestion('10', {
            creatorId: '4', question: 'Das ist eine Frage', topics: ['topic1'], language: 'de'
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('No Invitation sent to answer a question', async function () {
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/question/invite/alreadySent', {questionId: '10'});
        res.status.should.equal(200);

        res.body.users.length.should.equal(0);
    });

    it('Invitation sent to answer a question to not registered user', async function () {
        dbDsl.invitePreviouslyInvitedUserToAnswerQuestion({
            userId: '1', emailOfUserToInvite: 'not.exist@irgendwo.ch', questionId: '10',
        });
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/question/invite/alreadySent', {questionId: '10'});
        res.status.should.equal(200);

        res.body.users.length.should.equal(1);
        should.not.exist(res.body.users[0].userId);
        should.not.exist(res.body.users[0].name);
        should.not.exist(res.body.users[0].userImage);
        res.body.users[0].email.should.equals('not.exist@irgendwo.ch');
    });

    it('Invitation sent to answer a question to registered user', async function () {
        dbDsl.inviteRegisteredUserToAnswerQuestion({
            userId: '1', userIdOfUserToInvite: '2', questionId: '10',
        });
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/question/invite/alreadySent', {questionId: '10'});
        res.status.should.equal(200);

        res.body.users.length.should.equal(1);
        res.body.users[0].userId.should.equals('2');
        res.body.users[0].name.should.equals('user Meier2');
        res.body.users[0].userImage.should.equals('profileImage/2/thumbnail.jpg');
    });

    it('Two Invitation sent to answer a question to registered user', async function () {
        dbDsl.inviteRegisteredUserToAnswerQuestion({
            userId: '1', userIdOfUserToInvite: '2', questionId: '10',
        });
        dbDsl.inviteRegisteredUserToAnswerQuestion({
            userId: '1', userIdOfUserToInvite: '3', questionId: '10',
        });
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/question/invite/alreadySent', {questionId: '10'});
        res.status.should.equal(200);

        res.body.users.length.should.equal(2);
        res.body.users[0].userId.should.equals('2');
        res.body.users[0].name.should.equals('user Meier2');
        res.body.users[0].userImage.should.equals('profileImage/2/thumbnail.jpg');
        res.body.users[1].userId.should.equals('3');
        res.body.users[1].name.should.equals('user Meier3');
        res.body.users[1].userImage.should.equals('profileImage/3/thumbnail.jpg');
    });
});
