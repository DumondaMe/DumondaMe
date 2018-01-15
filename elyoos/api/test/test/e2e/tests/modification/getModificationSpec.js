'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let should = require('chai').should();
let moment = require('moment');

describe('Integration Tests for getting modification info', function () {

    let startTime;

    beforeEach(function () {

        return db.clearDatabase().then(function () {
            let commands = [];
            startTime = Math.floor(moment.utc().valueOf() / 1000);

            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', emailNormalized: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', userId: '1'})").end().getCommand());

            // User 2
            commands.push(db.cypher().create("(:User {email: 'user2@irgendwo.ch', emailNormalized: 'user2@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user2 Meier2', userId: '2'})").end().getCommand());
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
            commands.push(db.cypher().match("(u:User {userId: '2'})")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false})")
                .end({}).getCommand());

            // User 3
            commands.push(db.cypher().create("(:User {name: 'user3 Meier3', userId: '3'})").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '3'})")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: true})")
                .end({}).getCommand());

            //Create Thread with messages between user 1 + 3
            return db.cypher().match("(u:User {userId: '1'}), (u2:User {userId: '3'})")
                .create("(thread:Thread {threadId: '2'})-[:NEXT_MESSAGE]->(message:Message {messageAdded: {messageAdded}, text: 'message1'})" +
                "-[:NEXT_MESSAGE]->(message2:Message {messageAdded: {messageAdded2}, text: 'message2'})" +
                "-[:NEXT_MESSAGE]->(message3:Message {messageAdded: {messageAdded3}, text: 'message3'})" +
                "-[:NEXT_MESSAGE]->(message4:Message {messageAdded: {messageAdded4}, text: 'message4'})," +
                "(message)-[:WRITTEN]->(u)," +
                "(message2)-[:WRITTEN]->(u2)," +
                "(message3)-[:WRITTEN]->(u)," +
                "(message4)-[:WRITTEN]->(u2)," +
                "(u)-[:ACTIVE {lastTimeVisited: {lastTimeVisited}}]->(thread)," +
                "(u2)-[:ACTIVE {lastTimeVisited: {lastTimeVisited}}]->(thread)")
                .end({
                    messageAdded: startTime - 300,
                    messageAdded2: startTime - 400,
                    messageAdded3: startTime - 600,
                    messageAdded4: startTime - 700,
                    lastTimeVisited: startTime - 401
                }).send(commands);
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Only when new message is sent to the user then return message has changed - Return 200', function () {
        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.get('/api/modification');
        }).then(function (res) {
            res.status.should.equal(200);
            should.not.exist(res.body.hasChanged);
            return requestHandler.login(users.validUser2);
        }).then(function () {
            return requestHandler.post('/api/user/messages/conversation', {
                addMessageThread: {
                    threadId: '1',
                    text: 'messageAdded'
                }
            });
        }).then(function () {
            return requestHandler.logout();
        }).then(function () {
            return requestHandler.get('/api/modification');
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.hasChanged.should.be.true;
            res.body.messages.length.should.equals(2);
            res.body.messages[0].threadId.should.equals('1');
            res.body.messages[0].description.should.equals('user2 Meier2');
            res.body.messages[0].previewText.should.equals('messageAdded');
            res.body.messages[0].lastUpdate.should.least(startTime);
            res.body.messages[0].profileUrl.should.equals('profileImage/default/thumbnail.jpg');
            res.body.messages[0].numberOfUnreadMessages.should.equals(2);

            res.body.messages[1].threadId.should.equals('2');
            res.body.messages[1].description.should.equals('user3 Meier3');
            res.body.messages[1].previewText.should.equals('message1');
            res.body.messages[1].lastUpdate.should.equals(startTime - 300);
            res.body.messages[1].profileUrl.should.equals('profileImage/3/thumbnail.jpg');
            res.body.messages[1].numberOfUnreadMessages.should.equals(1);
            res.body.totalUnreadMessages.should.equal(3);
            return requestHandler.get('/api/modification');
        }).then(function (res) {
            res.status.should.equal(200);
            should.not.exist(res.body.hasChanged);
        });
    });

    it('When forcing is true then return for every request the value - Return 200', function () {
        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.get('/api/modification', {forceShowModification: true});
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.messages.length.should.equals(2);
        });
    });

    it('If the user sends a message then modification returns false - Return 200', function () {
        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.get('/api/modification');
        }).then(function (res) {
            res.status.should.equal(200);
            should.not.exist(res.body.hasChanged);
            return requestHandler.post('/api/user/messages/conversation', {
                addMessageThread: {
                    threadId: '1',
                    text: 'messageAdded'
                }
            });
        }).then(function () {
            return requestHandler.get('/api/modification');
        }).then(function (res) {
            res.status.should.equal(200);
            should.not.exist(res.body.hasChanged);
        });
    });

    it('If the user opens a thread then modification returns false - Return 200', function () {
        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.get('/api/modification');
        }).then(function (res) {
            res.status.should.equal(200);
            should.not.exist(res.body.hasChanged);
            return requestHandler.get('/api/user/messages/conversation', {
                maxItems: 10,
                skip: 0,
                threadId: '1'
            });
        }).then(function (res) {
            res.status.should.equal(200);
            return requestHandler.get('/api/modification');
        }).then(function (res) {
            res.status.should.equal(200);
            should.not.exist(res.body.hasChanged);
        });
    });
});