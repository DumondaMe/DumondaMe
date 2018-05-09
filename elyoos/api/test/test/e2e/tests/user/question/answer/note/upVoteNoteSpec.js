'use strict';

const users = require('elyoos-server-test-util').user;
const db = require('elyoos-server-test-util').db;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const requestHandler = require('elyoos-server-test-util').requestHandler;
const moment = require('moment');

describe('Handling up votes of note for a answer', function () {

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

        dbDsl.createNote('50', {answerId: '5', creatorId: '2', created: 555});
        dbDsl.createNote('51', {answerId: '5', creatorId: '1', created: 444});
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Up vote a note', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/note/upVote', {noteId: '50'});
        res.status.should.equal(200);

        let resp = await db.cypher().match(`(note:Note {noteId: '50'})<-[upVote:UP_VOTE]-(:User {userId: '1'})`)
            .return(`upVote`).end().send();
        resp.length.should.equals(1);
        resp[0].upVote.created.should.least(startTime);
    });

    it('Up vote of an already up voted note is not allowed', async function () {
        dbDsl.upVoteNote({noteId: '50', userId: '1'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/note/upVote', {noteId: '50'});
        res.status.should.equal(400);

        let resp = await db.cypher().match(`(note:Note {noteId: '50'})<-[:UP_VOTE]-(:User {userId: '1'})`)
            .return(`note`).end().send();
        resp.length.should.equals(1);
    });

    it('It is not allowed to rate the note if the user is the administrator of the note', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/note/upVote', {noteId: '51'});
        res.status.should.equal(400);

        let resp = await db.cypher().match(`(note:Note {noteId: '51'})<-[:UP_VOTE]-(:User {userId: '1'})`)
            .return(`note`).end().send();
        resp.length.should.equals(0);
    });

    it('Delete up vote of a note', async function () {
        dbDsl.upVoteNote({noteId: '50', userId: '1'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question/answer/note/upVote', {noteId: '50'});
        res.status.should.equal(200);

        let resp = await db.cypher().match(`(note:Note {noteId: '50'})<-[:UP_VOTE]-(:User {userId: '1'})`)
            .return(`note`).end().send();
        resp.length.should.equals(0);
    });

    it('Not logged in user can not up vote a note', async function () {
        await dbDsl.sendToDb();
        let res = await requestHandler.post('/api/user/question/answer/note/upVote', {noteId: '50'});
        res.status.should.equal(401);

        let resp = await db.cypher().match(`(note:Note)<-[:UP_VOTE]-(:User)`)
            .return(`note`).end().send();
        resp.length.should.equals(0);
    });

    it('Not logged in user can not delete an up vote of a note', async function () {
        dbDsl.upVoteNote({noteId: '50', userId: '1'});
        await dbDsl.sendToDb();
        let res = await requestHandler.del('/api/user/question/answer/note/upVote', {noteId: '50'});
        res.status.should.equal(401);

        let resp = await db.cypher().match(`(note:Note)<-[:UP_VOTE]-(:User)`)
            .return(`note`).end().send();
        resp.length.should.equals(1);
    });
});
