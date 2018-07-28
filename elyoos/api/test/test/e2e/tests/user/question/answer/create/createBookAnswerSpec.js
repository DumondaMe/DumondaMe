'use strict';

const users = require('elyoos-server-test-util').user;
const db = require('elyoos-server-test-util').db;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const requestHandler = require('elyoos-server-test-util').requestHandler;
const rp = require('request');
const moment = require('moment');
const fs = require('fs');
const should = require('chai').should();
const sinon = require('sinon');
const stubCDN = require('elyoos-server-test-util').stubCDN();

describe('Creating book answer', function () {

    let startTime, sandbox;

    beforeEach(async function () {
        stubCDN.uploadBuffer.reset();
        sandbox = sinon.sandbox.create();
        await dbDsl.init(3);
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'description', topics: ['Spiritual'],
            language: 'de'
        });
        dbDsl.createQuestion('2', {
            creatorId: '3', question: 'Das ist eine Frage2', description: 'description2', topics: ['Health'],
            language: 'en'
        });
        dbDsl.createQuestion('3', {
            creatorId: '3', question: 'Das ist eine Frage3', description: 'description3', topics: ['Health'],
            language: 'fr'
        });
    });

    afterEach(function () {
        sandbox.restore();
        return requestHandler.logout();
    });

    it('Creating not in elyoos existing book answer (with url)', async function () {
        let stubGetRequest = sandbox.stub(rp, 'get');
        stubGetRequest.returns(fs.createReadStream(`${__dirname}/test.jpg`));

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/book/1', {
            authors: 'Hans Wurst', googleBookId: '1234', imageUrl: 'https://example.com/example.jpg',
            title: 'titleBook', description: 'descriptionBook'
        });
        res.status.should.equal(200);
        res.body.created.should.least(startTime);
        res.body.imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/book/${res.body.answerId}/120x250/preview.jpg`);
        res.body.creator.name.should.equals('user Meier');
        res.body.creator.thumbnailUrl.should.equals('profileImage/1/thumbnail.jpg');
        stubCDN.uploadBuffer.calledWith(sinon.match.any, `book/${res.body.answerId}/preview.jpg`, sinon.match.any).should.be.true;
        stubCDN.uploadBuffer.calledWith(sinon.match.any, `book/${res.body.answerId}/120x250/preview.jpg`, sinon.match.any).should.be.true;

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->(answer:Book:Answer)<-[:IS_CREATOR]-(user:User)`)
            .optionalMatch(`(answer)-[:ORIGINAL]->(original)`)
            .return(`answer, user, original`).end().send();
        resp.length.should.equals(1);
        resp[0].answer.answerId.should.equals(res.body.answerId);
        resp[0].answer.googleBookId.should.equals('1234');
        resp[0].answer.title.should.equals('titleBook');
        resp[0].answer.description.should.equals('descriptionBook');
        resp[0].answer.hasPreviewImage.should.equals(true);
        resp[0].answer.created.should.equals(res.body.created);
        resp[0].user.userId.should.equals('1');
        should.not.exist(resp[0].original);
    });

    it('Create a book response that has not yet been created in elyoos (without url)', async function () {
        sandbox.stub(rp, 'get');

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/book/1', {
            authors: 'Hans Wurst', googleBookId: '1234',
            title: 'titleBook', description: 'descriptionBook'
        });
        res.status.should.equal(200);
        res.body.created.should.least(startTime);
        should.not.exist(res.body.imageUrl);
        res.body.creator.name.should.equals('user Meier');
        res.body.creator.thumbnailUrl.should.equals('profileImage/1/thumbnail.jpg');
        stubCDN.uploadBuffer.called.should.be.false;

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->(answer:Book:Answer)<-[:IS_CREATOR]-(user:User {userId: '1'})`)
            .optionalMatch(`(answer)-[:ORIGINAL]->(original)`)
            .return(`answer, original`).end().send();
        resp.length.should.equals(1);
        resp[0].answer.answerId.should.equals(res.body.answerId);
        resp[0].answer.googleBookId.should.equals('1234');
        resp[0].answer.title.should.equals('titleBook');
        resp[0].answer.description.should.equals('descriptionBook');
        resp[0].answer.hasPreviewImage.should.equals(false);
        resp[0].answer.created.should.equals(res.body.created);
        should.not.exist(resp[0].original);
    });

    it('Create a book response that was already used for another question', async function () {
        sandbox.stub(rp, 'get');
        dbDsl.createBookAnswer('10', {
            creatorId: '2', questionId: '2', created: 500, authors: 'Hans Wurst', googleBookId: '1234',
            hasPreviewImage: true
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/book/1', {
            authors: 'Hans Wurst', googleBookId: '1234',
            title: 'titleBook', description: 'descriptionBook'
        });
        res.status.should.equal(200);

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->(answer:Book:Answer)<-[:IS_CREATOR]-(user:User {userId: '1'})`)
            .optionalMatch(`(answer)-[:ORIGINAL]->(original:Book {answerId: '10'})`)
            .return(`original`).end().send();
        resp.length.should.equals(1);
        should.exist(resp[0].original);
    });

    it('Create a book response that was already used for other questions', async function () {
        sandbox.stub(rp, 'get');
        dbDsl.createBookAnswer('10', {
            creatorId: '2', questionId: '2', created: 500, authors: 'Hans Wurst', googleBookId: '1234',
            hasPreviewImage: true
        });
        dbDsl.createBookAnswer('11', {
            creatorId: '3', questionId: '3', created: 499, authors: 'Hans Wurst', googleBookId: '1234',
            hasPreviewImage: true
        });
        dbDsl.setOriginalAnswer({answerId: '10', originalAnswerId: '11'});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/book/1', {
            authors: 'Hans Wurst', googleBookId: '1234',
            title: 'titleBook', description: 'descriptionBook'
        });
        res.status.should.equal(200);

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->(answer:Book:Answer)<-[:IS_CREATOR]-(user:User {userId: '1'})`)
            .optionalMatch(`(answer)-[:ORIGINAL]->(original:Book {answerId: '11'})`)
            .return(`original`).end().send();
        resp.length.should.equals(1);
        should.exist(resp[0].original);
    });

    it('Creating book answer fails because book is already used for question', async function () {
        sandbox.stub(rp, 'get');
        dbDsl.createBookAnswer('10', {
            creatorId: '2', questionId: '1', created: 500, authors: 'Hans Wurst', googleBookId: '1234',
            hasPreviewImage: true
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/book/1', {
            authors: 'Hans Wurst', googleBookId: '1234',
            title: 'titleBook', description: 'descriptionBook'
        });
        res.status.should.equal(400);
        res.body.errorCode.should.equal(2);

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->(answer:Book:Answer)<-[:IS_CREATOR]-(user:User {userId: '1'})`)
            .return(`answer`).end().send();
        resp.length.should.equals(0);
    });

    it('Prevent xss attack when creating book answer', async function () {
        let stubGetRequest = sandbox.stub(rp, 'get');
        stubGetRequest.returns(fs.createReadStream(`${__dirname}/test.jpg`));

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/book/1', {
            authors: 'Hans Wurst', googleBookId: '1234', imageUrl: 'https://example.com/example.jpg',
            title: 'titleBook<script>alert()</script>', description: 'descriptionBook<script>alert()</script>'
        });
        res.status.should.equal(200);

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->(answer:Book:Answer)<-[:IS_CREATOR]-(user:User)`)
            .optionalMatch(`(answer)-[:ORIGINAL]->(original)`)
            .return(`answer, user, original`).end().send();
        resp.length.should.equals(1);
        resp[0].answer.title.should.equals('titleBook');
        resp[0].answer.description.should.equals('descriptionBook');
        should.not.exist(resp[0].original);
    });

    it('Only allowed to add a book answer as logged in user', async function () {
        await dbDsl.sendToDb();
        let res = await requestHandler.post('/api/user/question/answer/book/1', {
            authors: 'Hans Wurst', googleBookId: '1234',
            title: 'titleBook', description: 'descriptionBook'
        });
        res.status.should.equal(401);
    });
});
