'use strict';

const users = require('elyoos-server-test-util').user;
const db = require('elyoos-server-test-util').db;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const requestHandler = require('elyoos-server-test-util').requestHandler;
const moment = require('moment');

describe('Handling watch question requests from a user', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(4);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createRegion('region', {});

        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine FragöÖÄäÜü', description: 'description', topics: ['Spiritual'],
            language: 'de'
        });

        dbDsl.createQuestion('2', {
            creatorId: '1', question: 'Das ist eine FragöÖÄäÜü2', description: 'description2', topics: ['Spiritual'],
            language: 'de'
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('User request to watch question', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/watch/1');
        res.status.should.equal(200);

        let resp = await db.cypher().match("(q:Question)<-[w:WATCH]-(u:User)").return(`q, u, w`).end().send();
        resp.length.should.equals(1);
        resp[0].q.questionId.should.equals('1');
        resp[0].u.userId.should.equals('1');
        resp[0].w.created.should.least(startTime);
    });

    it('User request to watch question as admin is not allowed', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/watch/2');
        res.status.should.equal(400);

        let resp = await db.cypher().match("(q:Question)<-[:WATCH]-(u:User)").return(`q, u`).end().send();
        resp.length.should.equals(0);
    });

    it('User request to unwatch question', async function () {
        dbDsl.watchQuestion({questionId: '1', userId: '1'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question/watch', {questionId: '1'});
        res.status.should.equal(200);

        let resp = await db.cypher().match("(q:Question)<-[:WATCH]-(u:User)").return(`q, u`).end().send();
        resp.length.should.equals(0);
    });

    it('Only logged in user can watch question', async function () {
        await dbDsl.sendToDb();
        let res = await requestHandler.put('/api/user/question/watch/1');
        res.status.should.equal(401);
    });

    it('Only logged in user can delete watch of question', async function () {
        await dbDsl.sendToDb();
        let res = await requestHandler.del('/api/user/question/watch', {questionId: '1'});
        res.status.should.equal(401);
    });
});
