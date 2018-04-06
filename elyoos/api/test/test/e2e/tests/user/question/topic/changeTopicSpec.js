'use strict';

const users = require('elyoos-server-test-util').user;
const db = require('elyoos-server-test-util').db;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Change topic of a question', function () {

    beforeEach(async function () {
        await dbDsl.init(3);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Change topic of a question', async function () {

        dbDsl.createTopic('Test3');
        dbDsl.createQuestion('1', {
            creatorId: '1', question: 'Das ist eine Frage', description: 'description', topics: ['Test1', 'Test2'],
            language: 'de'
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/topic/1', {
            topics: ['test1', 'Test3', 'Test4'],
        });
        res.status.should.equal(200);

        let resp = await db.cypher().match("(topic:Topic)")
            .optionalMatch("(topic)-[:TOPIC]->(question:Question)")
            .return(`DISTINCT topic.name AS topic, question.questionId AS questionId`).orderBy(`topic.name`).end().send();
        resp.length.should.equals(3);
        resp[0].topic.should.equals('Test1');
        resp[0].questionId.should.equals('1');
        resp[1].topic.should.equals('Test3');
        resp[1].questionId.should.equals('1');
        resp[2].topic.should.equals('Test4');
        resp[2].questionId.should.equals('1');
    });

    it('Change topic of a question (other question references same previous topic)', async function () {

        dbDsl.createQuestion('1', {
            creatorId: '1', question: 'Das ist eine Frage', description: 'description', topics: ['Test1'],
            language: 'de'
        });
        dbDsl.createQuestion('2', {
            creatorId: '2', question: 'Das ist eine Frage2', description: 'description1', topics: ['Test1'],
            language: 'de'
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/topic/1', {
            topics: ['Test3'],
        });
        res.status.should.equal(200);

        let resp = await db.cypher().match("(topic:Topic)")
            .optionalMatch("(topic)-[:TOPIC]->(question:Question)")
            .return(`DISTINCT topic.name AS topic, question.questionId AS questionId`).orderBy(`topic.name`).end().send();
        resp.length.should.equals(2);
        resp[0].topic.should.equals('Test1');
        resp[0].questionId.should.equals('2');
        resp[1].topic.should.equals('Test3');
        resp[1].questionId.should.equals('1');
    });

    it('Not allowed to change topic of a question where user is not admin', async function () {
        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'description', topics: ['Test1'],
            language: 'de'
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/topic/1', {
            topics: ['Test3'],
        });
        res.status.should.equal(400);
    });

    it('Only allowed change topics as logged in user', async function () {
        dbDsl.createQuestion('1', {
            creatorId: '1', question: 'Das ist eine Frage', description: 'description', topics: ['Test1', 'Test2'],
            language: 'de'
        });

        await dbDsl.sendToDb();
        let res = await requestHandler.put('/api/user/question/topic/1', {
            topics: ['test1', 'Test3'],
        });
        res.status.should.equal(401);
    });
});
