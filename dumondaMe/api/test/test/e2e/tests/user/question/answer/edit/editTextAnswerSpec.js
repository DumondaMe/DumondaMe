'use strict';

let users = require('dumonda-me-server-test-util').user;
let db = require('dumonda-me-server-test-util').db;
let dbDsl = require('dumonda-me-server-test-util').dbDSL;
let requestHandler = require('dumonda-me-server-test-util').requestHandler;
let moment = require('moment');

describe('Edit text answer', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(3);
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'description', topics: ['Spiritual', 'Health'],
            language: 'de'
        });
        dbDsl.createQuestion('2', {
            creatorId: '3', question: 'Das ist eine Frage2', description: 'description2', topics: ['Health'],
            language: 'en'
        });
        dbDsl.createTextAnswer('5', {
            creatorId: '1', questionId:'1', answer: 'Answer'
        });
        dbDsl.createTextAnswer('6', {
            creatorId: '2', questionId:'1', answer: 'Answer2'
        });
        await dbDsl.sendToDb();
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Edit text answer', async function () {
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/answer/text/5', {
            answer: 'Answer5 www.dumonda.me'
        });
        res.status.should.equal(200);
        res.body.answerHtml.should.equals('Answer5 <a href="http://www.dumonda.me" class="linkified" target="_blank" rel="noopener">www.dumonda.me</a>');

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->
                                            (answer:Text {answerId: '5'})<-[:IS_CREATOR]-(user:User {userId: '1'})`)
            .return(`answer`).end().send();
        resp.length.should.equals(1);
        resp[0].answer.answer.should.equals('Answer5 www.dumonda.me');
        resp[0].answer.created.should.equals(500);
        resp[0].answer.modified.should.least(startTime);
    });

    it('The user is only allowed to change answers that he has created', async function () {
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/answer/text/6', {
            answer: 'Answer5'
        });
        res.status.should.equal(400);

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->
                                            (answer:Text {answerId: '6'})`)
            .return(`answer`).end().send();
        resp.length.should.equals(1);
        resp[0].answer.answer.should.equals('Answer2');
        resp[0].answer.created.should.equals(500);
        resp[0].answer.modified.should.equals(500);
    });
});
