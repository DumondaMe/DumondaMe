'use strict';

var app = require('../../../../../../server');
var users = require('../../util/user');
var db = require('../../util/db');
var requestHandler = require('../../util/request');
var should = require('chai').should();
var moment = require('moment');

describe('Integration Tests for getting the contact details', function () {

    var requestAgent, startTime;

    beforeEach(function () {

        var commands = [];
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return db.clearDatabase().then(function () {
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', forename: 'user', surname: 'Meier', userId: '1'})").end().getCommand());
            return db.cypher().match("(u:User {userId: '1'})")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: true, profileData: true, contacts: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Bekannter'}]->(:Privacy {profile: true, image: true})")
                .end().send(commands);
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting all possible contact details for a user to contact has no contact relationship - Return 200', function () {

        var commands = [];
        commands.push(db.cypher().create("(:User {email: 'user@irgendwo2.ch', password: '1234', name: 'user2 Meier2', forename: 'user2', surname: 'Meier2'," +
        "birthday: 1000, country: 'CH', street: 'irgendwo', place: 'sonstwo', userId: '2'})").end().getCommand());
        return db.cypher().match("(u:User {userId: '2'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: true, profileData: true, contacts: true}), " +
            "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: false, image: true, profileData: true, contacts: true}), " +
            "(u)-[:HAS_PRIVACY {type: 'Bekannter'}]->(:Privacy {profile: false, image: true, profileData: true, contacts: true})")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/contact/detail', {
                    userId: '2'
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.details.name.should.equals('user2 Meier2');
                res.body.details.birthday.should.equals(1000);
                res.body.details.country.should.equals('CH');
                res.body.details.street.should.equals('irgendwo');
                res.body.details.place.should.equals('sonstwo');
                res.body.details.profileUrl.should.equals('2/profile.jpg');
                should.not.exist(res.body.details.contactType);
            });
    });

    it('Getting only the name for a user to contact has no contact relationship - Return 200', function () {

        var commands = [];
        commands.push(db.cypher().create("(:User {email: 'user@irgendwo2.ch', password: '1234', name: 'user2 Meier2', forename: 'user2', surname: 'Meier2'," +
        "birthday: 1000, country: 'CH', street: 'irgendwo', place: 'sonstwo', userId: '2'})").end().getCommand());
        return db.cypher().match("(u:User {userId: '2'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: false, profileData: false, contacts: false}), " +
            "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true, profileData: true, contacts: true}), " +
            "(u)-[:HAS_PRIVACY {type: 'Bekannter'}]->(:Privacy {profile: true, image: true, profileData: true, contacts: true})")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/contact/detail', {
                    userId: '2'
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.details.name.should.equals('user2 Meier2');
                should.not.exist(res.body.details.birthday);
                should.not.exist(res.body.details.country);
                should.not.exist(res.body.details.street);
                should.not.exist(res.body.details.place);
                res.body.details.profileUrl.should.equals('default/profile.jpg');
                should.not.exist(res.body.details.contactType);
            });
    });

    it('Getting all possible contact details for a user-[IS_CONTACT]->contact - Return 200', function () {

        var commands = [];
        commands.push(db.cypher().create("(:User {email: 'user@irgendwo2.ch', password: '1234', name: 'user2 Meier2', forename: 'user2', surname: 'Meier2'," +
        "birthday: 1000, country: 'CH', street: 'irgendwo', place: 'sonstwo', userId: '2'})").end().getCommand());
        commands.push(db.cypher().match("(u:User), (u2:User)")
            .where("u.userId = '1' AND u2.userId = '2'")
            .create("(u)-[:IS_CONTACT {type: 'Bekannter', contactAdded: {contactAdded}}]->(u2)")
            .end({contactAdded: startTime}).getCommand());
        return db.cypher().match("(u:User {userId: '2'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: true, profileData: true, contacts: true}), " +
            "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: false, image: true, profileData: true, contacts: true}), " +
            "(u)-[:HAS_PRIVACY {type: 'Bekannter'}]->(:Privacy {profile: false, image: true, profileData: true, contacts: true})")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/contact/detail', {
                    userId: '2'
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.details.name.should.equals('user2 Meier2');
                res.body.details.birthday.should.equals(1000);
                res.body.details.country.should.equals('CH');
                res.body.details.street.should.equals('irgendwo');
                res.body.details.place.should.equals('sonstwo');
                res.body.details.contactType.should.equals('Bekannter');
                res.body.details.profileUrl.should.equals('2/profile.jpg');
            });
    });

    it('Getting only the name for a user when user-[IS_CONTACT]->contact - Return 200', function () {

        var commands = [];
        commands.push(db.cypher().create("(:User {email: 'user@irgendwo2.ch', password: '1234', name: 'user2 Meier2', forename: 'user2', surname: 'Meier2'," +
        "birthday: 1000, country: 'CH', street: 'irgendwo', place: 'sonstwo', userId: '2'})").end().getCommand());
        commands.push(db.cypher().match("(u:User), (u2:User)")
            .where("u.userId = '1' AND u2.userId = '2'")
            .create("(u)-[:IS_CONTACT {type: 'Bekannter', contactAdded: {contactAdded}}]->(u2)")
            .end({contactAdded: startTime}).getCommand());
        return db.cypher().match("(u:User {userId: '2'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: false, profileData: false, contacts: false}), " +
            "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true, profileData: true, contacts: true}), " +
            "(u)-[:HAS_PRIVACY {type: 'Bekannter'}]->(:Privacy {profile: true, image: true, profileData: true, contacts: true})")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/contact/detail', {
                    userId: '2'
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.details.name.should.equals('user2 Meier2');
                should.not.exist(res.body.details.birthday);
                should.not.exist(res.body.details.country);
                should.not.exist(res.body.details.street);
                should.not.exist(res.body.details.place);
                res.body.details.contactType.should.equals('Bekannter');
                res.body.details.profileUrl.should.equals('default/profile.jpg');

                //Contacts
                res.body.contacts.length.should.equals(0);
            });
    });

    it('Getting all possible contact details for a user<-[IS_CONTACT]-contact - Return 200', function () {

        var commands = [];
        //User2
        commands.push(db.cypher().create("(:User {email: 'user@irgendwo2.ch', password: '1234', name: 'user2 Meier2', forename: 'user2', surname: 'Meier2'," +
        "birthday: 1000, country: 'CH', street: 'irgendwo', place: 'sonstwo', userId: '2'})").end().getCommand());
        commands.push(db.cypher().match("(u:User {userId: '2'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: true, profileData: true, contacts: true}), " +
            "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: false, image: true, profileData: true, contacts: true}), " +
            "(u)-[:HAS_PRIVACY {type: 'Bekannter'}]->(:Privacy {profile: true, image: true, profileData: true, contacts: true})")
            .end().getCommand());
        //User3
        commands.push(db.cypher().create("(:User {email: 'user@irgendwo3.ch', password: '1234', name: 'user3 Meier3', userId: '3'})").end().getCommand());
        commands.push(db.cypher().match("(u:User {userId: '3'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: true, profileData: true, contacts: true})")
            .end().getCommand());
        //User4
        commands.push(db.cypher().create("(:User {email: 'user@irgendwo4.ch', password: '1234', name: 'user4 Meier4', userId: '4'})").end().getCommand());
        commands.push(db.cypher().match("(u:User {userId: '4'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: false, profileData: true, contacts: true})")
            .end().getCommand());
        //User5
        commands.push(db.cypher().create("(:User {email: 'user@irgendwo5.ch', password: '1234', name: 'user5 Meier5', userId: '5'})").end().getCommand());
        commands.push(db.cypher().match("(u:User {userId: '5'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: true, profileData: true, contacts: true})")
            .end().getCommand());
        //User6
        commands.push(db.cypher().create("(:User {email: 'user@irgendwo6.ch', password: '1234', name: 'user6 Meier6', userId: '6'})").end().getCommand());
        commands.push(db.cypher().match("(u:User), (u2:User)")
            .where("u.userId = '6' AND u2.userId = '1'")
            .create("(u)-[:IS_CONTACT {type: 'Bekannter', contactAdded: {contactAdded}}]->(u2)")
            .end({contactAdded: startTime}).getCommand());
        commands.push(db.cypher().match("(u:User {userId: '6'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false, profileData: true, contacts: true}), " +
            "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: false, image: false, profileData: true, contacts: true}), " +
            "(u)-[:HAS_PRIVACY {type: 'Bekannter'}]->(:Privacy {profile: true, image: true, profileData: true, contacts: true})")
            .end().getCommand());
        //User7
        commands.push(db.cypher().create("(:User {email: 'user@irgendwo7.ch', password: '1234', name: 'user7 Meier7', userId: '7'})").end().getCommand());
        commands.push(db.cypher().match("(u:User), (u2:User)")
            .where("u.userId = '7' AND u2.userId = '1'")
            .create("(u)-[:IS_CONTACT {type: 'Bekannter', contactAdded: {contactAdded}}]->(u2)")
            .end({contactAdded: startTime}).getCommand());

        //create Contact Connections for User 2
        commands.push(db.cypher().match("(u:User), (u2:User)")
            .where("u.userId = '2' AND u2.userId = '1'")
            .create("(u)-[:IS_CONTACT {type: 'Bekannter', contactAdded: {contactAdded}}]->(u2)")
            .end({contactAdded: startTime}).getCommand());
        commands.push(db.cypher().match("(u:User), (u2:User)")
            .where("u.userId = '2' AND u2.userId = '3'")
            .create("(u)-[:IS_CONTACT {type: 'Bekannter', contactAdded: {contactAdded}}]->(u2)")
            .end({contactAdded: startTime}).getCommand());
        commands.push(db.cypher().match("(u:User), (u2:User)")
            .where("u.userId = '2' AND u2.userId = '4'")
            .create("(u)-[:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(u2)")
            .end({contactAdded: startTime}).getCommand());
        commands.push(db.cypher().match("(u:User), (u2:User)")
            .where("u.userId = '2' AND u2.userId = '5'")
            .create("(u)-[:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(u2)")
            .end({contactAdded: startTime}).getCommand());
        commands.push(db.cypher().match("(u:User), (u2:User)")
            .where("u.userId = '2' AND u2.userId = '6'")
            .create("(u)-[:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(u2)")
            .end({contactAdded: startTime}).getCommand());
        commands.push(db.cypher().match("(u:User), (u2:User)")
            .where("u.userId = '2' AND u2.userId = '7'")
            .create("(u)-[:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(u2)")
            .end({contactAdded: startTime}).getCommand());

        return db.cypher().match("(u:User {userId: '7'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: true, profileData: true, contacts: true}), " +
            "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true, profileData: true, contacts: true}), " +
            "(u)-[:HAS_PRIVACY {type: 'Bekannter'}]->(:Privacy {profile: true, image: false, profileData: true, contacts: true})")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/contact/detail', {
                    userId: '2'
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.details.name.should.equals('user2 Meier2');
                res.body.details.birthday.should.equals(1000);
                res.body.details.country.should.equals('CH');
                res.body.details.street.should.equals('irgendwo');
                res.body.details.place.should.equals('sonstwo');
                res.body.details.profileUrl.should.equals('2/profile.jpg');
                should.not.exist(res.body.details.contactType);
                //Contacts
                res.body.contacts.length.should.equals(5);
                res.body.contacts[0].name.should.equals('user3 Meier3');
                res.body.contacts[0].profileUrl.should.equals('default/profilePreview.jpg');
                res.body.contacts[0].id.should.equals('3');
                res.body.contacts[1].name.should.equals('user4 Meier4');
                res.body.contacts[1].profileUrl.should.equals('default/profilePreview.jpg');
                res.body.contacts[1].id.should.equals('4');
                res.body.contacts[2].name.should.equals('user5 Meier5');
                res.body.contacts[2].profileUrl.should.equals('5/profilePreview.jpg');
                res.body.contacts[2].id.should.equals('5');
                res.body.contacts[3].name.should.equals('user6 Meier6');
                res.body.contacts[3].profileUrl.should.equals('6/profilePreview.jpg');
                res.body.contacts[3].id.should.equals('6');
                res.body.contacts[4].name.should.equals('user7 Meier7');
                res.body.contacts[4].profileUrl.should.equals('default/profilePreview.jpg');
                res.body.contacts[4].id.should.equals('7');
            });
    });

    it('Getting only the name for a user when user<-[IS_CONTACT]-contact - Return 200', function () {

        var commands = [];
        commands.push(db.cypher().create("(:User {email: 'user@irgendwo2.ch', password: '1234', name: 'user2 Meier2', forename: 'user2', surname: 'Meier2'," +
        "birthday: 1000, country: 'CH', street: 'irgendwo', place: 'sonstwo', userId: '2'})").end().getCommand());
        commands.push(db.cypher().match("(u:User), (u2:User)")
            .where("u.userId = '2' AND u2.userId = '1'")
            .create("(u)-[:IS_CONTACT {type: 'Bekannter', contactAdded: {contactAdded}}]->(u2)")
            .end({contactAdded: startTime}).getCommand());
        return db.cypher().match("(u:User {userId: '2'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: true, profileData: true, contacts: true}), " +
            "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true, profileData: true, contacts: true}), " +
            "(u)-[:HAS_PRIVACY {type: 'Bekannter'}]->(:Privacy {profile: true, image: false, profileData: false, contacts: false})")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/contact/detail', {
                    userId: '2'
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.details.name.should.equals('user2 Meier2');
                should.not.exist(res.body.details.birthday);
                should.not.exist(res.body.details.country);
                should.not.exist(res.body.details.street);
                should.not.exist(res.body.details.place);
                res.body.details.profileUrl.should.equals('default/profile.jpg');
                should.not.exist(res.body.details.contactType);
            });
    });

    it('Getting only the name for a user when user<-[IS_CONTACT]-contact and profile of privacy is set to false - Return 200', function () {

        var commands = [];
        commands.push(db.cypher().create("(:User {email: 'user@irgendwo2.ch', password: '1234', name: 'user2 Meier2', forename: 'user2', surname: 'Meier2'," +
        "birthday: 1000, country: 'CH', street: 'irgendwo', place: 'sonstwo', userId: '2'})").end().getCommand());
        commands.push(db.cypher().match("(u:User), (u2:User)")
            .where("u.userId = '2' AND u2.userId = '1'")
            .create("(u)-[:IS_CONTACT {type: 'Bekannter', contactAdded: {contactAdded}}]->(u2)")
            .end({contactAdded: startTime}).getCommand());
        return db.cypher().match("(u:User {userId: '2'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: true, profileData: true, contacts: true}), " +
            "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true, profileData: true, contacts: true}), " +
            "(u)-[:HAS_PRIVACY {type: 'Bekannter'}]->(:Privacy {profile: false, image: true, profileData: true, contacts: true})")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/contact/detail', {
                    userId: '2'
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.details.name.should.equals('user2 Meier2');
                should.not.exist(res.body.details.birthday);
                should.not.exist(res.body.details.country);
                should.not.exist(res.body.details.street);
                should.not.exist(res.body.details.place);
                res.body.details.profileUrl.should.equals('default/profile.jpg');
                should.not.exist(res.body.details.contactType);
                res.body.contacts.length.should.equals(0);
            });
    });
});
