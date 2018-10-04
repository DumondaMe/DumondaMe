'use strict';

const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const moment = require('moment');
const should = require('chai').should();

describe('Privacy settings of the user created a note', function () {

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

        dbDsl.createNote('50', {answerId: '6', creatorId: '2', created: 555});
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Hide creator when not logged in and privacy setting is publicEl', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'publicEl'});
        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/question/answer/note', {answerId: '6', page: 0, sort: 'upVotes'});
        res.status.should.equal(200);
        res.body.notes[0].noteId.should.equals('50');
        res.body.notes[0].creator.isAnonymous.should.equals(true);
        should.not.exist(res.body.notes[0].creator.userId);
        should.not.exist(res.body.notes[0].creator.name);
        should.not.exist(res.body.notes[0].creator.slug);
    });

    it('Hide creator when logged in and privacy setting is onlyContact', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'onlyContact'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/question/answer/note', {answerId: '6', page: 0, sort: 'upVotes'});
        res.status.should.equal(200);
        res.body.notes[0].noteId.should.equals('50');
        res.body.notes[0].creator.isAnonymous.should.equals(true);
        should.not.exist(res.body.notes[0].creator.userId);
        should.not.exist(res.body.notes[0].creator.name);
        should.not.exist(res.body.notes[0].creator.slug);
    });

    it('Show creator when logged in user', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'onlyContact'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser2);
        let res = await requestHandler.get('/api/question/answer/note', {answerId: '6', page: 0, sort: 'upVotes'});
        res.status.should.equal(200);
        res.body.notes.length.should.equals(1);
        res.body.notes[0].noteId.should.equals('50');
        res.body.notes[0].creator.isAnonymous.should.equals(false);
        res.body.notes[0].creator.name.should.equals('user Meier2');
        res.body.notes[0].creator.userId.should.equals('2');
        res.body.notes[0].creator.slug.should.equals('user-meier2');
    });

    it('Show creator when user is in trust circle', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'onlyContact'});
        dbDsl.createContactConnection('2', '1');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser2);
        let res = await requestHandler.get('/api/question/answer/note', {answerId: '6', page: 0, sort: 'upVotes'});
        res.status.should.equal(200);
        res.body.notes.length.should.equals(1);
        res.body.notes[0].noteId.should.equals('50');
        res.body.notes[0].creator.isAnonymous.should.equals(false);
        res.body.notes[0].creator.name.should.equals('user Meier2');
        res.body.notes[0].creator.userId.should.equals('2');
        res.body.notes[0].creator.slug.should.equals('user-meier2');
    });

    it('Show creator when user is logged in and privacy is publicEl', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'publicEl'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser2);
        let res = await requestHandler.get('/api/question/answer/note', {answerId: '6', page: 0, sort: 'upVotes'});
        res.status.should.equal(200);
        res.body.notes.length.should.equals(1);
        res.body.notes[0].noteId.should.equals('50');
        res.body.notes[0].creator.isAnonymous.should.equals(false);
        res.body.notes[0].creator.name.should.equals('user Meier2');
        res.body.notes[0].creator.userId.should.equals('2');
        res.body.notes[0].creator.slug.should.equals('user-meier2');
    });
});
