'use strict';

const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;

describe('Getting the status of the challenges', function () {

    beforeEach(async function () {
        await dbDsl.init(5);

    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('No challenge completed', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/notification', {skip: 0, limit: 10});
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

    it('Challenge create a commitment completed', async function () {
        dbDsl.createRegion('region-1', {de: 'regionDe', en: 'regionEn'});
        dbDsl.createCommitment('2', {
            adminId: '1', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700, modified: 701,
            website: 'https://www.example.org/', regions: ['region-1'], title: 'Das ist ein Test'
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/notification', {skip: 0, limit: 10});
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

    it('Challenge create a question completed', async function () {
        dbDsl.createQuestion('1', {
            creatorId: '1', question: 'Das ist eine Frage', description: 'description', topics: ['Spiritual'],
            language: 'de'
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/notification', {skip: 0, limit: 10});
        res.status.should.equal(200);
        res.body.challengeStatus.createAccount.should.equals(true);
        res.body.challengeStatus.watchQuestion.should.equals(false);
        res.body.challengeStatus.watchCommitment.should.equals(false);
        res.body.challengeStatus.likeAnswer.should.equals(false);
        res.body.challengeStatus.addedPersonToTrustCircle.should.equals(false);
        res.body.challengeStatus.createdAnswer.should.equals(false);
        res.body.challengeStatus.createdQuestion.should.equals(true);
        res.body.challengeStatus.createdCommitment.should.equals(false);
    });

    it('Challenge create a answer completed', async function () {
        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'description', topics: ['Spiritual'],
            language: 'de'
        });
        dbDsl.createBookAnswer('5', {
            creatorId: '1', questionId: '1', created: 555, authors: 'Hans Wurst', googleBookId: '1234',
            hasPreviewImage: true
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/notification', {skip: 0, limit: 10});
        res.status.should.equal(200);
        res.body.challengeStatus.createAccount.should.equals(true);
        res.body.challengeStatus.watchQuestion.should.equals(false);
        res.body.challengeStatus.watchCommitment.should.equals(false);
        res.body.challengeStatus.likeAnswer.should.equals(false);
        res.body.challengeStatus.addedPersonToTrustCircle.should.equals(false);
        res.body.challengeStatus.createdAnswer.should.equals(true);
        res.body.challengeStatus.createdQuestion.should.equals(false);
        res.body.challengeStatus.createdCommitment.should.equals(false);
    });

    it('Challenge added person to trust circle completed', async function () {
        dbDsl.notificationOneTimeFirstTrustCircleUser('10', {userId: '1', created: 500});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/notification', {skip: 0, limit: 10});
        res.status.should.equal(200);
        res.body.challengeStatus.createAccount.should.equals(true);
        res.body.challengeStatus.watchQuestion.should.equals(false);
        res.body.challengeStatus.watchCommitment.should.equals(false);
        res.body.challengeStatus.likeAnswer.should.equals(false);
        res.body.challengeStatus.addedPersonToTrustCircle.should.equals(true);
        res.body.challengeStatus.createdAnswer.should.equals(false);
        res.body.challengeStatus.createdQuestion.should.equals(false);
        res.body.challengeStatus.createdCommitment.should.equals(false);
    });

    it('Challenge like first answer completed', async function () {
        dbDsl.notificationOneTimeUpVoteFirstAnswer('10', {userId: '1', created: 500});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/notification', {skip: 0, limit: 10});
        res.status.should.equal(200);
        res.body.challengeStatus.createAccount.should.equals(true);
        res.body.challengeStatus.watchQuestion.should.equals(false);
        res.body.challengeStatus.watchCommitment.should.equals(false);
        res.body.challengeStatus.likeAnswer.should.equals(true);
        res.body.challengeStatus.addedPersonToTrustCircle.should.equals(false);
        res.body.challengeStatus.createdAnswer.should.equals(false);
        res.body.challengeStatus.createdQuestion.should.equals(false);
        res.body.challengeStatus.createdCommitment.should.equals(false);
    });

    it('Challenge watch first commitment completed', async function () {
        dbDsl.notificationOneTimeWatchFirstCommitment('10', {userId: '1', created: 500});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/notification', {skip: 0, limit: 10});
        res.status.should.equal(200);
        res.body.challengeStatus.createAccount.should.equals(true);
        res.body.challengeStatus.watchQuestion.should.equals(false);
        res.body.challengeStatus.watchCommitment.should.equals(true);
        res.body.challengeStatus.likeAnswer.should.equals(false);
        res.body.challengeStatus.addedPersonToTrustCircle.should.equals(false);
        res.body.challengeStatus.createdAnswer.should.equals(false);
        res.body.challengeStatus.createdQuestion.should.equals(false);
        res.body.challengeStatus.createdCommitment.should.equals(false);
    });

    it('Challenge watch first question completed', async function () {
        dbDsl.notificationOneTimeWatchFirstQuestion('10', {userId: '1', created: 500});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/notification', {skip: 0, limit: 10});
        res.status.should.equal(200);
        res.body.challengeStatus.createAccount.should.equals(true);
        res.body.challengeStatus.watchQuestion.should.equals(true);
        res.body.challengeStatus.watchCommitment.should.equals(false);
        res.body.challengeStatus.likeAnswer.should.equals(false);
        res.body.challengeStatus.addedPersonToTrustCircle.should.equals(false);
        res.body.challengeStatus.createdAnswer.should.equals(false);
        res.body.challengeStatus.createdQuestion.should.equals(false);
        res.body.challengeStatus.createdCommitment.should.equals(false);
    });
});
