'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let should = require('chai').should();

describe('Integration Tests for finding other users and applying the correct privacySetting', function () {

    before(function () {
        let createUser = "(:User {email: {email}, emailNormalized: {emailNormalized}, password: {password}, name: {name}, userId: {userId}})";
        return db.clearDatabase().then(function () {
            return db.cypher().create(createUser)
                .end({
                    email: 'user@irgendwo.ch',
                    emailNormalized: 'user@irgendwo.ch',
                    password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm',
                    name: 'user Meier',
                    userId: '1'
                }).send()
                .then(function () {
                    return db.cypher().create(createUser)
                        .end({
                            email: 'user@irgendwo2.ch',
                            emailNormalized: 'user@irgendwo2.ch',
                            password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm',
                            name: 'user2 Meier2',
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
                                .create("(u)-[:HAS_PRIVACY {type: 'Familie'}]->(:Privacy {profile: true, image: false})")
                                .end().send();
                        })
                        .then(function () {
                            return db.cypher().match("(u:User {userId: '2'})")
                                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: true})")
                                .end().send();
                        });
                })
                .then(function () {
                    return db.cypher().create(createUser)
                        .end({
                            email: 'user@irgendwo3.ch',
                            emailNormalized: 'user@irgendwo3.ch',
                            password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm',
                            name: 'user2 Meier3',
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
                                .create("(u)-[:HAS_PRIVACY {type: 'Familie'}]->(:Privacy {profile: true, image: true})")
                                .end().send();
                        })
                        .then(function () {
                            return db.cypher().match("(u:User {userId: '3'})")
                                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: false})")
                                .end().send();
                        });
                })
                .then(function () {
                    return db.cypher().create(createUser)
                        .end({
                            email: 'user@irgendwo4.ch',
                            emailNormalized: 'user@irgendwo4.ch',
                            password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm',
                            name: 'user Meier4',
                            userId: '4'
                        }).send()
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
                            emailNormalized: 'user@irgendwo5.ch',
                            password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm',
                            name: 'user Meier5',
                            userId: '5'
                        }).send()
                        .then(function () {
                            return db.cypher().match("(u:User {userId: '5'})")
                                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: false})")
                                .end().send();
                        });
                });
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Request only with forename - Return correct sorted list with correct privacy setting (Contacts first)', function () {

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.get('/api/user/contact/search', {
                search: 'user',
                maxItems: 10,
                isSuggestion: false
            });
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.length.should.equal(4);
            res.body[0].userId.should.equal('2');
            res.body[0].name.should.equal('user2 Meier2');
            res.body[0].type.should.equal('Freund');
            res.body[0].profileUrl.should.equal('profileImage/default/thumbnail.jpg');

            res.body[1].userId.should.equal('3');
            res.body[1].name.should.equal('user2 Meier3');
            res.body[1].type.should.equal('Freund');
            res.body[1].profileUrl.should.equal('profileImage/3/thumbnail.jpg');

            res.body[2].userId.should.equal('4');
            res.body[2].name.should.equal('user Meier4');
            should.not.exist(res.body[2].type);
            res.body[2].profileUrl.should.equal('profileImage/4/thumbnail.jpg');

            res.body[3].userId.should.equal('5');
            res.body[3].name.should.equal('user Meier5');
            should.not.exist(res.body[3].type);
            res.body[3].profileUrl.should.equal('profileImage/default/thumbnail.jpg');
        });
    });

});
