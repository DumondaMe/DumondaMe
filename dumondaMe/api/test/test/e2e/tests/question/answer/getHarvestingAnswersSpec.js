'use strict';

const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const moment = require('moment');

describe('Getting answers created by harvesting user of a question', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(6);
        await requestHandler.logout();
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createQuestion('1', {
            creatorId: '1', question: 'Das ist eine Frage', description: 'Test dumonda.me change the world',
            topics: ['topic1', 'topic2'], language: 'de', modified: 700
        });
        dbDsl.createDefaultAnswer('5', {
            creatorId: '1', questionId: '1', answer: 'Answer', created: 600,
        });
        dbDsl.createDefaultAnswer('6', {
            creatorId: '3', questionId: '1', answer: 'Answer2 www.dumonda.me', hasImage: true
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting only answers of harvesting user', async function () {
        dbDsl.setUserIsHarvestingUser('3', {start: 100, end: 200, link: 'https://www.link.ch', address: 'Milky Way'});
        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/question/answer', {questionId: '1', harvestingId: '3', page: 0, language: 'de'});
        res.status.should.equal(200);

        res.body.hasMoreAnswers.should.equals(false);
        res.body.answers.length.should.equals(1);
        res.body.answers[0].answerId.should.equals('6');
    });

    it('Has next answers', async function () {
        dbDsl.setUserIsHarvestingUser('3', {start: 100, end: 200, link: 'https://www.link.ch', address: 'Milky Way'});
        for (let index = 7; index < 27; index++) {
            dbDsl.createDefaultAnswer(`${index}`, {
                creatorId: '3', questionId: '1', answer: 'Answer', created: 600 + index,
            });
        }
        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/question/answer', {questionId: '1', harvestingId: '3', page: 0, language: 'de'});
        res.status.should.equal(200);

        res.body.answers.length.should.equals(20);
        res.body.hasMoreAnswers.should.equals(true);
    });

    it('Getting next answers', async function () {
        dbDsl.setUserIsHarvestingUser('3', {start: 100, end: 200, link: 'https://www.link.ch', address: 'Milky Way'});
        for (let index = 7; index < 27; index++) {
            dbDsl.createDefaultAnswer(`${index}`, {
                creatorId: '3', questionId: '1', answer: 'Answer', created: 1000 + index,
            });
            dbDsl.createDefaultAnswer(`5${index}`, {
                creatorId: '4', questionId: '1', answer: 'Answer', created: 1000 + index,
            });
        }
        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/question/answer', {questionId: '1', harvestingId: '3', page: 1, language: 'de'});
        res.status.should.equal(200);

        res.body.answers.length.should.equals(1);
        res.body.answers[0].answerId.should.equals('6');
        res.body.hasMoreAnswers.should.equals(false);
    });
});
