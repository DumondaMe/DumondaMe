'use strict';

const users = require('elyoos-server-test-util').user;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const requestHandler = require('elyoos-server-test-util').requestHandler;
const rp = require('request-promise');
const Promise = require('bluebird').Promise;
const sinon = require('sinon');
const should = require('chai').should();

describe('Search a website link', function () {

    let sandbox;

    beforeEach(async function () {
        await dbDsl.init(3);
        sandbox = sinon.sandbox.create();

        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'description',
            topic: ['spiritual', 'education'], language: 'de', modified: 700
        });
    });

    afterEach(function () {
        sandbox.restore();
        return requestHandler.logout();
    });

    it('Search for a website which has not yet been posted on elyoos', async function () {
        let stubGetRequest = sandbox.stub(rp, 'get');
        stubGetRequest.returns(Promise.resolve(
            `<head>
                <title>titleWebsite</title>
                <meta property="og:title" content="ogTitle">
                <meta property="og:description" content="ogDescription">
                <meta property="og:image" content="https://www.example.org/image.jpg">
                <meta property="og:image" content="https://www.example.org/image2.jpg">
                <meta property="og:type" content="article">
            </head>
            <body></body>`
        ));
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/link/search', {link: 'https://www.example.org/blog/1224'});
        res.status.should.equal(200);
        res.body.title.should.equals('ogTitle');
        res.body.description.should.equals('ogDescription');
        res.body.pageType.should.equals('article');
        res.body.imageUrl.should.equals('https://www.example.org/image.jpg');
        should.not.exist(res.body.linkEmbed);
        res.body.type.should.equals('Link');
    });

    it('Search for a website which has been posted on elyoos', async function () {

        dbDsl.createLinkAnswer('10', {creator: '2', questionId: '1', created: 500, pageType: 'article',
            link: 'https://www.example.org/blog/1224'});

        let stubGetRequest = sandbox.stub(rp, 'get');
        stubGetRequest.returns(Promise.reject(new Error()));
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/link/search', {link: 'https://www.example.org/blog/1224'});
        res.status.should.equal(200);
        res.body.title.should.equals('link10Title');
        res.body.description.should.equals('link10Description');
        res.body.pageType.should.equals('article');
        res.body.imageUrl.should.equals('/link/10/preview.jpg');
        res.body.type.should.equals('Link');
    });
});
