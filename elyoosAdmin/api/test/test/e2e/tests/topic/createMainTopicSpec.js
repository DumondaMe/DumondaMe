'use strict';

const users = require('elyoos-server-test-util').user;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const db = require('elyoos-server-test-util').db;
const requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for creating new main topics', function () {

    beforeEach(async function () {
        await dbDsl.init(4, true);
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Create a new main topics', async function () {

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/topics/main', {
            de: 'Umwelt', en: 'Environment',
            similarDe: ['Umweltschutz', 'Natur'], similarEn: ['Ecological']
        });
        res.status.should.equal(200);

        let topics = await db.cypher().match(`(topic:MainTopic:Topic {topicId: {topicId}})`)
            .return('topic')
            .end({topicId: res.body.topicId}).send();

        topics.length.should.equals(1);
        topics[0].topic.de.should.equals('Umwelt');
        topics[0].topic.en.should.equals('Environment');
        topics[0].topic.similarDe.length.should.equals(2);
        topics[0].topic.similarDe.should.includes('Umweltschutz');
        topics[0].topic.similarDe.should.includes('Natur');
        topics[0].topic.similarEn.length.should.equals(1);
        topics[0].topic.similarEn.should.includes('Ecological');
    });

    it('Create a new main topics only mandatory fields', async function () {

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/topics/main', {
            de: 'Umwelt', en: 'Environment'
        });
        res.status.should.equal(200);

        let topics = await db.cypher().match(`(topic:MainTopic:Topic {topicId: {topicId}})`)
            .return('topic')
            .end({topicId: res.body.topicId}).send();

        topics.length.should.equals(1);
        topics[0].topic.de.should.equals('Umwelt');
        topics[0].topic.en.should.equals('Environment');
    });
});
