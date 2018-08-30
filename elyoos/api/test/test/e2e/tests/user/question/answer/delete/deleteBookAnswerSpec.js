'use strict';

const users = require('elyoos-server-test-util').user;
const db = require('elyoos-server-test-util').db;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const requestHandler = require('elyoos-server-test-util').requestHandler;
const stubCDN = require('elyoos-server-test-util').stubCDN();
const sinon = require('sinon');
const moment = require('moment');

describe('Delete book answer', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(3);
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        stubCDN.deleteFolder.reset();
        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'description', topics: ['Spiritual', 'Health'],
            language: 'de'
        });
        dbDsl.createBookAnswer('5', {
            creatorId: '1', questionId: '1', created: 555, authors: 'Hans Wurst', googleBookId: '1234',
            hasPreviewImage: true
        });
        dbDsl.createBookAnswer('6', {
            creatorId: '2', questionId: '1', created: 666, authors: 'Hans Wurst', googleBookId: '1235',
            hasPreviewImage: true
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Delete book answer (without notes)', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question/answer/', {answerId: '5'});
        res.status.should.equal(200);
        stubCDN.deleteFolder.calledWith(`book/5/`, sinon.match.any).should.be.true;

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->
                                            (answer:Answer {answerId: '5'})`)
            .return(`answer`).end().send();
        resp.length.should.equals(0);
    });

    it('Delete book answer (with notes)', async function () {
        dbDsl.createNote('50', {answerId: '5', creatorId: '1', created: 555});
        dbDsl.createNote('51', {answerId: '5', creatorId: '2', created: 555});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question/answer/', {answerId: '5'});
        res.status.should.equal(200);
        stubCDN.deleteFolder.calledWith(`book/5/`, sinon.match.any).should.be.true;

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->
                                            (answer:Answer {answerId: '5'})`)
            .return(`answer`).end().send();
        resp.length.should.equals(0);
    });

    it('The user is only allowed to delete book answers that he has created', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question/answer/', {answerId: '6'});
        res.status.should.equal(400);
        stubCDN.deleteFolder.calledWith(`book/6/`, sinon.match.any).should.be.false;

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->
                                            (answer:Answer {answerId: '6'})`)
            .return(`answer`).end().send();
        resp.length.should.equals(1);
        resp[0].answer.title.should.equals('book6Title');
        resp[0].answer.created.should.equals(666);
    });
});
