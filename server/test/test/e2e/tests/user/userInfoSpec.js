'use strict';

var libUser = require('../../../../../lib/user')();
var users = require('../util/user');
var requestHandler = require('../util/request');
var db = require('../util/db');
var moment = require('moment');

describe('Integration Tests User Name', function () {

    beforeEach(function () {

        libUser.removeFromCache('user@irgendwo.ch');

        return db.clearDatabase().then(function () {

            var commands = [], startTime = Math.floor(moment.utc().valueOf() / 1000);
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', userId:'1'})").end().getCommand());

            commands.push(db.cypher().match("(u:User {userId: '1'})")
                .create("(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})")
                .end().getCommand());

            commands.push(db.cypher().match("(u:User {userId: '1'})")
                .create("(u)-[:HAS_PRIVACY {type: 'Bekannter'}]->(:Privacy {profile: true, image: true})")
                .end().getCommand());

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
            //Create Thread with messages between user 1 + 3
            commands.push(db.cypher().match("(u:User {userId: '1'}), (u2:User {userId: '3'})")
                .create("(u2)-[:ACTIVE {lastTimeVisited: {lastTimeVisited2}}]->(:Thread {threadId: '2'})<-[:ACTIVE {lastTimeVisited: {lastTimeVisited}}]-(u)")
                .end({
                    lastTimeVisited: startTime - 300,
                    lastTimeVisited2: startTime - 400
                }).getCommand());
            commands.push(db.cypher().match("(thread:Thread {threadId: '2'}), (u:User {userId: '1'}), (u2:User {userId: '3'})")
                .create("(thread)-[:NEXT_MESSAGE]->(message:Message {messageAdded: {messageAdded}, text: 'message1'})," +
                    "(message)-[:WRITTEN]->(u)")
                .end({
                    messageAdded: startTime - 299
                }).getCommand());
            commands.push(db.cypher().match("(u:User {userId: '3'})")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false}), " +
                    "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})")
                .end({}).getCommand());

            return db.cypher().create("(:User)")
                .end().send(commands);
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get User Infos when logged in - Return a 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.get('/api/user/userInfo', agent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.name.should.equal('user Meier');
            res.body.profileImage.should.equal('profileImage/1/thumbnail.jpg');
            res.body.profileImagePreview.should.equal('profileImage/1/profilePreview.jpg');
            res.body.email.should.equal('user@irgendwo.ch');
            res.body.privacyTypes.length.should.equal(2);
            res.body.privacyTypes[0].should.equal('Bekannter');
            res.body.privacyTypes[1].should.equal('Freund');
            res.body.totalUnreadMessages.should.equal(3);
        });
    });
});
