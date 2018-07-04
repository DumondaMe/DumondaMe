'use strict';

let requestHandler = require('elyoos-server-test-util').requestHandler;
let stubEmailQueue = require('elyoos-server-test-util').stubEmailQueue();
let db = require('elyoos-server-test-util').db;
let sinon = require('sinon');
let moment = require('moment');

describe('Integration Tests for requesting a password reset login', function () {

    let startTime;

    beforeEach(async function () {
        await db.clearDatabase();
        let commands = [];
        stubEmailQueue.createImmediatelyJob.reset();
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        commands.push(db.cypher().create("(:User {email: 'USER3@IRGENDWO.ch', emailNormalized: 'user3@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', " +
            "lastLogin: 100, userId:'3', resetPasswordRequestTimeout: {resetPasswordRequestTimeout} })")
            .end({resetPasswordRequestTimeout: startTime + 10}).getCommand());

        commands.push(db.cypher().create("(:User {email: 'user2@IRGENdwo.ch', emailNormalized: 'user2@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', " +
            "lastLogin: 100, userId:'2', resetPasswordRequestTimeout: {resetPasswordRequestTimeout} })")
            .end({resetPasswordRequestTimeout: startTime - 1}).getCommand());

        await db.cypher().create("(:User {email: 'USER@irgendwo.ch', emailNormalized: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', " +
            "lastLogin: 100, userId:'1'})")
            .end().send(commands);
    });

    it('Request a password reset and send link to email address', async function () {
        let res = await requestHandler.post('/api/login/password/requestReset', {email: 'user@irgendwo.ch'});
        res.status.should.equal(200);
        stubEmailQueue.createImmediatelyJob.calledWith("resetPassword", {
            email: 'USER@irgendwo.ch',
            linkId: sinon.match.any
        }).should.be.true;
        let user = await db.cypher().match("(u:User {resetPasswordLinkId: {linkId}})").return("u")
            .end({linkId: stubEmailQueue.createImmediatelyJob.args[0][1].linkId}).send();
        user.length.should.equals(1);
        user[0].u.resetPasswordRequestTimeout.should.at.least(startTime + (60 * 20));
    });

    it('Request a password reset to email with capital letters and send link to email address', async function () {
        let res = await requestHandler.post('/api/login/password/requestReset', {email: 'USER@IRGENDWO.CH'});
        res.status.should.equal(200);
        stubEmailQueue.createImmediatelyJob.calledWith("resetPassword", {
            email: 'USER@irgendwo.ch',
            linkId: sinon.match.any
        }).should.be.true;
        let user = await db.cypher().match("(u:User {resetPasswordLinkId: {linkId}})").return("u")
            .end({linkId: stubEmailQueue.createImmediatelyJob.args[0][1].linkId}).send();
        user.length.should.equals(1);
    });

    it('Request a password reset where the resend time is expired and send link to email address', async function () {
        let res = await requestHandler.post('/api/login/password/requestReset', {email: 'user2@irgendwo.ch'})
        res.status.should.equal(200);
        stubEmailQueue.createImmediatelyJob.calledWith("resetPassword", {
            email: 'user2@IRGENdwo.ch',
            linkId: sinon.match.any
        }).should.be.true;
        let user = await db.cypher().match("(u:User {resetPasswordLinkId: {linkId}})").return("u")
            .end({linkId: stubEmailQueue.createImmediatelyJob.args[0][1].linkId}).send();
        user.length.should.equals(1);
    });

    it('Request a password reset twice causes only first attempt to send link to email address', async function () {
        let linkId;
        let res = await requestHandler.post('/api/login/password/requestReset', {email: 'user@irgendwo.ch'});
        res.status.should.equal(200);
        stubEmailQueue.createImmediatelyJob.calledWith("resetPassword", {
            email: 'USER@irgendwo.ch',
            linkId: sinon.match.any
        }).should.be.true;
        linkId = stubEmailQueue.createImmediatelyJob.args[0][1].linkId;
        stubEmailQueue.createImmediatelyJob.reset();
        res = await requestHandler.post('/api/login/password/requestReset', {email: 'user@irgendwo.ch'});
        res.status.should.equal(200);
        stubEmailQueue.createImmediatelyJob.called.should.be.false;
        let user = await db.cypher().match("(u:User {resetPasswordLinkId: {linkId}})").return("u").end({linkId: linkId}).send();
        user.length.should.equals(1);
    });

    it('Email is not send when the resend time has not expired', async function () {
        let res = await requestHandler.post('/api/login/password/requestReset', {email: 'user3@irgendwo.ch'});
        res.status.should.equal(200);
        stubEmailQueue.createImmediatelyJob.called.should.be.false;
    });

    it('Email is not send when no user with address exists', async function () {
        let res = await requestHandler.post('/api/login/password/requestReset', {email: 'user10@irgendwo.ch'});
        res.status.should.equal(200);
        stubEmailQueue.createImmediatelyJob.called.should.be.false;
    });
});