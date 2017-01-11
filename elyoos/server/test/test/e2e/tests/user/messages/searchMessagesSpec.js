'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let should = require('chai').should();
let moment = require('moment');

describe('Integration Tests for searching message threads or users', function () {

    let requestAgent, startTime;

    beforeEach(function () {

        return db.clearDatabase().then(function () {
            let commands = [];
            startTime = Math.floor(moment.utc().valueOf() / 1000);

            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', userId: '1'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user2 Meier2', forename: 'user2', surname: 'Meier2', userId: '2'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user3 Meier3', forename: 'user3', surname: 'Meier3', userId: '3'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'Hans Wurst', forename: 'Hans', surname: 'Wurst', userId: '4'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user5 Meier5', forename: 'user5', surname: 'Meier5', userId: '5'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'rUser rMeier', forename: 'rUser', surname: 'rMeier', userId: '6'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'sUser Meier7', forename: 'sUser', surname: 'Meier7', userId: '7'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'luser Meier1', forename: 'luser', surname: 'Meier1', userId: '8'})").end().getCommand());

            //Set Privacy
            commands.push(db.cypher().match("(u:User)")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false})").end({}).getCommand());
            commands.push(db.cypher().match("(u:User)-[:HAS_PRIVACY_NO_CONTACT]->(p:Privacy)").where("u.userId IN ['8']")
                .set("p", {profile: true, image: true}).end({}).getCommand());
            commands.push(db.cypher().match("(u:User)").where("u.userId IN ['1', '3']")
                .create("(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})").end().getCommand());
            commands.push(db.cypher().match("(u:User)").where("u.userId IN ['7']")
                .create("(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: false, image: false})").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '5'})")
                .create("(u)-[:HAS_PRIVACY {type: 'Freund2'}]->(:Privacy {profile: true, image: true})")
                .end().getCommand());

            //Set Contact Relationships
            commands.push(db.cypher().match("(u:User {userId: '1'}), (u2:User {userId: '3'})")
                .create("(u)-[:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(u2)")
                .end({contactAdded: startTime}).getCommand());
            commands.push(db.cypher().match("(u:User {userId: '3'}), (u2:User {userId: '1'})")
                .create("(u)-[:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(u2)")
                .end({contactAdded: startTime}).getCommand());
            commands.push(db.cypher().match("(u:User {userId: '1'}), (u2:User {userId: '5'})")
                .create("(u)-[:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(u2)")
                .end({contactAdded: startTime}).getCommand());
            commands.push(db.cypher().match("(u:User {userId: '5'}), (u2:User {userId: '1'})")
                .create("(u)-[:IS_CONTACT {type: 'Freund2', contactAdded: {contactAdded}}]->(u2)")
                .end({contactAdded: startTime}).getCommand());
            commands.push(db.cypher().match("(u:User {userId: '1'}), (u2:User {userId: '6'})")
                .create("(u)-[:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(u2)")
                .end({contactAdded: startTime}).getCommand());
            commands.push(db.cypher().match("(u:User {userId: '7'}), (u2:User {userId: '1'})")
                .create("(u)-[:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(u2)")
                .end({contactAdded: startTime}).getCommand());

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

            //Create Thread with messages between user 1 + 4
            commands.push(db.cypher().match("(u:User {userId: '1'}), (u2:User {userId: '4'})")
                .create("(u2)-[:ACTIVE {lastTimeVisited: {lastTimeVisited2}}]->(:Thread {threadId: '3'})<-[:ACTIVE {lastTimeVisited: {lastTimeVisited}}]-(u)")
                .end({
                    lastTimeVisited: startTime - 500,
                    lastTimeVisited2: startTime - 400
                }).getCommand());
            return db.cypher().match("(thread:Thread {threadId: '3'}), (u:User {userId: '1'}), (u2:User {userId: '4'})")
                .create("(thread)-[:NEXT_MESSAGE]->(message:Message {messageAdded: {messageAdded}, text: 'message1'})," +
                    "(message)-[:WRITTEN]->(u)")
                .end({
                    messageAdded: startTime - 299
                }).send(commands);

        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Search surname of user when suggestion mode is off- Return 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/messages/search', {
                search: 'Meier',
                maxItems: 10,
                isSuggestion: false
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.threads.length.should.equal(5);
            res.body.threads[0].description.should.equal("user2 Meier2");
            res.body.threads[0].threadId.should.equal("1");
            res.body.threads[0].lastUpdate.should.equal(startTime - 299);
            should.not.exist(res.body.threads[0].type);
            res.body.threads[0].previewText.should.equal("message1");
            res.body.threads[0].profileUrl.should.equal("profileImage/default/profilePreview.jpg");

            res.body.threads[1].description.should.equal("user3 Meier3");
            res.body.threads[1].threadId.should.equal("2");
            res.body.threads[1].lastUpdate.should.equal(startTime - 299);
            res.body.threads[1].type.should.equal('Freund');
            res.body.threads[1].previewText.should.equal("message1");
            res.body.threads[1].profileUrl.should.equal('profileImage/3/profilePreview.jpg');

            res.body.threads[2].description.should.equal("user5 Meier5");
            res.body.threads[2].userId.should.equal("5");
            should.not.exist(res.body.threads[2].threadId);
            should.not.exist(res.body.threads[2].lastUpdate);
            res.body.threads[2].type.should.equal("Freund");
            res.body.threads[2].profileUrl.should.equal("profileImage/5/profilePreview.jpg");
            should.not.exist(res.body.threads[2].previewText);

            res.body.threads[3].description.should.equal("luser Meier1");
            res.body.threads[3].userId.should.equal("8");
            should.not.exist(res.body.threads[3].type);
            should.not.exist(res.body.threads[3].threadId);
            should.not.exist(res.body.threads[3].lastUpdate);
            res.body.threads[3].profileUrl.should.equal("profileImage/8/profilePreview.jpg");
            should.not.exist(res.body.threads[3].previewText);

            res.body.threads[4].description.should.equal("sUser Meier7");
            res.body.threads[4].userId.should.equal("7");
            should.not.exist(res.body.threads[4].type);
            should.not.exist(res.body.threads[4].threadId);
            should.not.exist(res.body.threads[4].lastUpdate);
            res.body.threads[4].profileUrl.should.equal("profileImage/default/profilePreview.jpg");
            should.not.exist(res.body.threads[4].previewText);
        });
    });

    it('Search surname of user when suggestion mode is on- Return 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/messages/search', {
                search: 'Meier',
                maxItems: 10,
                isSuggestion: true
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.length.should.equal(5);
            res.body[0].description.should.equal("user2 Meier2");
            should.not.exist(res.body[0].threadId);
            should.not.exist(res.body[0].type);
            should.not.exist(res.body[0].previewText);
            should.not.exist(res.body[0].profileUrl);

            res.body[1].description.should.equal("user3 Meier3");
            should.not.exist(res.body[1].threadId);
            should.not.exist(res.body[1].type);
            should.not.exist(res.body[1].previewText);
            should.not.exist(res.body[1].profileUrl);

            res.body[2].description.should.equal("user5 Meier5");
            should.not.exist(res.body[2].threadId);
            should.not.exist(res.body[2].type);
            should.not.exist(res.body[2].previewText);
            should.not.exist(res.body[2].profileUrl);

            res.body[3].description.should.equal("luser Meier1");
            should.not.exist(res.body[3].threadId);
            should.not.exist(res.body[3].type);
            should.not.exist(res.body[3].previewText);
            should.not.exist(res.body[3].profileUrl);

            res.body[4].description.should.equal("sUser Meier7");
            should.not.exist(res.body[4].threadId);
            should.not.exist(res.body[4].type);
            should.not.exist(res.body[4].previewText);
            should.not.exist(res.body[4].profileUrl);
        });
    });

    it('Search forename of user when suggestion mode is off- Return 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/messages/search', {
                search: 'user',
                maxItems: 10,
                isSuggestion: false
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.threads.length.should.equal(3);
            res.body.threads[0].description.should.equal("user2 Meier2");
            res.body.threads[0].threadId.should.equal("1");
            res.body.threads[0].lastUpdate.should.equal(startTime - 299);
            should.not.exist(res.body.threads[0].type);
            res.body.threads[0].previewText.should.equal("message1");
            res.body.threads[0].profileUrl.should.equal("profileImage/default/profilePreview.jpg");

            res.body.threads[1].description.should.equal("user3 Meier3");
            res.body.threads[1].threadId.should.equal("2");
            res.body.threads[1].lastUpdate.should.equal(startTime - 299);
            res.body.threads[1].type.should.equal('Freund');
            res.body.threads[1].previewText.should.equal("message1");
            res.body.threads[1].profileUrl.should.equal('profileImage/3/profilePreview.jpg');

            res.body.threads[2].description.should.equal("user5 Meier5");
            res.body.threads[2].userId.should.equal("5");
            should.not.exist(res.body.threads[2].threadId);
            should.not.exist(res.body.threads[2].lastUpdate);
            res.body.threads[2].type.should.equal("Freund");
            res.body.threads[2].profileUrl.should.equal("profileImage/5/profilePreview.jpg");
            should.not.exist(res.body.threads[2].previewText);
        });
    });

    it('Search forename of user when suggestion mode is on- Return 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/messages/search', {
                search: 'user',
                maxItems: 10,
                isSuggestion: true
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.length.should.equal(3);
            res.body[0].description.should.equal("user2 Meier2");
            should.not.exist(res.body[0].threadId);
            should.not.exist(res.body[0].type);
            should.not.exist(res.body[0].previewText);
            should.not.exist(res.body[0].profileUrl);

            res.body[1].description.should.equal("user3 Meier3");
            should.not.exist(res.body[1].threadId);
            should.not.exist(res.body[1].type);
            should.not.exist(res.body[1].previewText);
            should.not.exist(res.body[1].profileUrl);

            res.body[2].description.should.equal("user5 Meier5");
            should.not.exist(res.body[2].threadId);
            should.not.exist(res.body[2].type);
            should.not.exist(res.body[2].previewText);
            should.not.exist(res.body[2].profileUrl);
        });
    });
});
