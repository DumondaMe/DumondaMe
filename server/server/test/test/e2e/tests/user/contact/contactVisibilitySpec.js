'use strict';

var app = require('../../../../../../server');
var users = require('../../util/user');
var db = require('../../util/db');
var requestHandler = require('../../util/request');
var should = require('chai').should();

describe('Integration Tests for handling the profile privacy setting when returning the user contacts', function () {

    var requestAgent;

    beforeEach(function () {

        var createUser = "(:User {email: {email}, password: {password}, forename: {forename}, surname: {surname}, name: {name}, userId: {userId}})";

        return db.clearDatabase().then(function () {
            return db.cypher().create(createUser)
                .end({
                    email: 'user@irgendwo.ch',
                    password: '1234',
                    name: 'user Meier',
                    forename: 'user',
                    surname: 'Meier',
                    userId: '1'
                }).send()
                .then(function () {
                    return db.cypher().create(createUser)
                        .end({
                            email: 'user@irgendwo2.ch',
                            password: '1234',
                            name: 'user2 Meier2',
                            forename: 'user2',
                            surname: 'Meier2',
                            userId: '2'
                        }).send()
                        .then(function () {
                            return db.cypher().match("(u:User), (u2:User)")
                                .where("u.userId = '1' AND u2.userId = '2'")
                                .create("(u2)-[:IS_CONTACT {type: 'Familie'}]->(u)-[:IS_CONTACT {type: 'Freund'}]->(u2)")
                                .end().send();
                        })
                        .then(function () {
                            return db.cypher().match("(u:User {userId: '2'})")
                                .create("(u)-[:HAS_PRIVACY {type: 'Familie'}]->(:Privacy {profile: true, image: true})")
                                .end().send();
                        })
                        .then(function () {
                            return db.cypher().match("(u:User {userId: '2'})")
                                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false})")
                                .end().send();
                        });
                })
                .then(function () {
                    return db.cypher().create(createUser)
                        .end({
                            email: 'user@irgendwo3.ch',
                            password: '1234',
                            name: 'user3 Meier3',
                            forename: 'user3',
                            surname: 'Meier3',
                            userId: '3'
                        }).send()
                        .then(function () {
                            return db.cypher().match("(u:User), (u2:User)")
                                .where("u.userId = '1' AND u2.userId = '3'")
                                .create("(u2)-[:IS_CONTACT {type: 'Familie'}]->(u)-[:IS_CONTACT {type: 'Freund'}]->(u2)")
                                .end().send();
                        })
                        .then(function () {
                            return db.cypher().match("(u:User {userId: '3'})")
                                .create("(u)-[:HAS_PRIVACY {type: 'Familie'}]->(:Privacy {profile: false, image: true})")
                                .end().send();
                        })
                        .then(function () {
                            return db.cypher().match("(u:User {userId: '3'})")
                                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: true})")
                                .end().send();
                        });
                })
                .then(function () {
                    return db.cypher().create(createUser)
                        .end({
                            email: 'user@irgendwo4.ch',
                            password: '1234',
                            name: 'user4 Meier4',
                            forename: 'user4',
                            surname: 'Meier4',
                            userId: '4'
                        }).send()
                        .then(function () {
                            return db.cypher().match("(u:User), (u2:User)")
                                .where("u.userId = '1' AND u2.userId = '4'")
                                .create("(u2)-[:IS_CONTACT {type: 'Familie'}]->(u)-[:IS_CONTACT {type: 'Freund'}]->(u2)")
                                .end().send();
                        })
                        .then(function () {
                            return db.cypher().match("(u:User {userId: '4'})")
                                .create("(u)-[:HAS_PRIVACY {type: 'Familie'}]->(:Privacy {profile: true, image: false})")
                                .end().send();
                        })
                        .then(function () {
                            return db.cypher().match("(u:User {userId: '4'})")
                                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: true})")
                                .end().send();
                        });
                })
                .then(function () {
                    return db.cypher().create(createUser)
                        .end({
                            email: 'user@irgendwo5.ch',
                            password: '1234',
                            name: 'user5 Meier5',
                            forename: 'user5',
                            surname: 'Meier5',
                            userId: '5'
                        }).send()
                        .then(function () {
                            return db.cypher().match("(u:User), (u2:User)")
                                .where("u.userId = '1' AND u2.userId = '5'")
                                .create("(u)-[:IS_CONTACT {type: 'Familie'}]->(u2)")
                                .end().send();
                        })
                        .then(function () {
                            return db.cypher().match("(u:User {userId: '5'})")
                                .create("(u)-[:HAS_PRIVACY {type: 'Familie'}]->(:Privacy {profile: true, image: true})")
                                .end().send();
                        })
                        .then(function () {
                            return db.cypher().match("(u:User {userId: '5'})")
                                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false})")
                                .end().send();
                        });
                });
        });
    });

    afterEach(function (done) {
        requestHandler.logout(done);
    });

    it('Get all contacts of the user with the correct privacy- Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/contact', {
                itemsPerPage: 10,
                skip: 0
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.contacts.length.should.equal(4);
            res.body.contacts[0].id.should.equal("2");
            res.body.contacts[0].type.should.equal("Freund");
            res.body.contacts[0].name.should.equal("user2 Meier2");
            res.body.contacts[0].profileUrl.should.contain("path=56c1c4822e77717c3506f41ffde51597b67f96b1c6eed8733aa34571");

            //path is to default profile image
            res.body.contacts[1].id.should.equal("3");
            res.body.contacts[1].profileUrl.should.contain("path=008bd291347d6c3f205beb0bfbef19d4a35d8bb2d9ebd85466ac437f9b9e37698e5f");

            res.body.contacts[2].id.should.equal("4");
            res.body.contacts[2].profileUrl.should.contain("path=008bd291347d6c3f205beb0bfbef19d4a35d8bb2d9ebd85466ac437f9b9e37698e5f");

            res.body.contacts[3].id.should.equal("5");
            res.body.contacts[3].profileUrl.should.contain("path=008bd291347d6c3f205beb0bfbef19d4a35d8bb2d9ebd85466ac437f9b9e37698e5f");

            res.body.numberOfContacts.should.equal(4);
        });
    });
});
