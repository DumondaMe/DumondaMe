'use strict';

let requestHandler = require('dumonda-me-server-test-util').requestHandler;
let users = require('dumonda-me-server-test-util').user;
let db = require('dumonda-me-server-test-util').db;
let dbDsl = require('dumonda-me-server-test-util').dbDSL;

describe('Setting the interested topics for the user', function () {

    beforeEach(async function () {
        await dbDsl.init(1);

        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});
        dbDsl.createMainTopic({topicId: 'topic2', descriptionDe: 'topic2De', descriptionEn: 'topic2En'});
        dbDsl.createSubTopic({
            parentTopicId: 'topic2', topicId: 'topic21', descriptionDe: 'topic21De', descriptionEn: 'topic21En'
        });
        dbDsl.createSubTopic({
            parentTopicId: 'topic2', topicId: 'topic22', descriptionDe: 'topic22De', descriptionEn: 'topic22En'
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Change interested topic with no previous interested topics', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/settings/topics',
            {topics: ['topic1', 'topic22']});
        res.status.should.equal(200);
        let user = await db.cypher().match(`(:User {userId: '1'})-[:INTERESTED]->(topic:Topic)`)
            .return('topic.topicId AS topicId').orderBy('topicId').end().send();
        user.length.should.equals(2);
        user[0].topicId.should.equals('topic1');
        user[1].topicId.should.equals('topic22');
    });

    it('Change interested topic with previous interested topics', async function () {
        dbDsl.interestedTopics('1', {topics: ['topic2', 'topic22']});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/settings/topics',
            {topics: ['topic1', 'topic22']});
        res.status.should.equal(200);
        let user = await db.cypher().match(`(:User {userId: '1'})-[:INTERESTED]->(topic:Topic)`)
            .return('topic.topicId AS topicId').orderBy('topicId').end().send();
        user.length.should.equals(2);
        user[0].topicId.should.equals('topic1');
        user[1].topicId.should.equals('topic22');
    });

    it('Missing topics does delete all interested relationships', async function () {
        dbDsl.interestedTopics('1', {topics: ['topic2', 'topic22']});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/settings/topics');
        res.status.should.equal(200);
        let user = await db.cypher().match(`(:User {userId: '1'})-[:INTERESTED]->(topic:Topic)`)
            .return('topic.topicId AS topicId').orderBy('topicId').end().send();
        user.length.should.equals(0);
    });

});
