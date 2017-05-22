'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let should = require('chai').should();
let moment = require('moment');

describe('Integration Tests for getting user details', function () {

    let startTime;

    beforeEach(function () {

        let commands = [];
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return db.clearDatabase().then(function () {
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', emailNormalized: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', forename: 'user', surname: 'Meier', userId: '1', female: true})").end().getCommand());
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

    it('Getting all possible contact details for a user to which contact has no contact relationship - Return 200', function () {

        let commands = [];
        commands.push(db.cypher().create("(:User {email: 'user@irgendwo2.ch', password: '1234', name: 'user2 Meier2', forename: 'user2', surname: 'Meier2', userId: '2'})").end().getCommand());
        return db.cypher().match("(u:User {userId: '2'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: true, profileData: true, contacts: true}), " +
            "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: false, image: true, profileData: true, contacts: true}), " +
            "(u)-[:HAS_PRIVACY {type: 'Bekannter'}]->(:Privacy {profile: false, image: true, profileData: true, contacts: true})")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).then(function () {
                return requestHandler.get('/api/user/detail', {
                    userId: '2'
                });
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.user.name.should.equals('user2 Meier2');
                res.body.user.forename.should.equals('user2');
                res.body.user.profileUrl.should.equals('profileImage/2/profile.jpg');
                should.not.exist(res.body.user.type);
                res.body.user.blocked.should.equals(false);

                res.body.contactTypeStatistic.length.should.equals(2);
            });
    });

    it('Getting only the name of a user with no contact relationship and restrictions - Return 200', function () {

        let commands = [];
        commands.push(db.cypher().create("(:User {email: 'user@irgendwo2.ch', password: '1234', name: 'user2 Meier2', forename: 'user2', surname: 'Meier2', userId: '2'})").end().getCommand());
        return db.cypher().match("(u:User {userId: '2'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: false, profileData: false, contacts: false}), " +
            "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true, profileData: true, contacts: true}), " +
            "(u)-[:HAS_PRIVACY {type: 'Bekannter'}]->(:Privacy {profile: true, image: true, profileData: true, contacts: true})")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).then(function () {
                return requestHandler.get('/api/user/detail', {
                    userId: '2'
                });
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.user.name.should.equals('user2 Meier2');
                res.body.user.forename.should.equals('user2');
                res.body.user.profileUrl.should.equals('profileImage/default/profile.jpg');
                should.not.exist(res.body.user.type);
                res.body.user.blocked.should.equals(false);

                res.body.contactTypeStatistic.length.should.equals(2);
            });
    });

    it('Getting only the name of a user with no contact relationship and restriction no profile - Return 200', function () {

        let commands = [];
        commands.push(db.cypher().create("(:User {email: 'user@irgendwo2.ch', password: '1234', name: 'user2 Meier2', forename: 'user2', surname: 'Meier2', userId: '2'})").end().getCommand());
        return db.cypher().match("(u:User {userId: '2'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: true, profileData: true, contacts: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true, profileData: true, contacts: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Bekannter'}]->(:Privacy {profile: true, image: true, profileData: true, contacts: true})")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).then(function () {
                return requestHandler.get('/api/user/detail', {
                    userId: '2'
                });
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.user.name.should.equals('user2 Meier2');
                res.body.user.forename.should.equals('user2');
                res.body.user.profileUrl.should.equals('profileImage/default/profile.jpg');
                should.not.exist(res.body.user.type);
                res.body.user.blocked.should.equals(false);

                res.body.contactTypeStatistic.length.should.equals(2);
            });
    });

    it('Getting all info details for a user-[IS_CONTACT]->userDetail - Return 200', function () {

        let commands = [];
        commands.push(db.cypher().create("(:User {email: 'user@irgendwo2.ch', password: '1234', name: 'user2 Meier2', forename: 'user2', surname: 'Meier2', userId: '2'})").end().getCommand());
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
            }).then(function () {
                return requestHandler.get('/api/user/detail', {
                    userId: '2'
                });
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.user.name.should.equals('user2 Meier2');
                res.body.user.forename.should.equals('user2');
                res.body.user.profileUrl.should.equals('profileImage/2/profile.jpg');
                res.body.user.blocked.should.equals(false);

                res.body.contactTypeStatistic.length.should.equals(2);
            });
    });

    it('Getting only the name for a user when user-[IS_CONTACT]->userDetail- Return 200', function () {

        let commands = [];
        commands.push(db.cypher().create("(:User {email: 'user@irgendwo2.ch', password: '1234', name: 'user2 Meier2', forename: 'user2', surname: 'Meier2', userId: '2'})").end().getCommand());
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
            }).then(function () {
                return requestHandler.get('/api/user/detail', {
                    userId: '2'
                });
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.user.name.should.equals('user2 Meier2');
                res.body.user.forename.should.equals('user2');
                res.body.user.type.should.equals('Bekannter');
                res.body.user.profileUrl.should.equals('profileImage/default/profile.jpg');
                res.body.user.blocked.should.equals(false);

                //Contacts
                res.body.contacts.length.should.equals(0);

                res.body.contactTypeStatistic.length.should.equals(2);
            });
    });

    it('Getting all possible contact details for a user<-[IS_CONTACT]-userDetail - Return 200', function () {

        let commands = [];
        //User2
        commands.push(db.cypher().create("(:User {email: 'user@irgendwo2.ch', password: '1234', name: 'user2 Meier2', forename: 'user2', surname: 'Meier2', userId: '2'})").end().getCommand());
        commands.push(db.cypher().match("(u:User {userId: '2'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false, profileData: false, contacts: false}), " +
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
            .where("u.userId = '2' AND u2.userId in ['1', '3']")
            .create("(u)-[:IS_CONTACT {type: 'Bekannter', contactAdded: {contactAdded}}]->(u2)")
            .end({contactAdded: startTime}).getCommand());
        commands.push(db.cypher().match("(u:User), (u2:User)")
            .where("u.userId = '2' AND u2.userId in ['4', '5', '6', '7']")
            .create("(u)-[:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(u2)")
            .end({contactAdded: startTime}).getCommand());
        
        //create contacting connection for User 2
        commands.push(db.cypher().match("(u:User), (u2:User)")
            .where("u2.userId = '2' AND u.userId in ['4', '6', '7']")
            .create("(u)-[:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(u2)")
            .end({contactAdded: startTime}).getCommand());

        //create Contact Connections for User 1
        commands.push(db.cypher().match("(u:User), (u2:User)")
            .where("u.userId = '1' AND u2.userId in ['4', '6']")
            .create("(u)-[:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(u2)")
            .end({contactAdded: startTime}).getCommand());
        commands.push(db.cypher().match("(u:User), (u2:User)")
            .where("u.userId = '6' AND u2.userId = '1'")
            .create("(u)-[:IS_CONTACT {type: 'Bekannter', contactAdded: {contactAdded}}]->(u2)")
            .end({contactAdded: startTime}).getCommand());

        return db.cypher().match("(u:User {userId: '7'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: true, profileData: true, contacts: true}), " +
            "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true, profileData: true, contacts: true}), " +
            "(u)-[:HAS_PRIVACY {type: 'Bekannter'}]->(:Privacy {profile: true, image: false, profileData: true, contacts: true})")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).then(function () {
                return requestHandler.get('/api/user/detail', {
                    userId: '2'
                });
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.user.name.should.equals('user2 Meier2');
                res.body.user.forename.should.equals('user2');
                res.body.user.profileUrl.should.equals('profileImage/2/profile.jpg');
                should.not.exist(res.body.user.type);
                res.body.user.blocked.should.equals(false);
                //Contacts
                res.body.contacts.length.should.equals(6);
                res.body.contacts[0].name.should.equals('user Meier');
                res.body.contacts[0].profileUrl.should.equals('profileImage/1/profilePreview.jpg');
                res.body.contacts[0].userId.should.equals('1');
                res.body.contacts[1].name.should.equals('user3 Meier3');
                res.body.contacts[1].profileUrl.should.equals('profileImage/default/profilePreview.jpg');
                res.body.contacts[1].userId.should.equals('3');
                res.body.contacts[2].name.should.equals('user4 Meier4');
                res.body.contacts[2].profileUrl.should.equals('profileImage/default/profilePreview.jpg');
                res.body.contacts[2].userId.should.equals('4');
                res.body.contacts[3].name.should.equals('user5 Meier5');
                res.body.contacts[3].profileUrl.should.equals('profileImage/5/profilePreview.jpg');
                res.body.contacts[3].userId.should.equals('5');
                res.body.contacts[4].name.should.equals('user6 Meier6');
                res.body.contacts[4].profileUrl.should.equals('profileImage/6/profilePreview.jpg');
                res.body.contacts[4].userId.should.equals('6');
                res.body.contacts[5].name.should.equals('user7 Meier7');
                res.body.contacts[5].profileUrl.should.equals('profileImage/default/profilePreview.jpg');
                res.body.contacts[5].userId.should.equals('7');

                res.body.numberOfContacts.should.equals(6);
                res.body.numberOfSameContacts.should.equals(2);

                //Contacting
                res.body.contacting.length.should.equals(3);
                res.body.contacting[0].name.should.equals('user4 Meier4');
                res.body.contacting[0].profileUrl.should.equals('profileImage/default/profilePreview.jpg');
                res.body.contacting[0].userId.should.equals('4');
                res.body.contacting[1].name.should.equals('user6 Meier6');
                res.body.contacting[1].profileUrl.should.equals('profileImage/6/profilePreview.jpg');
                res.body.contacting[1].userId.should.equals('6');
                res.body.contacting[2].name.should.equals('user7 Meier7');
                res.body.contacting[2].profileUrl.should.equals('profileImage/default/profilePreview.jpg');
                res.body.contacting[2].userId.should.equals('7');

                res.body.numberOfContacting.should.equals(3);

                res.body.contactTypeStatistic.length.should.equals(2);
            });
    });

    it('Getting only the name for a user when user<-[IS_CONTACT]-userDetail - Return 200', function () {

        let commands = [];
        commands.push(db.cypher().create("(:User {email: 'user@irgendwo2.ch', password: '1234', name: 'user2 Meier2', forename: 'user2', surname: 'Meier2', userId: '2'})").end().getCommand());
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
            }).then(function () {
                return requestHandler.get('/api/user/detail', {
                    userId: '2'
                });
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.user.name.should.equals('user2 Meier2');
                res.body.user.forename.should.equals('user2');
                res.body.user.profileUrl.should.equals('profileImage/default/profile.jpg');
                should.not.exist(res.body.user.type);
                res.body.user.blocked.should.equals(false);

                res.body.contactTypeStatistic.length.should.equals(2);
            });
    });

    it('Getting only the name for a user when user<-[IS_CONTACT]-userDetail and profile of privacy is set to false - Return 200', function () {

        let commands = [];
        commands.push(db.cypher().create("(:User {email: 'user@irgendwo2.ch', password: '1234', name: 'user2 Meier2', forename: 'user2', surname: 'Meier2', userId: '2'})").end().getCommand());
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
            }).then(function () {
                return requestHandler.get('/api/user/detail', {
                    userId: '2'
                });
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.user.name.should.equals('user2 Meier2');
                res.body.user.forename.should.equals('user2');
                res.body.user.profileUrl.should.equals('profileImage/default/profile.jpg');
                should.not.exist(res.body.user.type);
                res.body.contacts.length.should.equals(0);
                res.body.user.blocked.should.equals(false);

                res.body.contactTypeStatistic.length.should.equals(2);
            });
    });
});
