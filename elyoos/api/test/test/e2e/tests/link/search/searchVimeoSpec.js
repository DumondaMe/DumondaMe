'use strict';

const users = require('elyoos-server-test-util').user;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const requestHandler = require('elyoos-server-test-util').requestHandler;
const rp = require('request-promise');
const sinon = require('sinon');

describe('Search a vimeo link', function () {

    let sandbox;

    beforeEach(async function () {
        await dbDsl.init(3);
        sandbox = sinon.sandbox.create();

        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'description',
            topic: ['spiritual', 'education'], language: 'de', modified: 700
        });

        dbDsl.createQuestion('2', {
            creatorId: '2', question: 'Das ist eine Frage2', description: 'description2',
            topic: ['spiritual', 'education'], language: 'en', modified: 700
        });
    });

    afterEach(function () {
        sandbox.restore();
        return requestHandler.logout();
    });

    it('Search for a vimeo video which has not yet been posted on elyoos', async function () {
        let stubGetRequest = sandbox.stub(rp, 'get');
        stubGetRequest.resolves(
            `<head>
                <title>titleWebsite</title>
                <meta name="description" content="contentWebsite">
            </head>
            <body></body>`
        );
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/link/search/1', {link: 'https://vimeo.com/channels/staffpicks/251713531'});
        res.status.should.equal(200);
        res.body.title.should.equals('titleWebsite');
        res.body.description.should.equals('contentWebsite');
        res.body.linkEmbed.should.equals('https://player.vimeo.com/video/251713531');
        res.body.type.should.equals('Vimeo');
    });

    it('Search for a vimeo video and request to vimeo fails', async function () {
        let stubGetRequest = sandbox.stub(rp, 'get');
        stubGetRequest.rejects('error');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/link/search/1', {link: 'https://vimeo.com/channels/staffpicks/251713531'});
        res.status.should.equal(404);
    });

    it('Search for a vimeo video which has been posted on elyoos', async function () {
        dbDsl.createVimeoAnswer('10', {creator: '2', questionId: '2', created: 500,
            link: 'https://vimeo.com/channels/staffpicks/251713531', linkEmbed: 'https://player.vimeo.com/video/251713531'});

        let stubGetRequest = sandbox.stub(rp, 'get');
        stubGetRequest.rejects('error');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/link/search/1', {link: 'https://vimeo.com/channels/staffpicks/251713531'});
        res.status.should.equal(200);
        res.body.title.should.equals('vimeo10Title');
        res.body.description.should.equals('vimeo10Description');
        res.body.linkEmbed.should.equals('https://player.vimeo.com/video/251713531');
        res.body.type.should.equals('Vimeo');
    });

    it('Create vimeo answer which already exists for question', async function () {
        dbDsl.createVimeoAnswer('10', {creator: '2', questionId: '1', created: 500,
            link: 'https://vimeo.com/channels/staffpicks/251713531', linkEmbed: 'https://player.vimeo.com/video/251713531'});

        let stubGetRequest = sandbox.stub(rp, 'get');
        stubGetRequest.resolves();
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/link/search/1', {link: 'https://vimeo.com/channels/staffpicks/251713531'});
        res.status.should.equal(400);
        res.body.errorCode.should.equal(2);
    });
});
