'use strict';

let users = require('dumonda-me-server-test-util').user;
let db = require('dumonda-me-server-test-util').db;
let dbDsl = require('dumonda-me-server-test-util').dbDSL;
let requestHandler = require('dumonda-me-server-test-util').requestHandler;
let moment = require('moment');

describe('Delete commitment answer', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(3);
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'description', topics: ['Spiritual', 'Health'],
            language: 'de'
        });
        dbDsl.createCommitment('100', {
            adminId: '2', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700,
            website: 'https://www.example.org/', regions: ['region-1'], title: 'Das ist ein Engagement'
        });
        dbDsl.createCommitmentAnswer('5', {
            creatorId: '1', questionId: '1', commitmentId: '100', created: 555, description: 'test'
        });
        dbDsl.createCommitment('101', {
            adminId: '2', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700,
            website: 'https://www.example2.org/', regions: ['region-1'], title: 'Das ist ein Engagement2'
        });
        dbDsl.createCommitmentAnswer('6', {
            creatorId: '2', questionId: '1', commitmentId: '101', created: 666, description: 'test2'
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Delete commitment answer (without notification)', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question/answer/', {answerId: '5'});
        res.status.should.equal(200);

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->
                                            (answer:Answer {answerId: '5'})`)
            .return(`answer`).end().send();
        resp.length.should.equals(0);
    });

    it('Delete commitment answer (with notification)', async function () {
        dbDsl.notificationShowQuestionOnCommitmentRequest('50', {questionId: '1', commitmentId: '100', adminId: '2',
            created: 777});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question/answer/', {answerId: '5'});
        res.status.should.equal(200);

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->
                                            (answer:Answer {answerId: '5'})`)
            .return(`answer`).end().send();
        resp.length.should.equals(0);

        resp = await db.cypher().match(`(notification:Notification)`)
            .return(`notification`).end().send();
        resp.length.should.equals(0);
    });

    it('Delete commitment answer (with show question)', async function () {
        dbDsl.showQuestionOnCommitment({questionId: '1', commitmentId: '100'});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question/answer/', {answerId: '5'});
        res.status.should.equal(200);

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->
                                            (answer:Answer {answerId: '5'})`)
            .return(`answer`).end().send();
        resp.length.should.equals(0);

        resp = await db.cypher().match(`(c:Commitment)-[SHOW_QUESTION]->(:Question)`)
            .return(`c`).end().send();
        resp.length.should.equals(0);
    });

    it('The user is only allowed to delete commitment answers that he has created', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question/answer/', {answerId: '6'});
        res.status.should.equal(400);

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->
                                            (answer:Answer {answerId: '6'})`)
            .return(`answer`).end().send();
        resp.length.should.equals(1);
        resp[0].answer.description.should.equals('test2');
        resp[0].answer.created.should.equals(666);
    });
});
