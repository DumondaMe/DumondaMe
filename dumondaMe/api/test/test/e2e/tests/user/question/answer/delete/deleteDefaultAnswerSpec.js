'use strict';

const users = require('dumonda-me-server-test-util').user;
const db = require('dumonda-me-server-test-util').db;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const sinon = require('sinon');
const stubCDN = require('dumonda-me-server-test-util').stubCDN();
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const moment = require('moment');

describe('Delete default answer', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(3);
        stubCDN.deleteFolder.reset();
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'description', topics: ['Spiritual', 'Health'],
            language: 'de'
        });
        dbDsl.createQuestion('2', {
            creatorId: '3', question: 'Das ist eine Frage2', description: 'description2', topics: ['Health'],
            language: 'en'
        });
        dbDsl.createDefaultAnswer('5', {
            creatorId: '1', questionId:'1', answer: 'Answer'
        });
        dbDsl.createDefaultAnswer('6', {
            creatorId: '2', questionId:'1', answer: 'Answer2'
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Delete default answer (without notes)', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question/answer/', {answerId: '5'});
        res.status.should.equal(200);

        stubCDN.deleteFolder.calledWith(`defaultAnswer/5/`, sinon.match.any).should.be.true;

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->
                                            (answer:Answer {answerId: '5'})`)
            .return(`answer`).end().send();
        resp.length.should.equals(0);
    });

    it('Delete default answer (with notes)', async function () {
        dbDsl.createNote('50', {answerId: '5', creatorId: '1', created: 555});
        dbDsl.createNote('51', {answerId: '5', creatorId: '2', created: 555});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question/answer/', {answerId: '5'});
        res.status.should.equal(200);

        stubCDN.deleteFolder.calledWith(`defaultAnswer/5/`, sinon.match.any).should.be.true;

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->
                                            (answer:Answer {answerId: '5'})`)
            .return(`answer`).end().send();
        resp.length.should.equals(0);
    });

    it('The user is only allowed to delete default answers that he has created', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question/answer/', {answerId: '6'});
        res.status.should.equal(400);

        stubCDN.deleteFolder.calledWith(`defaultAnswer/6/`, sinon.match.any).should.be.false;

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->
                                            (answer:Answer {answerId: '6'})`)
            .return(`answer`).end().send();
        resp.length.should.equals(1);
        resp[0].answer.answer.should.equals('Answer2');
        resp[0].answer.created.should.equals(500);
        resp[0].answer.modified.should.equals(500);
    });
});
