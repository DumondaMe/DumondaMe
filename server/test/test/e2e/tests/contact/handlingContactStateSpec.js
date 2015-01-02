'use strict';

var app = require('../../../../../server');
var users = require('../util/user');
var db = require('../util/db');
var requestHandler = require('../util/request');
var should = require('chai').should();

describe('Integration Tests for handling contact states', function () {

    var requestAgent;

    beforeEach(function () {

        var createUser = "(:User {email: {email}, password: {password}, forename: {forename}, surname: {surname}, name: {name}, userId: {userId}})";

        return db.clearDatabase().then(function () {
            return db.cypher().create(createUser)
                .send({
                    email: 'user@irgendwo.ch',
                    password: '1234',
                    name: 'user Meier',
                    forename: 'user',
                    surname: 'Meier',
                    userId: '1'
                })
                .then(function () {
                    return db.cypher().create(createUser)
                        .send({
                            email: 'user@irgendwo2.ch',
                            password: '1234',
                            name: 'user2 Meier2',
                            forename: 'user2',
                            surname: 'Meier2',
                            userId: '2'
                        });
                })
                .then(function () {
                    return db.cypher().create(createUser)
                        .send({
                            email: 'user@irgendwo3.ch',
                            password: '1234',
                            name: 'user3 Meier3',
                            forename: 'user3',
                            surname: 'Meier3',
                            userId: '3'
                        });
                })
                .then(function () {
                    return db.cypher().create(createUser)
                        .send({
                            email: 'user@irgendwo4.ch',
                            password: '1234',
                            name: 'user4 Meier4',
                            forename: 'user4',
                            surname: 'Meier4',
                            userId: '4'
                        });
                })
                .then(function () {
                    return db.cypher().create(createUser)
                        .send({
                            email: 'user@irgendwo5.ch',
                            password: '1234',
                            name: 'user5 Meier5',
                            forename: 'user5',
                            surname: 'Meier5',
                            userId: '5'
                        });
                });
        });
    });

    afterEach(function (done) {
        requestHandler.logout(done);
    });

    it('Get all Contacts of the user - Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/contact', {
                contactIds: ['2', '3', '5'],
                mode: 'addContact',
                description: 'Freund'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return requestHandler.get('/api/user/contact', requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.length.should.equal(3);
            res.body[0].id.should.equal("2");
            res.body[0].type.should.equal("Freund");
            res.body[0].name.should.equal("user2 Meier2");
        });
    });


    it('Add the same User two times as contact should result in one contact connection- Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/contact', {
                contactIds: ['2'],
                mode: 'addContact',
                description: 'Freund'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return requestHandler.post('/api/user/contact', {
                contactIds: ['2'],
                mode: 'addContact',
                description: 'Freun'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match('(u:User {userId: {userId}})-[r:IS_CONTACT]->(u2:User {userId: {contact}})')
                .return('r.type as type')
                .send({
                    userId: '1',
                    contact: '2'
                });
        }).then(function (user) {
            user.length.should.equals(1);
            user[0].type.should.equals('Freund');
        });
    });

    it('If user is blocked, add contact removes blocked state - Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/contact', {
                contactIds: ['2'],
                mode: 'blockContact'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match('(u:User {userId: {userId}})-[r:IS_BLOCKED]->(u2:User {userId: {contact}})')
                .return('r')
                .send({
                    userId: '1',
                    contact: '2'
                });
        }).then(function (rel) {
            rel.length.should.equals(1);
            return requestHandler.post('/api/user/contact', {
                contactIds: ['2'],
                mode: 'addContact'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match('(u:User {userId: {userId}})-[r:IS_BLOCKED]->(u2:User {userId: {contact}})')
                .return('r')
                .send({
                    userId: '1',
                    contact: '2'
                });
        }).then(function (rel) {
            rel.length.should.equals(0);
            return db.cypher().match('(u:User {userId: {userId}})-[r:IS_CONTACT]->(u2:User {userId: {contact}})')
                .return('r')
                .send({
                    userId: '1',
                    contact: '2'
                });
        }).then(function (rel) {
            rel.length.should.equals(1);
        });
    });

    it('Contact is blocked after it is added to the contacts - Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/contact', {
                contactIds: ['2'],
                mode: 'addContact',
                description: 'Freund'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match('(u:User {userId: {userId}})-[r:IS_CONTACT]->(u2:User {userId: {contact}})')
                .return('r')
                .send({
                    userId: '1',
                    contact: '2'
                });
        }).then(function (rel) {
            rel.length.should.equals(1);
            return requestHandler.post('/api/user/contact', {
                contactIds: ['2'],
                mode: 'blockContact'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match('(u:User {userId: {userId}})-[r:IS_CONTACT]->(u2:User {userId: {contact}})')
                .return('r')
                .send({
                    userId: '1',
                    contact: '2'
                });
        }).then(function (rel) {
            rel.length.should.equals(0);
            return db.cypher().match('(u:User {userId: {userId}})-[r:IS_BLOCKED]->(u2:User {userId: {contact}})')
                .return('r')
                .send({
                    userId: '1',
                    contact: '2'
                });
        }).then(function (rel) {
            rel.length.should.equals(1);
        });
    });

    it('Change State after adding contact - Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/contact', {
                contactIds: ['2'],
                mode: 'addContact',
                description: 'Bekannter'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return requestHandler.post('/api/user/contact', {
                contactIds: ['2'],
                mode: 'changeState',
                description: 'Freund'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match('(u:User {userId: {userId}})-[r:IS_CONTACT]->(u2:User {userId: {contact}})')
                .return('r.type as type')
                .send({
                    userId: '1',
                    contact: '2'
                });
        }).then(function (rel) {
            rel.length.should.equals(1);
            rel[0].type.should.equals('Freund');
        });
    });

    it('Change State after user is blocked is a invalid operation - Return 400', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/contact', {
                contactIds: ['2'],
                mode: 'blockContact'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return requestHandler.post('/api/user/contact', {
                contactIds: ['2'],
                mode: 'changeState',
                description: 'Freund'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match('(u:User {userId: {userId}})-[r:IS_CONTACT]->(u2:User {userId: {contact}})')
                .return('r.type as type')
                .send({
                    userId: '1',
                    contact: '2'
                });
        }).then(function (rel) {
            rel.length.should.equals(0);
            return db.cypher().match('(u:User {userId: {userId}})-[r:IS_BLOCKED]->(u2:User {userId: {contact}})')
                .return('r')
                .send({
                    userId: '1',
                    contact: '2'
                });
        }).then(function (rel) {
            rel.length.should.equals(1);
        });
    });
});
