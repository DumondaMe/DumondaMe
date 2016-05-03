'use strict';

var testee = require('../../../../../../../models/eMailService/jobs/messageReceivedJob');
var email = require('../../../../../../../lib/eMail/eMail');
var db = require('../../../../../e2e/tests/util/db');
var sinon = require('sinon');
var expect = require('chai').expect;

describe('Unit Test eMailService/jobs/messageReceivedJob', function () {

    var sandbox;

    before(function () {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(function () {
        return db.clearDatabase();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Send a Email to the user who received a message', function () {

        var finished = sinon.spy(), commands = [], sendEMail = sandbox.stub(email, 'sendEMail');

        commands.push(db.cypher().create("(:User {email: 'test@gmx.ch', forename: 'user', name: 'user Meier', userId: '1'})").end().getCommand());
        commands.push(db.cypher().create("(:User {name: 'user Meier2', userId: '2'})").end().getCommand());

        commands.push(db.cypher().match("(u:User {userId: '1'}), (u2:User {userId: '2'})")
            .create("(u2)-[:ACTIVE {lastTimeVisited: 500}]->(:Thread {threadId: '1'})<-[:ACTIVE {lastTimeVisited: 300}]-(u)")
            .end().getCommand());

        commands.push(db.cypher().match("(thread:Thread {threadId: '1'}), (u:User {userId: '1'}), (u2:User {userId: '2'})")
            .create("(thread)-[:NEXT_MESSAGE]->(message:Message {messageAdded: {messageAdded}, text: 'message1'})" +
                "-[:NEXT_MESSAGE]->(message2:Message {messageAdded: {messageAdded2}, text: 'message2'})" +
                "-[:NEXT_MESSAGE]->(message3:Message {messageAdded: {messageAdded3}, text: 'message3'})" +
                "-[:NEXT_MESSAGE]->(message4:Message {messageAdded: {messageAdded4}, text: 'message4'})," +
                "(message)-[:WRITTEN]->(u)," +
                "(message2)-[:WRITTEN]->(u)," +
                "(message3)-[:WRITTEN]->(u2)," +
                "(message4)-[:WRITTEN]->(u)")
            .end({
                messageAdded: 299,
                messageAdded2: 400,
                messageAdded3: 600,
                messageAdded4: 700
            }).getCommand());

        return db.cypher().create("(:EMailNotification {userId: '1', lastJobId: '2', lastUpdated: 500, countUpdates: 0})")
            .end().send(commands).then(function () {
                return testee.processDefinition({userId: '1', jobId: '2'}, finished).then(function () {
                    expect(sendEMail.withArgs('newMessages', {numberOfUnreadMessages: 1, forename: 'user'}, 'test@gmx.ch').calledOnce).to.be.true;
                    expect(finished.calledOnce).to.be.true;
                }).then(function () {
                    return db.cypher().match("(e:EMailNotification)").return("e").end().send();
                }).then(function (resp) {
                    expect(resp.length).to.be.equal(0);
                });
            });
    });

    it('EMail not sent when no unread messages', function () {

        var finished = sinon.spy(), commands = [], sendEMail = sandbox.stub(email, 'sendEMail');

        commands.push(db.cypher().create("(:User {email: 'test@gmx.ch', name: 'user Meier', userId: '1'})").end().getCommand());
        commands.push(db.cypher().create("(:User {name: 'user Meier2', userId: '2'})").end().getCommand());

        commands.push(db.cypher().match("(u:User {userId: '1'}), (u2:User {userId: '2'})")
            .create("(u2)-[:ACTIVE {lastTimeVisited: 500}]->(:Thread {threadId: '1'})<-[:ACTIVE {lastTimeVisited: 701}]-(u)")
            .end().getCommand());

        commands.push(db.cypher().match("(thread:Thread {threadId: '1'}), (u:User {userId: '1'}), (u2:User {userId: '2'})")
            .create("(thread)-[:NEXT_MESSAGE]->(message:Message {messageAdded: {messageAdded}, text: 'message1'})" +
                "-[:NEXT_MESSAGE]->(message2:Message {messageAdded: {messageAdded2}, text: 'message2'})" +
                "-[:NEXT_MESSAGE]->(message3:Message {messageAdded: {messageAdded3}, text: 'message3'})" +
                "-[:NEXT_MESSAGE]->(message4:Message {messageAdded: {messageAdded4}, text: 'message4'})," +
                "(message)-[:WRITTEN]->(u)," +
                "(message2)-[:WRITTEN]->(u)," +
                "(message3)-[:WRITTEN]->(u2)," +
                "(message4)-[:WRITTEN]->(u)")
            .end({
                messageAdded: 299,
                messageAdded2: 400,
                messageAdded3: 600,
                messageAdded4: 700
            }).getCommand());

        return db.cypher().create("(:EMailNotification {userId: '1', lastJobId: '2', lastUpdated: 500, countUpdates: 0})")
            .end().send(commands).then(function () {
                return testee.processDefinition({userId: '1', jobId: '2'}, finished).then(function () {
                    expect(sendEMail.called).to.be.false;
                    expect(finished.calledOnce).to.be.true;
                }).then(function () {
                    return db.cypher().match("(e:EMailNotification)").return("e").end().send();
                }).then(function (resp) {
                    expect(resp.length).to.be.equal(0);
                });
            });
    });

    it('Email not sent when lastJobId ist different to jobId', function () {

        var finished = sinon.spy(), commands = [], sendEMail = sandbox.stub(email, 'sendEMail');

        commands.push(db.cypher().create("(:User {email: 'test@gmx.ch', name: 'user Meier', userId: '1'})").end().getCommand());
        commands.push(db.cypher().create("(:User {name: 'user Meier2', userId: '2'})").end().getCommand());

        return db.cypher().create("(:EMailNotification {userId: '1', lastJobId: '3', lastUpdated: 500, countUpdates: 0})")
            .end().send(commands).then(function () {
                return testee.processDefinition({userId: '1', jobId: '2'}, finished).then(function () {
                    expect(sendEMail.called).to.be.false;
                    expect(finished.calledOnce).to.be.true;
                }).then(function () {
                    return db.cypher().match("(e:EMailNotification)").return("e").end().send();
                }).then(function (resp) {
                    expect(resp.length).to.be.equal(1);
                });
            });
    });

    it('Email not sent when EMailNotification is missing', function () {

        var finished = sinon.spy(), commands = [], sendEMail = sandbox.stub(email, 'sendEMail');

        commands.push(db.cypher().create("(:User {email: 'test@gmx.ch', name: 'user Meier', userId: '1'})").end().getCommand());

        return db.cypher().create("(:User {name: 'user Meier2', userId: '2'})")
            .end().send(commands).then(function () {
                return testee.processDefinition({userId: '1', jobId: '2'}, finished).then(function () {
                    expect(sendEMail.called).to.be.false;
                    expect(finished.calledOnce).to.be.true;
                });
            });
    });
});
