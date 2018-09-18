'use strict';

const users = require('dumonda-me-server-test-util').user;
const db = require('dumonda-me-server-test-util').db;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const moment = require('moment');
const should = require('chai').should();

describe('Edit link answer', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(3);
        startTime = Math.floor(moment.utc().valueOf() / 1000);
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
        await dbDsl.sendToDb();
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Edit link answer', async function () {
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/answer/link/5', {
            title: 'titleLink', description: 'descriptionLink', type: 'website'
        });
        res.status.should.equal(200);

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->(answer:Answer {answerId: '5'})`)
            .return(`answer`).end().send();
        resp.length.should.equals(1);
        resp[0].answer.title.should.equals('titleLink');
        resp[0].answer.description.should.equals('descriptionLink');
        resp[0].answer.pageType.should.equals('website');
        resp[0].answer.created.should.equals(555);
        resp[0].answer.modified.should.least(startTime);
    });

    it('Edit link answer without description', async function () {
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/answer/link/5', {
            title: 'titleLink', type: 'website'
        });
        res.status.should.equal(200);

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->(answer:Answer {answerId: '5'})`)
            .return(`answer`).end().send();
        resp.length.should.equals(1);
        resp[0].answer.title.should.equals('titleLink');
        should.not.exist(resp[0].answer.description);
        resp[0].answer.pageType.should.equals('website');
        resp[0].answer.created.should.equals(555);
        resp[0].answer.modified.should.least(startTime);
    });

    it('The user can only edit the answers he has created.', async function () {
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/answer/link/6', {
            title: 'titleBook', description: 'descriptionBook', type: 'website'
        });
        res.status.should.equal(400);

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->
                                            (answer:Answer {answerId: '6'})`)
            .return(`answer`).end().send();
        resp.length.should.equals(1);
        resp[0].answer.title.should.equals('link6Title');
        resp[0].answer.description.should.equals('link6Description');
        resp[0].answer.pageType.should.equals('blog');
        resp[0].answer.created.should.equals(666);
    });
});
