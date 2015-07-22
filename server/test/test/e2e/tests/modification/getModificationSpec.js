'use strict';

var app = require('../../../../../server');
var users = require('../util/user');
var db = require('../util/db');
var requestHandler = require('../util/request');
var should = require('chai').should();
var moment = require('moment');

describe('Integration Tests for getting modification info', function () {

    var requestAgent, requestAgent2, startTime;

    beforeEach(function () {

        return db.clearDatabase().then(function () {
            var commands = [];
            startTime = Math.floor(moment.utc().valueOf() / 1000);

            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', userId: '1'})").end().getCommand());

            // User 2
            commands.push(db.cypher().create("(:User {email: 'user2@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user2 Meier2', userId: '2'})").end().getCommand());
            //Create Thread with messages between user 1 + 2
            commands.push(db.cypher().match("(u:User {userId: '1'}), (u2:User {userId: '2'})")
                .create("(u2)-[:ACTIVE {lastTimeVisited: {lastTimeVisited2}}]->(:Thread {threadId: '1'})<-[:ACTIVE {lastTimeVisited: {lastTimeVisited}}]-(u)")
                .end({
                    lastTimeVisited: startTime - 500,
                    lastTimeVisited2: startTime - 400
                }).getCommand());
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
                    messageAdded: startTime - 299,
                    messageAdded2: startTime - 400,
                    messageAdded3: startTime - 600,
                    messageAdded4: startTime - 700
                }).getCommand());
            commands.push(db.cypher().match("(u:User {userId: '2'})")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false})")
                .end({}).getCommand());

            // User 3
            commands.push(db.cypher().create("(:User {name: 'user3 Meier3', userId: '3'})").end().getCommand());

            //Create GroupThread with messages between user 1 + 2 + 3
            return db.cypher().match("(u:User {userId: '1'}), (u2:User {userId: '2'}), (u3:User {userId: '3'})")
                .create("(thread:GroupThread {threadId: '1', description: 'TestChat'})-[:NEXT_MESSAGE]->(message:Message {messageAdded: {messageAdded}, text: 'message1'})" +
                "-[:NEXT_MESSAGE]->(message2:Message {messageAdded: {messageAdded2}, text: 'message2'})" +
                "-[:NEXT_MESSAGE]->(message3:Message {messageAdded: {messageAdded3}, text: 'message3'})" +
                "-[:NEXT_MESSAGE]->(message4:Message {messageAdded: {messageAdded4}, text: 'message4'})," +
                "(message)-[:WRITTEN]->(u)," +
                "(message2)-[:WRITTEN]->(u2)," +
                "(message3)-[:WRITTEN]->(u)," +
                "(message4)-[:WRITTEN]->(u3)," +
                "(u)-[:ACTIVE {lastTimeVisited: {lastTimeVisited}}]->(thread)," +
                "(u2)-[:ACTIVE {lastTimeVisited: {lastTimeVisited}}]->(thread)," +
                "(u3)-[:ACTIVE {lastTimeVisited: {lastTimeVisited}}]->(thread)")
                .end({
                    messageAdded: startTime - 300,
                    messageAdded2: startTime - 400,
                    messageAdded3: startTime - 600,
                    messageAdded4: startTime - 700,
                    lastTimeVisited: startTime - 301
                }).send(commands);
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Only when new message is sent to the user then return message has changed - Return 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.get('/api/modification', requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            should.not.exist(res.body.hasChanged);
            return requestHandler.login(users.validUser2);
        }).then(function (agent) {
            requestAgent2 = agent;
            return requestHandler.post('/api/user/messages/conversation', {
                addMessage: {
                    threadId: '1',
                    text: 'messageAdded'
                }
            }, requestAgent2);
        }).then(function () {
            return requestHandler.logout();
        }).then(function () {
            return requestHandler.get('/api/modification', requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.hasChanged.should.be.true;
            res.body.messages.length.should.equals(2);
            res.body.messages[0].threadId.should.equals('1');
            res.body.messages[0].isGroupThread.should.equals(false);
            res.body.messages[0].name.should.equals('user2 Meier2');
            res.body.messages[0].profileUrl.should.equals('profileImage/default/thumbnail.jpg');
            res.body.messages[0].numberOfUnreadMessages.should.equals(3);

            res.body.messages[1].threadId.should.equals('1');
            res.body.messages[1].isGroupThread.should.equals(true);
            res.body.messages[1].name.should.equals('TestChat');
            res.body.messages[1].profileUrl.should.equals('profileImage/default/thumbnail.jpg');
            res.body.messages[1].numberOfUnreadMessages.should.equals(1);
            return requestHandler.get('/api/modification', requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            should.not.exist(res.body.hasChanged);
        });
    });

    it('When forcing is true then return for every request the value - Return 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/modification', {forceShowModification: true}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.messages.length.should.equals(2);
        });
    });

    it('If the user sends a message then modification returns false - Return 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.get('/api/modification', requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            should.not.exist(res.body.hasChanged);
            return requestHandler.post('/api/user/messages/conversation', {
                addMessage: {
                    threadId: '1',
                    text: 'messageAdded'
                }
            }, requestAgent);
        }).then(function () {
            return requestHandler.get('/api/modification', requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            should.not.exist(res.body.hasChanged);
        });
    });

    it('If the user opens a thread then modification returns false - Return 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.get('/api/modification', requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            should.not.exist(res.body.hasChanged);
            return requestHandler.getWithData('/api/user/messages/conversation', {
                itemsPerPage: 10,
                skip: 0,
                threadId: '1',
                isGroupThread: 'true'
            }, requestAgent);
        }).then(function () {
            return requestHandler.get('/api/modification', requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            should.not.exist(res.body.hasChanged);
        });
    });
});
