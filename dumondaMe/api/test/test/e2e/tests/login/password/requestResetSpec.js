'use strict';

let requestHandler = require('dumonda-me-server-test-util').requestHandler;
let db = require('dumonda-me-server-test-util').db;
let eMail = require('dumonda-me-server-lib').eMail;
let sinon = require('sinon');
let moment = require('moment');

describe('Integration Tests for requesting a password reset login', function () {

    let startTime, sandbox, stubSendEMail;

    beforeEach(async function () {
        await db.clearDatabase();
        let commands = [];
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        sandbox = sinon.sandbox.create();
        stubSendEMail = sandbox.stub(eMail, 'sendEMail');
        stubSendEMail.resolves({});

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

    afterEach(function () {
        sandbox.restore();
    });

    it('Request a password reset and send link to email address', async function () {
        let res = await requestHandler.post('/api/login/password/requestReset', {
            email: 'user@irgendwo.ch',
            language: 'de'
        });
        res.status.should.equal(200);

        let user = await db.cypher().match("(u:User {userId: '1'})").return("u").end().send();

        user.length.should.equals(1);
        user[0].u.resetPasswordRequestTimeout.should.at.least(startTime + (60 * 20));
        stubSendEMail.calledWith("resetPassword",
            {link: `${process.env.ELYOOS_DOMAIN}login/passwordReset?linkId=${user[0].u.resetPasswordLinkId}`},
            'de', 'USER@irgendwo.ch').should.be.true;
    });

    it('Request a password reset to email with capital letters and send link to email address', async function () {
        let res = await requestHandler.post('/api/login/password/requestReset', {
            email: 'USER@IRGENDWO.CH',
            language: 'de'
        });
        res.status.should.equal(200);

        let user = await db.cypher().match("(u:User {userId: '1'})").return("u").end().send();

        user.length.should.equals(1);
        stubSendEMail.calledWith("resetPassword",
            {link: `${process.env.ELYOOS_DOMAIN}login/passwordReset?linkId=${user[0].u.resetPasswordLinkId}`},
            'de', 'USER@irgendwo.ch').should.be.true;
    });

    it('Request a password reset where the resend time is expired and send link to email address', async function () {
        let res = await requestHandler.post('/api/login/password/requestReset', {
            email: 'user2@irgendwo.ch',
            language: 'de'
        });
        res.status.should.equal(200);
        let user = await db.cypher().match("(u:User {userId: '2'})").return("u").end().send();
        user.length.should.equals(1);
        stubSendEMail.calledWith("resetPassword",
            {link: `${process.env.ELYOOS_DOMAIN}login/passwordReset?linkId=${user[0].u.resetPasswordLinkId}`},
            'de', 'user2@IRGENdwo.ch').should.be.true;
    });

    it('Request a password reset twice causes only first attempt to send link to email address', async function () {
        let res = await requestHandler.post('/api/login/password/requestReset', {
            email: 'user@irgendwo.ch',
            language: 'de'
        });
        res.status.should.equal(200);

        let user = await db.cypher().match("(u:User {userId: '1'})").return("u").end().send();
        stubSendEMail.calledWith("resetPassword",
            {link: `${process.env.ELYOOS_DOMAIN}login/passwordReset?linkId=${user[0].u.resetPasswordLinkId}`},
            'de', 'USER@irgendwo.ch').should.be.true;

        res = await requestHandler.post('/api/login/password/requestReset', {
            email: 'user@irgendwo.ch',
            language: 'de'
        });
        res.status.should.equal(200);
        stubSendEMail.calledOnce.should.be.true;
    });

    it('Email is not send when the resend time has not expired', async function () {
        let res = await requestHandler.post('/api/login/password/requestReset', {
            email: 'user3@irgendwo.ch',
            language: 'de'
        });
        res.status.should.equal(200);
        stubSendEMail.called.should.be.false;
    });

    it('Email is not send when no user with address exists', async function () {
        let res = await requestHandler.post('/api/login/password/requestReset', {
            email: 'user10@irgendwo.ch',
            language: 'de'
        });
        res.status.should.equal(200);
        stubSendEMail.called.should.be.false;
    });
});
