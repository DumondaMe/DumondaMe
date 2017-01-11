'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');

describe('Integration Tests for getting messages of a conversation for a user', function () {

    let requestAgent, startTime;

    beforeEach(function () {

        return db.clearDatabase().then(function () {
            let commands = [];
            startTime = Math.floor(moment.utc().valueOf() / 1000);

            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', userId: '1'})").end().getCommand());
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
                "(message)-[:WRITTEN]->(u)," +
                "(message2)-[:WRITTEN]->(u2)," +
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
            commands.push(db.cypher().match("(u:User {userId: '3'})")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})")
                .end({}).getCommand());
            commands.push(db.cypher().match("(u:User), (u2:User)")
                .where("u.userId = '1' AND u2.userId = '3'")
                .create("(u2)-[:IS_CONTACT {type: 'Freund'}]->(u)")
                .end({}).getCommand());

            // User 4
            commands.push(db.cypher().create("(:User {name: 'user4 Meier4', userId: '4'})").end().getCommand());
            //Create Thread with messages between user 1 + 4
            commands.push(db.cypher().match("(u:User {userId: '1'}), (u2:User {userId: '4'})")
                .create("(u2)-[:ACTIVE {lastTimeVisited: {lastTimeVisited2}}]->(:Thread {threadId: '3'})<-[:ACTIVE {lastTimeVisited: {lastTimeVisited}}]-(u)")
                .end({
                    lastTimeVisited: startTime - 500,
                    lastTimeVisited2: startTime - 400
                }).getCommand());
            commands.push(db.cypher().match("(thread:Thread {threadId: '3'}), (u:User {userId: '1'}), (u2:User {userId: '4'})")
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
            return db.cypher().match("(u:User {userId: '4'})")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false})")
                .end({}).send(commands);
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting the messages of a thread for the user - Return 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/messages/conversation', {
                maxItems: 10,
                skip: 0,
                threadId: '1'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.messages.length.should.equal(4);
            res.body.messages[0].name.should.equal("user Meier");
            res.body.messages[0].text.should.equal("message1");
            res.body.messages[0].timestamp.should.equal(startTime - 299);
            res.body.messages[0].isUser.should.equal(true);

            res.body.messages[1].name.should.equal("user2 Meier2");
            res.body.messages[1].text.should.equal("message2");
            res.body.messages[1].timestamp.should.equal(startTime - 400);
            res.body.messages[1].isUser.should.equal(false);

            res.body.messages[2].name.should.equal("user2 Meier2");
            res.body.messages[2].text.should.equal("message3");
            res.body.messages[2].timestamp.should.equal(startTime - 600);
            res.body.messages[2].isUser.should.equal(false);

            res.body.messages[3].name.should.equal("user Meier");
            res.body.messages[3].text.should.equal("message4");
            res.body.messages[3].timestamp.should.equal(startTime - 700);
            res.body.messages[3].isUser.should.equal(true);

            res.body.threadDescription.should.equal('user2 Meier2');
            res.body.userIdThreadDescription.should.equal('2');
            res.body.numberOfMessages.should.equal(4);
            res.body.totalUnreadMessages.should.equal(1);
            return db.cypher().match("(:User {userId: '1'})-[active:ACTIVE]->(thread:Thread {threadId: '1'})")
                .return('active.lastTimeVisited AS lastTimeVisited')
                .end().send();
        }).then(function (thread) {
            thread.length.should.equals(1);
            thread[0].lastTimeVisited.should.be.at.least(startTime);
        });
    });


    it('Getting the messages of a thread for the user with correct skip and limit- Return 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/messages/conversation', {
                maxItems: 2,
                skip: 1,
                threadId: '1'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.messages.length.should.equal(2);

            res.body.messages[0].name.should.equal("user2 Meier2");
            res.body.messages[0].text.should.equal("message2");
            res.body.messages[0].timestamp.should.equal(startTime - 400);
            res.body.messages[0].isUser.should.equal(false);

            res.body.messages[1].name.should.equal("user2 Meier2");
            res.body.messages[1].text.should.equal("message3");
            res.body.messages[1].timestamp.should.equal(startTime - 600);
            res.body.messages[1].isUser.should.equal(false);

            res.body.threadDescription.should.equal('user2 Meier2');
            res.body.userIdThreadDescription.should.equal('2');
            res.body.numberOfMessages.should.equal(4);
            res.body.totalUnreadMessages.should.equal(1);
        });
    });

    it('Trying to get access to a thread which user does not participate - Return 400', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/messages/conversation', {
                maxItems: 10,
                skip: 0,
                threadId: '2'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });

});
