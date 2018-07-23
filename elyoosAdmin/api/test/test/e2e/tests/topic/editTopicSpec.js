'use strict';

const users = require('elyoos-server-test-util').user;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const db = require('elyoos-server-test-util').db;
const requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for edit topics', function () {

    beforeEach(async function () {
        await dbDsl.init(4, true);
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Edit a main topics with all properties', async function () {

        dbDsl.createMainTopic({
            topicId: '1', descriptionDe: 'Umwelt', similarDe: ['Umweltschutz', 'Natur'],
            descriptionEn: 'Environment', similarEn: ['Ecological']
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/topics', {
            topicId: '1', de: 'Umwelt2', en: 'Environment2',
            similarDe: ['Umweltschutz2'], similarEn: ['Ecological2', 'Ecological3']
        });
        res.status.should.equal(200);

        let topics = await db.cypher().match(`(topic:MainTopic:Topic {topicId: '1'})`)
            .return('topic').end().send();

        topics.length.should.equals(1);
        topics[0].topic.de.should.equals('Umwelt2');
        topics[0].topic.en.should.equals('Environment2');
        topics[0].topic.similarDe.length.should.equals(1);
        topics[0].topic.similarDe.should.includes('Umweltschutz2');
        topics[0].topic.similarEn.length.should.equals(2);
        topics[0].topic.similarEn.should.includes('Ecological2');
        topics[0].topic.similarEn.should.includes('Ecological3');
    });

    it('Edit a main topics with only mandatory properties', async function () {

        dbDsl.createMainTopic({
            topicId: '1', descriptionDe: 'Umwelt', similarDe: ['Umweltschutz', 'Natur'],
            descriptionEn: 'Environment', similarEn: ['Ecological']
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/topics', {
            topicId: '1', de: 'Umwelt2', en: 'Environment2'
        });
        res.status.should.equal(200);

        let topics = await db.cypher().match(`(topic:MainTopic:Topic {topicId: '1'})`)
            .return('topic').end().send();

        topics.length.should.equals(1);
        topics[0].topic.de.should.equals('Umwelt2');
        topics[0].topic.en.should.equals('Environment2');
        topics[0].topic.similarDe.length.should.equals(0);
        topics[0].topic.similarEn.length.should.equals(0);
    });

    it('Error when topic not exists', async function () {

        dbDsl.createMainTopic({
            topicId: '1', descriptionDe: 'Umwelt', similarDe: ['Umweltschutz', 'Natur'],
            descriptionEn: 'Environment', similarEn: ['Ecological']
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/topics', {
            topicId: '2', de: 'Umwelt2', en: 'Environment2',
            similarDe: ['Umweltschutz2'], similarEn: ['Ecological2', 'Ecological3']
        });
        res.status.should.equal(400);

        let topics = await db.cypher().match(`(topic:MainTopic:Topic {topicId: '1'})`)
            .return('topic').end().send();

        topics.length.should.equals(1);
        topics[0].topic.de.should.equals('Umwelt');
        topics[0].topic.en.should.equals('Environment');
        topics[0].topic.similarDe.length.should.equals(2);
        topics[0].topic.similarDe.should.includes('Umweltschutz');
        topics[0].topic.similarDe.should.includes('Natur');
        topics[0].topic.similarEn.length.should.equals(1);
        topics[0].topic.similarEn.should.includes('Ecological');
    });
});
