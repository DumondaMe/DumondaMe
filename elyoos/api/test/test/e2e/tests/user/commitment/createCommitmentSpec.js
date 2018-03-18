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
        sandbox = sinon.sandbox.create();
        await dbDsl.init(3);
        startTime = Math.floor(moment.utc().valueOf() / 1000);
    });

    afterEach(function () {
        sandbox.restore();
        return requestHandler.logout();
    });

    it('Create a new commitment (all properties)', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/commitment', {
            title: 'Commitment Example',
            description: 'description',
            website: 'https://www.example.org',
            topic: ['spiritual', 'education'],
            lang: 'de'
        }, `${__dirname}/test.jpg`);
        res.status.should.equal(200);
        res.body.slug.should.equals('commitment-example');
        stubCDN.uploadBuffer.calledWith(sinon.match.any, `commitment/${res.body.answerId}/title.jpg`, sinon.match.any).should.be.true;
        stubCDN.copyFile.called.should.be.false;

        let resp = await db.cypher().match("(commitment:Answer:Commitment)<-[:IS_ADMIN]-(user:User {userId: '1'})")
            .return(`commitment`).end().send();
        resp.length.should.equals(1);
        resp[0].commitment.answerId.should.equals(res.body.answerId);
        resp[0].commitment.title.should.equals('Commitment Example');
        resp[0].commitment.description.should.equals('description');
        resp[0].commitment.website.should.equals('https://www.example.org');
        resp[0].commitment.created.should.least(startTime);
        resp[0].commitment.topic.length.should.equals(2);
        resp[0].commitment.topic[0].should.equals('spiritual');
        resp[0].commitment.topic[1].should.equals('education');
        resp[0].commitment.language.should.equals('de');
    });

    it('Create a new commitment (only mandatory properties)', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/commitment', {
            title: 'Commitment Example',
            description: 'description',
            topic: ['spiritual', 'education'],
            lang: 'de'});
        res.status.should.equal(200);
        res.body.slug.should.equals('commitment-example');
        stubCDN.uploadBuffer.called.should.be.false;
        stubCDN.copyFile.calledWith('default/commitment/title.jpg', `commitment/${res.body.answerId}/title.jpg`, sinon.match.any).should.be.true;

        let resp = await db.cypher().match("(commitment:Answer:Commitment)<-[:IS_ADMIN]-(user:User {userId: '1'})")
            .return(`commitment`).end().send();
        resp.length.should.equals(1);
        resp[0].commitment.answerId.should.equals(res.body.answerId);
        resp[0].commitment.title.should.equals('Commitment Example');
        resp[0].commitment.description.should.equals('description');
        should.not.exist(resp[0].commitment.website);
        resp[0].commitment.created.should.least(startTime);
        resp[0].commitment.topic.length.should.equals(2);
        resp[0].commitment.topic[0].should.equals('spiritual');
        resp[0].commitment.topic[1].should.equals('education');
        resp[0].commitment.language.should.equals('de');
    });

    it('Only allowed to create a new commitment as logged in user', async function () {
        await dbDsl.sendToDb();
        let res = await requestHandler.post('/api/user/commitment', {
            title: 'Commitment Example', description: 'description', website: 'www.example.org',
            topic: ['spiritual', 'education'], lang: 'de'
        });
        res.status.should.equal(401);
    });
});
