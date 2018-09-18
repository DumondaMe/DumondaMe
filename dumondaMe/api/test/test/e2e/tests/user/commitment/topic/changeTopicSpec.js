'use strict';

const users = require('elyoos-server-test-util').user;
const db = require('elyoos-server-test-util').db;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Change topic of a commitment', function () {

    beforeEach(async function () {
        await dbDsl.init(3);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Change topic of a commitment', async function () {

        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});
        dbDsl.createSubTopic({
            parentTopicId: 'topic1',
            topicId: 'topic11',
            descriptionDe: 'topic11De',
            descriptionEn: 'topic11En'
        });
        dbDsl.createSubTopic({
            parentTopicId: 'topic1',
            topicId: 'topic12',
            descriptionDe: 'topic12De',
            descriptionEn: 'topic12En'
        });
        dbDsl.createSubTopic({
            parentTopicId: 'topic1',
            topicId: 'topic13',
            descriptionDe: 'topic13De',
            descriptionEn: 'topic13En'
        });

        dbDsl.createCommitment('1', {
            adminId: '1', topics: ['topic1', 'topic11'], language: 'de', created: 700, website: 'https://www.example.org/'
        }, []);

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/commitment/topic/1', {
            topics: ['topic12', 'topic13'],
        });
        res.status.should.equal(200);

        let resp = await db.cypher().match("(topic:Topic)-[:TOPIC]->(commitment:Commitment {commitmentId: '1'})")
            .return(`DISTINCT topic.topicId AS topic`)
            .orderBy(`topic.topicId`).end().send();
        resp.length.should.equals(2);
        resp[0].topic.should.equals('topic12');
        resp[1].topic.should.equals('topic13');
    });

    it('Change of topic fails because topic does not exist', async function () {

        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});

        dbDsl.createCommitment('1', {
            adminId: '1', topics: ['topic1'], language: 'de', created: 700, website: 'https://www.example.org/'
        }, []);

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/commitment/topic/1', {
            topics: ['topic12'],
        });
        res.status.should.equal(401);

        let resp = await db.cypher().match("(topic:Topic)-[:TOPIC]->(commitment:Commitment {commitmentId: '1'})")
            .return(`DISTINCT topic.topicId AS topic`)
            .orderBy(`topic.topicId`).end().send();
        resp.length.should.equals(1);
        resp[0].topic.should.equals('topic1');
    });

    it('Not allowed to change topic of a commitment where user is not admin', async function () {
        dbDsl.createCommitment('1', {
            adminId: '2', topics: ['Test1'], language: 'de', created: 700, website: 'https://www.example.org/'
        }, []);

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/commitment/topic/1', {
            topics: ['Test3'],
        });
        res.status.should.equal(400);
    });

    it('Only allowed change topics as not logged in user', async function () {
        dbDsl.createCommitment('1', {
            adminId: '1', topics: ['Test1'], language: 'de', created: 700, website: 'https://www.example.org/'
        }, []);

        await dbDsl.sendToDb();
        let res = await requestHandler.put('/api/user/commitment/topic/1', {
            topics: ['test1', 'Test3'],
        });
        res.status.should.equal(401);
    });
});
