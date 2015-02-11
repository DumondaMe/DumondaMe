'use strict';

var app = require('../../../../../server');
var users = require('../util/user');
var db = require('../util/db');
var requestHandler = require('../util/request');
var should = require('chai').should();
var moment = require('moment');

describe('Integration Tests for finding other users', function () {

    var requestAgent, startTime;

    before(function () {
        var createUser = "(:User {email: {email}, password: {password}, name: {name}, userId: {userId}})";
        startTime = Math.floor(moment.utc().valueOf() / 1000);
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
                            return db.cypher().match("(u:User {userId: '2'})")
                                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: false})")
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
                            return db.cypher().match("(u:User {userId: '3'})")
                                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: false})")
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
                                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: false})")
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
                                .create("(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})")
                                .end().send();
                        })
                        .then(function () {
                            return db.cypher().match("(u:User {userId: '5'})")
                                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: false})")
                                .end().send();
                        });
                })
                .then(function () {
                    return db.cypher().create(createUser)
                        .end({
                            email: 'user@irgendwo6.ch',
                            password: '1234',
                            name: 'user Meier6',
                            userId: '6'
                        }).send()
                        .then(function () {
                            return db.cypher().match("(u:User {userId: '6'})")
                                .create("(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})")
                                .end().send();
                        })
                        .then(function () {
                            return db.cypher().match("(u:User {userId: '6'})")
                                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: false})")
                                .end().send();
                        });
                })
                .then(function () {
                    return db.cypher().create(createUser)
                        .end({
                            email: 'user@irgendwo7.ch',
                            password: '1234',
                            name: 'etwasganzanderes nochwas anderes',
                            userId: '7'
                        }).send()
                        .then(function () {
                            return db.cypher().match("(u:User {userId: '7'})")
                                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: false})")
                                .end().send();
                        });
                })
                .then(function () {
                    return db.cypher().match("(a:User {userId:'1'}), (b:User {userId:'2'})")
                        .create("(a)-[r:IS_CONTACT {type: 'Familie', contactAdded: {contactAdded}}]->(b)")
                        .end({contactAdded: startTime})
                        .send();
                })
                .then(function () {
                    return db.cypher().match("(a:User {userId:'1'}), (b:User {userId:'6'})")
                        .create("(a)-[r:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(b)")
                        .end({contactAdded: startTime})
                        .send();
                })
                .then(function () {
                    return db.cypher().match("(a:User {userId:'6'}), (b:User {userId:'1'})")
                        .create("(a)-[r:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(b)")
                        .end({contactAdded: startTime})
                        .send();
                })
                .then(function () {
                    return db.cypher().match("(a:User {userId:'5'}), (b:User {userId:'1'})")
                        .create("(a)-[r:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(b)")
                        .end({contactAdded: startTime})
                        .send();
                });
        });
    });

    afterEach(function (done) {
        requestHandler.logout(done);
    });


    it('Request only with forename - Return correct sorted list (Contacts first)', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/contact/search', {
                search: 'user',
                maxItems: 4,
                isSuggestion: false
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.length.should.equal(4);
            res.body[0].id.should.equal('6');
            res.body[0].name.should.equal('user Meier6');
            res.body[0].type.should.equal('Freund');
            res.body[0].contactAdded.should.least(startTime);
            res.body[0].userAdded.should.least(startTime);
            res.body[0].connected.should.equal('both');
            should.exist(res.body[0].profileUrl);
            res.body[1].id.should.equal('2');
            res.body[1].name.should.equal('user2 Meier2');
            res.body[1].type.should.equal('Familie');
            should.not.exist(res.body[1].userAdded);
            res.body[1].contactAdded.should.least(startTime);
            res.body[1].connected.should.equal('userToContact');
            should.exist(res.body[1].profileUrl);
            res.body[2].id.should.equal('4');
            res.body[2].name.should.equal('user Meier4');
            res.body[2].connected.should.equal('none');
            should.not.exist(res.body[2].type);
            should.exist(res.body[2].profileUrl);
            res.body[3].name.should.equal('user Meier5');
            should.not.exist(res.body[3].contactAdded);
            res.body[3].userAdded.should.least(startTime);
            res.body[3].connected.should.equal('contactToUser');
            should.not.exist(res.body[3].type);
            should.exist(res.body[3].profileUrl);
        });
    });

    it('Request with forename and surename - Return correct sorted list', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/contact/search', {
                search: 'user2 Meier',
                maxItems: 2,
                isSuggestion: false
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.length.should.equal(2);
            res.body[0].id.should.equal('2');
            res.body[0].name.should.equal('user2 Meier2');
            res.body[0].type.should.equal('Familie');
            should.exist(res.body[0].profileUrl);
            res.body[1].id.should.equal('3');
            res.body[1].name.should.equal('user2 Meier3');
            should.not.exist(res.body[1].type);
            should.exist(res.body[1].profileUrl);
        });
    });

    it('Request with only surname - Return correct sorted list', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/contact/search', {
                search: 'Meier',
                maxItems: 3,
                isSuggestion: false
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.length.should.equal(3);
            res.body[0].id.should.equal('6');
            res.body[0].name.should.equal('user Meier6');
            res.body[0].type.should.equal('Freund');
            should.exist(res.body[0].profileUrl);
            res.body[1].id.should.equal('2');
            res.body[1].name.should.equal('user2 Meier2');
            res.body[1].type.should.equal('Familie');
            should.exist(res.body[1].profileUrl);
            res.body[2].id.should.equal('4');
            res.body[2].name.should.equal('user Meier4');
            should.not.exist(res.body[2].type);
            should.exist(res.body[2].profileUrl);
        });
    });

    it('Request only with forename - Return correct sorted list in suggestion mode (Contacts first)', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/contact/search', {
                search: 'user',
                maxItems: 4,
                isSuggestion: true
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.length.should.equal(4);
            res.body[0].name.should.equal('user Meier6');
            should.not.exist(res.body[0].type);
            should.not.exist(res.body[0].id);
            should.not.exist(res.body[0].profileUrl);
            res.body[1].name.should.equal('user2 Meier2');
            should.not.exist(res.body[1].type);
            should.not.exist(res.body[1].id);
            should.not.exist(res.body[1].profileUrl);
            res.body[2].name.should.equal('user Meier4');
            should.not.exist(res.body[2].type);
            should.not.exist(res.body[2].id);
            should.not.exist(res.body[2].profileUrl);
            res.body[3].name.should.equal('user Meier5');
            should.not.exist(res.body[3].type);
            should.not.exist(res.body[3].id);
            should.not.exist(res.body[3].profileUrl);
        });
    });
});
