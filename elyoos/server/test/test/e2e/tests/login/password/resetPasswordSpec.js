'use strict';

var requestHandler = require('elyoos-server-test-util').requestHandler;
var stubEmailQueue = require('elyoos-server-test-util').stubEmailQueue();
var db = require('elyoos-server-test-util').db;
var moment = require('moment');
var should = require('chai').should();

describe('Integration Tests for reset a password with email link', function () {

    beforeEach(function () {
        return db.clearDatabase().then(function () {
            stubEmailQueue.createImmediatelyJob.reset();
            return db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', " +
                "lastLogin: 100, userId:'1'})")
                .end().send();
        });
    });

    it('Reset a password - Return 200', function () {
        var resetPasswordLinkId = "yrtcus4PnEvcz0UD8nsHMGqSRlnaQU3wHMyjvqkydfMWEXDh3tHQ4vVOwMbwtfl3",
            expires = Math.floor(moment.utc().valueOf() / 1000) + 10, newPassword = "Krgvb8riomf";
        return db.cypher().match("(u:User {userId: '1'})").set("u", {
            resetPasswordLinkId: resetPasswordLinkId,
            resetPasswordRequestTimeout: expires
        }).end().send().then(function () {
            return requestHandler.post('/api/login/password/reset', {linkId: resetPasswordLinkId, newPassword: newPassword}).then(function (res) {
                res.status.should.equal(200);
                return db.cypher().match("(user:User {userId: '1'})").return("user").end().send();
            }).then(function (user) {
                user.length.should.equals(1);
                user[0].user.password.should.not.equals('$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm');
                should.not.exist(user[0].user.resetPasswordLinkId);
            });
        });
    });

    it('Reset a password fails because of expired timeout - Return 400', function () {
        var resetPasswordLinkId = "yrtcus4PnEvcz0UD8nsHMGqSRlnaQU3wHMyjvqkydfMWEXDh3tHQ4vVOwMbwtfl3",
            expires = Math.floor(moment.utc().valueOf() / 1000) - 1, newPassword = "Krgvb8riomf";
        return db.cypher().match("(u:User {userId: '1'})").set("u", {
            resetPasswordLinkId: resetPasswordLinkId,
            resetPasswordRequestTimeout: expires
        }).end().send().then(function () {
            return requestHandler.post('/api/login/password/reset', {linkId: resetPasswordLinkId, newPassword: newPassword}).then(function (res) {
                res.status.should.equal(400);
                return db.cypher().match("(user:User {userId: '1'})").return("user").end().send();
            }).then(function (user) {
                user.length.should.equals(1);
                user[0].user.password.should.equals('$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm');
            });
        });
    });

    it('Reset a password fails because link does not exist - Return 400', function () {
        var resetPasswordLinkId = "yrtcus4PnEvcz0UD8nsHMGqSRlnaQU3wHMyjvqkydfMWEXDh3tHQ4vVOwMbwtfl3",
            expires = Math.floor(moment.utc().valueOf() / 1000) + 10, newPassword = "Krgvb8riomf";
        return db.cypher().match("(u:User {userId: '1'})").set("u", {
            resetPasswordLinkId: resetPasswordLinkId,
            resetPasswordRequestTimeout: expires
        }).end().send().then(function () {
            resetPasswordLinkId = resetPasswordLinkId.slice(-1) + '4';
            return requestHandler.post('/api/login/password/reset', {linkId: resetPasswordLinkId, newPassword: newPassword}).then(function (res) {
                res.status.should.equal(400);
                return db.cypher().match("(user:User {userId: '1'})").return("user").end().send();
            }).then(function (user) {
                user.length.should.equals(1);
                user[0].user.password.should.equals('$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm');
            });
        });
    });
});