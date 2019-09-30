'use strict';

const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const sinon = require('sinon');

describe('Get info of topics', function () {

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

    it('Get topic info in german', async function () {
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/topic/info', {language: 'de', topicIds: ['topic1', 'topic11', 'topic3']});
        res.status.should.equal(200);
        res.body.length.should.equals(3);

        res.body[0].id.should.equals('topic11');
        res.body[0].description.should.equals('topic11De');
        res.body[0].image.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/topic/topic11/preview.jpg`);
        res.body[0].thumbnail.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/topic/topic11/thumbnail.jpg`);

        res.body[1].id.should.equals('topic1');
        res.body[1].description.should.equals('topic1De');
        res.body[1].image.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/topic/topic1/preview.jpg`);
        res.body[1].thumbnail.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/topic/topic1/thumbnail.jpg`);

        res.body[2].id.should.equals('topic3');
        res.body[2].description.should.equals('topic3De');
        res.body[2].image.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/topic/topic3/preview.jpg`);
        res.body[2].thumbnail.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/topic/topic3/thumbnail.jpg`);
    });

    it('Get topics in english', async function () {
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/topic/info', {language: 'en', topicIds: ['topic1', 'topic11', 'topic3']});
        res.status.should.equal(200);
        res.body.length.should.equals(3);

        res.body[0].id.should.equals('topic11');
        res.body[0].description.should.equals('topic11En');
        res.body[0].image.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/topic/topic11/preview.jpg`);
        res.body[0].thumbnail.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/topic/topic11/thumbnail.jpg`);

        res.body[1].id.should.equals('topic1');
        res.body[1].description.should.equals('topic1En');
        res.body[1].image.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/topic/topic1/preview.jpg`);
        res.body[1].thumbnail.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/topic/topic1/thumbnail.jpg`);

        res.body[2].id.should.equals('topic3');
        res.body[2].description.should.equals('topic3En');
        res.body[2].image.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/topic/topic3/preview.jpg`);
        res.body[2].thumbnail.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/topic/topic3/thumbnail.jpg`);
    });

    it('Not existing topic', async function () {
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/topic/info', {language: 'de', topicIds: ['notExisting']});
        res.status.should.equal(200);
        res.body.length.should.equals(0);
    });
});
