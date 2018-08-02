'use strict';

const users = require('elyoos-server-test-util').user;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const db = require('elyoos-server-test-util').db;
const requestHandler = require('elyoos-server-test-util').requestHandler;
const should = require('chai').should();

describe('Integration Tests for creating new sub topics', function () {

    beforeEach(async function () {
        await dbDsl.init(4, true);
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Create a new sub topic', async function () {

        dbDsl.createMainTopic({
            topicId: '1', descriptionDe: 'Umwelt', similarDe: ['Umweltschutz', 'Natur'],
            descriptionEn: 'Environment', similarEn: ['Ecological']
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/topics/sub', {
            parentTopicId: '1', de: 'Umwelt2', en: 'Environment2',
            similarDe: ['Umweltschutz2', 'Natur2'], similarEn: ['Ecological2']
        });
        res.status.should.equal(200);

        let topics = await db.cypher().match(`(topic:Topic {topicId: {topicId}})<-[:SUB_TOPIC]-(:Topic {topicId: '1'})`)
            .return('topic')
            .end({topicId: res.body.topicId}).send();

        topics.length.should.equals(1);
        topics[0].topic.de.should.equals('Umwelt2');
        topics[0].topic.en.should.equals('Environment2');
        topics[0].topic.similarDe.length.should.equals(2);
        topics[0].topic.similarDe.should.includes('Umweltschutz2');
        topics[0].topic.similarDe.should.includes('Natur2');
        topics[0].topic.similarEn.length.should.equals(1);
        topics[0].topic.similarEn.should.includes('Ecological2');
    });

    it('Create a new sub topic (only mandatory properties)', async function () {

        dbDsl.createMainTopic({
            topicId: '1', descriptionDe: 'Umwelt', similarDe: ['Umweltschutz', 'Natur'],
            descriptionEn: 'Environment', similarEn: ['Ecological']
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/topics/sub', {
            parentTopicId: '1', de: 'Umwelt2', en: 'Environment2'
        });
        res.status.should.equal(200);

        let topics = await db.cypher().match(`(topic:Topic {topicId: {topicId}})<-[:SUB_TOPIC]-(:Topic {topicId: '1'})`)
            .return('topic')
            .end({topicId: res.body.topicId}).send();

        topics.length.should.equals(1);
        topics[0].topic.de.should.equals('Umwelt2');
        topics[0].topic.en.should.equals('Environment2');
        should.not.exist(topics[0].topic.similarDe);
        should.not.exist(topics[0].topic.similarEn);

    });

    it('Sub topic not created because main topic does not exist', async function () {

        dbDsl.createMainTopic({
            topicId: '1', descriptionDe: 'Umwelt', similarDe: ['Umweltschutz', 'Natur'],
            descriptionEn: 'Environment', similarEn: ['Ecological']
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/topics/sub', {
            parentTopicId: '2', de: 'Umwelt2', en: 'Environment2',
            similarDe: ['Umweltschutz2', 'Natur2'], similarEn: ['Ecological2']
        });
        res.status.should.equal(200);

        let topics = await db.cypher().match(`(topic:Topic {topicId: {topicId}})<-[:SUB_TOPIC]-(:Topic {topicId: '1'})`)
            .return('topic')
            .end({topicId: res.body.topicId}).send();

        topics.length.should.equals(0);
    });
});
