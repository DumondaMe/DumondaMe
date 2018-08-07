'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let should = require('chai').should();
let moment = require('moment');

describe('Creating a new question', function () {

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

    it('Adding a new question with description', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question', {
            question: 'Das ist eine FragöÖÄäÜü',
            description: 'description',
            topics: ['topic1', 'topic2'],
            lang: 'de'
        });
        res.status.should.equal(200);
        res.body.slug.should.equals('das-ist-eine-fragööääüü');
        res.body.descriptionHtml.should.equals('description');

        let resp = await db.cypher().match("(topic:Topic)-[:TOPIC]->(question:Question)<-[:IS_CREATOR]-(:User {userId: '1'})")
            .return(`question, collect(topic.topicId) AS topics`).end().send();
        resp.length.should.equals(1);
        resp[0].question.questionId.should.equals(res.body.questionId);
        resp[0].question.question.should.equals('Das ist eine FragöÖÄäÜü');
        resp[0].question.description.should.equals('description');
        resp[0].question.created.should.least(startTime);
        resp[0].topics.length.should.equals(2);
        resp[0].topics.should.include('topic1');
        resp[0].topics.should.include('topic2');
        resp[0].question.language.should.equals('de');
    });

    it('Adding a new question with description (description includes url)', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question', {
            question: 'Das ist eine FragöÖÄäÜü',
            description: 'Test elyoos.org change the world',
            topics: ['topic1', 'topic2'],
            lang: 'de'
        });
        res.status.should.equal(200);
        res.body.slug.should.equals('das-ist-eine-fragööääüü');
        res.body.descriptionHtml.should.equals(`Test <a href="http://elyoos.org" class="linkified" target="_blank">elyoos.org</a> change the world`);

        let resp = await db.cypher().match("(topic:Topic)-[:TOPIC]->(question:Question)<-[:IS_CREATOR]-(:User {userId: '1'})")
            .return(`question, collect(topic.topicId) AS topics`).end().send();
        resp.length.should.equals(1);
        resp[0].question.questionId.should.equals(res.body.questionId);
        resp[0].question.question.should.equals('Das ist eine FragöÖÄäÜü');
        resp[0].question.description.should.equals(`Test elyoos.org change the world`);
        resp[0].question.created.should.least(startTime);
        resp[0].topics.length.should.equals(2);
        resp[0].topics.should.include('topic1');
        resp[0].topics.should.include('topic2');
        resp[0].question.language.should.equals('de');
    });

    it('Adding a new question without a description', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question', {
            question: 'Das ist eine FragöÖÄäÜü', topics: ['topic1', 'topic2'], lang: 'de'
        });
        res.status.should.equal(200);
        res.body.slug.should.equals('das-ist-eine-fragööääüü');
        should.not.exist(res.body.descriptionHtml);

        let resp = await db.cypher().match("(topic:Topic)-[:TOPIC]->(question:Question)<-[:IS_CREATOR]-(:User {userId: '1'})")
            .return(`question, collect(topic.topicId) AS topics`).end().send();
        resp.length.should.equals(1);
        resp[0].question.questionId.should.equals(res.body.questionId);
        resp[0].question.question.should.equals('Das ist eine FragöÖÄäÜü');
        should.not.exist(resp[0].question.description);
        resp[0].question.created.should.least(startTime);
        resp[0].topics.length.should.equals(2);
        resp[0].topics.should.include('topic1');
        resp[0].topics.should.include('topic2');
        resp[0].question.language.should.equals('de');
    });

    it('Prevent xss attack when uploading question', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question', {
            question: 'Das ist eine FragöÖÄäÜü<script>alert()</script>',
            description: 'Test elyoos.org change the world<script>alert()</script>',
            topics: ['topic1', 'topic2'], lang: 'de'
        });
        res.status.should.equal(200);
        res.body.slug.should.equals('das-ist-eine-fragööääüü');
        res.body.descriptionHtml.should.equals(`Test <a href="http://elyoos.org" class="linkified" target="_blank">elyoos.org</a> change the world`);

        let resp = await db.cypher().match("(topic:Topic)-[:TOPIC]->(question:Question)<-[:IS_CREATOR]-(:User {userId: '1'})")
            .return(`question, collect(topic.name) AS topics`).end().send();
        resp.length.should.equals(1);
        resp[0].question.question.should.equals('Das ist eine FragöÖÄäÜü');
        resp[0].question.description.should.equals('Test elyoos.org change the world');
    });

    it('Adding a new question fails because topic does not exist', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question', {
            question: 'Das ist eine FragöÖÄäÜü',
            description: 'description',
            topics: ['topic3', 'topic2'],
            lang: 'de'
        });
        res.status.should.equal(401);
    });

    it('Only allowed to add a question as logged in user', async function () {
        await dbDsl.sendToDb();
        let res = await requestHandler.post('/api/user/question', {
            question: 'Das ist eine FragöÖÄäÜü', topic: ['topic1', 'topic2'], lang: 'de'
        });
        res.status.should.equal(401);
    });
});
