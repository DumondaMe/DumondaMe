'use strict';

let users = require('dumonda-me-server-test-util').user;
let db = require('dumonda-me-server-test-util').db;
let dbDsl = require('dumonda-me-server-test-util').dbDSL;
let requestHandler = require('dumonda-me-server-test-util').requestHandler;
let moment = require('moment');

describe('Delete a question', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(3);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});
        dbDsl.createMainTopic({topicId: 'topic2', descriptionDe: 'topic2De', descriptionEn: 'topic2En'});
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Delete a question without answers and delete topic', async function () {

        dbDsl.createQuestion('1', {
            creatorId: '1', question: 'Das ist eine FragöÖÄäÜü', topics: ['topic1'], language: 'de'
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question', {
            questionId: '1'
        });
        res.status.should.equal(200);
        res.body.markedForDeletion.should.equals(false);

        let resp = await db.cypher().match("(question:Question)")
            .return(`question`).end().send();
        resp.length.should.equals(0);
    });

    it('Delete a question without answers do not delete topic used by other question', async function () {

        dbDsl.createQuestion('1', {
            creatorId: '1', question: 'Das ist eine FragöÖÄäÜü', topics: ['topic1'], language: 'de'
        });
        dbDsl.createQuestion('2', {
            creatorId: '1', question: 'Das ist eine FragöÖÄäÜü2', topics: ['topic1'], language: 'de'
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question', {
            questionId: '1'
        });
        res.status.should.equal(200);
        res.body.markedForDeletion.should.equals(false);

        let resp = await db.cypher().match("(question:Question)")
            .return(`question`).end().send();
        resp.length.should.equals(1);
        resp[0].question.questionId.should.equals('2');
    });

    it('Mark a question to delete when answers exist', async function () {

        dbDsl.createQuestion('1', {
            creatorId: '1', question: 'Das ist eine FragöÖÄäÜü', topics: ['topic1'], language: 'de'
        });
        dbDsl.createDefaultAnswer('1', {creatorId: '2', questionId: '1', answer: 'Das ist eine Antwort'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question', {
            questionId: '1'
        });
        res.status.should.equal(200);
        res.body.markedForDeletion.should.equals(true);

        let resp = await db.cypher().match("(question:Question:DeleteRequested)")
            .return(`question`).end().send();
        resp.length.should.equals(1);
        resp[0].question.timeDeleteRequested.should.least(startTime);
    });

    it('Only admin is allowed to delete question', async function () {

        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine FragöÖÄäÜü', topics: ['topic1'], language: 'de'
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question', {
            questionId: '1'
        });
        res.status.should.equal(400);

        let resp = await db.cypher().match("(question:Question)")
            .return(`question`).end().send();
        resp.length.should.equals(1);
    });
});
