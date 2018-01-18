'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let should = require('chai').should();
let moment = require('moment');

describe('Creating new questions', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(3);
        startTime = Math.floor(moment.utc().valueOf() / 1000);
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
            topic: ['spiritual', 'education'],
            lang: 'de'
        });
        res.status.should.equal(200);
        res.body.slug.should.equals('das-ist-eine-fragööääüü');

        let resp = await db.cypher().match("(question:Question)<-[:IS_CREATOR]-(user:User)")
            .return(`question, user`).end().send();
        resp.length.should.equals(1);
        resp[0].question.questionId.should.equals(res.body.questionId);
        resp[0].question.question.should.equals('Das ist eine FragöÖÄäÜü');
        resp[0].question.description.should.equals('description');
        resp[0].question.created.should.least(startTime);
        resp[0].question.topic.length.should.equals(2);
        resp[0].question.topic[0].should.equals('spiritual');
        resp[0].question.topic[1].should.equals('education');
        resp[0].question.language.should.equals('de');
        resp[0].user.userId.should.equals('1');
    });

    it('Adding a new question without a description', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question', {
            question: 'Das ist eine FragöÖÄäÜü', topic: ['spiritual', 'education'], lang: 'de'
        });
        res.status.should.equal(200);
        res.body.slug.should.equals('das-ist-eine-fragööääüü');

        let resp = await db.cypher().match("(question:Question)<-[:IS_CREATOR]-(user:User)")
            .return(`question, user`).end().send();
        resp.length.should.equals(1);
        resp[0].question.questionId.should.equals(res.body.questionId);
        resp[0].question.question.should.equals('Das ist eine FragöÖÄäÜü');
        should.not.exist(resp[0].question.description);
        resp[0].question.created.should.least(startTime);
        resp[0].question.topic.length.should.equals(2);
        resp[0].question.topic[0].should.equals('spiritual');
        resp[0].question.topic[1].should.equals('education');
        resp[0].question.language.should.equals('de');
        resp[0].user.userId.should.equals('1');
    });

    it('Only allowed to add a question as logged in user', async function () {
        await dbDsl.sendToDb();
        let res = await requestHandler.post('/api/user/question', {
            question: 'Das ist eine FragöÖÄäÜü', topic: ['spiritual', 'education'], lang: 'de'
        });
        res.status.should.equal(401);
    });
});
