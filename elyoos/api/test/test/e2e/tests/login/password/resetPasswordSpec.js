'use strict';

let requestHandler = require('elyoos-server-test-util').requestHandler;
let db = require('elyoos-server-test-util').db;
let moment = require('moment');
let should = require('chai').should();

describe('Integration Tests for reset a password with email link', function () {

    beforeEach(async function () {
        await db.clearDatabase();
        await db.cypher().create("(:User {email: 'user@irgendwo.ch', emailNormalized: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', " +
            "lastLogin: 100, userId:'1'})")
            .end().send();
    });

    it('Reset a password', async function () {
        let resetPasswordLinkId = "yrtcus4PnEvcz0UD8nsHMGqSRlnaQU3wHMyjvqkydfMWEXDh3tHQ4vVOwMbwtfl3",
            expires = Math.floor(moment.utc().valueOf() / 1000) + 10, newPassword = "Krgvb8riomf";
        await db.cypher().match("(u:User {userId: '1'})").set("u", {
            resetPasswordLinkId: resetPasswordLinkId,
            resetPasswordRequestTimeout: expires
        }).end().send();

        let res = await requestHandler.post('/api/login/password/reset', {
            linkId: resetPasswordLinkId,
            newPassword: newPassword
        });
        res.status.should.equal(200);

        let user = await db.cypher().match("(user:User {userId: '1'})").return("user").end().send();
        user.length.should.equals(1);
        user[0].user.password.should.not.equals('$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm');
        should.not.exist(user[0].user.resetPasswordLinkId);
    });

    it('Reset a password fails because of expired timeout', async function () {
        let resetPasswordLinkId = "yrtcus4PnEvcz0UD8nsHMGqSRlnaQU3wHMyjvqkydfMWEXDh3tHQ4vVOwMbwtfl3",
            expires = Math.floor(moment.utc().valueOf() / 1000) - 1, newPassword = "Krgvb8riomf";
        await db.cypher().match("(u:User {userId: '1'})").set("u", {
            resetPasswordLinkId: resetPasswordLinkId,
            resetPasswordRequestTimeout: expires
        }).end().send();

        let res = await requestHandler.post('/api/login/password/reset', {
            linkId: resetPasswordLinkId,
            newPassword: newPassword
        });
        res.status.should.equal(400);

        let user = await db.cypher().match("(user:User {userId: '1'})").return("user").end().send();
        user.length.should.equals(1);
        user[0].user.password.should.equals('$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm');
    });

    it('Reset a password fails because link does not exist', async function () {
        let resetPasswordLinkId = "yrtcus4PnEvcz0UD8nsHMGqSRlnaQU3wHMyjvqkydfMWEXDh3tHQ4vVOwMbwtfl3",
            expires = Math.floor(moment.utc().valueOf() / 1000) + 10, newPassword = "Krgvb8riomf";
        await db.cypher().match("(u:User {userId: '1'})").set("u", {
            resetPasswordLinkId: resetPasswordLinkId,
            resetPasswordRequestTimeout: expires
        }).end().send();
        resetPasswordLinkId = resetPasswordLinkId.slice(-1) + '4';

        let res = await requestHandler.post('/api/login/password/reset', {
            linkId: resetPasswordLinkId,
            newPassword: newPassword
        });
        res.status.should.equal(400);

        let user = await db.cypher().match("(user:User {userId: '1'})").return("user").end().send();
        user.length.should.equals(1);
        user[0].user.password.should.equals('$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm');
    });
});
