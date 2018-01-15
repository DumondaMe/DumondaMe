'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let should = require('chai').should();
let moment = require('moment');

describe('Integration Tests for getting user details when blocking is involved', function () {

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

    it('User has blocked the user on which he request the details - Return 200', function () {

        let commands = [];
        commands.push(db.cypher().create("(:User {email: 'user@irgendwo2.ch', password: '1234', name: 'user2 Meier2', forename: 'user2', surname: 'Meier2',userId: '2'})").end().getCommand());

        commands.push(db.cypher().match("(u1:User {userId: '1'}), (u2:User {userId: '2'})")
            .create("(u1)-[:IS_BLOCKED]->(u2)").end().getCommand());

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
                res.body.user.profileUrl.should.equals('profileImage/2/profile.jpg');
                should.not.exist(res.body.user.type);
                res.body.user.blocked.should.equals(true);

                res.body.contactTypeStatistic.length.should.equals(2);
            });
    });

    it('If the other user has blocked the requested only show name and default image - Return 200', function () {

        let commands = [];
        commands.push(db.cypher().create("(:User {email: 'user@irgendwo2.ch', password: '1234', name: 'user2 Meier2', forename: 'user2', surname: 'Meier2', userId: '2'})").end().getCommand());

        commands.push(db.cypher().match("(u1:User {userId: '1'}), (u2:User {userId: '2'})")
            .create("(u2)-[:IS_BLOCKED]->(u1)").end().getCommand());

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
                res.body.user.profileUrl.should.equals('profileImage/default/profile.jpg');
                should.not.exist(res.body.user.type);
                res.body.user.blocked.should.equals(false);
            });
    });
});