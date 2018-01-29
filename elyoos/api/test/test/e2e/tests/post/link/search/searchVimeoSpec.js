'use strict';

const users = require('elyoos-server-test-util').user;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const requestHandler = require('elyoos-server-test-util').requestHandler;
const rp = require('request-promise');
const Promise = require('bluebird').Promise;
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
    });

    afterEach(function () {
        sandbox.restore();
        return requestHandler.logout();
    });

    it('Search for a vimeo video which has not yet been posted on elyoos', async function () {
        let stubGetRequest = sandbox.stub(rp, 'get');
        stubGetRequest.returns(Promise.resolve(
            `<head>
                <title>titleWebsite</title>
                <meta name="description" content="contentWebsite">
            </head>
            <body></body>`
        ));
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/link/search', {link: 'https://vimeo.com/channels/staffpicks/251713531'});
        res.status.should.equal(200);
        res.body.title.should.equals('titleWebsite');
        res.body.description.should.equals('contentWebsite');
        res.body.linkEmbed.should.equals('https://player.vimeo.com/video/251713531');
        res.body.type.should.equals('Vimeo');
    });
});
