'use strict';

const users = require('dumonda-me-server-test-util').user;
const db = require('dumonda-me-server-test-util').db;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const moment = require('moment');
const sinon = require('sinon');
const stubCDN = require('dumonda-me-server-test-util').stubCDN();

describe('Change title Image of default answer', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(3);
        stubCDN.uploadBuffer.reset();
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'description', topics: ['Spiritual', 'Health'],
            language: 'de'
        });
        dbDsl.createQuestion('2', {
            creatorId: '3', question: 'Das ist eine Frage2', description: 'description2', topics: ['Health'],
            language: 'en'
        });
        dbDsl.createDefaultAnswer('6', {
            creatorId: '2', questionId: '1', answer: 'Answer2'
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Add image to default answer (no image yet)', async function () {
        dbDsl.createDefaultAnswer('5', {
            creatorId: '1', questionId: '1', answer: 'Answer', modified: 600, hasImage: false
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/answer/default/image', {
            answerId: '5'
        }, `${__dirname}/../create/defaultAnswerImage.jpg`);
        res.status.should.equal(200);

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->
                                            (answer:Default:Answer:HasTitleImage {answerId: '5'})<-[:IS_CREATOR]-(user:User {userId: '1'})`)
            .return(`answer`).end().send();
        resp.length.should.equals(1);
        resp[0].answer.modified.should.least(startTime);

        res.body.imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/defaultAnswer/5/500x800/title.jpg?v=${resp[0].answer.modified}`);

        stubCDN.uploadBuffer.calledWith(sinon.match.any, `defaultAnswer/5/title.jpg`, sinon.match.any).should.be.true;
        stubCDN.uploadBuffer.calledWith(sinon.match.any, `defaultAnswer/5/500x800/title.jpg`, sinon.match.any).should.be.true;
        stubCDN.uploadBuffer.calledWith(sinon.match.any, `defaultAnswer/5/1000x1600/title.jpg`, sinon.match.any).should.be.true;
    });

    it('Add image to default answer (answer has image)', async function () {
        dbDsl.createDefaultAnswer('5', {
            creatorId: '1', questionId: '1', answer: 'Answer', modified: 600, hasImage: true
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/answer/default/image', {
            answerId: '5'
        }, `${__dirname}/../create/defaultAnswerImage.jpg`);
        res.status.should.equal(200);

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->
                                            (answer:Default:Answer:HasTitleImage {answerId: '5'})<-[:IS_CREATOR]-(user:User {userId: '1'})`)
            .return(`answer`).end().send();
        resp.length.should.equals(1);
        resp[0].answer.modified.should.least(startTime);

        res.body.imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/defaultAnswer/5/500x800/title.jpg?v=${resp[0].answer.modified}`);

        stubCDN.uploadBuffer.calledWith(sinon.match.any, `defaultAnswer/5/title.jpg`, sinon.match.any).should.be.true;
        stubCDN.uploadBuffer.calledWith(sinon.match.any, `defaultAnswer/5/500x800/title.jpg`, sinon.match.any).should.be.true;
        stubCDN.uploadBuffer.calledWith(sinon.match.any, `defaultAnswer/5/1000x1600/title.jpg`, sinon.match.any).should.be.true;
    });

    it('The user is only allowed to change answers that he has created', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/answer/default/image', {
            answerId: '6'
        }, `${__dirname}/../create/defaultAnswerImage.jpg`);
        res.status.should.equal(400);

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->
                                            (answer:Default {answerId: '6'})`)
            .return(`answer`).end().send();
        resp.length.should.equals(1);
        resp[0].answer.answer.should.equals('Answer2');
        resp[0].answer.created.should.equals(500);
        resp[0].answer.modified.should.equals(500);

        stubCDN.uploadBuffer.called.should.be.false;
    });
});
