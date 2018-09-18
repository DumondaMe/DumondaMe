'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');

describe('Delete youtube answer', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(3);
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'description', topics: ['Spiritual', 'Health'],
            language: 'de'
        });
        dbDsl.createYoutubeAnswer('5', {
            creatorId: '1', questionId: '1', created: 555, idOnYoutube: 'Lhku7ZBWEK8',
            link: 'https://www.youtube.com/watch?v=Lhku7ZBWEK8', linkEmbed: 'https://www.youtube.com/embed/Lhku7ZBWEK8'
        });
        dbDsl.createYoutubeAnswer('6', {
            creatorId: '2', questionId: '1', created: 666, idOnYoutube: 'Lhku7ZBWEK7',
            link: 'https://www.youtube.com/watch?v=Lhku7ZBWEK7', linkEmbed: 'https://www.youtube.com/embed/Lhku7ZBWEK7'
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Delete youtube answer (without notes)', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question/answer/', {answerId: '5'});
        res.status.should.equal(200);

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->
                                            (answer:Answer {answerId: '5'})`)
            .return(`answer`).end().send();
        resp.length.should.equals(0);
    });

    it('Delete youtube answer (with notes)', async function () {
        dbDsl.createNote('50', {answerId: '5', creatorId: '1', created: 555});
        dbDsl.createNote('51', {answerId: '5', creatorId: '2', created: 555});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question/answer/', {answerId: '5'});
        res.status.should.equal(200);

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->
                                            (answer:Answer {answerId: '5'})`)
            .return(`answer`).end().send();
        resp.length.should.equals(0);
    });

    it('The user is only allowed to delete youtube answers that he has created', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question/answer/', {answerId: '6'});
        res.status.should.equal(400);

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->
                                            (answer:Answer {answerId: '6'})`)
            .return(`answer`).end().send();
        resp.length.should.equals(1);
        resp[0].answer.title.should.equals('youtube6Title');
        resp[0].answer.created.should.equals(666);
    });
});
