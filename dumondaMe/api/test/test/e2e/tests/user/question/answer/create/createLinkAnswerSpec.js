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

describe('Creating link answer', function () {

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

    it('Create a link response that has not yet been created in elyoos (with url)', async function () {
        let stubGetRequest = sandbox.stub(rp, 'get');
        stubGetRequest.returns(fs.createReadStream(`${__dirname}/test.jpg`));

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/link/1', {
            link: 'https://example.com/blog', imageUrl: 'https://example.com/example.jpg',
            title: 'titleLink', description: 'descriptionLink', type: 'blog'
        });
        res.status.should.equal(200);
        res.body.created.should.least(startTime);
        res.body.imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/link/${res.body.answerId}/460x460/preview.jpg`);
        res.body.creator.name.should.equals('user Meier');
        res.body.creator.slug.should.equals('user-meier');
        res.body.creator.isLoggedInUser.should.equals(true);
        res.body.creator.isTrustUser.should.equals(false);
        res.body.creator.userImage.should.equals('profileImage/1/thumbnail.jpg');
        res.body.creator.userImagePreview.should.equals('profileImage/1/profilePreview.jpg');
        stubCDN.uploadBuffer.calledWith(sinon.match.any, `link/${res.body.answerId}/preview.jpg`, sinon.match.any).should.be.true;
        stubCDN.uploadBuffer.calledWith(sinon.match.any, `link/${res.body.answerId}/460x460/preview.jpg`, sinon.match.any).should.be.true;

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->(answer:Link:Answer)<-[:IS_CREATOR]-(user:User {userId: '1'})`)
            .optionalMatch(`(answer)-[:ORIGINAL]->(original)`)
            .return(`answer, original`).end().send();
        resp.length.should.equals(1);
        resp[0].answer.answerId.should.equals(res.body.answerId);
        resp[0].answer.title.should.equals('titleLink');
        resp[0].answer.description.should.equals('descriptionLink');
        resp[0].answer.link.should.equals('https://example.com/blog');
        resp[0].answer.pageType.should.equals('blog');
        resp[0].answer.hasPreviewImage.should.equals(true);
        resp[0].answer.created.should.equals(res.body.created);
        should.not.exist(resp[0].original);
    });

    it('Create a link response that has not yet been created in elyoos (without url and description)', async function () {
        sandbox.stub(rp, 'get');

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/link/1', {
            link: 'https://example.com/blog',
            title: 'titleLink', type: 'blog'
        });
        res.status.should.equal(200);
        res.body.created.should.least(startTime);
        should.not.exist(res.body.imageUrl);
        res.body.creator.name.should.equals('user Meier');
        res.body.creator.slug.should.equals('user-meier');
        res.body.creator.isLoggedInUser.should.equals(true);
        res.body.creator.isTrustUser.should.equals(false);
        res.body.creator.userImage.should.equals('profileImage/1/thumbnail.jpg');
        res.body.creator.userImagePreview.should.equals('profileImage/1/profilePreview.jpg');
        stubCDN.uploadBuffer.called.should.be.false;

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->(answer:Link:Answer)<-[:IS_CREATOR]-(user:User {userId: '1'})`)
            .optionalMatch(`(answer)-[:ORIGINAL]->(original)`)
            .return(`answer, original`).end().send();
        resp.length.should.equals(1);
        resp[0].answer.answerId.should.equals(res.body.answerId);
        resp[0].answer.title.should.equals('titleLink');
        should.not.exist(resp[0].answer.description);
        resp[0].answer.link.should.equals('https://example.com/blog');
        resp[0].answer.pageType.should.equals('blog');
        resp[0].answer.hasPreviewImage.should.equals(false);
        resp[0].answer.created.should.equals(res.body.created);
        should.not.exist(resp[0].original);
    });

    it('Create a link response that was already used for another question', async function () {
        sandbox.stub(rp, 'get');
        dbDsl.createLinkAnswer('10', {
            creatorId: '2', questionId: '2', created: 500,
            link: 'https://example.com', pageType: 'blog'
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/link/1', {
            link: 'https://example.com',
            title: 'titleLink', description: 'descriptionLink', type: 'blog'
        });
        res.status.should.equal(200);

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->(answer:Link:Answer)<-[:IS_CREATOR]-(user:User {userId: '1'})`)
            .optionalMatch(`(answer)-[:ORIGINAL]->(original:Link {answerId: '10'})`)
            .return(`original`).end().send();
        resp.length.should.equals(1);
        should.exist(resp[0].original);
    });

    it('Create a link response that was already used for other questions', async function () {
        sandbox.stub(rp, 'get');
        dbDsl.createLinkAnswer('10', {
            creatorId: '2', questionId: '2', created: 500,
            link: 'https://example.com', pageType: 'blog'
        });
        dbDsl.createLinkAnswer('11', {
            creatorId: '2', questionId: '3', created: 499,
            link: 'https://example.com', pageType: 'article'
        });
        dbDsl.setOriginalAnswer({answerId: '10', originalAnswerId: '11'});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/link/1', {
            link: 'https://example.com',
            title: 'titleLink', description: 'descriptionLink', type: 'blog'
        });
        res.status.should.equal(200);

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->(answer:Link:Answer)<-[:IS_CREATOR]-(user:User {userId: '1'})`)
            .optionalMatch(`(answer)-[:ORIGINAL]->(original:Link {answerId: '11'})`)
            .return(`original`).end().send();
        resp.length.should.equals(1);
        should.exist(resp[0].original);
    });

    it('Creating link answer fails because link is already used for question', async function () {
        sandbox.stub(rp, 'get');
        dbDsl.createLinkAnswer('10', {
            creatorId: '2', questionId: '1', created: 500,
            link: 'https://example.com', pageType: 'blog'
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/link/1', {
            link: 'https://example.com',
            title: 'titleLink', description: 'descriptionLink', type: 'blog'
        });
        res.status.should.equal(400);
        res.body.errorCode.should.equal(2);

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->(answer:Link:Answer)<-[:IS_CREATOR]-(user:User {userId: '1'})`)
            .return(`answer`).end().send();
        resp.length.should.equals(0);
    });

    it('Prevent xss attack when creating a link answer', async function () {
        let stubGetRequest = sandbox.stub(rp, 'get');
        stubGetRequest.returns(fs.createReadStream(`${__dirname}/test.jpg`));

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/link/1', {
            link: 'https://example.com/blog', imageUrl: 'https://example.com/example.jpg',
            title: 'titleLink<script>alert()</script>', description: 'descriptionLink<script>alert()</script>', type: 'blog'
        });
        res.status.should.equal(200);

        let resp = await db.cypher().match(`(:Question {questionId: '1'})-[:ANSWER]->(answer:Link:Answer)<-[:IS_CREATOR]-(user:User {userId: '1'})`)
            .return(`answer`).end().send();
        resp.length.should.equals(1);
        resp[0].answer.title.should.equals('titleLink');
        resp[0].answer.description.should.equals('descriptionLink');
    });

    it('Only allowed to add a link answer as logged in user', async function () {
        await dbDsl.sendToDb();
        let res = await requestHandler.post('/api/user/question/answer/link/1', {
            title: 'title', description: 'description'
        });
        res.status.should.equal(401);
    });
});
