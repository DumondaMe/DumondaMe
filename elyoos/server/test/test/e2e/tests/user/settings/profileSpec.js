'use strict';

let libUser = require('elyoos-server-lib').user();
let users = require('elyoos-server-test-util').user;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let should = require('chai').should();
let db = require('elyoos-server-test-util').db;

describe('Integration Tests User Profile Data', function () {

    beforeEach(function () {

        libUser.removeFromCache('user@irgendwo.ch');
        libUser.removeFromCache('userchange@irgendwo.ch');

        return db.clearDatabase().then(function () {

            return db.cypher().create("(:User {email: {email}, password: {password}, forename: {forename}, surname: {surname}, userId: {userId}})")
                .end({
                    email: 'user@irgendwo.ch',
                    password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm',
                    forename: 'user',
                    surname: 'Meier',
                    userId: '0'
                }).send()
                .then(function () {
                    return db.cypher().create("(:User {email: {email}, password: {password}, userId: {userId}})")
                        .end({
                            email: 'userchange@irgendwo.ch',
                            password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm',
                            userId: '1'
                        }).send();
                });
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get User Data when logged in - Return a 200', function () {
        let commands = [];
        commands.push(db.cypher().create("(:User {name: 'user Meier2', userId: '2'})").end().getCommand());
        commands.push(db.cypher().create("(:User {name: 'user Meier3', userId: '3'})").end().getCommand());
        commands.push(db.cypher().create("(:User {name: 'user Meier4', userId: '4'})").end().getCommand());
        commands.push(db.cypher().create("(:User {name: 'user Meier5', userId: '5'})").end().getCommand());
        commands.push(db.cypher().create("(:User {name: 'user Meier6', userId: '6'})").end().getCommand());
        commands.push(db.cypher().create("(:User {name: 'user Meier7', userId: '7'})").end().getCommand());
        
        //Create Contacts
        commands.push(db.cypher().match("(a:User), (b:User {userId: '0'})").where("a.userId IN ['2','3','4','5']")
            .create("(b)-[:IS_CONTACT {type: 'Freund'}]->(a)").end().getCommand());
        return db.cypher().match("(a:User {userId: '0'}), (b:User)").where("b.userId IN ['6','7']")
            .create("(b)-[:IS_CONTACT {type: 'Freund'}]->(a)").end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).then(function (agent) {
                return requestHandler.get('/api/user/settings/profile', agent);
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.email.should.equal('user@irgendwo.ch');
                res.body.forename.should.equal('user');
                res.body.surname.should.equal('Meier');
                should.not.exist(res.body.password);
                res.body.profileImage.should.equal('profileImage/0/profile.jpg');
                res.body.numberOfContacts.should.equal(4);
                res.body.numberOfContacting.should.equal(2);
            });
    });

    it('Get no user data when not logged in - Return a 401', function () {
        return requestHandler.get('/api/user/settings/profile').then(function (res) {
            res.status.should.equal(401);
        });
    });

    it('Post new user data when not logged in- Return a 401', function () {
        let user = {
            forename: 'user',
            surname: 'surname'
        };

        return requestHandler.post('/api/user/settings/profile', user, null).then(function (res) {
            res.status.should.equal(401);
        });
    });

    it('Post valid user data - Return a 200', function () {
        let user = {
            forename: 'user',
            surname: 'surname'
        };

        return requestHandler.login(users.changeUserData).then(function (agent) {
            return requestHandler.post('/api/user/settings/profile', user, agent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(user:User {userId: '1'})")
                .return('user')
                .end()
                .send();
        }).then(function (user) {
            user.length.should.equals(1);
            user[0].user.forename.should.equals('user');
            user[0].user.surname.should.equals('surname');
        });
    });
});
