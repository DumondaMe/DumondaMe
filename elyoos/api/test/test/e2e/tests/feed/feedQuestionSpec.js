'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');

describe('Get question feed', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(3);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'description',
            topic: ['spiritual', 'education'], language: 'de', created: 500, modified: 700
        });
        dbDsl.createTextAnswer('5', {
            creatorId: '2', questionId:'1', answer: 'Answer', created: 600,
        });
        dbDsl.createTextAnswer('6', {
            creatorId: '3', questionId:'1', answer: 'Answer2',
        });

        dbDsl.createQuestion('2', {
            creatorId: '3', question: 'Das ist eine Frage2', description: 'description2',
            topic: ['health'], language: 'de', created: 600,
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get question feed', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/feed/question', {timestamp: 601});
        res.status.should.equal(200);
        res.body.questions.length.should.equals(2);
        res.body.questions[0].questionId.should.equals('2');
        res.body.questions[0].question.should.equals('Das ist eine Frage2');
        res.body.questions[0].slug.should.equals('das-ist-eine-frage2');
        res.body.questions[0].description.should.equals('description2');
        res.body.questions[0].created.should.equals(600);
        res.body.questions[0].numberOfAnswers.should.equals(0);
        res.body.questions[0].creator.name.should.equals('user Meier3');
        //@todo test with new privacy settings
        res.body.questions[0].creator.thumbnailUrl.should.equals('profileImage/3/thumbnail.jpg');
        res.body.questions[0].topic.length.should.equals(1);
        res.body.questions[0].topic[0].should.equals('health');

        res.body.questions[1].questionId.should.equals('1');
        res.body.questions[1].question.should.equals('Das ist eine Frage');
        res.body.questions[1].slug.should.equals('das-ist-eine-frage');
        res.body.questions[1].description.should.equals('description');
        res.body.questions[1].created.should.equals(500);
        res.body.questions[1].numberOfAnswers.should.equals(2);
        res.body.questions[1].creator.name.should.equals('user Meier2');
        //@todo test with new privacy settings
        res.body.questions[1].creator.thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');
        res.body.questions[1].topic.length.should.equals(2);
        res.body.questions[1].topic[0].should.equals('spiritual');
        res.body.questions[1].topic[1].should.equals('education');
    });

    it('Ignore new question for start page', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/feed/question', {timestamp: 599});
        res.status.should.equal(200);
        res.body.questions.length.should.equals(1);
        res.body.questions[0].questionId.should.equals('1');
    });

    it('Get maximal 20 questions', async function () {

        for(let i = 3; i < 23; i++) {
            dbDsl.createQuestion(`${i}`, {
                creatorId: '2', question: 'Das ist eine Frage1', description: 'description1',
                topic: ['health'], language: 'de', created: 500 - i,
            });
        }
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/feed/question', {timestamp: 601});
        res.status.should.equal(200);
        res.body.questions.length.should.equals(20);
    });

    it('Get next page of questions', async function () {
        for(let i = 3; i < 23; i++) {
            dbDsl.createQuestion(`${i}`, {
                creatorId: '2', question: 'Das ist eine Frage1', description: 'description1',
                topic: ['health'], language: 'de', created: 500 - i,
            });
        }
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/feed/question', {page: 1, timestamp: 601});
        res.status.should.equal(200);
        res.body.questions.length.should.equals(2);
        res.body.questions[0].questionId.should.equals('21');
        res.body.questions[1].questionId.should.equals('22');
    });

    it('Ignore newer question then timestamp calling next page', async function () {
        for(let i = 3; i < 23; i++) {
            dbDsl.createQuestion(`${i}`, {
                creatorId: '2', question: 'Das ist eine Frage1', description: 'description1',
                topic: ['health'], language: 'de', created: 500 - i,
            });
        }
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/feed/question', {page: 1, timestamp: 599});
        res.status.should.equal(200);
        res.body.questions.length.should.equals(1);
        res.body.questions[0].questionId.should.equals('22');
    });

    it('Get question feed when not logged in', async function () {
        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/feed/question', {timestamp: 601});
        res.status.should.equal(200);
        res.body.questions.length.should.equals(2);
        res.body.questions[0].questionId.should.equals('2');
        res.body.questions[1].questionId.should.equals('1');
    });
});
