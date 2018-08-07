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

        dbDsl.createRegion('international', {de: 'internationalDe', en: 'internationalEn'});
        dbDsl.createRegion('region-1', {parentRegionId: 'international', de: 'Region1De', en: 'Region1En'});
        dbDsl.createRegion('region-2', {parentRegionId: 'international', de: 'Region2De', en: 'Region2En'});

        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});
        dbDsl.createMainTopic({topicId: 'topic2', descriptionDe: 'topic2De', descriptionEn: 'topic2En'});

        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'description', topics: ['topic1'],
            language: 'de'
        });
        dbDsl.createQuestion('2', {
            creatorId: '3', question: 'Das ist eine Frage2', description: 'description2', topics: ['topic2'],
            language: 'en'
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Answer a question with a commitment (Not admin of commitment)', async function () {
        dbDsl.createCommitment('10', {
            adminId: '2', topics: ['topic1', 'topic2'], language: 'de', created: 700,
            website: 'https://www.example.org/', regions: ['region-1'], title: 'Das ist ein Engagement'
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/commitment/1', {
            commitmentId: '10', description: 'This is a commitment', language: 'de'
        });
        res.status.should.equal(200);
        res.body.created.should.least(startTime);
        res.body.imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/10/460x460/title.jpg`);
        res.body.slug.should.equals('das-ist-ein-engagement');
        res.body.creator.name.should.equals('user Meier');
        res.body.creator.isAdminOfCommitment.should.equals(false);
        res.body.creator.thumbnailUrl.should.equals('profileImage/1/thumbnail.jpg');
        res.body.regions.length.should.equals(1);
        res.body.regions.should.include('Region1De');

        let resp = await db.cypher()
            .match(`(q:Question {questionId: '1'})-[:ANSWER]->(answer:CommitmentAnswer:Answer)
                     -[:COMMITMENT]->(c:Commitment {commitmentId: '10'})`)
            .optionalMatch(`(answer)-[showAnswer:SHOW_ANSWER]->(c)`)
            .optionalMatch(`(answer)<-[isCreator:IS_CREATOR]-(:User {userId: '1'})`)
            .optionalMatch(`(q)<-[:NOTIFICATION]-(notification:Notification {type: 'showQuestionRequest'})-[:NOTIFIED]->(:User {userId: '2'})`)
            .optionalMatch(`(c)<-[relNotificationToCommitment:NOTIFICATION]-(notification)`)
            .return(`answer, notification, showAnswer, isCreator, relNotificationToCommitment`).end().send();
        resp.length.should.equals(1);
        resp[0].answer.answerId.should.equals(res.body.answerId);
        resp[0].answer.created.should.equals(res.body.created);
        should.exist(resp[0].notification.notificationId);
        resp[0].notification.created.should.equals(res.body.created);
        resp[0].notification.type.should.equals('showQuestionRequest');
        should.not.exist(resp[0].showAnswer);
        should.exist(resp[0].relNotificationToCommitment);
        should.exist(resp[0].isCreator);
    });

    it('Answer a question with a commitment (Admin of commitment)', async function () {
        dbDsl.createCommitment('10', {
            adminId: '1', topics: ['topic1', 'topic2'], language: 'de', created: 700,
            website: 'https://www.example.org/', regions: ['region-1'], title: 'Das ist ein Engagement'
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/commitment/1', {
            commitmentId: '10', description: 'This is a commitment', language: 'de'
        });
        res.status.should.equal(200);
        res.body.created.should.least(startTime);
        res.body.imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/10/460x460/title.jpg`);
        res.body.slug.should.equals('das-ist-ein-engagement');
        res.body.creator.name.should.equals('user Meier');
        res.body.creator.isAdminOfCommitment.should.equals(true);
        res.body.creator.thumbnailUrl.should.equals('profileImage/1/thumbnail.jpg');
        res.body.regions.length.should.equals(1);
        res.body.regions.should.include('Region1De');

        let resp = await db.cypher()
            .match(`(q:Question {questionId: '1'})-[:ANSWER]->(answer:CommitmentAnswer:Answer)
                     -[:COMMITMENT]->(c:Commitment {commitmentId: '10'})`)
            .optionalMatch(`(answer)-[showAnswer:SHOW_ANSWER]->(c)`)
            .optionalMatch(`(answer)<-[isCreator:IS_CREATOR]-(:User {userId: '1'})`)
            .optionalMatch(`(q)<-[:NOTIFICATION]-(notification:Notification)-[:NOTIFIED]->(:User {userId: '1'})`)
            .optionalMatch(`(c)<-[relNotificationToCommitment:NOTIFICATION]-(notification)`)
            .return(`answer, notification, showAnswer, isCreator, relNotificationToCommitment`).end().send();
        resp.length.should.equals(1);
        resp[0].answer.answerId.should.equals(res.body.answerId);
        resp[0].answer.created.should.equals(res.body.created);
        should.exist(resp[0].notification.notificationId);
        resp[0].notification.created.should.equals(res.body.created);
        resp[0].notification.type.should.equals('showQuestionRequest');
        should.not.exist(resp[0].showAnswer);
        should.exist(resp[0].relNotificationToCommitment);
        should.exist(resp[0].isCreator);
    });

    it('Answer a question with an already linked commitment fails', async function () {
        dbDsl.createCommitment('10', {
            adminId: '1', topics: ['topic1', 'topic2'], language: 'de', created: 700,
            website: 'https://www.example.org/', regions: ['region-1']
        });

        dbDsl.createCommitmentAnswer('100', {
            creatorId: '2', questionId: '1', commitmentId: '10', created: 500, description: 'test'
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/commitment/1', {
            commitmentId: '10', description: 'This is a commitment', language: 'de'
        });
        res.status.should.equal(400);
    });

    it('Prevent xss attack when creating a commitment answer', async function () {
        dbDsl.createCommitment('10', {
            adminId: '2', topics: ['topic1', 'topic2'], language: 'de', created: 700,
            website: 'https://www.example.org/', regions: ['region-1'], title: 'Das ist ein Engagement'
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/commitment/1', {
            commitmentId: '10', description: 'This is a commitment<script>alert()</script>', language: 'de'
        });
        res.status.should.equal(200);

        let resp = await db.cypher()
            .match(`(q:Question {questionId: '1'})-[:ANSWER]->(answer:CommitmentAnswer:Answer)
                     -[:COMMITMENT]->(c:Commitment {commitmentId: '10'})`)
            .return(`answer`).end().send();
        resp.length.should.equals(1);
        resp[0].answer.description.should.equals('This is a commitment');
    });

    it('Allow only to link commitment and question with same language', async function () {
        dbDsl.createCommitment('10', {
            adminId: '2', topics: ['topic1', 'topic2'], language: 'en', created: 700,
            website: 'https://www.example.org/', regions: ['region-1']
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/commitment/1', {
            commitmentId: '10', description: 'This is a commitment', language: 'de'
        });
        res.status.should.equal(400);
    });
});
