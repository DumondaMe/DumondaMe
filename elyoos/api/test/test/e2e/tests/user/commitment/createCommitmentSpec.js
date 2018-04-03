'use strict';

const users = require('elyoos-server-test-util').user;
const db = require('elyoos-server-test-util').db;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const requestHandler = require('elyoos-server-test-util').requestHandler;
const moment = require('moment');
const sinon = require('sinon');
const should = require('chai').should();
const stubCDN = require('elyoos-server-test-util').stubCDN();

describe('Creating a new commitment', function () {

    let startTime, sandbox;

    beforeEach(async function () {
        stubCDN.uploadBuffer.reset();
        stubCDN.copyFile.reset();
        sandbox = sinon.sandbox.create();
        await dbDsl.init(3);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createRegion('international', {});
        dbDsl.createRegion('region-1', {upperRegionLayerCode: 'international'});
        dbDsl.createRegion('region-2', {upperRegionLayerCode: 'international'});
        dbDsl.createRegion('region-1-1', {upperRegionLayerCode: 'region-1'});
    });

    afterEach(function () {
        sandbox.restore();
        return requestHandler.logout();
    });

    it('Create a new commitment (all properties, new topics)', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/commitment', {
            title: 'Commitment Example',
            description: 'description',
            website: 'https://www.example.org',
            regions: ['region-1-1'],
            topics: ['spiritual', 'education'],
            lang: 'de'
        }, `${__dirname}/test.jpg`);
        res.status.should.equal(200);
        res.body.slug.should.equals('commitment-example');
        stubCDN.uploadBuffer.calledWith(sinon.match.any, `commitment/${res.body.answerId}/title.jpg`, sinon.match.any).should.be.true;
        stubCDN.uploadBuffer.calledWith(sinon.match.any, `commitment/${res.body.answerId}/120x120/title.jpg`, sinon.match.any).should.be.true;
        stubCDN.uploadBuffer.calledWith(sinon.match.any, `commitment/${res.body.answerId}/148x148/title.jpg`, sinon.match.any).should.be.true;
        stubCDN.copyFile.called.should.be.false;

        let resp = await db.cypher().match("(topic:Topic)-[:TOPIC]->(commitment:Answer:Commitment)<-[:IS_ADMIN]-(user:User {userId: '1'})")
            .match("(commitment)-[:BELONGS_TO_REGION]->(r:Region)")
            .return(`commitment, collect(DISTINCT topic.name) AS topics, collect(DISTINCT r.code) AS regions`).end().send();
        resp.length.should.equals(1);
        resp[0].commitment.answerId.should.equals(res.body.answerId);
        resp[0].commitment.title.should.equals('Commitment Example');
        resp[0].commitment.description.should.equals('description');
        resp[0].commitment.website.should.equals('https://www.example.org');
        resp[0].commitment.created.should.least(startTime);
        resp[0].regions.length.should.equals(1);
        resp[0].regions.should.include('region-1-1');
        resp[0].topics.length.should.equals(2);
        resp[0].topics.should.include('Spiritual');
        resp[0].topics.should.include('Education');
        resp[0].commitment.language.should.equals('de');
    });

    it('Create a new commitment (only mandatory properties, new topics)', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/commitment', {
            title: 'Commitment Example',
            description: 'description',
            regions: ['region-1-1', 'region-2'],
            topics: ['spiritual', 'education'],
            lang: 'de'
        });
        res.status.should.equal(200);
        res.body.slug.should.equals('commitment-example');
        stubCDN.uploadBuffer.called.should.be.false;
        stubCDN.copyFile.calledWith('default/commitment/title.jpg', `commitment/${res.body.answerId}/title.jpg`, sinon.match.any).should.be.true;
        stubCDN.copyFile.calledWith('default/commitment/120x120/title.jpg', `commitment/${res.body.answerId}/120x120/title.jpg`, sinon.match.any).should.be.true;
        stubCDN.copyFile.calledWith('default/commitment/148x148/title.jpg', `commitment/${res.body.answerId}/148x148/title.jpg`, sinon.match.any).should.be.true;

        let resp = await db.cypher().match("(topic:Topic)-[:TOPIC]->(commitment:Answer:Commitment)<-[:IS_ADMIN]-(user:User {userId: '1'})")
            .match("(commitment)-[:BELONGS_TO_REGION]->(r:Region)")
            .return(`commitment, collect(DISTINCT topic.name) AS topics, collect(DISTINCT r.code) AS regions`).end().send();
        resp.length.should.equals(1);
        resp[0].commitment.answerId.should.equals(res.body.answerId);
        resp[0].commitment.title.should.equals('Commitment Example');
        resp[0].commitment.description.should.equals('description');
        should.not.exist(resp[0].commitment.website);
        resp[0].commitment.created.should.least(startTime);
        resp[0].regions.length.should.equals(2);
        resp[0].regions.should.include('region-1-1');
        resp[0].regions.should.include('region-2');
        resp[0].topics.length.should.equals(2);
        resp[0].topics.should.include('Spiritual');
        resp[0].topics.should.include('Education');
        resp[0].commitment.language.should.equals('de');
    });

    it('Create a new commitment (only mandatory properties, existing topics)', async function () {

        dbDsl.createTopic('Spiritual');

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/commitment', {
            title: 'Commitment Example',
            description: 'description',
            regions: ['region-1-1', 'region-2'],
            topics: ['spiritual', 'education'],
            lang: 'de'
        });
        res.status.should.equal(200);
        res.body.slug.should.equals('commitment-example');
        stubCDN.uploadBuffer.called.should.be.false;
        stubCDN.copyFile.calledWith('default/commitment/title.jpg', `commitment/${res.body.answerId}/title.jpg`, sinon.match.any).should.be.true;
        stubCDN.copyFile.calledWith('default/commitment/120x120/title.jpg', `commitment/${res.body.answerId}/120x120/title.jpg`, sinon.match.any).should.be.true;
        stubCDN.copyFile.calledWith('default/commitment/148x148/title.jpg', `commitment/${res.body.answerId}/148x148/title.jpg`, sinon.match.any).should.be.true;

        let resp = await db.cypher().match("(topic:Topic)-[:TOPIC]->(commitment:Answer:Commitment)<-[:IS_ADMIN]-(user:User {userId: '1'})")
            .return(`collect(topic.name) AS topics`).end().send();
        resp.length.should.equals(1);
        resp[0].topics.length.should.equals(2);
        resp[0].topics.should.include('Spiritual');
        resp[0].topics.should.include('Education');

        resp = await db.cypher().match("(topic:Topic)").return("topic").end().send();
        resp.length.should.equals(2);
    });

    it('Allowed to add region international without other regions', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/commitment', {
            title: 'Commitment Example',
            description: 'description',
            website: 'https://www.example.org',
            regions: ['international'],
            topics: ['spiritual', 'education'],
            lang: 'de'
        }, `${__dirname}/test.jpg`);
        res.status.should.equal(200);

        let resp = await db.cypher().match("(commitment:Answer:Commitment)-[:BELONGS_TO_REGION]->(:Region {code: 'international'})")
            .return(`commitment`).end().send();
        resp.length.should.equals(1);
    });

    it('Not allowed to add region international with other regions', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/commitment', {
            title: 'Commitment Example',
            description: 'description',
            website: 'https://www.example.org',
            regions: ['international', 'region-1-1'],
            topics: ['spiritual', 'education'],
            lang: 'de'
        }, `${__dirname}/test.jpg`);
        res.status.should.equal(401);
        stubCDN.uploadBuffer.called.should.be.false;
        stubCDN.copyFile.called.should.be.false;

        let resp = await db.cypher().match("(commitment:Answer:Commitment)")
            .return(`commitment`).end().send();
        resp.length.should.equals(0);
    });

    it('Not allowed to add non existing regions', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/commitment', {
            title: 'Commitment Example',
            description: 'description',
            website: 'https://www.example.org',
            regions: ['region-1-1', 'region-555'],
            topics: ['spiritual', 'education'],
            lang: 'de'
        }, `${__dirname}/test.jpg`);
        res.status.should.equal(401);
        stubCDN.uploadBuffer.called.should.be.false;
        stubCDN.copyFile.called.should.be.false;

        let resp = await db.cypher().match("(commitment:Answer:Commitment)")
            .return(`commitment`).end().send();
        resp.length.should.equals(0);
    });

    it('Only allowed to create a new commitment as logged in user', async function () {
        await dbDsl.sendToDb();
        let res = await requestHandler.post('/api/user/commitment', {
            title: 'Commitment Example', description: 'description', website: 'www.example.org',
            regions: ['region-1-1'], topics: ['spiritual', 'education'], lang: 'de'
        });
        res.status.should.equal(401);
    });
});
