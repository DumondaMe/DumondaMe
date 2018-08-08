'use strict';

const users = require('elyoos-server-test-util').user;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const requestHandler = require('elyoos-server-test-util').requestHandler;
const sinon = require('sinon');

describe('Get topics', function () {

    let sandbox;

    beforeEach(async function () {
        await dbDsl.init(3);
        sandbox = sinon.sandbox.create();

        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});
        dbDsl.createSubTopic({
            parentTopicId: 'topic1', topicId: 'topic11', descriptionDe: 'topic11De', descriptionEn: 'topic11En'
        });
        dbDsl.createSubTopic({
            parentTopicId: 'topic1', topicId: 'topic12', descriptionDe: 'topic12De', descriptionEn: 'topic12En'
        });
        dbDsl.createSubTopic({
            parentTopicId: 'topic12', topicId: 'topic121', descriptionDe: 'topic121De', descriptionEn: 'topic121En'
        });
        dbDsl.createMainTopic({topicId: 'topic2', descriptionDe: 'topic2De', descriptionEn: 'topic2En'});
        dbDsl.createSubTopic({
            parentTopicId: 'topic2', topicId: 'topic21', descriptionDe: 'topic21De', descriptionEn: 'topic21En'
        });
        dbDsl.createMainTopic({topicId: 'topic3', descriptionDe: 'topic3De', descriptionEn: 'topic3En'});
        await dbDsl.sendToDb();
    });

    afterEach(function () {
        sandbox.restore();
        return requestHandler.logout();
    });

    it('Get topics in german', async function () {
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/topic', {language: 'de'});
        res.status.should.equal(200);
        res.body.length.should.equals(3);
        res.body[0].id.should.equals('topic1');
        res.body[0].description.should.equals('topic1De');
        res.body[0].subItems.length.should.equals(2);
        res.body[0].subItems[0].id.should.equals('topic11');
        res.body[0].subItems[0].parentId.should.equals('topic1');
        res.body[0].subItems[0].description.should.equals('topic11De');
        res.body[0].subItems[0].subItems.length.should.equals(0);
        res.body[0].subItems[1].id.should.equals('topic12');
        res.body[0].subItems[1].parentId.should.equals('topic1');
        res.body[0].subItems[1].description.should.equals('topic12De');
        res.body[0].subItems[1].subItems.length.should.equals(1);
        res.body[0].subItems[1].subItems[0].id.should.equals('topic121');
        res.body[0].subItems[1].subItems[0].parentId.should.equals('topic12');
        res.body[0].subItems[1].subItems[0].description.should.equals('topic121De');

        res.body[1].id.should.equals('topic2');
        res.body[1].description.should.equals('topic2De');
        res.body[1].subItems.length.should.equals(1);
        res.body[1].subItems[0].id.should.equals('topic21');
        res.body[1].subItems[0].parentId.should.equals('topic2');
        res.body[1].subItems[0].description.should.equals('topic21De');
        res.body[1].subItems[0].subItems.length.should.equals(0);

        res.body[2].id.should.equals('topic3');
        res.body[2].description.should.equals('topic3De');
        res.body[2].subItems.length.should.equals(0);
    });

    it('Get topics in english', async function () {
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/topic', {language: 'en'});
        res.status.should.equal(200);
        res.body.length.should.equals(3);
        res.body[0].id.should.equals('topic1');
        res.body[0].description.should.equals('topic1En');
        res.body[0].subItems.length.should.equals(2);
        res.body[0].subItems[0].id.should.equals('topic11');
        res.body[0].subItems[0].description.should.equals('topic11En');
        res.body[0].subItems[0].subItems.length.should.equals(0);
        res.body[0].subItems[1].id.should.equals('topic12');
        res.body[0].subItems[1].description.should.equals('topic12En');
        res.body[0].subItems[1].subItems.length.should.equals(1);
        res.body[0].subItems[1].subItems[0].id.should.equals('topic121');
        res.body[0].subItems[1].subItems[0].description.should.equals('topic121En');

        res.body[1].id.should.equals('topic2');
        res.body[1].description.should.equals('topic2En');
        res.body[1].subItems.length.should.equals(1);
        res.body[1].subItems[0].id.should.equals('topic21');
        res.body[1].subItems[0].description.should.equals('topic21En');
        res.body[1].subItems[0].subItems.length.should.equals(0);

        res.body[2].id.should.equals('topic3');
        res.body[2].description.should.equals('topic3En');
        res.body[2].subItems.length.should.equals(0);
    });
});
