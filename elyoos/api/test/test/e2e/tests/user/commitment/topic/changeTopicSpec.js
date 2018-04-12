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

        dbDsl.createTopic('Test3');
        dbDsl.createCommitment('1', {
            adminId: '1', topics: ['Test1', 'Test2'], language: 'de', created: 700, website: 'https://www.example.org/'
        }, []);

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/commitment/topic/1', {
            topics: ['test1', 'Test3', 'Test4'],
        });
        res.status.should.equal(200);

        let resp = await db.cypher().match("(topic:Topic)")
            .optionalMatch("(topic)-[:TOPIC]->(commitment:Commitment)")
            .return(`DISTINCT topic.name AS topic, commitment.commitmentId AS commitmentId`).orderBy(`topic.name`).end().send();
        resp.length.should.equals(3);
        resp[0].topic.should.equals('Test1');
        resp[0].commitmentId.should.equals('1');
        resp[1].topic.should.equals('Test3');
        resp[1].commitmentId.should.equals('1');
        resp[2].topic.should.equals('Test4');
        resp[2].commitmentId.should.equals('1');
    });

    it('Change topic of a commitment (other commitment references same previous topic)', async function () {

        dbDsl.createCommitment('1', {
            adminId: '1', topics: ['Test1'], language: 'de', created: 700, website: 'https://www.example.org/'
        }, []);
        dbDsl.createCommitment('2', {
            adminId: '1', topics: ['Test1'], language: 'de', created: 700, website: 'https://www.example.org/'
        }, []);

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/commitment/topic/1', {
            topics: ['Test3'],
        });
        res.status.should.equal(200);

        let resp = await db.cypher().match("(topic:Topic)")
            .optionalMatch("(topic)-[:TOPIC]->(commitment:Commitment)")
            .return(`DISTINCT topic.name AS topic, commitment.commitmentId AS commitmentId`).orderBy(`topic.name`).end().send();
        resp.length.should.equals(2);
        resp[0].topic.should.equals('Test1');
        resp[0].commitmentId.should.equals('2');
        resp[1].topic.should.equals('Test3');
        resp[1].commitmentId.should.equals('1');
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
