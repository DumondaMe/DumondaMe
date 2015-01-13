'use strict';

var app = require('../../../../../server');
var users = require('../util/user');
var db = require('../util/db');
var requestHandler = require('../util/request');
var should = require('chai').should();

describe('Integration Tests for finding other users and applying the correct visibility', function () {

    before(function () {
        var createUser = "(:User {email: {email}, password: {password}, name: {name}, userId: {userId}})";
        return db.clearDatabase().then(function () {
            return db.cypher().create(createUser)
                .end({
                    email: 'user@irgendwo.ch',
                    password: '1234',
                    name: 'user Meier',
                    userId: '1'
                }).send()
                .then(function () {
                    return db.cypher().create(createUser)
                        .end({
                            email: 'user@irgendwo2.ch',
                            password: '1234',
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
                                .create("(u)-[:IS_VISIBLE {type: 'Familie'}]->(:Visibility {profile: true, image: false})")
                                .end().send();
                        })
                        .then(function () {
                            return db.cypher().match("(u:User {userId: '2'})")
                                .create("(u)-[:IS_VISIBLE_NO_CONTACT]->(:Visibility {profile: true, image: true})")
                                .end().send();
                        });
                })
                .then(function () {
                    return db.cypher().create(createUser)
                        .end({
                            email: 'user@irgendwo3.ch',
                            password: '1234',
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
                                .create("(u)-[:IS_VISIBLE {type: 'Familie'}]->(:Visibility {profile: true, image: true})")
                                .end().send();
                        })
                        .then(function () {
                            return db.cypher().match("(u:User {userId: '3'})")
                                .create("(u)-[:IS_VISIBLE_NO_CONTACT]->(:Visibility {profile: true, image: false})")
                                .end().send();
                        });
                })
                .then(function () {
                    return db.cypher().create(createUser)
                        .end({
                            email: 'user@irgendwo4.ch',
                            password: '1234',
                            name: 'user Meier4',
                            userId: '4'
                        }).send()
                        .then(function () {
                            return db.cypher().match("(u:User {userId: '4'})")
                                .create("(u)-[:IS_VISIBLE_NO_CONTACT]->(:Visibility {profile: true, image: true})")
                                .end().send();
                        });
                })
                .then(function () {
                    return db.cypher().create(createUser)
                        .end({
                            email: 'user@irgendwo5.ch',
                            password: '1234',
                            name: 'user Meier5',
                            userId: '5'
                        }).send()
                        .then(function () {
                            return db.cypher().match("(u:User {userId: '5'})")
                                .create("(u)-[:IS_VISIBLE_NO_CONTACT]->(:Visibility {profile: true, image: false})")
                                .end().send();
                        });
                });
        });
    });

    afterEach(function (done) {
        requestHandler.logout(done);
    });


    it('Request only with forename - Return correct sorted list with correct visibility (Contacts first)', function () {

        var requestAgent;

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/contact/search', {
                search: 'user',
                maxItems: 10,
                isSuggestion: false
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.length.should.equal(4);
            res.body[0].id.should.equal('2');
            res.body[0].name.should.equal('user2 Meier2');
            res.body[0].type.should.equal('Freund');
            res.body[0].profileUrl.should.equal('cms/default/profile/thumbnail.jpg');

            res.body[1].id.should.equal('3');
            res.body[1].name.should.equal('user2 Meier3');
            res.body[1].type.should.equal('Freund');
            res.body[1].profileUrl.should.equal('cms/3/profile/thumbnail.jpg');

            res.body[2].id.should.equal('4');
            res.body[2].name.should.equal('user Meier4');
            should.not.exist(res.body[2].type);
            res.body[2].profileUrl.should.equal('cms/4/profile/thumbnail.jpg');

            res.body[3].id.should.equal('5');
            res.body[3].name.should.equal('user Meier5');
            should.not.exist(res.body[3].type);
            res.body[3].profileUrl.should.equal('cms/default/profile/thumbnail.jpg');
        });
    });

});
