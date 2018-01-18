'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let should = require('chai').should();
let moment = require('moment');

describe('Edit a question', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(3);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Edit a question description', async function () {

        dbDsl.createQuestion('1', {
            creatorId: '1', question: 'Das ist eine FragöÖÄäÜü', description: 'description', topic: ['spiritual'],
            language: 'de'
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/1', {
            question: 'Andere Frage', description: 'description2', topic: ['health']
        });
        res.status.should.equal(200);

        let resp = await db.cypher().match("(question:Question {questionId: '1'})")
            .return(`question`).end().send();
        resp.length.should.equals(1);
        resp[0].question.question.should.equals('Andere Frage');
        resp[0].question.description.should.equals('description2');
        resp[0].question.modified.should.least(startTime);
        resp[0].question.topic.length.should.equals(1);
        resp[0].question.topic[0].should.equals('health');
        resp[0].question.language.should.equals('de');
    });

    it('Edit a question without description', async function () {

        dbDsl.createQuestion('1', {
            creatorId: '1', question: 'Das ist eine FragöÖÄäÜü', description: 'description', topic: ['spiritual'],
            language: 'de'
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/1', {
            question: 'Andere Frage', topic: ['health']
        });
        res.status.should.equal(200);

        let resp = await db.cypher().match("(question:Question {questionId: '1'})")
            .return(`question`).end().send();
        resp.length.should.equals(1);
        resp[0].question.question.should.equals('Andere Frage');
        should.not.exist(resp[0].question.description);
        resp[0].question.modified.should.least(startTime);
        resp[0].question.topic.length.should.equals(1);
        resp[0].question.topic[0].should.equals('health');
        resp[0].question.language.should.equals('de');
    });

    it('Only admin is allowed to edit question', async function () {

        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine FragöÖÄäÜü', description: 'description', topic: ['spiritual'],
            language: 'de'
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/1', {
            question: 'Andere Frage', description: 'description2', topic: ['health']
        });
        res.status.should.equal(400);

        let resp = await db.cypher().match("(question:Question {questionId: '1'})")
            .return(`question`).end().send();
        resp.length.should.equals(1);
        resp[0].question.question.should.equals('Das ist eine FragöÖÄäÜü');
        resp[0].question.description.should.equals('description');
        resp[0].question.modified.should.equals(500);
        resp[0].question.topic.length.should.equals(1);
        resp[0].question.topic[0].should.equals('spiritual');
        resp[0].question.language.should.equals('de');
    });
});
