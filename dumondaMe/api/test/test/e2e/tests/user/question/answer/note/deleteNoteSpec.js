'use strict';

const users = require('dumonda-me-server-test-util').user;
const db = require('dumonda-me-server-test-util').db;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const moment = require('moment');

describe('Delete a note of a answer', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(3);
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'description', topics: ['Spiritual', 'Health'],
            language: 'de'
        });
        dbDsl.createTextAnswer('5', {
            creatorId: '2', questionId:'1', answer: 'Answer'
        });
        dbDsl.createNote('50', {answerId: '5', creatorId: '1', created: 555});
        dbDsl.createNote('51', {answerId: '5', creatorId: '2', created: 666});
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Delete a note of an answer (no up votes)', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question/answer/note', {noteId: '50'});
        res.status.should.equal(200);

        let resp = await db.cypher().match(`(note:Note {noteId: '50'})`)
            .return(`note`).end().send();
        resp.length.should.equals(0);
    });

    it('Delete a note of an answer (with up votes)', async function () {
        dbDsl.upVoteNote({noteId: '50', userId: '2'});
        dbDsl.upVoteNote({noteId: '50', userId: '3'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question/answer/note', {noteId: '50'});
        res.status.should.equal(200);

        let resp = await db.cypher().match(`(note:Note {noteId: '50'})`)
            .return(`note`).end().send();
        resp.length.should.equals(0);
    });

    it('Delete a note of an answer (not creator of note)', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question/answer/note', {noteId: '51'});
        res.status.should.equal(400);

        let resp = await db.cypher().match(`(note:Note {noteId: '51'})`)
            .return(`note`).end().send();
        resp.length.should.equals(1);
    });

    it('Only logged in user can delete a note', async function () {
        await dbDsl.sendToDb();
        let res = await requestHandler.del('/api/user/question/answer/note', {noteId: '50'});
        res.status.should.equal(401);

        let resp = await db.cypher().match(`(note:Note {noteId: '50'})`)
            .return(`note`).end().send();
        resp.length.should.equals(1);
    });
});
