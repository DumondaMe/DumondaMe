'use strict';

let users = require('dumonda-me-server-test-util').user;
let db = require('dumonda-me-server-test-util').db;
let dbDsl = require('dumonda-me-server-test-util').dbDSL;
let requestHandler = require('dumonda-me-server-test-util').requestHandler;
let should = require('chai').should();
let moment = require('moment');

describe('Edit a question', function () {

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

    it('Edit a question description without html', async function () {

        dbDsl.createQuestion('1', {
            creatorId: '1', question: 'Das ist eine FragöÖÄäÜü', description: 'description', topics: ['topic1'],
            language: 'de'
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question', {
            questionId: '1', question: 'Andere Frage', description: 'description2', lang: 'en'
        });
        res.status.should.equal(200);
        res.body.descriptionHtml.should.equals('description2');

        let resp = await db.cypher().match("(topic:Topic)-[:TOPIC]->(question:Question {questionId: '1'})")
            .return(`question, collect(topic.topicId) AS topics`).end().send();
        resp.length.should.equals(1);
        resp[0].question.question.should.equals('Andere Frage');
        resp[0].question.description.should.equals('description2');
        resp[0].question.modified.should.least(startTime);
        resp[0].topics.length.should.equals(1);
        resp[0].topics.should.include('topic1');
        resp[0].question.language.should.equals('en');
    });

    it('Edit a question description with html', async function () {

        dbDsl.createQuestion('1', {
            creatorId: '1', question: 'Das ist eine FragöÖÄäÜü', description: 'description', topics: ['topic1'],
            language: 'de'
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question', {
            questionId: '1', question: 'Andere Frage', description: 'Test elyoos.org change the world', lang: 'en'
        });
        res.status.should.equal(200);
        res.body.descriptionHtml.should.equals(`Test <a href="http://elyoos.org" class="linkified" target="_blank">elyoos.org</a> change the world`);

        let resp = await db.cypher().match("(topic:Topic)-[:TOPIC]->(question:Question {questionId: '1'})")
            .return(`question, collect(topic.topicId) AS topics`).end().send();
        resp.length.should.equals(1);
        resp[0].question.question.should.equals('Andere Frage');
        resp[0].question.description.should.equals('Test elyoos.org change the world');
        resp[0].question.modified.should.least(startTime);
        resp[0].topics.length.should.equals(1);
        resp[0].topics.should.include('topic1');
        resp[0].question.language.should.equals('en');
    });

    it('Edit a question without description', async function () {

        dbDsl.createQuestion('1', {
            creatorId: '1', question: 'Das ist eine FragöÖÄäÜü', description: 'description', topics: ['topic1'],
            language: 'de'
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question', {
            questionId: '1', question: 'Andere Frage', lang: 'en'
        });
        res.status.should.equal(200);
        should.not.exist(res.body.descriptionHtml);

        let resp = await db.cypher().match("(topic:Topic)-[:TOPIC]->(question:Question {questionId: '1'})")
            .return(`question, collect(topic.topicId) AS topics`).end().send();
        resp.length.should.equals(1);
        resp[0].question.question.should.equals('Andere Frage');
        should.not.exist(resp[0].question.description);
        resp[0].question.modified.should.least(startTime);
        resp[0].topics.length.should.equals(1);
        resp[0].topics.should.include('topic1');
        resp[0].question.language.should.equals('en');
    });

    it('Prevent xss attack when edit question', async function () {

        dbDsl.createQuestion('1', {
            creatorId: '1', question: 'Das ist eine FragöÖÄäÜü', description: 'description', topics: ['topic1'],
            language: 'de'
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question', {
            questionId: '1', question: 'Andere Frage<script>alert()</script>',
            description: 'Test elyoos.org change the world<script>alert()</script>', lang: 'en'
        });
        res.status.should.equal(200);
        res.body.descriptionHtml.should.equals(`Test <a href="http://elyoos.org" class="linkified" target="_blank">elyoos.org</a> change the world`);

        let resp = await db.cypher().match("(topic:Topic)-[:TOPIC]->(question:Question {questionId: '1'})")
            .return(`question, collect(topic.topicId) AS topics`).end().send();
        resp.length.should.equals(1);
        resp[0].question.question.should.equals('Andere Frage');
        resp[0].question.description.should.equals('Test elyoos.org change the world');
    });

    it('Only admin is allowed to edit question', async function () {

        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine FragöÖÄäÜü', description: 'description', topics: ['topic1'],
            language: 'de'
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question', {
            questionId: '1', question: 'Andere Frage', description: 'description2', lang: 'en'
        });
        res.status.should.equal(400);

        let resp = await db.cypher().match("(topic:Topic)-[:TOPIC]->(question:Question {questionId: '1'})")
            .return(`question, collect(topic.topicId) AS topics`).end().send();
        resp.length.should.equals(1);
        resp[0].question.question.should.equals('Das ist eine FragöÖÄäÜü');
        resp[0].question.description.should.equals('description');
        resp[0].question.modified.should.equals(500);
        resp[0].topics.length.should.equals(1);
        resp[0].topics.should.include('topic1');
        resp[0].question.language.should.equals('de');
    });
});
