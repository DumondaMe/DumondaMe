'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');

describe('Delete a question', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(3);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Delete a question without answers', async function () {

        dbDsl.createQuestion('1', {
            adminId: '1', question: 'Das ist eine FragöÖÄäÜü', topic: ['spiritual'], language: 'de'
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

    it('Mark a question to delete when answers exist', async function () {

        dbDsl.createQuestion('1', {
            adminId: '1', question: 'Das ist eine FragöÖÄäÜü', topic: ['spiritual'], language: 'de'
        });
        dbDsl.createAnswer('1', {adminId: '2', questionId: '1', answer: 'Das ist eine Antwort'});
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

    it('Only user is allowed to delete question', async function () {

        dbDsl.createQuestion('1', {
            adminId: '2', question: 'Das ist eine FragöÖÄäÜü', topic: ['spiritual'], language: 'de'
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
