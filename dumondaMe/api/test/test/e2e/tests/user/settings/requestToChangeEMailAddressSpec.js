'use strict';

const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const users = require('dumonda-me-server-test-util').user;
const db = require('dumonda-me-server-test-util').db;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const eMail = require('dumonda-me-server-lib').eMail;
const sinon = require('sinon');
const should = require('chai').should();
const moment = require('moment');

describe('Request to change users email address', function () {

    let startTime, sandbox, stubSendEMail;

    beforeEach(async function () {
        await dbDsl.init(2);
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        sandbox = sinon.sandbox.create();
        stubSendEMail = sandbox.stub(eMail, 'sendEMail');
        stubSendEMail.resolves({});
        await dbDsl.sendToDb();
    });

    afterEach(function () {
        sandbox.restore();
        return requestHandler.logout();
    });

    it('Request to change the email address', async function () {
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/settings/email', {newEMailAddress: 'info@NewEMailAddress.ch'});
        res.status.should.equal(200);
        let request = await db.cypher().match(`(:User {userId: '1'})-[:NEW_EMAIL_REQUEST]->(request:NewEMail)`)
            .return('request').end().send();
        request.length.should.equals(1);
        request[0].request.email.should.equals('info@NewEMailAddress.ch');
        request[0].request.created.should.least(startTime);
        should.exist(request[0].request.verify);

        stubSendEMail.calledWith("changeEmailRequestNewAddress", {
            name: `user Meier`,
            link: `${process.env.DUMONDA_ME_DOMAIN}user/email/verify?linkId=${request[0].request.verify}`
        }, 'de', 'info@NewEMailAddress.ch').should.be.true;

        stubSendEMail.calledWith("changeEmailRequestOldAddress", {
            name: `user Meier`, newEmail: 'info@NewEMailAddress.ch'
        }, 'de', 'user@irgendwo.ch').should.be.true;
    });

    it('New request overrides existing ', async function () {
        dbDsl.newEmailRequest('1', {email: 'test@old.ch', verify: '3', created: 500});
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/settings/email', {newEMailAddress: 'info@NewEMailAddress.ch'});
        res.status.should.equal(200);
        let request = await db.cypher().match(`(:User {userId: '1'})-[:NEW_EMAIL_REQUEST]->(request:NewEMail)`)
            .return('request').end().send();
        request.length.should.equals(1);
        request[0].request.email.should.equals('info@NewEMailAddress.ch');
        request[0].request.created.should.least(startTime);
        request[0].request.verify.should.not.equals('3');

        stubSendEMail.calledWith("changeEmailRequestNewAddress", {
            name: `user Meier`,
            link: `${process.env.DUMONDA_ME_DOMAIN}user/email/verify?linkId=${request[0].request.verify}`
        }, 'de', 'info@NewEMailAddress.ch').should.be.true;

        stubSendEMail.calledWith("changeEmailRequestOldAddress", {
            name: `user Meier`, newEmail: 'info@NewEMailAddress.ch'
        }, 'de', 'user@irgendwo.ch').should.be.true;
    });

    it('Not allowed to use actual email of user', async function () {
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/settings/email', {newEMailAddress: 'user@irgendwo.ch'});
        res.status.should.equal(400);
        let request = await db.cypher().match(`(:User {userId: '1'})-[:NEW_EMAIL_REQUEST]->(request:NewEMail)`)
            .return('request').end().send();
        request.length.should.equals(0);

        stubSendEMail.called.should.be.false;
    });

    it('Not allowed to use email of existing user', async function () {
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/settings/email', {newEMailAddress: 'User2@irgendwo.ch'});
        res.status.should.equal(400);
        res.body.errorCode.should.equal(1);
        let request = await db.cypher().match(`(:User {userId: '1'})-[:NEW_EMAIL_REQUEST]->(request:NewEMail)`)
            .return('request').end().send();
        request.length.should.equals(0);

        stubSendEMail.called.should.be.false;
    });


    it('Not logged in user', async function () {
        let res = await requestHandler.put('/api/user/settings/email', {newEMailAddress: 'info@NewEMailAddress.ch'});
        res.status.should.equal(401);
        let request = await db.cypher().match(`(user:User {userId: '1'})-[:NEW_EMAIL_REQUEST]->(request:NewEMail)`)
            .return('user').end().send();
        request.length.should.equals(0);

        stubSendEMail.called.should.be.false;
    });
});
