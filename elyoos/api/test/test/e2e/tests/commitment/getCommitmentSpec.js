'use strict';

const users = require('elyoos-server-test-util').user;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const requestHandler = require('elyoos-server-test-util').requestHandler;
const sinon = require('sinon');

describe('Get details of a commitment', function () {

    let sandbox;

    beforeEach(async function () {
        await dbDsl.init(3);
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
        return requestHandler.logout();
    });

    it('Get a commitment (User is Admin and logged in)', async function () {
        dbDsl.createCommitment('1', {
            adminId: '1', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700, website: 'https://www.example.org/'
        }, []);

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/commitment', {answerId: '1'});
        res.status.should.equal(200);
        res.body.title.should.equals('commitment1Title');
        res.body.description.should.equals('commitment1Description');
        res.body.imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/1/148x148/title.jpg`);
        res.body.created.should.equals(700);
        res.body.website.should.equals('https://www.example.org/');
        res.body.language.should.equals('de');
        res.body.isAdmin.should.equals(true);
        res.body.topics.length.should.equals(2);
        res.body.topics.should.include('Spiritual');
        res.body.topics.should.include('Meditation');
    });

    it('Get a commitment (User is not logged in)', async function () {
        dbDsl.createCommitment('1', {
            adminId: '1', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700, website: 'https://www.example.org/'
        }, []);

        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/commitment', {answerId: '1'});
        res.status.should.equal(200);
        res.body.title.should.equals('commitment1Title');
        res.body.description.should.equals('commitment1Description');
        res.body.imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/1/148x148/title.jpg`);
        res.body.created.should.equals(700);
        res.body.website.should.equals('https://www.example.org/');
        res.body.language.should.equals('de');
        res.body.isAdmin.should.equals(false);
        res.body.topics.length.should.equals(2);
        res.body.topics.should.include('Spiritual');
        res.body.topics.should.include('Meditation');
    });

    it('Get non existing commitment', async function () {
        dbDsl.createCommitment('1', {
            adminId: '1', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700, website: 'https://www.example.org/'
        }, []);

        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/commitment', {answerId: '2'});
        res.status.should.equal(404);
    });

});
