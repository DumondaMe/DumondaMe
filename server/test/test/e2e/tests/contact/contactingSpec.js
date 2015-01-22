'use strict';

var app = require('../../../../../server');
var users = require('../util/user');
var db = require('../util/db');
var requestHandler = require('../util/request');
var should = require('chai').should();
var moment = require('moment');

describe('Integration Tests for handling contacting information', function () {

    var requestAgent, startTime;

    beforeEach(function () {

        return db.clearDatabase().then(function () {
            var commands = [];
            startTime = Math.floor(moment.utc().valueOf() / 1000);

            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '1234', name: 'user Meier', userId: '1'})").end().getCommand());

            // User 2
            commands.push(db.cypher().create("(:User {name: 'user2 Meier2', userId: '2'})").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '2'})")
                .create("(u)-[:IS_VISIBLE {type: 'Freund'}]->(:Visibility {profile: true, image: true})")
                .end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '1'}), (u2:User {userId: '2'})")
                .create("(u2)-[:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(u)")
                .end({contactAdded: startTime - 86401}).getCommand());
            // User 3
            commands.push(db.cypher().create("(:User {name: 'user3 Meier3', userId: '3'})").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '3'})")
                .create("(u)-[:IS_VISIBLE {type: 'Freund'}]->(:Visibility {profile: true, image: true})")
                .end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '1'}), (u2:User {userId: '3'})")
                .create("(u2)-[:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(u)")
                .end({contactAdded: startTime - 1000}).getCommand());
            // User 4
            commands.push(db.cypher().create("(:User {name: 'user4 Meier4', userId: '4'})").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '4'})")
                .create("(u)-[:IS_VISIBLE {type: 'Freund'}]->(:Visibility {profile: true, image: true})")
                .end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '1'}), (u2:User {userId: '4'})")
                .create("(u2)-[:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(u)")
                .end({contactAdded: startTime - 2591000}).getCommand());
            // User 4
            commands.push(db.cypher().create("(:User {name: 'user5 Meier5', userId: '5'})").end().getCommand());
            return db.cypher().match("(u:User {userId: '5'})")
                .create("(u)-[:IS_VISIBLE_NO_CONTACT]->(:Visibility {profile: true, image: true})")
                .end().send(commands);

        });
    });

    afterEach(function (done) {
        requestHandler.logout(done);
    });

    it('Getting the contacting information for the user - Return 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/contact/contacting', {
                maxItems: 5,
                skip: 0
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.contactingUsers.length.should.equal(3);
            should.not.exist(res.body.contactingUsers[0].type);
            res.body.contactingUsers[0].id.should.equal("3");
            res.body.contactingUsers[0].name.should.equal("user3 Meier3");
            res.body.contactingUsers[0].connected.should.equal("contactToUser");
            res.body.contactingUsers[0].contactAdded.should.equal(startTime - 1000);

            res.body.contactingUsers[1].id.should.equal("2");
            res.body.contactingUsers[1].name.should.equal("user2 Meier2");
            res.body.contactingUsers[1].connected.should.equal("contactToUser");
            res.body.contactingUsers[1].contactAdded.should.equal(startTime - 86401);

            res.body.contactingUsers[2].id.should.equal("4");
            res.body.contactingUsers[2].name.should.equal("user4 Meier4");
            res.body.contactingUsers[2].connected.should.equal("contactToUser");
            res.body.contactingUsers[2].contactAdded.should.equal(startTime - 2591000);

            res.body.numberOfContactingLastDay.should.equal(1);
            res.body.numberOfContactingLastWeek.should.equal(2);
            res.body.numberOfContactingLastMonth.should.equal(3);
            res.body.numberOfAllContactings.should.equal(3);
        });
    });

    it('Getting the contacting information for the user and skip the first limit the last - Return 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/contact/contacting', {
                maxItems: 1,
                skip: 1
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.contactingUsers.length.should.equal(1);

            res.body.contactingUsers[0].id.should.equal("2");
            res.body.contactingUsers[0].name.should.equal("user2 Meier2");
            res.body.contactingUsers[0].connected.should.equal("contactToUser");
            res.body.contactingUsers[0].contactAdded.should.equal(startTime - 86401);

            res.body.numberOfContactingLastDay.should.equal(1);
            res.body.numberOfContactingLastWeek.should.equal(2);
            res.body.numberOfContactingLastMonth.should.equal(3);
            res.body.numberOfAllContactings.should.equal(3);
        });
    });

});
