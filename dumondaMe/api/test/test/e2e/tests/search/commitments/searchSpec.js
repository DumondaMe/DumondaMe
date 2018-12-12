'use strict';

const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;

describe('Search for commitments with fuzzy match', function () {

    beforeEach(async function () {
        await dbDsl.init(4);
        dbDsl.createRegion('region-1', {de: 'Region1De', en: 'Region1En'});
        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});

        dbDsl.createCommitment('1', {
            title: 'Das ist ein Engagement', regions: ['region-1'],
            adminId: '2', topics: ['topic1'], language: 'de', created: 700, modified: 777,
            website: 'https://www.example.org/'
        }, []);
        dbDsl.createCommitment('3', {
            title: 'Irgendwas', regions: ['region-1'],
            adminId: '2', topics: ['topic1'], language: 'de', created: 700, website: 'https://www.example.org/'
        }, []);
        dbDsl.watchCommitment({commitmentId: '1', userId: '1', created: 999});
        dbDsl.watchCommitment({commitmentId: '1', userId: '3', created: 999});
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Search commitment when not logged in', async function () {
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        let res = await requestHandler.get('/api/search/commitments', {query: 'Das ist ein Engagement', lang: 'de', skip: 0, limit: 10});
        res.status.should.equal(200);
        res.body.hasMoreCommitments.should.equals(false);
        res.body.commitments.length.should.equals(1);
        res.body.commitments[0].commitmentId.should.equals('1');
        res.body.commitments[0].title.should.equals('Das ist ein Engagement');
        res.body.commitments[0].slug.should.equals('das-ist-ein-engagement');
        res.body.commitments[0].description.should.equals('commitment1Description');
        res.body.commitments[0].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/1/120x120/title.jpg?v=777`);
        res.body.commitments[0].numberOfWatches.should.equals(2);
        res.body.commitments[0].isWatchedByUser.should.equals(false);
        res.body.commitments[0].isAdmin.should.equals(false);
        res.body.commitments[0].regions.length.should.equals(1);
        res.body.commitments[0].regions.should.include('Region1De');
    });

    it('Search commitment when logged in', async function () {
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/search/commitments', {query: 'Das ist ein Engagement', lang: 'de', skip: 0, limit: 10});
        res.status.should.equal(200);
        res.body.hasMoreCommitments.should.equals(false);
        res.body.commitments.length.should.equals(1);
        res.body.commitments[0].commitmentId.should.equals('1');
        res.body.commitments[0].title.should.equals('Das ist ein Engagement');
        res.body.commitments[0].slug.should.equals('das-ist-ein-engagement');
        res.body.commitments[0].description.should.equals('commitment1Description');
        res.body.commitments[0].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/1/120x120/title.jpg?v=777`);
        res.body.commitments[0].numberOfWatches.should.equals(2);
        res.body.commitments[0].isWatchedByUser.should.equals(true);
        res.body.commitments[0].isAdmin.should.equals(false);
        res.body.commitments[0].regions.length.should.equals(1);
        res.body.commitments[0].regions.should.include('Region1De');
    });

    it('Search commitment created by the logged in user', async function () {
        dbDsl.createCommitment('4', {
            title: 'BlaBlaBla', regions: ['region-1'],
            adminId: '1', topics: ['topic1'], language: 'de', created: 700, website: 'https://www.example.org/'
        }, []);
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/search/commitments', {query: 'BlaBlaBla', lang: 'de', skip: 0, limit: 10});
        res.status.should.equal(200);
        res.body.hasMoreCommitments.should.equals(false);
        res.body.commitments.length.should.equals(1);
        res.body.commitments[0].commitmentId.should.equals('4');
        res.body.commitments[0].isWatchedByUser.should.equals(false);
        res.body.commitments[0].isAdmin.should.equals(true);
    });

    it('Has more commitments', async function () {
        for (let index = 0; index < 7; index++) {
            dbDsl.createCommitment(`1${index}`, {
                title: 'Das ist ein Engagement', regions: ['region-1'],
                adminId: '2', topics: ['topic1'], language: 'de', created: 700, modified: 777,
                website: 'https://www.example.org/'
            }, []);
        }
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/search/commitments', {query: 'Das ist ein Engagement', lang: 'de', skip: 1, limit: 4});
        res.status.should.equal(200);
        res.body.hasMoreCommitments.should.equals(true);
        res.body.commitments.length.should.equals(4);
    });
});
