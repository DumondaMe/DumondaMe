'use strict';

const users = require('elyoos-server-test-util').user;
const db = require('elyoos-server-test-util').db;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const requestHandler = require('elyoos-server-test-util').requestHandler;
const moment = require('moment');
const sinon = require('sinon');
const stubCDN = require('elyoos-server-test-util').stubCDN();

describe('Creating a new commitment', function () {

    let startTime, sandbox;

    beforeEach(async function () {
        stubCDN.uploadBuffer.reset();
        stubCDN.copyFile.reset();
        sandbox = sinon.sandbox.create();
        await dbDsl.init(3);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createRegion('international', {de: 'InternationalDe', en: 'InternationalEn'});
        dbDsl.createRegion('region-1', {parentRegionId: 'international', de: 'Region1De', en: 'Region1En'});
        dbDsl.createRegion('region-2', {parentRegionId: 'international', de: 'Region2De', en: 'Region2En'});
        dbDsl.createRegion('region-1-1', {parentRegionId: 'region-1', de: 'Region11De', en: 'Region11En'});
    });

    afterEach(function () {
        sandbox.restore();
        return requestHandler.logout();
    });

    it('Create a new commitment (all properties)', async function () {
        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});
        dbDsl.createSubTopic({
            parentTopicId: 'topic1',
            topicId: 'topic11',
            descriptionDe: 'topic11De',
            descriptionEn: 'topic11En'
        });
        dbDsl.createSubTopic({
            parentTopicId: 'topic1',
            topicId: 'topic12',
            descriptionDe: 'topic12De',
            descriptionEn: 'topic12En'
        });
        dbDsl.createSubTopic({
            parentTopicId: 'topic1',
            topicId: 'topic13',
            descriptionDe: 'topic13De',
            descriptionEn: 'topic13En'
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/commitment', {
            title: 'Commitment Example',
            description: 'description',
            website: 'https://www.example.org',
            regions: ['region-1-1'],
            topics: ['topic12', 'topic13'],
            lang: 'de'
        }, `${__dirname}/test.jpg`);
        res.status.should.equal(200);
        res.body.slug.should.equals('commitment-example');
        stubCDN.uploadBuffer.calledWith(sinon.match.any, `commitment/${res.body.commitmentId}/title.jpg`, sinon.match.any).should.be.true;
        stubCDN.uploadBuffer.calledWith(sinon.match.any, `commitment/${res.body.commitmentId}/120x120/title.jpg`, sinon.match.any).should.be.true;
        stubCDN.uploadBuffer.calledWith(sinon.match.any, `commitment/${res.body.commitmentId}/148x148/title.jpg`, sinon.match.any).should.be.true;
        stubCDN.uploadBuffer.calledWith(sinon.match.any, `commitment/${res.body.commitmentId}/460x460/title.jpg`, sinon.match.any).should.be.true;
        stubCDN.copyFile.called.should.be.false;

        let resp = await db.cypher().match("(topic:Topic)-[:TOPIC]->(commitment:Commitment)<-[:IS_ADMIN]-(user:User {userId: '1'})")
            .match("(commitment)-[:BELONGS_TO_REGION]->(r:Region)")
            .match("(commitment)<-[:IS_CREATOR]->(user)")
            .return(`commitment, collect(DISTINCT topic.topicId) AS topics, collect(DISTINCT r.regionId) AS regions`).end().send();
        resp.length.should.equals(1);
        resp[0].commitment.commitmentId.should.equals(res.body.commitmentId);
        resp[0].commitment.title.should.equals('Commitment Example');
        resp[0].commitment.description.should.equals('description');
        resp[0].commitment.website.should.equals('https://www.example.org');
        resp[0].commitment.created.should.least(startTime);
        resp[0].regions.length.should.equals(1);
        resp[0].regions.should.include('region-1-1');
        resp[0].topics.length.should.equals(2);
        resp[0].topics.should.include('topic12');
        resp[0].topics.should.include('topic13');
        resp[0].commitment.language.should.equals('de');
    });

    it('Create a new commitment (only mandatory properties)', async function () {

        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});
        dbDsl.createSubTopic({
            parentTopicId: 'topic1',
            topicId: 'topic11',
            descriptionDe: 'topic11De',
            descriptionEn: 'topic11En'
        });
        dbDsl.createSubTopic({
            parentTopicId: 'topic1',
            topicId: 'topic12',
            descriptionDe: 'topic12De',
            descriptionEn: 'topic12En'
        });
        dbDsl.createSubTopic({
            parentTopicId: 'topic1',
            topicId: 'topic13',
            descriptionDe: 'topic13De',
            descriptionEn: 'topic13En'
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/commitment', {
            title: 'Commitment Example',
            description: 'description',
            regions: ['region-1-1', 'region-2'],
            topics: ['topic11', 'topic13'],
            lang: 'de'
        });
        res.status.should.equal(200);
        res.body.slug.should.equals('commitment-example');
        stubCDN.uploadBuffer.called.should.be.false;
        stubCDN.copyFile.calledWith('default/commitment/title.jpg', `commitment/${res.body.commitmentId}/title.jpg`, sinon.match.any).should.be.true;
        stubCDN.copyFile.calledWith('default/commitment/120x120/title.jpg', `commitment/${res.body.commitmentId}/120x120/title.jpg`, sinon.match.any).should.be.true;
        stubCDN.copyFile.calledWith('default/commitment/148x148/title.jpg', `commitment/${res.body.commitmentId}/148x148/title.jpg`, sinon.match.any).should.be.true;
        stubCDN.copyFile.calledWith('default/commitment/460x460/title.jpg', `commitment/${res.body.commitmentId}/460x460/title.jpg`, sinon.match.any).should.be.true;

        let resp = await db.cypher().match("(topic:Topic)-[:TOPIC]->(commitment:Commitment)<-[:IS_ADMIN]-(user:User {userId: '1'})")
            .match("(commitment)<-[:IS_CREATOR]->(user)")
            .return(`collect(topic.topicId) AS topics`).end().send();
        resp.length.should.equals(1);
        resp[0].topics.length.should.equals(2);
        resp[0].topics.should.include('topic11');
        resp[0].topics.should.include('topic13');
    });

    it('Allowed to add region international without other regions', async function () {
        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/commitment', {
            title: 'Commitment Example',
            description: 'description',
            website: 'https://www.example.org',
            regions: ['international'],
            topics: ['topic1'],
            lang: 'de'
        }, `${__dirname}/test.jpg`);
        res.status.should.equal(200);

        let resp = await db.cypher().match("(commitment:Commitment)-[:BELONGS_TO_REGION]->(:Region {regionId: 'international'})")
            .match("(commitment)<-[:IS_CREATOR]->(user)")
            .return(`commitment`).end().send();
        resp.length.should.equals(1);
    });

    it('Not allowed to add region international with other regions', async function () {
        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/commitment', {
            title: 'Commitment Example',
            description: 'description',
            website: 'https://www.example.org',
            regions: ['international', 'region-1-1'],
            topics: ['topic1'],
            lang: 'de'
        }, `${__dirname}/test.jpg`);
        res.status.should.equal(401);
        stubCDN.uploadBuffer.called.should.be.false;
        stubCDN.copyFile.called.should.be.false;

        let resp = await db.cypher().match("(commitment:Commitment)")
            .return(`commitment`).end().send();
        resp.length.should.equals(0);
    });

    it('Not allowed to add non existing regions', async function () {
        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/commitment', {
            title: 'Commitment Example',
            description: 'description',
            website: 'https://www.example.org',
            regions: ['region-1-1', 'region-555'],
            topics: ['topic1'],
            lang: 'de'
        }, `${__dirname}/test.jpg`);
        res.status.should.equal(401);
        stubCDN.uploadBuffer.called.should.be.false;
        stubCDN.copyFile.called.should.be.false;

        let resp = await db.cypher().match("(commitment:Commitment)")
            .return(`commitment`).end().send();
        resp.length.should.equals(0);
    });

    it('Not allowed to create with none existing topic', async function () {
        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/commitment', {
            title: 'Commitment Example',
            description: 'description',
            website: 'https://www.example.org',
            regions: ['region-1-1'],
            topics: ['topic12'],
            lang: 'de'
        }, `${__dirname}/test.jpg`);
        res.status.should.equal(401);
        stubCDN.uploadBuffer.called.should.be.false;
        stubCDN.copyFile.called.should.be.false;
    });

    it('Only allowed to create a new commitment as logged in user', async function () {
        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});
        await dbDsl.sendToDb();
        let res = await requestHandler.post('/api/user/commitment', {
            title: 'Commitment Example', description: 'description', website: 'www.example.org',
            regions: ['region-1-1'], topics: ['topic1'], lang: 'de'
        });
        res.status.should.equal(401);
    });
});
