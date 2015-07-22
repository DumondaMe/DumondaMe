'use strict';

var users = require('../../util/user');
var db = require('../../util/db');
var requestHandler = require('../../util/request');
var should = require('chai').should();
var moment = require('moment');

describe('Integration Tests for getting home screen information for a user', function () {

    var requestAgent;

    beforeEach(function () {

        var commands = [];
        return db.clearDatabase().then(function () {
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', surname: 'Meier', forename:'user', userId: '1'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier2', userId: '2'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier3', userId: '3'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier4', userId: '4'})").end().getCommand());
            commands.push(db.cypher().create("(:Page {title: 'bookPage1Title', label: 'Book', description: 'bookPage1', language: 'de', created: 501, pageId: '0'," +
                "author: 'Hans Muster', publishDate: 1000})").end().getCommand());
            return db.cypher().create("(:Page {title: 'bookPage2Title', label: 'Youtube', description: 'bookPage2', language: 'de', created: 501, pageId: '1'," +
                "author: 'Hans Muster', publishDate: 1000, link: 'www.test.ch'})").end().send(commands);

        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting the last recommendations of the contacts', function () {

        var commands = [];

        commands.push(db.cypher().match("(u:User {userId: '1'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false, profileData: true, contacts: true}), " +
            "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})")
            .end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '2'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund'}]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(u:User {userId: '2'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: true, profileData: true, contacts: true})")
            .end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '4'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund'}]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(u:User {userId: '4'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: true, profileData: true, contacts: true})")
            .end().getCommand());

        //Recommendations
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 502, rating: 1, comment: 'irgendwas', recommendationId: '0'})-[:RECOMMENDS]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '1'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 501, rating: 4, comment: 'irgendwas2', recommendationId: '1'})-[:RECOMMENDS]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '3'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 500, rating: 4, comment: 'irgendwas3', recommendationId: '2'})-[:RECOMMENDS]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '4'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 499, rating: 3, comment: 'irgendwas3', recommendationId: '2'})-[:RECOMMENDS]->(a)")
            .end().getCommand());

        return db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_ADMIN]->(a)")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).
            then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/home', {
                    skip: 0,
                    maxItems: 10,
                    timestamp: 502
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(2);
                res.body.pinwall[0].label.should.equals('Book');
                res.body.pinwall[0].pageId.should.equals('0');
                res.body.pinwall[0].name.should.equals('user Meier2');
                res.body.pinwall[0].title.should.equals('bookPage1Title');
                res.body.pinwall[0].rating.should.equals(1);
                res.body.pinwall[0].ratingAllContacts.should.equals(2);
                res.body.pinwall[0].numberOfRatingsByContacts.should.equals(2);
                res.body.pinwall[0].created.should.equals(502);
                res.body.pinwall[0].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
                res.body.pinwall[0].url.should.equals('pages/0/pagePreview.jpg');
                res.body.pinwall[0].comment.should.equals('irgendwas');
                res.body.pinwall[0].description.should.equals('bookPage1');

                res.body.pinwall[1].label.should.equals('Youtube');
                res.body.pinwall[1].pageId.should.equals('1');
                res.body.pinwall[1].name.should.equals('user Meier2');
                res.body.pinwall[1].title.should.equals('bookPage2Title');
                res.body.pinwall[1].rating.should.equals(4);
                res.body.pinwall[1].ratingAllContacts.should.equals(4);
                res.body.pinwall[1].numberOfRatingsByContacts.should.equals(1);
                res.body.pinwall[1].created.should.equals(501);
                res.body.pinwall[1].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
                should.not.exist(res.body.pinwall[1].url);
                res.body.pinwall[1].link.should.equals('www.test.ch');
                res.body.pinwall[1].comment.should.equals('irgendwas2');
                res.body.pinwall[1].description.should.equals('bookPage2');

            });
    });

    it('Ignoring newer recommenations', function () {

        var commands = [];

        commands.push(db.cypher().match("(u:User {userId: '1'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false, profileData: true, contacts: true}), " +
            "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})")
            .end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '2'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund'}]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(u:User {userId: '2'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: true, profileData: true, contacts: true})")
            .end().getCommand());

        //Recommendations
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 502, rating: 1, comment: 'irgendwas', recommendationId: '0'})-[:RECOMMENDS]->(a)")
            .end().getCommand());

        return db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_ADMIN]->(a)")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).
            then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/home', {
                    skip: 0,
                    maxItems: 10,
                    timestamp: 501
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.pinwall.length.should.equals(0);
                res.body.messages.length.should.equals(0);
            });
    });

    it('Getting the message sent to the user and not read', function () {

        var commands = [], startTime = Math.floor(moment.utc().valueOf() / 1000);

        commands.push(db.cypher().match("(u:User {userId: '1'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false, profileData: true, contacts: true})")
            .end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund'}]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(u:User {userId: '2'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: true, profileData: true, contacts: true}), " +
            "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})")
            .end().getCommand());
        commands.push(db.cypher().match("(u:User {userId: '3'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: false, profileData: true, contacts: true})")
            .end().getCommand());


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
            "(message)-[:WRITTEN]->(u2)," +
            "(message2)-[:WRITTEN]->(u)," +
            "(message3)-[:WRITTEN]->(u2)")
            .end({
                messageAdded: startTime - 299,
                messageAdded2: startTime - 400,
                messageAdded3: startTime - 600
            }).getCommand());

        //Create Thread with messages between user 1 + 3
        commands.push(db.cypher().match("(u:User {userId: '1'}), (u2:User {userId: '3'})")
            .create("(u2)-[:ACTIVE {lastTimeVisited: {lastTimeVisited2}}]->(:Thread {threadId: '2'})<-[:ACTIVE {lastTimeVisited: {lastTimeVisited}}]-(u)")
            .end({
                lastTimeVisited: startTime - 300,
                lastTimeVisited2: startTime - 300
            }).getCommand());
        commands.push(db.cypher().match("(thread:Thread {threadId: '2'}), (u:User {userId: '1'}), (u2:User {userId: '3'})")
            .create("(thread)-[:NEXT_MESSAGE]->(message:Message {messageAdded: {messageAdded}, text: 'message1'})," +
            "(message)-[:WRITTEN]->(u2)")
            .end({
                messageAdded: startTime - 299
            }).getCommand());

        return db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_ADMIN]->(a)")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).
            then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/home', {
                    skip: 0,
                    maxItems: 10,
                    timestamp: 500
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.messages.length.should.equals(2);
                res.body.messages[0].threadId.should.equals('1');
                res.body.messages[0].name.should.equals('user Meier2');
                res.body.messages[0].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
                res.body.messages[0].numberOfUnreadMessages.should.equals(2);

                res.body.messages[1].threadId.should.equals('2');
                res.body.messages[1].name.should.equals('user Meier3');
                res.body.messages[1].profileUrl.should.equals('profileImage/default/thumbnail.jpg');
                res.body.messages[1].numberOfUnreadMessages.should.equals(1);
            });
    });

    it('Getting the contacts who has recently added user', function () {

        var commands = [], startTime = Math.floor(moment.utc().valueOf() / 1000);

        commands.push(db.cypher().match("(u:User {userId: '1'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false, profileData: true, contacts: true})")
            .end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund'}]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(u:User {userId: '2'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: true, profileData: true, contacts: true}), " +
            "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})")
            .end().getCommand());
        commands.push(db.cypher().match("(u:User {userId: '3'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: false, profileData: true, contacts: true})")
            .end().getCommand());


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
            "(message)-[:WRITTEN]->(u2)," +
            "(message2)-[:WRITTEN]->(u)," +
            "(message3)-[:WRITTEN]->(u2)")
            .end({
                messageAdded: startTime - 299,
                messageAdded2: startTime - 400,
                messageAdded3: startTime - 600
            }).getCommand());

        //Create Thread with messages between user 1 + 3
        commands.push(db.cypher().match("(u:User {userId: '1'}), (u2:User {userId: '3'})")
            .create("(u2)-[:ACTIVE {lastTimeVisited: {lastTimeVisited2}}]->(:Thread {threadId: '2'})<-[:ACTIVE {lastTimeVisited: {lastTimeVisited}}]-(u)")
            .end({
                lastTimeVisited: startTime - 300,
                lastTimeVisited2: startTime - 300
            }).getCommand());
        commands.push(db.cypher().match("(thread:Thread {threadId: '2'}), (u:User {userId: '1'}), (u2:User {userId: '3'})")
            .create("(thread)-[:NEXT_MESSAGE]->(message:Message {messageAdded: {messageAdded}, text: 'message1'})," +
            "(message)-[:WRITTEN]->(u2)")
            .end({
                messageAdded: startTime - 299
            }).getCommand());

        return db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_ADMIN]->(a)")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).
            then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/home', {
                    skip: 0,
                    maxItems: 10,
                    timestamp: 500
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.messages.length.should.equals(2);
                res.body.messages[0].threadId.should.equals('1');
                res.body.messages[0].name.should.equals('user Meier2');
                res.body.messages[0].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
                res.body.messages[0].numberOfUnreadMessages.should.equals(2);

                res.body.messages[1].threadId.should.equals('2');
                res.body.messages[1].name.should.equals('user Meier3');
                res.body.messages[1].profileUrl.should.equals('profileImage/default/thumbnail.jpg');
                res.body.messages[1].numberOfUnreadMessages.should.equals(1);
            });
    });
});
