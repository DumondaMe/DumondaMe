'use strict';

const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;

describe('Integration Tests to get an overview of the topics', function () {

    beforeEach(async function () {
        await dbDsl.init(4, true);
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Get the topics overview', async function () {

        dbDsl.createTopicSuggestion({userId: '2', topic: 'spirituality', created: 666});
        dbDsl.createTopicSuggestion({userId: '3', topic: 'environment', created: 777});

        dbDsl.createMainTopic({
            topicId: '1', descriptionDe: 'Umwelt', similarDe: ['Umweltschutz', 'Natur'],
            descriptionEn: 'Environment', similarEn: ['Ecological']
        });

        dbDsl.createSubTopic({
            parentTopicId: '1', topicId: '2', descriptionDe: 'Zero Waste', similarDe: [],
            descriptionEn: 'Zero Waste', similarEn: []
        });

        dbDsl.createSubTopic({
            parentTopicId: '1', topicId: '3', descriptionDe: 'Alternative Währungen', similarDe: [],
            descriptionEn: 'Alternative Currencies', similarEn: []
        });

        dbDsl.createMainTopic({
            topicId: '4', descriptionDe: 'Finanzen', similarDe: ['Geld'],
            descriptionEn: 'Finance', similarEn: ['Commerce', 'Money']
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/topics', {language: 'de'});
        res.status.should.equal(200);

        res.body.numberOfTopicSuggestions.should.equals(2);
        res.body.topicSuggestions.length.should.equals(2);
        res.body.topicSuggestions[0].topic.should.equals("environment");
        res.body.topicSuggestions[0].name.should.equals("user Meier3");
        res.body.topicSuggestions[0].created.should.equals(777);
        res.body.topicSuggestions[0].userId.should.equals("3");
        res.body.topicSuggestions[0].url.should.equals("profileImage/3/thumbnail.jpg");

        res.body.topicSuggestions[1].topic.should.equals("spirituality");
        res.body.topicSuggestions[1].name.should.equals("user Meier2");
        res.body.topicSuggestions[1].created.should.equals(666);
        res.body.topicSuggestions[1].userId.should.equals("2");
        res.body.topicSuggestions[1].url.should.equals("profileImage/2/thumbnail.jpg");

        res.body.numberOfTopics.should.equals(2);
        res.body.topics.length.should.equals(2);
        res.body.topics[0].topicId.should.equals('4');
        res.body.topics[0].de.should.equals('Finanzen');
        res.body.topics[0].similarDe.length.should.equals(1);
        res.body.topics[0].similarDe.should.include('Geld');
        res.body.topics[0].en.should.equals('Finance');
        res.body.topics[0].similarEn.length.should.equals(2);
        res.body.topics[0].similarEn.should.include('Commerce');
        res.body.topics[0].similarEn.should.include('Money');
        res.body.topics[0].numberOfSubTopics.should.equals(0);

        res.body.topics[1].topicId.should.equals('1');
        res.body.topics[1].de.should.equals('Umwelt');
        res.body.topics[1].similarDe.length.should.equals(2);
        res.body.topics[1].similarDe.should.include('Umweltschutz');
        res.body.topics[1].similarDe.should.include('Natur');
        res.body.topics[1].en.should.equals('Environment');
        res.body.topics[1].similarEn.length.should.equals(1);
        res.body.topics[1].similarEn.should.include('Ecological');
        res.body.topics[1].numberOfSubTopics.should.equals(2);

    });
});
