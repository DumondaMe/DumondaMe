'use strict';

const users = require('dumonda-me-server-test-util').user;
const db = require('dumonda-me-server-test-util').db;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const stubCDN = require('dumonda-me-server-test-util').stubCDN();
const sinon = require('sinon');
const moment = require('moment');

describe('Delete link answer', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(3);
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        stubCDN.deleteFolder.reset();
        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'description', topics: ['Spiritual', 'Health'],
            language: 'de'
        });
        dbDsl.createLinkAnswer('5', {
            creatorId: '1', questionId: '1', created: 555,
            link: 'https://example.com', pageType: 'blog'
        });
        dbDsl.createLinkAnswer('6', {
            creatorId: '2', questionId: '1', created: 666,
            link: 'https://example2.com', pageType: 'blog'
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Delete link answer (without notes)', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question/answer/', {answerId: '5'});
        res.status.should.equal(200);
        stubCDN.deleteFolder.calledWith(`link/5/`, sinon.match.any).should.be.true;

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->
                                            (answer:Answer {answerId: '5'})`)
            .return(`answer`).end().send();
        resp.length.should.equals(0);
    });

    it('Delete link answer (with notes)', async function () {
        dbDsl.createNote('50', {answerId: '5', creatorId: '1', created: 555});
        dbDsl.createNote('51', {answerId: '5', creatorId: '2', created: 555});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question/answer/', {answerId: '5'});
        res.status.should.equal(200);
        stubCDN.deleteFolder.calledWith(`link/5/`, sinon.match.any).should.be.true;

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->
                                            (answer:Answer {answerId: '5'})`)
            .return(`answer`).end().send();
        resp.length.should.equals(0);
    });

    it('Delete link answer (with original connection to other link answer)', async function () {
        dbDsl.createQuestion('2', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'description', topics: ['Spiritual', 'Health'],
            language: 'de'
        });
        dbDsl.createLinkAnswer('7', {
            creatorId: '2', questionId: '1', created: 555,
            link: 'https://example.com', pageType: 'blog'
        });
        dbDsl.setOriginalAnswer({answerId: '5', originalAnswerId: '7'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question/answer/', {answerId: '5'});
        res.status.should.equal(200);
        stubCDN.deleteFolder.calledWith(`link/5/`, sinon.match.any).should.be.true;

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->
                                            (answer:Answer {answerId: '5'})`)
            .return(`answer`).end().send();
        resp.length.should.equals(0);
    });

    it('The user is only allowed to delete link answers that he has created', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question/answer/', {answerId: '6'});
        res.status.should.equal(400);
        stubCDN.deleteFolder.calledWith(`link/5/`, sinon.match.any).should.be.false;

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->
                                            (answer:Answer {answerId: '6'})`)
            .return(`answer`).end().send();
        resp.length.should.equals(1);
        resp[0].answer.link.should.equals('https://example2.com');
        resp[0].answer.created.should.equals(666);
    });
});
