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
        should.not.exist(res.body.existingCommitment);
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
        should.not.exist(res.body.existingCommitment);
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
            adminId: '2', topics: ['spiritual'], language: 'de', created: 700, website: 'https://www.example.org/'
        }, []);

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/commitment/websitePreview', {link: 'https://www.example.org/'});
        res.status.should.equal(200);
        res.body.title.should.equals('titleWebsite');
        res.body.existingCommitment.commitmentId.should.equals('1');
        res.body.existingCommitment.title.should.equals('commitment1Title');
        res.body.existingCommitment.description.should.equals('commitment1Description');
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
