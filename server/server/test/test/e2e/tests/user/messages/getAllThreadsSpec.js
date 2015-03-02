'use strict';

var app = require('../../../../../../server');
var users = require('../../util/user');
var db = require('../../util/db');
var requestHandler = require('../../util/request');
var should = require('chai').should();
var moment = require('moment');

describe('Integration Tests for getting all threads of a user', function () {

    var requestAgent, startTime;

    beforeEach(function () {

        return db.clearDatabase().then(function () {
            var commands = [];
            startTime = Math.floor(moment.utc().valueOf() / 1000);

            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '1234', name: 'user Meier', userId: '1'})").end().getCommand());

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
                    "-[:NEXT_MESSAGE]->(message3:Message {messageAdded: {messageAdded3}, text: 'message3'})," +
                    "(message)-[:WRITTEN]->(u)," +
                    "(message2)-[:WRITTEN]->(u)," +
                    "(message3)-[:WRITTEN]->(u2)")
                .end({
                    messageAdded: startTime - 299,
                    messageAdded2: startTime - 400,
                    messageAdded3: startTime - 600
                }).getCommand());
            commands.push(db.cypher().match("(u:User {userId: '2'})")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: true})")
                .end({}).getCommand());
            commands.push(db.cypher().match("(u:User {userId: '2'})")
                .create("(u)-[:HAS_PRIVACY {type: 'Familie'}]->(:Privacy {profile: false, image: false})")
                .end({}).getCommand());
            commands.push(db.cypher().match("(u:User), (u2:User)")
                .where("u.userId = '1' AND u2.userId = '2'")
                .create("(u2)-[:IS_CONTACT {type: 'Familie'}]->(u)")
                .end({}).getCommand());
            // User 3
            commands.push(db.cypher().create("(:User {name: 'user3 Meier3', userId: '3'})").end().getCommand());
            //Create Thread with messages between user 1 + 3
            commands.push(db.cypher().match("(u:User {userId: '1'}), (u2:User {userId: '3'})")
                .create("(u2)-[:ACTIVE {lastTimeVisited: {lastTimeVisited2}}]->(:Thread {threadId: '2'})<-[:ACTIVE {lastTimeVisited: {lastTimeVisited}}]-(u)")
                .end({
                    lastTimeVisited: startTime - 200,
                    lastTimeVisited2: startTime - 400
                }).getCommand());
            commands.push(db.cypher().match("(thread:Thread {threadId: '2'}), (u:User {userId: '1'}), (u2:User {userId: '3'})")
                .create("(thread)-[:NEXT_MESSAGE]->(message:Message {messageAdded: {messageAdded}, text: 'message1'})" +
                    "-[:NEXT_MESSAGE]->(message2:Message {messageAdded: {messageAdded2}, text: 'message2'})" +
                    "-[:NEXT_MESSAGE]->(message3:Message {messageAdded: {messageAdded3}, text: 'message3'})," +
                    "(message)-[:WRITTEN]->(u)," +
                    "(message2)-[:WRITTEN]->(u2)," +
                    "(message3)-[:WRITTEN]->(u)")
                .end({
                    messageAdded: startTime - 301,
                    messageAdded2: startTime - 400,
                    messageAdded3: startTime - 600
                }).getCommand());
            commands.push(db.cypher().match("(u:User {userId: '3'})")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: true})")
                .end({}).getCommand());
            // User 4
            commands.push(db.cypher().create("(:User {name: 'user4 Meier4', userId: '4'})").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '1'}), (u2:User {userId: '2'}), (u3:User {userId: '3'}), (u4:User {userId: '4'})")
                .create("(u)-[:IS_ADMIN]->(groupThread:GroupThread {threadId: '3', description: 'TestChat'})<-[:ACTIVE {lastTimeVisited: {lastTimeVisited}}]-(u)," +
                "(u2)-[:ACTIVE {lastTimeVisited: {lastTimeVisited2}}]->(groupThread)," +
                "(u3)-[:ACTIVE {lastTimeVisited: {lastTimeVisited3}}]->(groupThread)," +
                "(u4)-[:ACTIVE {lastTimeVisited: {lastTimeVisited4}}]->(groupThread)")
                .end({
                    lastTimeVisited: startTime - 650,
                    lastTimeVisited2: startTime - 400,
                    lastTimeVisited3: startTime - 401,
                    lastTimeVisited4: startTime - 402
                }).getCommand());
            commands.push(db.cypher().match("(u:User {userId: '4'})")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false})")
                .end({}).getCommand());
            return db.cypher().match("(thread:GroupThread {threadId: '3'}), (u:User {userId: '1'}), (u3:User {userId: '3'}), (u4:User {userId: '4'})")
                .create("(thread)-[:NEXT_MESSAGE]->(message:Message {messageAdded: {messageAdded}, text: 'message1'})" +
                "-[:NEXT_MESSAGE]->(message2:Message {messageAdded: {messageAdded2}, text: 'message2'})" +
                "-[:NEXT_MESSAGE]->(message3:Message {messageAdded: {messageAdded3}, text: 'message3'})" +
                "-[:NEXT_MESSAGE]->(message4:Message {messageAdded: {messageAdded4}, text: 'message4'})," +
                "(message)-[:WRITTEN]->(u)," +
                "(message2)-[:WRITTEN]->(u3)," +
                "(message3)-[:WRITTEN]->(u4)," +
                "(message4)-[:WRITTEN]->(u4)")
                .end({
                    messageAdded: startTime - 300,
                    messageAdded2: startTime - 400,
                    messageAdded3: startTime - 600,
                    messageAdded4: startTime - 700
                }).send(commands);
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting all threads for the user - Return 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/messages', {
                itemsPerPage: 10,
                skip: 0
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.threads.length.should.equal(3);
            res.body.threads[0].hasNotReadMessages.should.be.true;
            res.body.threads[0].description.should.equal("user2 Meier2");
            res.body.threads[0].previewText.should.equal("message1");
            res.body.threads[0].lastUpdate.should.equal(startTime - 299);
            //cms/default/profile/thumbnail.jpg
            res.body.threads[0].profileUrl.should.contain("?path=008bd291347d6c3f205beb0bfbef19d4a35d8bb2d9ebd85466ac437f9b9e37698e5f&expires");
            res.body.threads[0].threadId.should.equal('1');
            res.body.threads[0].isGroupThread.should.be.false;
            res.body.threads[0].numberOfUnreadMessages.should.equal(2);

            res.body.threads[1].hasNotReadMessages.should.be.true;
            res.body.threads[1].description.should.equal("TestChat");
            res.body.threads[1].previewText.should.equal("message1");
            res.body.threads[1].lastUpdate.should.equal(startTime - 300);
            //cms/default/profile/thumbnail.jpg
            res.body.threads[1].profileUrl.should.contain("?path=008bd291347d6c3f205beb0bfbef19d4a35d8bb2d9ebd85466ac437f9b9e37698e5f&expires");
            res.body.threads[1].threadId.should.equal('3');
            res.body.threads[1].isGroupThread.should.be.true;
            res.body.threads[1].numberOfUnreadMessages.should.equal(3);

            res.body.threads[2].hasNotReadMessages.should.be.false;
            res.body.threads[2].description.should.equal("user3 Meier3");
            res.body.threads[2].previewText.should.equal("message1");
            res.body.threads[2].lastUpdate.should.equal(startTime - 301);
            //cms/3/profile/thumbnail.jpg
            res.body.threads[2].profileUrl.should.contain("?path=57c1c4822e77717c3506f41ffde51597b67f96b1c6eed8733aa34571&expires");
            res.body.threads[2].threadId.should.equal('2');
            res.body.threads[2].isGroupThread.should.be.false;

            res.body.numberOfUnreadMessages.should.equal(5);
        });
    });

    it('Getting threads for the user and limit and skip correctly - Return 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/messages', {
                itemsPerPage: 2,
                skip: 1
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.threads.length.should.equal(2);

            res.body.threads[0].hasNotReadMessages.should.be.true;
            res.body.threads[0].description.should.equal("TestChat");
            res.body.threads[0].previewText.should.equal("message1");
            res.body.threads[0].lastUpdate.should.equal(startTime - 300);
            res.body.threads[0].threadId.should.equal('3');
            res.body.threads[0].isGroupThread.should.be.true;
            res.body.threads[0].numberOfUnreadMessages.should.equal(3);

            res.body.threads[1].hasNotReadMessages.should.be.false;
            res.body.threads[1].description.should.equal("user3 Meier3");
            res.body.threads[1].previewText.should.equal("message1");
            res.body.threads[1].lastUpdate.should.equal(startTime - 301);
            res.body.threads[1].threadId.should.equal('2');
            res.body.threads[1].isGroupThread.should.be.false;

            res.body.numberOfUnreadMessages.should.equal(5);
        });
    });

});
