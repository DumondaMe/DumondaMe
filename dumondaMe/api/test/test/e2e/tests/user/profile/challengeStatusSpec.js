'use strict';

const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const should = require('chai').should();
const requestHandler = require('dumonda-me-server-test-util').requestHandler;

describe('Getting the status of the challenges in user profile', function () {

    beforeEach(async function () {
        await dbDsl.init(5);

    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('No challenge completed for logged in user', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile', {guiLanguage: 'de', languages: ['de']});
        res.status.should.equal(200);
        res.body.challengeStatus.createAccount.should.equals(true);
        res.body.challengeStatus.watchQuestion.should.equals(false);
        res.body.challengeStatus.watchCommitment.should.equals(false);
        res.body.challengeStatus.likeAnswer.should.equals(false);
        res.body.challengeStatus.addedPersonToTrustCircle.should.equals(false);
        res.body.challengeStatus.createdAnswer.should.equals(false);
        res.body.challengeStatus.createdQuestion.should.equals(false);
        res.body.challengeStatus.createdCommitment.should.equals(false);
    });

    it('Challenge create a commitment completed for logged in user', async function () {
        dbDsl.notificationOneTimeFirstCommitment('16', {userId: '1', created: 506});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile', {guiLanguage: 'de', languages: ['de']});
        res.status.should.equal(200);
        res.body.challengeStatus.createAccount.should.equals(true);
        res.body.challengeStatus.watchQuestion.should.equals(false);
        res.body.challengeStatus.watchCommitment.should.equals(false);
        res.body.challengeStatus.likeAnswer.should.equals(false);
        res.body.challengeStatus.addedPersonToTrustCircle.should.equals(false);
        res.body.challengeStatus.createdAnswer.should.equals(false);
        res.body.challengeStatus.createdQuestion.should.equals(false);
        res.body.challengeStatus.createdCommitment.should.equals(true);
    });

    it('Challenge should not exist for not logged in user', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile', {userId: '2', guiLanguage: 'de', languages: ['de']});
        res.status.should.equal(200);
        should.not.exist(res.body.challengeStatus);
    });

    it('Challenge should not exist for public user', async function () {
        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/user/profile', {userId: '1', guiLanguage: 'de', languages: ['de']});
        res.status.should.equal(200);
        should.not.exist(res.body.challengeStatus);
    });
});
