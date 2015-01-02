'use strict';

var app = require('../../../../../server');
var users = require('../util/user');
var db = require('../util/db');
var requestHandler = require('../util/request');
var should = require('chai').should();

describe('Integration Tests for finding other users', function () {

    before(function () {
        var createUser = "(:User {email: {email}, password: {password}, name: {name}, userId: {userId}})";
        return db.clearDatabase().then(function () {
            return db.cypher().create(createUser)
                .send({
                    email: 'user@irgendwo.ch',
                    password: '1234',
                    name: 'user Meier',
                    userId: '1'
                })
                .then(function () {
                    return db.cypher().create(createUser)
                        .send({
                            email: 'user@irgendwo2.ch',
                            password: '1234',
                            name: 'user2 Meier2',
                            userId: '2'
                        });
                })
                .then(function () {
                    return db.cypher().create(createUser)
                        .send({
                            email: 'user@irgendwo3.ch',
                            password: '1234',
                            name: 'user2 Meier3',
                            userId: '3'
                        });
                })
                .then(function () {
                    return db.cypher().create(createUser)
                        .send({
                            email: 'user@irgendwo4.ch',
                            password: '1234',
                            name: 'user Meier4',
                            userId: '4'
                        });
                })
                .then(function () {
                    return db.cypher().create(createUser)
                        .send({
                            email: 'user@irgendwo5.ch',
                            password: '1234',
                            name: 'user Meier5',
                            userId: '5'
                        });
                })
                .then(function () {
                    return db.cypher().create(createUser)
                        .send({
                            email: 'user@irgendwo6.ch',
                            password: '1234',
                            name: 'user Meier6',
                            userId: '6'
                        });
                })
                .then(function () {
                    return db.cypher().create(createUser)
                        .send({
                            email: 'user@irgendwo7.ch',
                            password: '1234',
                            name: 'etwasganzanderes nochwas anderes',
                            userId: '7'
                        });
                })
                .then(function () {
                    return db.cypher().match("(a:User {userId:'1'}), (b:User {userId:'2'})")
                        .create("(a)-[r:IS_CONTACT {type: 'Familie'}]->(b)")
                        .send();
                })
                .then(function () {
                    return db.cypher().match("(a:User {userId:'1'}), (b:User {userId:'6'})")
                        .create("(a)-[r:IS_CONTACT {type: 'Freund'}]->(b)")
                        .send();
                });
        });
    });

    afterEach(function (done) {
        requestHandler.logout(done);
    });


    it('Request only with forename - Return correct sorted list (Contacts first)', function () {

        var requestAgent;

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/contact/search', {
                search: 'user',
                maxItems: 4
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.length.should.equal(4);
            res.body[0].name.should.equal('user Meier6');
            res.body[0].type.should.equal('Freund');
            res.body[1].name.should.equal('user2 Meier2');
            res.body[1].type.should.equal('Familie');
            res.body[2].name.should.equal('user Meier4');
            should.not.exist(res.body[2].type);
            res.body[3].name.should.equal('user Meier5');
            should.not.exist(res.body[3].type);
        });
    });

    it('Request with forename and surename - Return correct sorted list', function () {

        var requestAgent;

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/contact/search', {
                search: 'user2 Meier',
                maxItems: 10
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.length.should.equal(2);
            res.body[0].name.should.equal('user2 Meier2');
            res.body[0].type.should.equal('Familie');
            res.body[1].name.should.equal('user2 Meier3');
            should.not.exist(res.body[1].type);
        });
    });
});
