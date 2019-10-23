'use strict';

const users = require('dumonda-me-server-test-util').user;
const db = require('dumonda-me-server-test-util').db;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const moment = require('moment');

describe('Edit a note for an answer', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(3);
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'description', topics: ['Spiritual', 'Health'],
            language: 'de'
        });
        dbDsl.createDefaultAnswer('5', {
            creatorId: '2', questionId:'1', answer: 'Answer'
        });
        dbDsl.createNote('50', {answerId: '5', creatorId: '1', created: 555});
        dbDsl.createNote('51', {answerId: '5', creatorId: '2', created: 666});
        await dbDsl.sendToDb();
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Edit a note for an answer (without url)', async function () {
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/answer/note', {noteId: '50', text: 'This is a note'});
        res.status.should.equal(200);
        res.body.textHtml.should.equals('This is a note');

        let resp = await db.cypher().match(`(answer:Answer {answerId: '5'})-[:NOTE]->(note:Note {noteId: '50'})`)
            .return(`note`).end().send();
        resp.length.should.equals(1);
        resp[0].note.text.should.equals('This is a note');
    });

    it('Edit a note for an answer (with url)', async function () {
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/answer/note', {noteId: '50', text: 'Test dumonda.me change the world'});
        res.status.should.equal(200);
        res.body.textHtml.should.equals(`Test <a href="http://dumonda.me" class="linkified" target="_blank" rel="noopener">dumonda.me</a> change the world`);

        let resp = await db.cypher().match(`(answer:Answer {answerId: '5'})-[:NOTE]->(note:Note {noteId: '50'})`)
            .return(`note`).end().send();
        resp.length.should.equals(1);
        resp[0].note.text.should.equals('Test dumonda.me change the world');
    });

    it('Edit a note for an answer (not creator of note)', async function () {
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/answer/note', {noteId: '51', text: 'This is a note'});
        res.status.should.equal(400);

        let resp = await db.cypher().match(`(answer:Answer {answerId: '5'})-[:NOTE]->(note:Note {noteId: '51'})`)
            .return(`note`).end().send();
        resp.length.should.equals(1);
        resp[0].note.text.should.equals('note51Text');
    });

    it('Only logged in user can edit a note', async function () {
        let res = await requestHandler.put('/api/user/question/answer/note', {noteId: '50', text: 'This is a note'});
        res.status.should.equal(401);

        let resp = await db.cypher().match(`(answer:Answer {answerId: '5'})-[:NOTE]->(note:Note {noteId: '50'})`)
            .return(`note`).end().send();
        resp.length.should.equals(1);
        resp[0].note.text.should.equals('note50Text');
    });
});
