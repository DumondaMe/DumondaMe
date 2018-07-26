'use strict';

const dbDsl = require('elyoos-server-test-util').dbDSL;
const users = require('elyoos-server-test-util').user;
const requestHandler = require('elyoos-server-test-util').requestHandler;
const moment = require('moment');

describe('Get feed of the user with question filter', function () {

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
        dbDsl.createContactConnection('1', '2');

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
        let res = await requestHandler.get('/api/user/feed', {typeFilter: 'question'});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.totalNumberOfElements.should.equals(1);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Text');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].answerId.should.equals('5');
        res.body.feed[0].answer.should.equals('Answer');
        res.body.feed[0].questionId.should.equals('1');
        res.body.feed[0].question.should.equals('Das ist eine Frage');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage');
        res.body.feed[0].created.should.equals(600);
        res.body.feed[0].creator.userId.should.equals('5');
        res.body.feed[0].creator.name.should.equals('user Meier5');
        res.body.feed[0].creator.slug.should.equals('user-meier5');
        res.body.feed[0].creator.userImage.should.equals('profileImage/5/thumbnail.jpg');
    });

    it('Newly created answers by users from the Trust Circle', async function () {
        dbDsl.createContactConnection('1', '5');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed', {typeFilter: 'question'});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.totalNumberOfElements.should.equals(1);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Text');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].answerId.should.equals('5');
        res.body.feed[0].answer.should.equals('Answer');
        res.body.feed[0].questionId.should.equals('1');
        res.body.feed[0].question.should.equals('Das ist eine Frage');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage');
        res.body.feed[0].created.should.equals(600);
        res.body.feed[0].creator.userId.should.equals('5');
        res.body.feed[0].creator.name.should.equals('user Meier5');
        res.body.feed[0].creator.slug.should.equals('user-meier5');
        res.body.feed[0].creator.userImage.should.equals('profileImage/5/thumbnail.jpg');
    });

    it('Newly created questions by users from the Trust Circle', async function () {
        dbDsl.createContactConnection('1', '6');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed', {typeFilter: 'question'});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.totalNumberOfElements.should.equals(1);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Question');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].questionId.should.equals('2');
        res.body.feed[0].question.should.equals('Das ist eine Frage2');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage2');
        res.body.feed[0].description.should.equals('Test elyoos.org change the world');
        res.body.feed[0].descriptionHtml.should.equals(`Test <a href="http://elyoos.org" class="linkified" target="_blank">elyoos.org</a> change the world`);
        res.body.feed[0].created.should.equals(602);
        res.body.feed[0].numberOfAnswers.should.equals(0);
        res.body.feed[0].creator.userId.should.equals('6');
        res.body.feed[0].creator.name.should.equals('user Meier6');
        res.body.feed[0].creator.slug.should.equals('user-meier6');
        res.body.feed[0].creator.userImage.should.equals('profileImage/6/thumbnail.jpg');
    });

    it('A user from the Trust Circle watches a question', async function () {
        dbDsl.createContactConnection('1', '9');
        dbDsl.watchQuestion({questionId: '2', userId: '9', created: 999});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed', {typeFilter: 'question'});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.totalNumberOfElements.should.equals(1);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Question');
        res.body.feed[0].action.should.equals('watch');
        res.body.feed[0].questionId.should.equals('2');
        res.body.feed[0].question.should.equals('Das ist eine Frage2');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage2');
        res.body.feed[0].descriptionHtml.should.equals(`Test <a href="http://elyoos.org" class="linkified" target="_blank">elyoos.org</a> change the world`);
        res.body.feed[0].created.should.equals(999);
        res.body.feed[0].numberOfAnswers.should.equals(0);
        res.body.feed[0].creator.userId.should.equals('9');
        res.body.feed[0].creator.name.should.equals('user Meier9');
        res.body.feed[0].creator.slug.should.equals('user-meier9');
        res.body.feed[0].creator.userImage.should.equals('profileImage/9/thumbnail.jpg');
    });

    it('Up vote of an answer by users from the Trust Circle', async function () {
        dbDsl.createContactConnection('1', '9');
        dbDsl.upVoteAnswer({userId: '9', answerId: '5', created: 999});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed', {typeFilter: 'question'});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.totalNumberOfElements.should.equals(1);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Text');
        res.body.feed[0].action.should.equals('upVote');
        res.body.feed[0].answerId.should.equals('5');
        res.body.feed[0].answer.should.equals('Answer');
        res.body.feed[0].questionId.should.equals('1');
        res.body.feed[0].question.should.equals('Das ist eine Frage');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage');
        res.body.feed[0].created.should.equals(999);
        res.body.feed[0].creator.userId.should.equals('9');
        res.body.feed[0].creator.name.should.equals('user Meier9');
        res.body.feed[0].creator.slug.should.equals('user-meier9');
        res.body.feed[0].creator.userImage.should.equals('profileImage/9/thumbnail.jpg');

    });

    it('A user from the Trust Circle watches a commitment', async function () {
        dbDsl.createContactConnection('1', '9');
        dbDsl.watchCommitment({commitmentId: '100', userId: '9', created: 999});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed', {typeFilter: 'question'});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.totalNumberOfElements.should.equals(0);
        res.body.feed.length.should.equals(0);
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
        let res = await requestHandler.get('/api/user/feed', {typeFilter: 'question'});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.totalNumberOfElements.should.equals(0);
        res.body.feed.length.should.equals(0);
    });
});
