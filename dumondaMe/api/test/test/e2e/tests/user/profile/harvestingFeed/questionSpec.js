'use strict';

const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const users = require('dumonda-me-server-test-util').user;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const moment = require('moment');
const should = require('chai').should();

describe('Get question feed of harvesting user', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(8);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});
        dbDsl.createMainTopic({topicId: 'topic2', descriptionDe: 'topic2De', descriptionEn: 'topic2En'});
        dbDsl.createMainTopic({topicId: 'topic3', descriptionDe: 'topic3De', descriptionEn: 'topic3En'});

        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'Test dumonda.me change the world1',
            topics: ['topic1'], language: 'de', created: 500, modified: 700
        });
        dbDsl.createTextAnswer('5', {
            creatorId: '6', questionId: '1', answer: 'Answer', created: 600,
        });
        dbDsl.createBookAnswer('6', {
            creatorId: '7', questionId: '1', created: 601, authors: 'Hans Wurst', googleBookId: '1234',
            hasPreviewImage: true
        });
        dbDsl.createQuestion('2', {
            creatorId: '1', question: 'Das ist eine Frage2',
            topics: ['topic2'], language: 'de', created: 602,
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Show question create by a harvesting user', async function () {
        dbDsl.setUserIsHarvestingUser('2', {start: 100, end: 200, link: 'https://www.link.ch', address: 'Milky Way'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile', {userId: '2', guiLanguage: 'de', languages: ['de']});
        res.status.should.equal(200);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('HarvestingQuestion');
        res.body.feed[0].questionId.should.equals('1');
        res.body.feed[0].question.should.equals('Das ist eine Frage');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage');
        res.body.feed[0].description.should.equals('Test dumonda.me change the world1');
        res.body.feed[0].descriptionHtml.should.equals(`Test <a href="http://dumonda.me" class="linkified" target="_blank" rel="noopener">dumonda.me</a> change the world1`);
        res.body.feed[0].numberOfAnswers.should.equals(2);
    });

    it('Show question where answer has been created by a harvesting user', async function () {
        dbDsl.setUserIsHarvestingUser('6', {start: 100, end: 200, link: 'https://www.link.ch', address: 'Milky Way'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile', {userId: '6', guiLanguage: 'de', languages: ['de']});
        res.status.should.equal(200);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('HarvestingQuestion');
        res.body.feed[0].questionId.should.equals('1');
        res.body.feed[0].question.should.equals('Das ist eine Frage');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage');
        res.body.feed[0].description.should.equals('Test dumonda.me change the world1');
        res.body.feed[0].descriptionHtml.should.equals(`Test <a href="http://dumonda.me" class="linkified" target="_blank" rel="noopener">dumonda.me</a> change the world1`)
        res.body.feed[0].numberOfAnswers.should.equals(2);
    });

    it('Show question only once where two answer has been created by a harvesting user', async function () {
        dbDsl.createBookAnswer('8', {
            creatorId: '6', questionId: '1', created: 601, authors: 'Hans Wurst', googleBookId: '1234',
            hasPreviewImage: true
        });
        dbDsl.setUserIsHarvestingUser('6', {start: 100, end: 200, link: 'https://www.link.ch', address: 'Milky Way'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile', {userId: '6', guiLanguage: 'de', languages: ['de']});
        res.status.should.equal(200);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('HarvestingQuestion');
        res.body.feed[0].questionId.should.equals('1');
        res.body.feed[0].question.should.equals('Das ist eine Frage');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage');
        res.body.feed[0].description.should.equals('Test dumonda.me change the world1');
        res.body.feed[0].descriptionHtml.should.equals(`Test <a href="http://dumonda.me" class="linkified" target="_blank" rel="noopener">dumonda.me</a> change the world1`);
        res.body.feed[0].numberOfAnswers.should.equals(3);
    });

    it('Show question only once where two answer and question has been created by a harvesting user', async function () {
        dbDsl.createBookAnswer('8', {
            creatorId: '2', questionId: '1', created: 601, authors: 'Hans Wurst', googleBookId: '1234',
            hasPreviewImage: true
        });
        dbDsl.setUserIsHarvestingUser('2', {start: 100, end: 200, link: 'https://www.link.ch', address: 'Milky Way'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile', {userId: '2', guiLanguage: 'de', languages: ['de']});
        res.status.should.equal(200);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('HarvestingQuestion');
        res.body.feed[0].questionId.should.equals('1');
        res.body.feed[0].question.should.equals('Das ist eine Frage');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage');
        res.body.feed[0].description.should.equals('Test dumonda.me change the world1');
        res.body.feed[0].descriptionHtml.should.equals(`Test <a href="http://dumonda.me" class="linkified" target="_blank" rel="noopener">dumonda.me</a> change the world1`);
        res.body.feed[0].numberOfAnswers.should.equals(3);
    });

    it('Show question create by a harvesting user without description', async function () {
        dbDsl.setUserIsHarvestingUser('1', {start: 100, end: 200, link: 'https://www.link.ch', address: 'Milky Way'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile', {guiLanguage: 'de', languages: ['de']});
        res.status.should.equal(200);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('HarvestingQuestion');
        res.body.feed[0].questionId.should.equals('2');
        res.body.feed[0].question.should.equals('Das ist eine Frage2');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage2');
        res.body.feed[0].numberOfAnswers.should.equals(0);

        should.not.exist(res.body.feed[0].description);
        should.not.exist(res.body.feed[0].descriptionHtml);
    });
});
