'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');

describe('Getting users who up voted an answer', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(28);
        await requestHandler.logout();
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'Test elyoos.org change the world',
            topics: ['Spiritual', 'Education'], language: 'de', modified: 700
        });
        dbDsl.createTextAnswer('6', {
            creatorId: '2', questionId: '1', answer: 'Answer', created: 600,
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('When logged in and no up votes', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/question/answer/upVotes', {answerId: '6', page: 0});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(0);
    });

    it('When logged in and no user in trust circle', async function () {
        dbDsl.upVoteAnswer({userId: '3', answerId: '6', created: 999});
        dbDsl.upVoteAnswer({userId: '4', answerId: '6', created: 998});
        dbDsl.upVoteAnswer({userId: '5', answerId: '6', created: 997});
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/question/answer/upVotes', {answerId: '6', page: 0});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(3);
        res.body.users[0].userId.should.equals('3');
        res.body.users[0].date.should.equals(999);
        res.body.users[0].name.should.equals('user Meier3');
        res.body.users[0].slug.should.equals('user-meier3');
        res.body.users[0].profileUrl.should.equals('profileImage/3/thumbnail.jpg');
        res.body.users[0].isPersonOfTrust.should.equals(false);

        res.body.users[1].userId.should.equals('4');
        res.body.users[1].date.should.equals(998);
        res.body.users[1].name.should.equals('user Meier4');
        res.body.users[1].slug.should.equals('user-meier4');
        res.body.users[1].profileUrl.should.equals('profileImage/4/thumbnail.jpg');
        res.body.users[1].isPersonOfTrust.should.equals(false);

        res.body.users[2].userId.should.equals('5');
        res.body.users[2].date.should.equals(997);
        res.body.users[2].name.should.equals('user Meier5');
        res.body.users[2].slug.should.equals('user-meier5');
        res.body.users[2].profileUrl.should.equals('profileImage/5/thumbnail.jpg');
        res.body.users[2].isPersonOfTrust.should.equals(false);
    });

    it('When logged in and users in trust circle', async function () {
        dbDsl.upVoteAnswer({userId: '3', answerId: '6', created: 999});
        dbDsl.upVoteAnswer({userId: '4', answerId: '6', created: 998});
        dbDsl.upVoteAnswer({userId: '5', answerId: '6', created: 997});

        dbDsl.createContactConnection('1', '4');
        dbDsl.createContactConnection('1', '5');
        dbDsl.createContactConnection('3', '1');
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/question/answer/upVotes', {answerId: '6', page: 0});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(3);

        res.body.users[0].userId.should.equals('4');
        res.body.users[0].date.should.equals(998);
        res.body.users[0].isPersonOfTrust.should.equals(true);

        res.body.users[1].userId.should.equals('5');
        res.body.users[1].date.should.equals(997);
        res.body.users[1].isPersonOfTrust.should.equals(true);

        res.body.users[2].userId.should.equals('3');
        res.body.users[2].date.should.equals(999);
        res.body.users[2].isPersonOfTrust.should.equals(false);
    });

    it('When public', async function () {
        dbDsl.upVoteAnswer({userId: '1', answerId: '6', created: 999});
        dbDsl.upVoteAnswer({userId: '4', answerId: '6', created: 998});
        dbDsl.upVoteAnswer({userId: '5', answerId: '6', created: 997});
        await dbDsl.sendToDb();

        let res = await requestHandler.get('/api/question/answer/upVotes', {answerId: '6', page: 0});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(3);

        res.body.users[0].userId.should.equals('1');
        res.body.users[0].date.should.equals(999);
        res.body.users[0].isPersonOfTrust.should.equals(false);

        res.body.users[1].userId.should.equals('4');
        res.body.users[1].date.should.equals(998);
        res.body.users[1].isPersonOfTrust.should.equals(false);

        res.body.users[2].userId.should.equals('5');
        res.body.users[2].date.should.equals(997);
        res.body.users[2].isPersonOfTrust.should.equals(false);
    });

    it('Show not user when privacy to contact only and no contact relationship exists', async function () {
        dbDsl.upVoteAnswer({userId: '3', answerId: '6', created: 999});
        dbDsl.setUserPrivacy('3', {privacyMode: 'contactOnly'});
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/question/answer/upVotes', {answerId: '6', page: 0});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(0);
    });

    it('Show user when privacy to contact only and contact relationship exists', async function () {
        dbDsl.upVoteAnswer({userId: '3', answerId: '6', created: 999});
        dbDsl.setUserPrivacy('3', {privacyMode: 'contactOnly'});
        dbDsl.createContactConnection('3', '1');
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/question/answer/upVotes', {answerId: '6', page: 0});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(1);

        res.body.users[0].userId.should.equals('3');
        res.body.users[0].date.should.equals(999);
        res.body.users[0].isPersonOfTrust.should.equals(false);
    });

    it('Show not user when privacy to elyoos only and user is not logged in', async function () {
        dbDsl.upVoteAnswer({userId: '3', answerId: '6', created: 999});
        dbDsl.setUserPrivacy('3', {privacyMode: 'publicEl'});
        await dbDsl.sendToDb();

        let res = await requestHandler.get('/api/question/answer/upVotes', {answerId: '6', page: 0});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(0);
    });

    it('Show user when privacy to elyoos only and user is logged in', async function () {
        dbDsl.upVoteAnswer({userId: '3', answerId: '6', created: 999});
        dbDsl.setUserPrivacy('3', {privacyMode: 'publicEl'});
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/question/answer/upVotes', {answerId: '6', page: 0});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(1);

        res.body.users[0].userId.should.equals('3');
        res.body.users[0].date.should.equals(999);
        res.body.users[0].isPersonOfTrust.should.equals(false);
    });

    it('Do not show the up votes of the logged in user', async function () {
        dbDsl.upVoteAnswer({userId: '1', answerId: '6', created: 999});
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/question/answer/upVotes', {answerId: '6', page: 0});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(0);
    });

    it('Has more is true', async function () {
        for (let index = 3; index < 25; index++) {
            dbDsl.upVoteAnswer({userId: `${index}`, answerId: '6', created: 999 + index});
        }
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/question/answer/upVotes', {answerId: '6', page: 0});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(true);
        res.body.users.length.should.equals(20);
    });
});
