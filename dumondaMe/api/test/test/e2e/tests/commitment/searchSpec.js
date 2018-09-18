'use strict';

const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;

describe('Search a commitment with fuzzy match', function () {

    beforeEach(async function () {
        await dbDsl.init(3);
        dbDsl.createRegion('region-1', {de: 'Region1De', en: 'Region1En'});

        dbDsl.createCommitment('1', {
            title: 'Das ist ein Engagement', regions: ['region-1'],
            adminId: '2', topics: ['Test1', 'Test2'], language: 'de', created: 700, website: 'https://www.example.org/'
        }, []);

        dbDsl.createCommitment('2', {
            title: 'Wie geht es weiter mit diesem Engagement', regions: ['region-1'],
            adminId: '2', topics: ['Test1', 'Test2'], language: 'de', created: 700, website: 'https://www.example.org/'
        }, []);

    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('find a commitment where the word is in the middle of the title (without language filter)', async function () {
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/commitment/search', {query: 'weiter'});
        res.status.should.equal(200);
        res.body.length.should.equals(1);
        res.body[0].commitmentId.should.equals('2');
        res.body[0].title.should.equals('Wie geht es weiter mit diesem Engagement');
        res.body[0].description.should.equals('commitment2Description');
        res.body[0].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/2/120x120/title.jpg`);
    });

    it('find a commitment with two query words (without language filter)', async function () {
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/commitment/search', {query: 'weiter mit'});
        res.status.should.equal(200);
        res.body.length.should.equals(1);
        res.body[0].commitmentId.should.equals('2');
        res.body[0].title.should.equals('Wie geht es weiter mit diesem Engagement');
        res.body[0].description.should.equals('commitment2Description');
        res.body[0].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/2/120x120/title.jpg`);
    });

    it('find a commitment where the word is in the middle of the title (with language filter)', async function () {
        dbDsl.createCommitment('3', {
            title: 'Wie geht es weiter mit diesem Engagement2', regions: ['region-1'],
            adminId: '2', topics: ['Test1', 'Test2'], language: 'en', created: 700, website: 'https://www.example.org/'
        }, []);
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/commitment/search', {query: 'weiter', lang: 'de'});
        res.status.should.equal(200);
        res.body.length.should.equals(1);
        res.body[0].commitmentId.should.equals('2');
        res.body[0].title.should.equals('Wie geht es weiter mit diesem Engagement');
        res.body[0].description.should.equals('commitment2Description');
        res.body[0].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/2/120x120/title.jpg`);
    });

    it('find a commitment and mark as already linked with question (without language)', async function () {
        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'description', topics: ['Test1'],
            language: 'de'
        });
        dbDsl.createCommitmentAnswer('100', {
            creatorId: '2', questionId: '1', commitmentId: '2', created: 500, description: 'test'
        });
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/commitment/search', {query: 'weiter', questionId: '1'});
        res.status.should.equal(200);
        res.body.length.should.equals(1);
        res.body[0].commitmentId.should.equals('2');
        res.body[0].title.should.equals('Wie geht es weiter mit diesem Engagement');
        res.body[0].description.should.equals('commitment2Description');
        res.body[0].linkedWithQuestion.should.equals(true);
        res.body[0].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/2/120x120/title.jpg`);
    });

    it('find a commitment and mark as already linked with question (with language)', async function () {
        dbDsl.createCommitment('3', {
            title: 'Wie geht es weiter mit diesem Engagement2', regions: ['region-1'],
            adminId: '2', topics: ['Test1', 'Test2'], language: 'en', created: 700, website: 'https://www.example.org/'
        }, []);
        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'description', topics: ['Test1'],
            language: 'de'
        });
        dbDsl.createCommitmentAnswer('100', {
            creatorId: '2', questionId: '1', commitmentId: '2', created: 500, description: 'test'
        });
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/commitment/search', {query: 'weiter', questionId: '1', lang: 'de'});
        res.status.should.equal(200);
        res.body.length.should.equals(1);
        res.body[0].commitmentId.should.equals('2');
        res.body[0].title.should.equals('Wie geht es weiter mit diesem Engagement');
        res.body[0].description.should.equals('commitment2Description');
        res.body[0].linkedWithQuestion.should.equals(true);
        res.body[0].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/2/120x120/title.jpg`);
    });
});
