'use strict';

const users = require('elyoos-server-test-util').user;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const requestHandler = require('elyoos-server-test-util').requestHandler;
const rp = require('request-promise');
const sinon = require('sinon');
const should = require('chai').should();

describe('Get a preview from the website for a commitment', function () {

    let sandbox;

    beforeEach(async function () {
        await dbDsl.init(3);
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
        return requestHandler.logout();
    });

    it('Get preview for a website of a commitment (og)', async function () {
        let stubGetRequest = sandbox.stub(rp, 'get');
        stubGetRequest.resolves(
            `<html lang="de-DE"><head>
                <title>titleWebsite</title>
                <meta property="og:title" content="ogTitle">
                <meta property="og:description" content="ogDescription">
                <meta property="og:image" content="https://www.example.org/image.jpg">
            </head>
            <body></body></html>`
        );
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/commitment/websitePreview', {link: 'https://www.example.org/'});
        res.status.should.equal(200);
        res.body.title.should.equals('ogTitle');
        res.body.description.should.equals('ogDescription');
        res.body.lang.should.equals('de');
        res.body.link.should.equals('https://www.example.org/');
        should.not.exist(res.body.existingCommitment);
        should.not.exist(res.body.error);
    });

    it('Get preview for a website of a commitment (og and add https)', async function () {
        let stubGetRequest = sandbox.stub(rp, 'get');
        stubGetRequest.resolves(
            `<html lang="de-DE"><head>
                <title>titleWebsite</title>
                <meta property="og:title" content="ogTitle">
                <meta property="og:description" content="ogDescription">
                <meta property="og:image" content="https://www.example.org/image.jpg">
            </head>
            <body></body></html>`
        );
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/commitment/websitePreview', {link: 'www.example.org/'});
        res.status.should.equal(200);
        res.body.title.should.equals('ogTitle');
        res.body.description.should.equals('ogDescription');
        res.body.lang.should.equals('de');
        res.body.link.should.equals('https://www.example.org/');
        should.not.exist(res.body.existingCommitment);
        should.not.exist(res.body.error);
    });

    it('Get preview for a website of a commitment (og and add http because https fails)', async function () {
        let stubGetRequest = sandbox.stub(rp, 'get');
        stubGetRequest.onFirstCall().rejects();
        stubGetRequest.onSecondCall().resolves(
            `<html lang="de-DE"><head>
                <title>titleWebsite</title>
                <meta property="og:title" content="ogTitle">
                <meta property="og:description" content="ogDescription">
                <meta property="og:image" content="https://www.example.org/image.jpg">
            </head>
            <body></body></html>`
        );
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/commitment/websitePreview', {link: 'www.example.org/'});
        res.status.should.equal(200);
        res.body.title.should.equals('ogTitle');
        res.body.description.should.equals('ogDescription');
        res.body.lang.should.equals('de');
        res.body.link.should.equals('http://www.example.org/');
        should.not.exist(res.body.existingCommitment);
        should.not.exist(res.body.error);
    });

    it('Get preview for a website with only title', async function () {
        let stubGetRequest = sandbox.stub(rp, 'get');
        stubGetRequest.resolves(
            `<html><head>
                <title>titleWebsite</title>
            </head>
            <body></body></html>`
        );
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/commitment/websitePreview', {link: 'https://www.example.org/'});
        res.status.should.equal(200);
        res.body.title.should.equals('titleWebsite');
        res.body.link.should.equals('https://www.example.org/');
        should.not.exist(res.body.existingCommitment);
        should.not.exist(res.body.error);
    });

    it('Get preview for a website of a commitment which exists already in Elyoos', async function () {
        let stubGetRequest = sandbox.stub(rp, 'get');
        stubGetRequest.resolves(
            `<html><head>
                <title>titleWebsite</title>
            </head>
            <body></body></html>`
        );

        dbDsl.createCommitment('1', {
            adminId: '2', topics: ['spiritual'], language: 'de', created: 700, modified: 701, website: 'https://www.example.org/',
            title: 'Commitment does exist'
        }, []);

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/commitment/websitePreview', {link: 'https://www.example.org/'});
        res.status.should.equal(200);
        res.body.title.should.equals('titleWebsite');
        res.body.link.should.equals('https://www.example.org/');
        res.body.existingCommitment.commitmentId.should.equals('1');
        res.body.existingCommitment.imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/1/320x320/title.jpg?v=701`);
        res.body.existingCommitment.title.should.equals('Commitment does exist');
        res.body.existingCommitment.slug.should.equals('commitment-does-exist');
        res.body.existingCommitment.description.should.equals('commitment1Description');
        should.not.exist(res.body.error);
    });

    it('Return error when connecting request to website fails', async function () {
        let stubGetRequest = sandbox.stub(rp, 'get');
        stubGetRequest.rejects();

        dbDsl.createCommitment('1', {
            adminId: '2', topics: ['spiritual'], language: 'de', created: 700, website: 'https://www.example.org/'
        }, []);

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/commitment/websitePreview', {link: 'https://www.example.org/'});
        res.status.should.equal(200);
        res.body.error.should.equals(1);
    });

    it('Only logged in user can get a preview of a commitment website', async function () {
        let stubGetRequest = sandbox.stub(rp, 'get');
        stubGetRequest.resolves(
            `<html><head>
                <title>titleWebsite</title>
            </head>
            <body></body></html>`
        );

        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/commitment/websitePreview', {link: 'https://www.example.org/'});
        res.status.should.equal(401);
    });
});
