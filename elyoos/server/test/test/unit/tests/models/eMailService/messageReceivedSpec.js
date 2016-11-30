'use strict';

var testee = require('../../../../../../models/eMailService/messageReceived');
var emailQueue = require('../../../../../../lib/eMail/eMailQueue');
var db = require('../../../../e2e/tests/util/db');
var sinon = require('sinon');
var expect = require('chai').expect;

describe('Unit Test eMailService/messageReceived', function () {

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

    it('Start Email job when message received. No previous message received.', function () {

        var commands = [], createJob = sandbox.stub(emailQueue, 'createJob');

        commands.push(db.cypher().create("(:User {email: 'test@gmx.ch', name: 'user Meier', userId: '1'})").end().getCommand());
        commands.push(db.cypher().create("(:User {name: 'user Meier2', userId: '2'})").end().getCommand());

        commands.push(db.cypher().match("(u:User {userId: '1'}), (u2:User {userId: '2'})")
            .create("(u2)-[:ACTIVE {lastTimeVisited: 500}]->(:Thread {threadId: '1'})<-[:ACTIVE {lastTimeVisited: 300}]-(u)")
            .end().getCommand());

        return db.cypher().match("(thread:Thread {threadId: '1'}), (u:User {userId: '1'}), (u2:User {userId: '2'})")
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
            }).end().send(commands).then(function () {
                return testee.received('1').then(function () {
                    expect(createJob.withArgs('messageReceived', {userId: '1', jobId: sinon.match.any}).calledOnce).to.be.true;
                }).then(function () {
                    return db.cypher().match("(e:EMailNotification {userId: '1'})").return("e").end().send();
                }).then(function (resp) {
                    expect(resp.length).to.be.equal(1);
                });
            });
    });

    it('Start Email job when message received. Job for previous Message is already running.', function () {

        var commands = [], createJob = sandbox.stub(emailQueue, 'createJob');

        commands.push(db.cypher().create("(:User {email: 'test@gmx.ch', name: 'user Meier', userId: '1'})").end().getCommand());
        commands.push(db.cypher().create("(:User {name: 'user Meier2', userId: '2'})").end().getCommand());

        commands.push(db.cypher().match("(u:User {userId: '1'}), (u2:User {userId: '2'})")
            .create("(u2)-[:ACTIVE {lastTimeVisited: 500}]->(:Thread {threadId: '1'})<-[:ACTIVE {lastTimeVisited: 300}]-(u)")
            .end().getCommand());

        commands.push(db.cypher().create("(:EMailNotification {userId: '1', lastJobId: '3', lastUpdated: 500, countUpdates: 2})")
            .end().getCommand());

        return db.cypher().match("(thread:Thread {threadId: '1'}), (u:User {userId: '1'}), (u2:User {userId: '2'})")
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
            }).end().send(commands).then(function () {
                return testee.received('1').then(function () {
                    expect(createJob.withArgs('messageReceived', {userId: '1', jobId: sinon.match.any}).calledOnce).to.be.true;
                }).then(function () {
                    return db.cypher().match("(e:EMailNotification {userId: '1'})").return("e").end().send();
                }).then(function (resp) {
                    expect(resp.length).to.be.equal(1);
                    expect(resp[0].e.lastJobId).to.not.equal('3');
                    expect(resp[0].e.lastUpdated).to.not.equal(500);
                    expect(resp[0].e.countUpdates).to.be.equal(3);
                });
            });
    });
});
