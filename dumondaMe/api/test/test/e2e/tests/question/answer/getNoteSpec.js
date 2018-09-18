'use strict';

let users = require('dumonda-me-server-test-util').user;
let dbDsl = require('dumonda-me-server-test-util').dbDSL;
let requestHandler = require('dumonda-me-server-test-util').requestHandler;
let moment = require('moment');

describe('Getting notes of an answer', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(6);
        await requestHandler.logout();
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createQuestion('1', {
            creatorId: '1', question: 'Das ist eine Frage', description: 'Test dumonda.me change the world',
            topics: ['Spiritual', 'Education'], language: 'de', modified: 700
        });
        dbDsl.createTextAnswer('6', {
            creatorId: '1', questionId: '1', answer: 'Answer', created: 600,
        });

        dbDsl.createNote('50', {answerId: '6', creatorId: '1', created: 555});
        dbDsl.createNote('51', {answerId: '6', creatorId: '2', created: 444});
        dbDsl.createNote('52', {answerId: '6', creatorId: '3', created: 333});
        dbDsl.createNote('53', {answerId: '6', creatorId: '1', created: 666, text: 'Test dumonda.me change the world'});
        dbDsl.upVoteNote({noteId: '52', userId: '1'});
        dbDsl.upVoteNote({noteId: '52', userId: '2'});
        dbDsl.upVoteNote({noteId: '53', userId: '3'});

        await dbDsl.sendToDb();
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting notes of an answer (logged in, sort upVotes)', async function () {

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/question/answer/note', {answerId: '6', page: 0, sort: 'upVotes'});
        res.status.should.equal(200);
        res.body.numberOfNotes.should.equals(4);
        res.body.notes.length.should.equals(4);
        res.body.notes[0].noteId.should.equals('52');
        res.body.notes[0].text.should.equals('note52Text');
        res.body.notes[0].textHtml.should.equals('note52Text');
        res.body.notes[0].created.should.equals(333);
        res.body.notes[0].upVotes.should.equals(2);
        res.body.notes[0].hasVoted.should.equals(true);
        res.body.notes[0].isAdmin.should.equals(false);
        res.body.notes[0].creator.userId.should.equals('3');
        res.body.notes[0].creator.name.should.equals('user Meier3');
        res.body.notes[0].creator.slug.should.equals('user-meier3');

        res.body.notes[1].noteId.should.equals('53');
        res.body.notes[1].text.should.equals('Test dumonda.me change the world');
        res.body.notes[1].textHtml.should.equals(`Test <a href="http://dumonda.me" class="linkified" target="_blank">dumonda.me</a> change the world`);
        res.body.notes[1].created.should.equals(666);
        res.body.notes[1].upVotes.should.equals(1);
        res.body.notes[1].hasVoted.should.equals(false);
        res.body.notes[1].isAdmin.should.equals(true);
        res.body.notes[1].creator.userId.should.equals('1');
        res.body.notes[1].creator.name.should.equals('user Meier');
        res.body.notes[1].creator.slug.should.equals('user-meier');

        res.body.notes[2].noteId.should.equals('50');
        res.body.notes[2].text.should.equals('note50Text');
        res.body.notes[2].textHtml.should.equals('note50Text');
        res.body.notes[2].created.should.equals(555);
        res.body.notes[2].upVotes.should.equals(0);
        res.body.notes[2].hasVoted.should.equals(false);
        res.body.notes[2].isAdmin.should.equals(true);
        res.body.notes[2].creator.userId.should.equals('1');
        res.body.notes[2].creator.name.should.equals('user Meier');
        res.body.notes[2].creator.slug.should.equals('user-meier');

        res.body.notes[3].noteId.should.equals('51');
        res.body.notes[3].text.should.equals('note51Text');
        res.body.notes[3].textHtml.should.equals('note51Text');
        res.body.notes[3].created.should.equals(444);
        res.body.notes[3].upVotes.should.equals(0);
        res.body.notes[3].hasVoted.should.equals(false);
        res.body.notes[3].isAdmin.should.equals(false);
        res.body.notes[3].creator.userId.should.equals('2');
        res.body.notes[3].creator.name.should.equals('user Meier2');
        res.body.notes[3].creator.slug.should.equals('user-meier2');
    });

    it('Getting notes of an answer (logged in, sort newest)', async function () {

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/question/answer/note', {answerId: '6', page: 0, sort: 'newest'});
        res.status.should.equal(200);
        res.body.numberOfNotes.should.equals(4);
        res.body.notes.length.should.equals(4);

        res.body.notes[0].noteId.should.equals('53');
        res.body.notes[0].text.should.equals('Test dumonda.me change the world');
        res.body.notes[0].textHtml.should.equals(`Test <a href="http://dumonda.me" class="linkified" target="_blank">dumonda.me</a> change the world`);
        res.body.notes[0].created.should.equals(666);
        res.body.notes[0].upVotes.should.equals(1);
        res.body.notes[0].hasVoted.should.equals(false);
        res.body.notes[0].isAdmin.should.equals(true);
        res.body.notes[0].creator.userId.should.equals('1');
        res.body.notes[0].creator.name.should.equals('user Meier');
        res.body.notes[0].creator.slug.should.equals('user-meier');

        res.body.notes[1].noteId.should.equals('50');
        res.body.notes[1].text.should.equals('note50Text');
        res.body.notes[1].textHtml.should.equals('note50Text');
        res.body.notes[1].created.should.equals(555);
        res.body.notes[1].upVotes.should.equals(0);
        res.body.notes[1].hasVoted.should.equals(false);
        res.body.notes[1].isAdmin.should.equals(true);
        res.body.notes[1].creator.userId.should.equals('1');
        res.body.notes[1].creator.name.should.equals('user Meier');
        res.body.notes[1].creator.slug.should.equals('user-meier');

        res.body.notes[2].noteId.should.equals('51');
        res.body.notes[2].text.should.equals('note51Text');
        res.body.notes[2].textHtml.should.equals('note51Text');
        res.body.notes[2].created.should.equals(444);
        res.body.notes[2].upVotes.should.equals(0);
        res.body.notes[2].hasVoted.should.equals(false);
        res.body.notes[2].isAdmin.should.equals(false);
        res.body.notes[2].creator.userId.should.equals('2');
        res.body.notes[2].creator.name.should.equals('user Meier2');
        res.body.notes[2].creator.slug.should.equals('user-meier2');

        res.body.notes[3].noteId.should.equals('52');
        res.body.notes[3].text.should.equals('note52Text');
        res.body.notes[3].textHtml.should.equals('note52Text');
        res.body.notes[3].created.should.equals(333);
        res.body.notes[3].upVotes.should.equals(2);
        res.body.notes[3].hasVoted.should.equals(true);
        res.body.notes[3].isAdmin.should.equals(false);
        res.body.notes[3].creator.userId.should.equals('3');
        res.body.notes[3].creator.name.should.equals('user Meier3');
        res.body.notes[3].creator.slug.should.equals('user-meier3');
    });

    it('Getting notes of an answer (public, sort upVotes)', async function () {

        let res = await requestHandler.get('/api/question/answer/note', {answerId: '6', page: 0, sort: 'upVotes'});
        res.status.should.equal(200);
        res.body.numberOfNotes.should.equals(4);
        res.body.notes.length.should.equals(4);
        res.body.notes[0].noteId.should.equals('52');
        res.body.notes[0].text.should.equals('note52Text');
        res.body.notes[0].textHtml.should.equals('note52Text');
        res.body.notes[0].created.should.equals(333);
        res.body.notes[0].upVotes.should.equals(2);
        res.body.notes[0].hasVoted.should.equals(false);
        res.body.notes[0].isAdmin.should.equals(false);
        res.body.notes[0].creator.userId.should.equals('3');
        res.body.notes[0].creator.name.should.equals('user Meier3');
        res.body.notes[0].creator.slug.should.equals('user-meier3');

        res.body.notes[1].noteId.should.equals('53');
        res.body.notes[1].text.should.equals('Test dumonda.me change the world');
        res.body.notes[1].textHtml.should.equals(`Test <a href="http://dumonda.me" class="linkified" target="_blank">dumonda.me</a> change the world`);
        res.body.notes[1].created.should.equals(666);
        res.body.notes[1].upVotes.should.equals(1);
        res.body.notes[1].hasVoted.should.equals(false);
        res.body.notes[1].isAdmin.should.equals(false);
        res.body.notes[1].creator.userId.should.equals('1');
        res.body.notes[1].creator.name.should.equals('user Meier');
        res.body.notes[1].creator.slug.should.equals('user-meier');

        res.body.notes[2].noteId.should.equals('50');
        res.body.notes[2].text.should.equals('note50Text');
        res.body.notes[2].textHtml.should.equals('note50Text');
        res.body.notes[2].created.should.equals(555);
        res.body.notes[2].upVotes.should.equals(0);
        res.body.notes[2].hasVoted.should.equals(false);
        res.body.notes[2].isAdmin.should.equals(false);
        res.body.notes[2].creator.userId.should.equals('1');
        res.body.notes[2].creator.name.should.equals('user Meier');
        res.body.notes[2].creator.slug.should.equals('user-meier');

        res.body.notes[3].noteId.should.equals('51');
        res.body.notes[3].text.should.equals('note51Text');
        res.body.notes[3].textHtml.should.equals('note51Text');
        res.body.notes[3].created.should.equals(444);
        res.body.notes[3].upVotes.should.equals(0);
        res.body.notes[3].hasVoted.should.equals(false);
        res.body.notes[3].isAdmin.should.equals(false);
        res.body.notes[3].creator.userId.should.equals('2');
        res.body.notes[3].creator.name.should.equals('user Meier2');
        res.body.notes[3].creator.slug.should.equals('user-meier2');
    });

    it('Getting notes of an answer (logged in, sort newest)', async function () {

        let res = await requestHandler.get('/api/question/answer/note', {answerId: '6', page: 0, sort: 'newest'});
        res.status.should.equal(200);
        res.body.numberOfNotes.should.equals(4);
        res.body.notes.length.should.equals(4);

        res.body.notes[0].noteId.should.equals('53');
        res.body.notes[0].text.should.equals('Test dumonda.me change the world');
        res.body.notes[0].textHtml.should.equals(`Test <a href="http://dumonda.me" class="linkified" target="_blank">dumonda.me</a> change the world`);
        res.body.notes[0].created.should.equals(666);
        res.body.notes[0].upVotes.should.equals(1);
        res.body.notes[0].hasVoted.should.equals(false);
        res.body.notes[0].isAdmin.should.equals(false);
        res.body.notes[0].creator.userId.should.equals('1');
        res.body.notes[0].creator.name.should.equals('user Meier');
        res.body.notes[0].creator.slug.should.equals('user-meier');

        res.body.notes[1].noteId.should.equals('50');
        res.body.notes[1].text.should.equals('note50Text');
        res.body.notes[1].textHtml.should.equals('note50Text');
        res.body.notes[1].created.should.equals(555);
        res.body.notes[1].upVotes.should.equals(0);
        res.body.notes[1].hasVoted.should.equals(false);
        res.body.notes[1].isAdmin.should.equals(false);
        res.body.notes[1].creator.userId.should.equals('1');
        res.body.notes[1].creator.name.should.equals('user Meier');
        res.body.notes[1].creator.slug.should.equals('user-meier');

        res.body.notes[2].noteId.should.equals('51');
        res.body.notes[2].text.should.equals('note51Text');
        res.body.notes[2].textHtml.should.equals('note51Text');
        res.body.notes[2].created.should.equals(444);
        res.body.notes[2].upVotes.should.equals(0);
        res.body.notes[2].hasVoted.should.equals(false);
        res.body.notes[2].isAdmin.should.equals(false);
        res.body.notes[2].creator.userId.should.equals('2');
        res.body.notes[2].creator.name.should.equals('user Meier2');
        res.body.notes[2].creator.slug.should.equals('user-meier2');

        res.body.notes[3].noteId.should.equals('52');
        res.body.notes[3].text.should.equals('note52Text');
        res.body.notes[3].textHtml.should.equals('note52Text');
        res.body.notes[3].created.should.equals(333);
        res.body.notes[3].upVotes.should.equals(2);
        res.body.notes[3].hasVoted.should.equals(false);
        res.body.notes[3].isAdmin.should.equals(false);
        res.body.notes[3].creator.userId.should.equals('3');
        res.body.notes[3].creator.name.should.equals('user Meier3');
        res.body.notes[3].creator.slug.should.equals('user-meier3');
    });
});
