'use strict';

const users = require('elyoos-server-test-util').user;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const requestHandler = require('elyoos-server-test-util').requestHandler;
const moment = require('moment');

describe('Get details of a commitment', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(8);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createRegion('region-1', {});
        dbDsl.createRegion('region-2', {});
        dbDsl.createRegion('region-1-1', {upperRegionLayerCode: 'region-1'});
        dbDsl.createRegion('region-1-2', {upperRegionLayerCode: 'region-1'});

        dbDsl.createCommitment('1', {
            adminId: '1', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700, modified: 701,
            website: 'https://www.example.org/', regions: ['region-1-1', 'region-1-2']
        });

        dbDsl.createQuestion('10', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'description',
            topics: ['Spiritual', 'Education'], language: 'de', created: 533, modified: 700
        });
        dbDsl.createQuestion('11', {
            creatorId: '2', question: 'Das ist eine Frage2', description: 'description2',
            topics: ['Spiritual'], language: 'de', created: 544
        });
        dbDsl.createQuestion('12', {
            creatorId: '2', question: 'Das ist eine Frage3', description: 'description3',
            topics: ['Spiritual'], language: 'de', created: 555
        });

        dbDsl.createCommitmentAnswer('100', {
            creatorId: '2', questionId: '10', commitmentId: '1', created: 500, description: 'test'
        });
        dbDsl.createCommitmentAnswer('101', {
            creatorId: '2', questionId: '11', commitmentId: '1', created: 501, description: 'test2'
        });
        dbDsl.createCommitmentAnswer('102', {
            creatorId: '2', questionId: '12', commitmentId: '1', created: 502, description: 'test3'
        });

        dbDsl.createCommitmentEvent({commitmentId: '1', eventId: '22',
            startDate: startTime - 100, endDate: startTime + 200, region: 'region-2'});

        dbDsl.createCommitmentEvent({commitmentId: '1', eventId: '23',
            startDate: startTime - 300, endDate: startTime - 200, region: 'region-2'});
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get a commitment (User is Admin and logged in)', async function () {
        dbDsl.showQuestionOnCommitment({questionId: '10', commitmentId: '1'});
        dbDsl.showQuestionOnCommitment({questionId: '11', commitmentId: '1'});
        dbDsl.upVoteAnswer({userId: '3', answerId: '100'});
        dbDsl.upVoteAnswer({userId: '4', answerId: '100'});
        dbDsl.watchCommitment({commitmentId: '1', userId: '5'});
        dbDsl.watchCommitment({commitmentId: '1', userId: '6'});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/commitment', {commitmentId: '1'});
        res.status.should.equal(200);
        res.body.title.should.equals('commitment1Title');
        res.body.description.should.equals('commitment1Description');
        res.body.imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/1/148x148/title.jpg?v=701`);
        res.body.created.should.equals(700);
        res.body.website.should.equals('https://www.example.org/');
        res.body.lang.should.equals('de');
        res.body.numberOfWatches.should.equals(2);
        res.body.userWatchesCommitment.should.equals(false);
        res.body.regions.length.should.equals(2);
        res.body.regions.should.include('region-1-1');
        res.body.regions.should.include('region-1-2');
        res.body.isAdmin.should.equals(true);
        res.body.topics.length.should.equals(2);
        res.body.topics.should.include('Spiritual');
        res.body.topics.should.include('Meditation');
        res.body.linkedWithQuestions.length.should.equals(2);
        res.body.linkedWithQuestions[0].questionId.should.equals('10');
        res.body.linkedWithQuestions[0].question.should.equals('Das ist eine Frage');
        res.body.linkedWithQuestions[0].slug.should.equals('das-ist-eine-frage');
        res.body.linkedWithQuestions[0].description.should.equals('description');
        res.body.linkedWithQuestions[0].upVotes.should.equals(2);
        res.body.linkedWithQuestions[1].questionId.should.equals('11');
        res.body.linkedWithQuestions[1].question.should.equals('Das ist eine Frage2');
        res.body.linkedWithQuestions[1].slug.should.equals('das-ist-eine-frage2');
        res.body.linkedWithQuestions[1].description.should.equals('description2');
        res.body.linkedWithQuestions[1].upVotes.should.equals(0);

        res.body.events.length.should.equals(1);
        res.body.events[0].eventId.should.equals('22');
        res.body.events[0].title.should.equals('event22Title');
        res.body.events[0].description.should.equals('event22Description');
        res.body.events[0].startDate.should.equals(startTime - 100);
        res.body.events[0].endDate.should.equals(startTime + 200);
        res.body.events[0].region.should.equals('region-2');
        res.body.events[0].location.should.equals('event22Location');
    });

    it('Get a commitment (User is not Admin and logged in)', async function () {
        dbDsl.watchCommitment({commitmentId: '1', userId: '2'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser2);
        let res = await requestHandler.get('/api/commitment', {commitmentId: '1'});
        res.status.should.equal(200);
        res.body.title.should.equals('commitment1Title');
        res.body.description.should.equals('commitment1Description');
        res.body.imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/1/148x148/title.jpg?v=701`);
        res.body.created.should.equals(700);
        res.body.website.should.equals('https://www.example.org/');
        res.body.lang.should.equals('de');
        res.body.numberOfWatches.should.equals(1);
        res.body.userWatchesCommitment.should.equals(true);
        res.body.regions.length.should.equals(2);
        res.body.regions.should.include('region-1-1');
        res.body.regions.should.include('region-1-2');
        res.body.isAdmin.should.equals(false);
        res.body.topics.length.should.equals(2);
        res.body.topics.should.include('Spiritual');
        res.body.topics.should.include('Meditation');
        res.body.linkedWithQuestions.length.should.equals(0);
        res.body.events.length.should.equals(1);
    });

    it('Get a commitment (User is not logged in)', async function () {
        dbDsl.showQuestionOnCommitment({questionId: '10', commitmentId: '1'});
        dbDsl.showQuestionOnCommitment({questionId: '11', commitmentId: '1'});
        dbDsl.upVoteAnswer({userId: '3', answerId: '100'});
        dbDsl.upVoteAnswer({userId: '4', answerId: '100'});
        dbDsl.watchCommitment({commitmentId: '1', userId: '1'});
        dbDsl.watchCommitment({commitmentId: '1', userId: '6'});

        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/commitment', {commitmentId: '1'});
        res.status.should.equal(200);
        res.body.title.should.equals('commitment1Title');
        res.body.description.should.equals('commitment1Description');
        res.body.imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/1/148x148/title.jpg?v=701`);
        res.body.created.should.equals(700);
        res.body.website.should.equals('https://www.example.org/');
        res.body.lang.should.equals('de');
        res.body.numberOfWatches.should.equals(2);
        res.body.userWatchesCommitment.should.equals(false);
        res.body.regions.length.should.equals(2);
        res.body.regions.should.include('region-1-1');
        res.body.regions.should.include('region-1-2');
        res.body.isAdmin.should.equals(false);
        res.body.topics.length.should.equals(2);
        res.body.topics.should.include('Spiritual');
        res.body.topics.should.include('Meditation');
        res.body.linkedWithQuestions.length.should.equals(2);
        res.body.linkedWithQuestions[0].questionId.should.equals('10');
        res.body.linkedWithQuestions[0].question.should.equals('Das ist eine Frage');
        res.body.linkedWithQuestions[0].slug.should.equals('das-ist-eine-frage');
        res.body.linkedWithQuestions[0].description.should.equals('description');
        res.body.linkedWithQuestions[0].upVotes.should.equals(2);
        res.body.linkedWithQuestions[1].questionId.should.equals('11');
        res.body.linkedWithQuestions[1].question.should.equals('Das ist eine Frage2');
        res.body.linkedWithQuestions[1].slug.should.equals('das-ist-eine-frage2');
        res.body.linkedWithQuestions[1].description.should.equals('description2');
        res.body.linkedWithQuestions[1].upVotes.should.equals(0);
        res.body.events.length.should.equals(1);
    });

    it('Get non existing commitment', async function () {
        let res = await requestHandler.get('/api/commitment', {commitmentId: '2'});
        res.status.should.equal(404);
    });

});
