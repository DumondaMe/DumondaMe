'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');

describe('Creating new text answer', function () {

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
        await dbDsl.sendToDb();
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Creating new text answer', async function () {
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/text/1', {
            answer: 'answer'
        });
        res.status.should.equal(200);
        res.body.created.should.least(startTime);
        res.body.creator.name.should.equals('user Meier');
        res.body.creator.thumbnailUrl.should.equals('profileImage/1/thumbnail.jpg');

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->(answer:Text:Answer)<-[:IS_CREATOR]-(user:User)`)
            .return(`answer, user`).end().send();
        resp.length.should.equals(1);
        resp[0].answer.answerId.should.equals(res.body.answerId);
        resp[0].answer.answer.should.equals('answer');
        resp[0].answer.created.should.equals(res.body.created);
        resp[0].user.userId.should.equals('1');
    });

    it('Prevent xss attack when creating a text answer', async function () {
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/text/1', {
            answer: 'answer<script>alert()</script>'
        });
        res.status.should.equal(200);

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->(answer:Text:Answer)<-[:IS_CREATOR]-(user:User)`)
            .return(`answer, user`).end().send();
        resp.length.should.equals(1);
        resp[0].answer.answer.should.equals('answer');
    });

    it('Only allowed to add an text answer as logged in user', async function () {
        let res = await requestHandler.post('/api/user/question/answer/text/1', {
            answer: 'answer'
        });
        res.status.should.equal(401);
    });
});
