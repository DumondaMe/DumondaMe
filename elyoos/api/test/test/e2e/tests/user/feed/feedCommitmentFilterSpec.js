'use strict';

const dbDsl = require('elyoos-server-test-util').dbDSL;
const users = require('elyoos-server-test-util').user;
const requestHandler = require('elyoos-server-test-util').requestHandler;
const moment = require('moment');

describe('Get feed of the user with commitment filter', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(10);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createRegion('region-1', {});
        dbDsl.createCommitment('100', {
            adminId: '2',
            topics: ['Spiritual', 'Education'],
            language: 'de',
            created: 400,
            modified: 606,
            title: 'Test Commitment',
            website: 'https://www.example.org/',
            regions: ['region-1']
        });
        dbDsl.createContactConnection('1', '4');

        dbDsl.createQuestion('1', {
            creatorId: '4', question: 'Das ist eine Frage', description: 'Test elyoos.org change the world1',
            topics: ['Spiritual', 'Education'], language: 'de', created: 500, modified: 700
        });
        dbDsl.createTextAnswer('5', {
            creatorId: '5', questionId: '1', answer: 'Answer', created: 600,
        });
        dbDsl.createQuestion('2', {
            creatorId: '6', question: 'Das ist eine Frage2', description: 'Test elyoos.org change the world',
            topics: ['Health'], language: 'de', created: 602,
        });

    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Newly created answers to questions the user watches', async function () {
        dbDsl.watchQuestion({questionId: '1', userId: '1'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed', {typeFilter: 'commitment'});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.totalNumberOfElements.should.equals(0);
        res.body.feed.length.should.equals(0);
    });

    it('Newly created answers by users from the Trust Circle', async function () {
        dbDsl.createContactConnection('1', '5');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed', {typeFilter: 'commitment'});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.totalNumberOfElements.should.equals(0);
        res.body.feed.length.should.equals(0);

    });

    it('Newly created questions by users from the Trust Circle', async function () {
        dbDsl.createContactConnection('1', '6');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed', {typeFilter: 'commitment'});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.totalNumberOfElements.should.equals(0);
        res.body.feed.length.should.equals(0);
    });

    it('A user from the Trust Circle watches a question', async function () {
        dbDsl.createContactConnection('1', '9');
        dbDsl.watchQuestion({questionId: '2', userId: '9', created: 999});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed', {typeFilter: 'commitment'});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.totalNumberOfElements.should.equals(0);
        res.body.feed.length.should.equals(0);
    });

    it('Up vote of an answer by users from the Trust Circle', async function () {
        dbDsl.createContactConnection('1', '9');
        dbDsl.upVoteAnswer({userId: '9', answerId: '5', created: 999});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed', {typeFilter: 'commitment'});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.totalNumberOfElements.should.equals(0);
        res.body.feed.length.should.equals(0);
    });

    it('A user from the Trust Circle watches a commitment', async function () {
        dbDsl.createContactConnection('1', '9');
        dbDsl.watchCommitment({commitmentId: '100', userId: '9', created: 999});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed', {typeFilter: 'commitment'});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.totalNumberOfElements.should.equals(1);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Commitment');
        res.body.feed[0].action.should.equals('watch');
        res.body.feed[0].commitmentId.should.equals('100');
        res.body.feed[0].commitmentSlug.should.equals('test-commitment');
        res.body.feed[0].title.should.equals('Test Commitment');
        res.body.feed[0].description.should.equals('commitment100Description');
        res.body.feed[0].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/100/120x120/title.jpg?v=606`);
        res.body.feed[0].regions.length.should.equals(1);
        res.body.feed[0].regions.should.include('region-1');
        res.body.feed[0].created.should.equals(999);
        res.body.feed[0].creator.userId.should.equals('9');
        res.body.feed[0].creator.name.should.equals('user Meier9');
        res.body.feed[0].creator.slug.should.equals('user-meier9');
    });

    it('A user from the Trust Circle created a commitment', async function () {
        dbDsl.createContactConnection('1', '9');
        dbDsl.createCommitment('101', {
            adminId: '9',
            topics: ['Spiritual'],
            language: 'de',
            created: 555,
            modified: 607,
            title: 'Test Commitment',
            website: 'https://www.example.org/',
            regions: ['region-1']
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed', {typeFilter: 'commitment'});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.totalNumberOfElements.should.equals(1);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Commitment');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].commitmentId.should.equals('101');
        res.body.feed[0].commitmentSlug.should.equals('test-commitment');
        res.body.feed[0].title.should.equals('Test Commitment');
        res.body.feed[0].description.should.equals('commitment101Description');
        res.body.feed[0].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/101/120x120/title.jpg?v=607`);
        res.body.feed[0].regions.length.should.equals(1);
        res.body.feed[0].regions.should.include('region-1');
        res.body.feed[0].created.should.equals(555);
        res.body.feed[0].creator.userId.should.equals('9');
        res.body.feed[0].creator.name.should.equals('user Meier9');
        res.body.feed[0].creator.slug.should.equals('user-meier9');
    });
});
