'use strict';

const users = require('dumonda-me-server-test-util').user;
const db = require('dumonda-me-server-test-util').db;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const moment = require('moment');
const sinon = require('sinon');
const stubCDN = require('dumonda-me-server-test-util').stubCDN();

describe('Delete title Image of default answer', function () {

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
        dbDsl.createDefaultAnswer('6', {
            creatorId: '2', questionId: '1', answer: 'Answer2'
        });

    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Delete image of a default answer', async function () {
        dbDsl.createDefaultAnswer('5', {
            creatorId: '1', questionId: '1', answer: 'Answer', modified: 600, hasImage: true
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question/answer/default/image', {
            answerId: '5'
        });
        res.status.should.equal(200);

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->
                                            (answer:Default:Answer {answerId: '5'})<-[:IS_CREATOR]-(user:User {userId: '1'})`)
            .where(`NOT answer:HasTitleImage`)
            .return(`answer`).end().send();
        resp.length.should.equals(1);
        resp[0].answer.modified.should.least(startTime);

        stubCDN.deleteFolder.calledWith(`defaultAnswer/5/`, sinon.match.any).should.be.true;
    });

    it('Delete fails because no text is set', async function () {
        dbDsl.createDefaultAnswer('5', {
            creatorId: '1', questionId: '1', modified: 600, hasImage: true
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question/answer/default/image', {
            answerId: '5'
        });
        res.status.should.equal(400);

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->
                                            (answer:Default:Answer:HasTitleImage {answerId: '5'})<-[:IS_CREATOR]-(user:User {userId: '1'})`)
            .return(`answer`).end().send();
        resp.length.should.equals(1);
        resp[0].answer.modified.should.equals(600);

        stubCDN.deleteFolder.called.should.be.false;
    });

    it('The user is only allowed to delete images of answers he has created', async function () {
        dbDsl.createDefaultAnswer('5', {
            creatorId: '1', questionId: '1', answer: 'Answer', modified: 600, hasImage: true
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question/answer/default/image', {
            answerId: '6'
        });
        res.status.should.equal(400);

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->
                                            (answer:Default {answerId: '6'})`)
            .return(`answer`).end().send();
        resp.length.should.equals(1);
        resp[0].answer.answer.should.equals('Answer2');
        resp[0].answer.created.should.equals(500);
        resp[0].answer.modified.should.equals(500);

        stubCDN.deleteFolder.called.should.be.false;
    });
});
