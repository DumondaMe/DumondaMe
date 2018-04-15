'use strict';

const users = require('elyoos-server-test-util').user;
const db = require('elyoos-server-test-util').db;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const requestHandler = require('elyoos-server-test-util').requestHandler;
const moment = require('moment');
const should = require('chai').should();

describe('Creating a commitment answer', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(3);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createRegion('international', {});
        dbDsl.createRegion('region-1', {upperRegionLayerCode: 'international'});
        dbDsl.createRegion('region-2', {upperRegionLayerCode: 'international'});

        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'description', topics: ['Spiritual'],
            language: 'de'
        });
        dbDsl.createQuestion('2', {
            creatorId: '3', question: 'Das ist eine Frage2', description: 'description2', topics: ['Health'],
            language: 'en'
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Answer a question with a commitment', async function () {
        dbDsl.createCommitment('10', {
            adminId: '2', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700,
            website: 'https://www.example.org/', regions: ['region-1']
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/commitment/1', {
            commitmentId: '10', description: 'This is a commitment'
        });
        res.status.should.equal(200);

        let resp = await db.cypher()
            .match(`(q:Question {questionId: '1'})-[:ANSWER]->(answer:CommitmentAnswer:Answer)
                     -[:COMMITMENT]->(c:Commitment {commitmentId: '10'})`)
            .optionalMatch(`(answer)-[showAnswer:SHOW_ANSWER]->(c)`)
            .optionalMatch(`(answer)<-[isCreator:IS_CREATOR]-(:User {userId: '1'})`)
            .optionalMatch(`(q)<-[:NOTIFICATION]-(notification:Notification)-[:NOTIFIED]->(:User {userId: '2'})`)
            .optionalMatch(`(c)<-[relNotificationToCommitment:NOTIFICATION]-(notification)`)
            .return(`answer, notification, showAnswer, isCreator, relNotificationToCommitment`).end().send();
        resp.length.should.equals(1);
        resp[0].notification.created.should.least(startTime);
        resp[0].notification.type.should.equals('showQuestionRequest');
        should.not.exist(resp[0].showAnswer);
        should.exist(resp[0].relNotificationToCommitment);
        should.exist(resp[0].isCreator);
    });

    it('Answer a question with an already linked commitment fails', async function () {
        dbDsl.createCommitment('10', {
            adminId: '1', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700,
            website: 'https://www.example.org/', regions: ['region-1']
        });

        dbDsl.createCommitmentAnswer('100', {
            creatorId: '2', questionId: '1', commitmentId: '10', created: 500, description: 'test'
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/commitment/1', {
            commitmentId: '10', description: 'This is a commitment'
        });
        res.status.should.equal(400);
    });

    it('Allow only to link commitment and question with same language', async function () {
        dbDsl.createCommitment('10', {
            adminId: '2', topics: ['Spiritual', 'Meditation'], language: 'en', created: 700,
            website: 'https://www.example.org/', regions: ['region-1']
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/commitment/1', {
            commitmentId: '10', description: 'This is a commitment'
        });
        res.status.should.equal(400);
    });
});
