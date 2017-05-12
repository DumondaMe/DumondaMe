'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');

describe('Integration Tests for sending messages to a conversation and adding threads', function () {

    let requestAgent, startTime;

    beforeEach(function () {

        return db.clearDatabase().then(function () {
            let commands = [];
            startTime = Math.floor(moment.utc().valueOf() / 1000);

            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', emailNormalized: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', userId: '1'})").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '1'})")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false})")
                .end({}).getCommand());

            // User 2
            commands.push(db.cypher().create("(:User {name: 'user2 Meier2', userId: '2'})").end().getCommand());
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
                "(message)-[:WRITTEN]->(u2)," +
                "(message2)-[:WRITTEN]->(u)," +
                "(message3)-[:WRITTEN]->(u2)," +
                "(message4)-[:WRITTEN]->(u)")
                .end({
                    messageAdded: startTime - 299,
                    messageAdded2: startTime - 400,
                    messageAdded3: startTime - 600,
                    messageAdded4: startTime - 700
                }).getCommand());

            // User 3
            commands.push(db.cypher().create("(:User {name: 'user3 Meier3', userId: '3'})").end().getCommand());
            //Create Thread with messages between user 2 + 3
            commands.push(db.cypher().match("(u:User {userId: '2'}), (u2:User {userId: '3'})")
                .create("(u2)-[:ACTIVE {lastTimeVisited: {lastTimeVisited2}}]->(:Thread {threadId: '2'})<-[:ACTIVE {lastTimeVisited: {lastTimeVisited}}]-(u)")
                .end({
                    lastTimeVisited: startTime - 500,
                    lastTimeVisited2: startTime - 400
                }).getCommand());
            commands.push(db.cypher().match("(thread:Thread {threadId: '2'}), (u:User {userId: '2'}), (u2:User {userId: '3'})")
                .create("(thread)-[:NEXT_MESSAGE]->(message:Message {messageAdded: {messageAdded}, text: 'message1'})," +
                "(message)-[:WRITTEN]->(u)")
                .end({
                    messageAdded: startTime - 299
                }).getCommand());

            // User 4
            commands.push(db.cypher().create("(:User {name: 'user4 Meier4', userId: '4'})").end().getCommand());
            //Create Thread with messages between user 1 + 4 but user 1 is blocked by user 4
            commands.push(db.cypher().match("(u:User {userId: '1'}), (u2:User {userId: '4'})")
                .create("(u2)-[:ACTIVE {lastTimeVisited: {lastTimeVisited2}}]->(:Thread {threadId: '3'})<-[:ACTIVE {lastTimeVisited: {lastTimeVisited}}]-(u)")
                .end({
                    lastTimeVisited: startTime - 500,
                    lastTimeVisited2: startTime - 400
                }).getCommand());
            commands.push(db.cypher().match("(thread:Thread {threadId: '3'}), (u:User {userId: '1'}), (u2:User {userId: '4'})")
                .create("(thread)-[:NEXT_MESSAGE]->(message:Message {messageAdded: {messageAdded}, text: 'message1'})," +
                "(message)-[:WRITTEN]->(u)")
                .end({
                    messageAdded: startTime - 299
                }).getCommand());
            commands.push(db.cypher().match("(u:User {userId: '1'}), (u2:User {userId: '4'})")
                .create("(u2)-[:IS_BLOCKED]->(u)")
                .end({}).getCommand());

            // User 5
            commands.push(db.cypher().create("(:User {name: 'user5 Meier5', userId: '5'})").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '1'}), (u2:User {userId: '5'})")
                .create("(u2)-[:IS_BLOCKED]->(u)")
                .end({}).getCommand());

            return db.cypher().create("(:User {name: 'user6 Meier6', userId: '6'})").end().send(commands);
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Sending a new message to a thread - Return 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/messages/conversation', {
                addMessageThread: {
                    threadId: '1',
                    text: 'messageAdded'
                }
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.message.name.should.equal("user Meier");
            res.body.message.text.should.equal("messageAdded");
            res.body.message.timestamp.should.be.at.least(startTime);
            return db.cypher().match("(user:User {userId: '1'})-[active:ACTIVE]->(thread:Thread {threadId: '1'})-[:NEXT_MESSAGE]->(message:Message)-[:WRITTEN]->(written:User)")
                .return('message.messageAdded AS messageAdded, message.text AS text, written.userId as userId, active.lastTimeVisited AS lastTimeVisited')
                .end().send();
        }).then(function (thread) {
            thread.length.should.equals(1);
            thread[0].messageAdded.should.be.at.least(startTime);
            thread[0].lastTimeVisited.should.equals(startTime - 500);
            thread[0].text.should.be.equals("messageAdded");
            thread[0].userId.should.be.equals("1");
        });
    });

    it('Sending a new message to a single thread one which the user does not participate- Return 400', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/messages/conversation', {
                addMessageToThread: {
                    threadId: '2',
                    text: 'messageAdded'
                }
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });

    it('Sending a new message to a thread to contact which has blocked user- Return 400', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/messages/conversation', {
                addMessageToThread: {
                    threadId: '3',
                    text: 'messageAdded'
                }
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });

    it('Sending a new message to a user with existing thread - Return 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/messages/conversation', {
                addMessageUser: {
                    userId: '2',
                    text: 'messageAdded'
                }
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.message.name.should.equal("user Meier");
            res.body.message.text.should.equal("messageAdded");
            res.body.message.timestamp.should.be.at.least(startTime);
            res.body.message.threadId.should.equal("1");
            return db.cypher().match("(user:User {userId: '1'})-[active:ACTIVE]->(thread:Thread {threadId: '1'})-[:NEXT_MESSAGE]->(message:Message)-[:WRITTEN]->(written:User)")
                .return('message.messageAdded AS messageAdded, message.text AS text, written.userId as userId, active.lastTimeVisited AS lastTimeVisited')
                .end().send();
        }).then(function (thread) {
            thread.length.should.equals(1);
            thread[0].messageAdded.should.be.at.least(startTime);
            thread[0].lastTimeVisited.should.equals(startTime - 500);
            thread[0].text.should.be.equals("messageAdded");
            thread[0].userId.should.be.equals("1");
        });
    });

    it('Sending a new message to a user with no existing thread - Return 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/messages/conversation', {
                addMessageUser: {
                    userId: '6',
                    text: 'messageAdded'
                }
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.message.name.should.equal("user Meier");
            res.body.message.text.should.equal("messageAdded");
            res.body.message.timestamp.should.be.at.least(startTime);
            return db.cypher().match("(user:User {userId: '1'})-[active:ACTIVE]->(thread:Thread {threadId: '" + res.body.message.threadId + "'})-[:NEXT_MESSAGE]->(message:Message)-[:WRITTEN]->(written:User)")
                .return('message.messageAdded AS messageAdded, message.text AS text, written.userId as userId, active.lastTimeVisited AS lastTimeVisited')
                .end().send();
        }).then(function (thread) {
            thread.length.should.equals(1);
            thread[0].messageAdded.should.be.at.least(startTime);
            thread[0].lastTimeVisited.should.be.at.least(startTime);
            thread[0].text.should.be.equals("messageAdded");
            thread[0].userId.should.be.equals("1");
        });
    });

    it('Sending a new message to another user which has blocked user (without Thread)- Return 400', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/messages/conversation', {
                addMessageUser: {
                    userId: '5',
                    text: 'messageAdded'
                }
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });

    it('Sending a new message to another user which has blocked user (with Thread)- Return 400', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/messages/conversation', {
                addMessageUser: {
                    userId: '4',
                    text: 'messageAdded'
                }
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });

});
