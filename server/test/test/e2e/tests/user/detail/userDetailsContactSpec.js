'use strict';

var users = require('../../util/user');
var db = require('../../util/db');
var requestHandler = require('../../util/request');
var should = require('chai').should();
var moment = require('moment');

describe('Integration Tests for getting the contacts in user details', function () {

    var requestAgent, startTime;

    beforeEach(function () {

        var commands = [];
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return db.clearDatabase().then(function () {
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', forename: 'user', surname: 'Meier', userId: '1', female: true})").end().getCommand());

            commands.push(db.cypher().create("(:User {name: 'user Meier2', userId: '2'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier3', userId: '3'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier4', userId: '4'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier5', userId: '5'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier6', userId: '6'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier7', userId: '7'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier8', userId: '8'})").end().getCommand());

            return db.cypher().match("(u:User)")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: true, profileData: true, contacts: true}), " +
                    "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true, contacts: true}), " +
                    "(u)-[:HAS_PRIVACY {type: 'Bekannter'}]->(:Privacy {profile: true, image: true, contacts: true})")
                .end().send(commands);
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting all possible contacts for a user to which contact has no contact relationship. Test visibility of contacts. - Return 200', function () {

        var commands = [];

        //Set contact relationships
        commands.push(db.cypher().match("(a:User), (b:User {userId: '2'})").where("a.userId IN ['3','4','5','6','7','8']")
            .create("(b)-[:IS_CONTACT {type: 'Freund'}]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:User), (b:User {userId: '1'})").where("a.userId IN ['5','6','7']")
            .create("(b)<-[:IS_CONTACT {type: 'Freund'}]-(a)").end().getCommand());
        commands.push(db.cypher().match("(a:User), (b:User {userId: '1'})").where("a.userId IN ['6','7']")
            .create("(b)-[:IS_CONTACT {type: 'Freund'}]->(a)").end().getCommand());
        
        //Set visibility
        commands.push(db.cypher().match("(u:User {userId: '3'})-[:HAS_PRIVACY_NO_CONTACT]->(privacy:Privacy)")
            .set('privacy', {profile: true, image: false}).getCommand());
        commands.push(db.cypher().match("(u:User {userId: '4'})-[:HAS_PRIVACY_NO_CONTACT]->(privacy:Privacy)")
            .set('privacy', {profile: false, image: true}).getCommand());
        commands.push(db.cypher().match("(u:User {userId: '5'})-[:HAS_PRIVACY {type: 'Freund'}]->(privacy:Privacy)")
            .set('privacy', {profile: true, image: false}).getCommand());
        commands.push(db.cypher().match("(u:User {userId: '6'})-[:HAS_PRIVACY {type: 'Freund'}]->(privacy:Privacy)")
            .set('privacy', {profile: false, image: true}).getCommand());

        return db.cypher().match("(u:User {userId: '2'})-[:HAS_PRIVACY_NO_CONTACT]->(privacy:Privacy)")
            .set('privacy', {profile: true, contacts: true})
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/detail/contact', {
                    userId: '2',
                    skip: 0,
                    maxItems: 10
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.contacts.length.should.equals(6);
                res.body.contacts[0].name.should.equals('user Meier3');
                res.body.contacts[0].profileUrl.should.equals('profileImage/default/profilePreview.jpg');
                res.body.contacts[0].userId.should.equals('3');
                should.not.exist(res.body.contacts[0].type);
                should.not.exist(res.body.contacts[0].blocked);

                res.body.contacts[1].name.should.equals('user Meier4');
                res.body.contacts[1].profileUrl.should.equals('profileImage/default/profilePreview.jpg');
                res.body.contacts[1].userId.should.equals('4');
                should.not.exist(res.body.contacts[1].type);
                should.not.exist(res.body.contacts[1].blocked);

                res.body.contacts[2].name.should.equals('user Meier5');
                res.body.contacts[2].profileUrl.should.equals('profileImage/default/profilePreview.jpg');
                res.body.contacts[2].userId.should.equals('5');
                should.not.exist(res.body.contacts[2].type);
                should.not.exist(res.body.contacts[2].blocked);

                res.body.contacts[3].name.should.equals('user Meier6');
                res.body.contacts[3].profileUrl.should.equals('profileImage/default/profilePreview.jpg');
                res.body.contacts[3].userId.should.equals('6');
                res.body.contacts[3].type.should.equals('Freund');
                should.not.exist(res.body.contacts[3].blocked);

                res.body.contacts[4].name.should.equals('user Meier7');
                res.body.contacts[4].profileUrl.should.equals('profileImage/7/profilePreview.jpg');
                res.body.contacts[4].userId.should.equals('7');
                res.body.contacts[4].type.should.equals('Freund');
                should.not.exist(res.body.contacts[4].blocked);

                res.body.contacts[5].name.should.equals('user Meier8');
                res.body.contacts[5].profileUrl.should.equals('profileImage/8/profilePreview.jpg');
                res.body.contacts[5].userId.should.equals('8');
                should.not.exist(res.body.contacts[5].type);
                should.not.exist(res.body.contacts[5].blocked);
            });
    });

    it('Testing skip an limit of returning contacts - Return 200', function () {

        var commands = [];

        //Set contact relationships
        commands.push(db.cypher().match("(a:User), (b:User {userId: '2'})").where("a.userId IN ['3','4','5','6','7','8']")
            .create("(b)-[:IS_CONTACT {type: 'Freund'}]->(a)").end().getCommand());

        return db.cypher().match("(u:User {userId: '2'})-[:HAS_PRIVACY_NO_CONTACT]->(privacy:Privacy)")
            .set('privacy', {profile: true, contacts: true})
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/detail/contact', {
                    userId: '2',
                    skip: 2,
                    maxItems: 2
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.contacts.length.should.equals(2);

                res.body.contacts[0].name.should.equals('user Meier5');
                res.body.contacts[0].profileUrl.should.equals('profileImage/5/profilePreview.jpg');
                res.body.contacts[0].userId.should.equals('5');
                should.not.exist(res.body.contacts[0].type);
                should.not.exist(res.body.contacts[0].blocked);

                res.body.contacts[1].name.should.equals('user Meier6');
                res.body.contacts[1].profileUrl.should.equals('profileImage/6/profilePreview.jpg');
                res.body.contacts[1].userId.should.equals('6');
                should.not.exist(res.body.contacts[1].type);
                should.not.exist(res.body.contacts[1].blocked);
            });
    });

    it('Do not return the contacts. contacts=false, (user)<-[:IS_CONTACT]-(otherUser) - Return 400', function () {

        var commands = [];

        //Set contact relationships
        commands.push(db.cypher().match("(a:User), (b:User {userId: '2'})").where("a.userId IN ['3','4']")
            .create("(b)-[:IS_CONTACT {type: 'Freund'}]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '2'}), (b:User {userId: '1'})")
            .create("(b)<-[:IS_CONTACT {type: 'Freund'}]-(a)").end().getCommand());

        return db.cypher().match("(u:User {userId: '2'})-[:HAS_PRIVACY {type: 'Freund'}]->(privacy:Privacy)")
            .set('privacy', {profile: true, contacts: false})
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/detail/contact', {
                    userId: '2',
                    skip: 0,
                    maxItems: 10
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(400);
            });
    });

    it('Do not return the contacts. profile=false, (user)<-[:IS_CONTACT]-(otherUser) - Return 400', function () {

        var commands = [];

        //Set contact relationships
        commands.push(db.cypher().match("(a:User), (b:User {userId: '2'})").where("a.userId IN ['3','4']")
            .create("(b)-[:IS_CONTACT {type: 'Freund'}]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '2'}), (b:User {userId: '1'})")
            .create("(b)<-[:IS_CONTACT {type: 'Freund'}]-(a)").end().getCommand());

        return db.cypher().match("(u:User {userId: '2'})-[:HAS_PRIVACY {type: 'Freund'}]->(privacy:Privacy)")
            .set('privacy', {profile: false, contacts: true})
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/detail/contact', {
                    userId: '2',
                    skip: 0,
                    maxItems: 10
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(400);
            });
    });

    it('Do not return the contacts. contacts=false, (user) not contact (otherUser) - Return 400', function () {

        var commands = [];

        //Set contact relationships
        commands.push(db.cypher().match("(a:User), (b:User {userId: '2'})").where("a.userId IN ['3','4']")
            .create("(b)-[:IS_CONTACT {type: 'Freund'}]->(a)").end().getCommand());

        return db.cypher().match("(u:User {userId: '2'})-[:HAS_PRIVACY_NO_CONTACT]->(privacy:Privacy)")
            .set('privacy', {profile: true, contacts: false})
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/detail/contact', {
                    userId: '2',
                    skip: 0,
                    maxItems: 10
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(400);
            });
    });

    it('Do not return the contacts. profile=false, (user) not contact (otherUser) - Return 400', function () {

        var commands = [];

        //Set contact relationships
        commands.push(db.cypher().match("(a:User), (b:User {userId: '2'})").where("a.userId IN ['3','4']")
            .create("(b)-[:IS_CONTACT {type: 'Freund'}]->(a)").end().getCommand());

        return db.cypher().match("(u:User {userId: '2'})-[:HAS_PRIVACY_NO_CONTACT]->(privacy:Privacy)")
            .set('privacy', {profile: false, contacts: true})
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/detail/contact', {
                    userId: '2',
                    skip: 0,
                    maxItems: 10
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(400);
            });
    });
});
