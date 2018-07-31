'use strict';

const users = require('elyoos-server-test-util').user;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests to get all subtopics of an topic', function () {

    beforeEach(async function () {
        await dbDsl.init(4, true);
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Get all sub topics of a topic', async function () {

        dbDsl.createMainTopic({
            topicId: '1', descriptionDe: 'Umwelt', similarDe: ['Umweltschutz', 'Natur'],
            descriptionEn: 'Environment', similarEn: ['Ecological']
        });

        dbDsl.createSubTopic({
            parentTopicId: '1', topicId: '2', descriptionDe: 'Zero Waste', similarDe: ['Zero Waste1', 'Zero Waste2'],
            descriptionEn: 'ero Waste3', similarEn: ['Zero Waste4']
        });

        dbDsl.createSubTopic({
            parentTopicId: '1', topicId: '3', descriptionDe: 'Währungen', similarDe: ['Währungen1'],
            descriptionEn: 'Währungen2', similarEn: ['Währungen3', 'Währungen4']
        });

        dbDsl.createMainTopic({
            topicId: '4', descriptionDe: 'Finanzen', similarDe: ['Geld'],
            descriptionEn: 'Finance', similarEn: ['Commerce', 'Money']
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/topics/sub', {topicId: '1', language:'de'});
        res.status.should.equal(200);

        res.body.topics.length.should.equals(2);

        res.body.topics[0].topicId.should.equals('3');
        res.body.topics[0].parentTopicId.should.equals('1');
        res.body.topics[0].de.should.equals('Währungen');
        res.body.topics[0].similarDe.length.should.equals(1);
        res.body.topics[0].similarDe.should.include('Währungen1');
        res.body.topics[0].en.should.equals('Währungen2');
        res.body.topics[0].similarEn.length.should.equals(2);
        res.body.topics[0].similarEn.should.include('Währungen3');
        res.body.topics[0].similarEn.should.include('Währungen4');
        res.body.topics[0].numberOfSubTopics.should.equals(0);

        res.body.topics[1].topicId.should.equals('2');
        res.body.topics[1].parentTopicId.should.equals('1');
        res.body.topics[1].de.should.equals('Zero Waste');
        res.body.topics[1].similarDe.length.should.equals(2);
        res.body.topics[1].similarDe.should.include('Zero Waste1');
        res.body.topics[1].similarDe.should.include('Zero Waste2');
        res.body.topics[1].en.should.equals('ero Waste3');
        res.body.topics[1].similarEn.length.should.equals(1);
        res.body.topics[1].similarEn.should.include('Zero Waste4');
        res.body.topics[1].numberOfSubTopics.should.equals(0);
    });
});
