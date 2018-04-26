'use strict';

const users = require('elyoos-server-test-util').user;
const db = require('elyoos-server-test-util').db;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Show question on commitment activation', function () {

    beforeEach(async function () {
        await dbDsl.init(4);

        dbDsl.createRegion('region', {});

        dbDsl.createCommitment('1', {
            adminId: '1', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700,
            website: 'https://www.example.org/', regions: ['region']
        });

        dbDsl.createQuestion('2', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'description',
            topics: ['Spiritual', 'Education'], language: 'de', created: 500, modified: 700
        });

        dbDsl.notificationShowQuestionOnCommitmentRequest('50', {
            questionId: '2', commitmentId: '1', adminId: '1',
            created: 666
        });

        dbDsl.createCommitmentAnswer('100', {
            creatorId: '1', questionId: '2', commitmentId: '1', created: 500, description: 'test'
        });
        dbDsl.upVoteAnswer({userId: '3', answerId: '100'});
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Accept request to show question on commitment detail page', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/commitment/showQuestionRequest/1', {questionId: '2', showQuestion: true});
        res.status.should.equal(200);
        res.body.question.should.equals('Das ist eine Frage');
        res.body.description.should.equals('description');
        res.body.slug.should.equals('das-ist-eine-frage');
        res.body.upVotes.should.equals(1);

        let resp = await db.cypher().match("(n:Notification)").return(`n`).end().send();
        resp.length.should.equals(0);

        resp = await db.cypher().match("(q:Question {questionId: '2'})<-[:SHOW_QUESTION]-(c:Commitment {commitmentId: '1'})")
            .return(`q`).end().send();
        resp.length.should.equals(1);
    });

    it('Deny request to show question on commitment detail page', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/commitment/showQuestionRequest/1', {questionId: '2', showQuestion: false});
        res.status.should.equal(200);

        let resp = await db.cypher().match("(n:Notification)").return(`n`).end().send();
        resp.length.should.equals(0);

        resp = await db.cypher().match("(q:Question {questionId: '2'})<-[:SHOW_QUESTION]-(c:Commitment {commitmentId: '1'})")
            .return(`q`).end().send();
        resp.length.should.equals(0);
    });

    it('Only administrator of commitment is allowed to activate show request', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser2);
        let res = await requestHandler.put('/api/user/commitment/showQuestionRequest/1', {questionId: '2', showQuestion: true});
        res.status.should.equal(400);

        let resp = await db.cypher().match("(n:Notification)").return(`n`).end().send();
        resp.length.should.equals(1);

        resp = await db.cypher().match("(q:Question {questionId: '2'})<-[:SHOW_QUESTION]-(c:Commitment {commitmentId: '1'})")
            .return(`q`).end().send();
        resp.length.should.equals(0);
    });
});
