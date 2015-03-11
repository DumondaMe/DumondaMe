'use strict';

var app = require('../../../../../../server');
var users = require('../../util/user');
var db = require('../../util/db');
var requestHandler = require('../../util/request');
var should = require('chai').should();
var moment = require('moment');

describe('Integration Tests for searching messages or user contacts', function () {

    var requestAgent, startTime;

    beforeEach(function () {

        return db.clearDatabase().then(function () {
            var commands = [];
            startTime = Math.floor(moment.utc().valueOf() / 1000);

            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', userId: '1'})").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '1'})")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false})")
                .end({}).getCommand());
            commands.push(db.cypher().match("(u:User {userId: '1'})")
                .create("(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})")
                .end().getCommand());

            // User 2
            commands.push(db.cypher().create("(:User {name: 'user2 Meier2', userId: '2'})").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '2'})")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false})")
                .end({}).getCommand());
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
            commands.push(db.cypher().match("(u:User {userId: '3'})")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false})")
                .end({}).getCommand());
            //Create Thread with messages between user 1 + 3
            commands.push(db.cypher().match("(u:User {userId: '1'}), (u2:User {userId: '3'})")
                .create("(u2)-[:ACTIVE {lastTimeVisited: {lastTimeVisited2}}]->(:Thread {threadId: '2'})<-[:ACTIVE {lastTimeVisited: {lastTimeVisited}}]-(u)")
                .end({
                    lastTimeVisited: startTime - 500,
                    lastTimeVisited2: startTime - 400
                }).getCommand());
            commands.push(db.cypher().match("(thread:Thread {threadId: '2'}), (u:User {userId: '1'}), (u2:User {userId: '3'})")
                .create("(thread)-[:NEXT_MESSAGE]->(message:Message {messageAdded: {messageAdded}, text: 'message1'})," +
                "(message)-[:WRITTEN]->(u)")
                .end({
                    messageAdded: startTime - 299
                }).getCommand());
            commands.push(db.cypher().match("(u:User {userId: '3'})")
                .create("(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})")
                .end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '3'}), (u2:User {userId: '1'})")
                .create("(u)-[:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(u2)")
                .end({contactAdded: startTime}).getCommand());
            // User 4
            commands.push(db.cypher().create("(:User {name: 'Hans Wurst', userId: '4'})").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '4'})")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false})")
                .end({}).getCommand());
            //Create Thread with messages between user 1 + 4
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

            // User 5
            commands.push(db.cypher().create("(:User {name: 'user5 Meier5', userId: '5'})").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '5'})")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false})")
                .end({}).getCommand());
            commands.push(db.cypher().match("(u:User {userId: '5'})")
                .create("(u)-[:HAS_PRIVACY {type: 'Freund2'}]->(:Privacy {profile: true, image: true})")
                .end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '1'}), (u2:User {userId: '5'})")
                .create("(u)-[:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(u2)")
                .end({contactAdded: startTime}).getCommand());
            commands.push(db.cypher().match("(u:User {userId: '5'}), (u2:User {userId: '1'})")
                .create("(u)-[:IS_CONTACT {type: 'Freund2', contactAdded: {contactAdded}}]->(u2)")
                .end({contactAdded: startTime}).getCommand());
            // User 6
            commands.push(db.cypher().create("(:User {name: 'irgenwas', userId: '6'})").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '6'})")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false})")
                .end({}).getCommand());
            commands.push(db.cypher().match("(u:User {userId: '1'}), (u2:User {userId: '6'})")
                .create("(u)-[:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(u2)")
                .end({contactAdded: startTime}).getCommand());

            //Create GroupThread with messages between user 1 + 2 + 3
            return db.cypher().match("(u:User {userId: '1'}), (u2:User {userId: '2'}), (u3:User {userId: '3'})")
                .create("(thread:GroupThread {threadId: '1', description: 'Meier Chat'})-[:NEXT_MESSAGE]->(message:Message {messageAdded: {messageAdded}, text: 'message1'})" +
                "-[:NEXT_MESSAGE]->(message2:Message {messageAdded: {messageAdded2}, text: 'message2'})" +
                "-[:NEXT_MESSAGE]->(message3:Message {messageAdded: {messageAdded3}, text: 'message3'})" +
                "-[:NEXT_MESSAGE]->(message4:Message {messageAdded: {messageAdded4}, text: 'message4'})," +
                "(message)-[:WRITTEN]->(u2)," +
                "(message2)-[:WRITTEN]->(u)," +
                "(message3)-[:WRITTEN]->(u)," +
                "(message4)-[:WRITTEN]->(u)," +
                "(u)-[:ACTIVE {lastTimeVisited: {lastTimeVisited}}]->(thread)," +
                "(u2)-[:ACTIVE {lastTimeVisited: {lastTimeVisited}}]->(thread)," +
                "(u3)-[:ACTIVE {lastTimeVisited: {lastTimeVisited}}]->(thread)")
                .end({
                    messageAdded: startTime - 300,
                    messageAdded2: startTime - 400,
                    messageAdded3: startTime - 600,
                    messageAdded4: startTime - 3602,
                    lastTimeVisited: startTime - 300
                }).send(commands);
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Search messages of a user when suggestion mode is off- Return 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/messages/search', {
                search: 'Meier',
                maxItems: 10,
                isSuggestion: false
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.threads.length.should.equal(4);
            res.body.threads[0].description.should.equal("user2 Meier2");
            res.body.threads[0].threadId.should.equal("1");
            res.body.threads[0].isGroupThread.should.be.false;
            res.body.threads[0].previewText.should.equal("message1");
            //cms/default/profile/thumbnail.jpg
            res.body.threads[0].profileUrl.should.contain("?path=008bd291347d6c3f205beb0bfbef19d4a35d8bb2d9ebd85466ac437f9b9e37698e5f&expires");
            res.body.threads[1].description.should.equal("user3 Meier3");
            res.body.threads[1].threadId.should.equal("2");
            res.body.threads[1].isGroupThread.should.be.false;
            res.body.threads[1].previewText.should.equal("message1");
            //cms/3/profile/thumbnail.jpg
            res.body.threads[1].profileUrl.should.contain("?path=57c1c4822e77717c3506f41ffde51597b67f96b1c6eed8733aa34571&expires");
            res.body.threads[2].description.should.equal("Meier Chat");
            res.body.threads[2].threadId.should.equal("1");
            res.body.threads[2].isGroupThread.should.be.true;
            res.body.threads[2].previewText.should.equal("message1");
            //cms/default/profile/thumbnail.jpg
            res.body.threads[2].profileUrl.should.contain("?path=008bd291347d6c3f205beb0bfbef19d4a35d8bb2d9ebd85466ac437f9b9e37698e5f&expires");
            res.body.threads[3].description.should.equal("user5 Meier5");
            res.body.threads[3].userId.should.equal("5");
            //cms/5/profile/thumbnail.jpg
            res.body.threads[3].profileUrl.should.contain("?path=51c1c4822e77717c3506f41ffde51597b67f96b1c6eed8733aa34571&expires");
            should.not.exist(res.body.threads[3].previewText);
        });
    });

    it('Search messages of a user when suggestion mode is on- Return 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/messages/search', {
                search: 'Meier',
                maxItems: 10,
                isSuggestion: true
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.length.should.equal(4);
            res.body[0].name.should.equal("user2 Meier2");
            should.not.exist(res.body[0].threadId);
            should.not.exist(res.body[0].isGroupThread);
            should.not.exist(res.body[0].profileUrl);
            res.body[1].name.should.equal("user3 Meier3");
            should.not.exist(res.body[1].threadId);
            should.not.exist(res.body[1].isGroupThread);
            should.not.exist(res.body[1].profileUrl);
            res.body[2].name.should.equal("Meier Chat");
            should.not.exist(res.body[2].threadId);
            should.not.exist(res.body[2].isGroupThread);
            should.not.exist(res.body[2].profileUrl);
            res.body[3].name.should.equal("user5 Meier5");
            should.not.exist(res.body[3].userId);
            should.not.exist(res.body[3].profileUrl);
        });
    });
});
