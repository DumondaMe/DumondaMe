'use strict';

var requestHandler = require('elyoos-server-test-util').requestHandler;
var stubEmailQueue = require('elyoos-server-test-util').stubEmailQueue();
var db = require('elyoos-server-test-util').db;
var sinon = require('sinon');

describe('Integration Tests for requesting a password reset Login', function () {

    beforeEach(function () {
        return db.clearDatabase().then(function () {
            stubEmailQueue.createImmediatelyJob.reset();
            return db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', " +
                "lastLogin: 100, userId:'1' })")
                .end().send();
        });
    });

    it('Request a password reset and send link to email address- Return 200', function () {
        return requestHandler.post('/api/login/password/requestReset', {email: 'user@irgendwo.ch'}).then(function (res) {
            res.status.should.equal(200);
            stubEmailQueue.createImmediatelyJob.calledWith("resetPassword", {
                email: 'user@irgendwo.ch',
                linkId: sinon.match.any
            }).should.be.true;
            return db.cypher().match("(u:User {resetPasswordLinkId: {linkId}})").return("u")
                .end({linkId: stubEmailQueue.createImmediatelyJob.args[0][1].linkId}).send();
        }).then(function (user) {
            user.length.should.equals(1);
        });
    });

    it('Request a password reset twice causes only first attempt to send link to email address - Return 200', function () {
        var linkId;
        return requestHandler.post('/api/login/password/requestReset', {email: 'user@irgendwo.ch'}).then(function (res) {
            res.status.should.equal(200);
            stubEmailQueue.createImmediatelyJob.calledWith("resetPassword", {
                email: 'user@irgendwo.ch',
                linkId: sinon.match.any
            }).should.be.true;
            linkId = stubEmailQueue.createImmediatelyJob.args[0][1].linkId;
            stubEmailQueue.createImmediatelyJob.reset();
            return requestHandler.post('/api/login/password/requestReset', {email: 'user@irgendwo.ch'});
        }).then(function (res) {
            res.status.should.equal(200);
            stubEmailQueue.createImmediatelyJob.called.should.be.false;
            return db.cypher().match("(u:User {resetPasswordLinkId: {linkId}})").return("u").end({linkId: linkId}).send();
        }).then(function (user) {
            user.length.should.equals(1);
        });
    });

    it('Email is not send when no user with address exists - Return 200', function () {
        return requestHandler.post('/api/login/password/requestReset', {email: 'user2@irgendwo.ch'}).then(function (res) {
            res.status.should.equal(200);
            stubEmailQueue.createImmediatelyJob.called.should.be.false;
        });
    });
});