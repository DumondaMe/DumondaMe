'use strict';

var app = require('../../../../../server');
var users = require('../util/user');
var db = require('../util/db');
var requestHandler = require('../util/request');
var should = require('chai').should();
var moment = require('moment');

describe('Integration Tests for handling contacts', function () {

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
                            name: 'user3 Meier3',
                            forename: 'user3',
                            surname: 'Meier3',
                            userId: '3'
                        }).send()
                        .then(function () {
                            return db.cypher().match("(u:User {userId: '3'})")
                                .create("(u)-[:IS_VISIBLE_NO_CONTACT]->(:Visibility {profile: true, image: true})")
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
                            name: 'user5 Meier5',
                            forename: 'user5',
                            surname: 'Meier5',
                            userId: '5'
                        }).send()
                        .then(function () {
                            return db.cypher().match("(u:User {userId: '5'})")
                                .create("(u)-[:IS_VISIBLE_NO_CONTACT]->(:Visibility {profile: true, image: true})")
                                .end().send();
                        })
                        .then(function () {
                            return db.cypher().match("(u:User {userId: '5'})")
                                .create("(u)-[:IS_VISIBLE {type: 'Familie'}]->(:Visibility {profile: true, image: true})")
                                .end().send();
                        })
                        .then(function () {
                            return db.cypher().match("(u:User), (u2:User)")
                                .where("u.userId = '1' AND u2.userId = '5'")
                                .create("(u2)-[:IS_CONTACT {type: 'Familie'}]->(u)")
                                .end().send();
                        });
                });
        });
    });

    afterEach(function (done) {
        requestHandler.logout(done);
    });

    it('Adding a contact - Return 200', function () {

        var startTime = moment.utc().valueOf();
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/contact', {
                contactIds: ['5'],
                mode: 'addContact',
                description: 'Freund'
            }, requestAgent);
        }).then(function (res) {
            res.body.statistic.length.should.equals(1);
            res.body.statistic[0].type.should.equals('Freund');
            res.body.statistic[0].count.should.equals(1);
            res.body.numberOfContacts.should.equals(1);
            res.status.should.equal(200);
            return db.cypher().match("(u:User {userId: '1'})-[r:IS_CONTACT]->(u2:User {userId: '5'})")
                .return('r.type as type, r.contactAdded as contactAdded')
                .end().send();
        }).then(function (user) {
            user.length.should.equals(1);
            user[0].type.should.equals('Freund');
            user[0].contactAdded.should.least(startTime);
        });
    });

    it('Adding multiple contacts and get all contacts of the user - Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/contact', {
                contactIds: ['2', '3', '5'],
                mode: 'addContact',
                description: 'Freund'
            }, requestAgent);
        }).then(function (res) {
            res.body.statistic.length.should.equals(1);
            res.body.statistic[0].type.should.equals('Freund');
            res.body.statistic[0].count.should.equals(3);
            res.body.numberOfContacts.should.equals(3);
            res.status.should.equal(200);
            return requestHandler.post('/api/user/contact', {
                contactIds: ['4'],
                mode: 'addContact',
                description: 'Familie'
            }, requestAgent);
        }).then(function (res) {
            res.body.statistic.length.should.equals(2);
            res.body.statistic[0].type.should.equals('Freund');
            res.body.statistic[0].count.should.equals(3);
            res.body.statistic[1].type.should.equals('Familie');
            res.body.statistic[1].count.should.equals(1);
            res.body.numberOfContacts.should.equals(4);
            res.status.should.equal(200);
            return requestHandler.getWithData('/api/user/contact', {
                itemsPerPage: 5,
                skip: 0
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.contacts.length.should.equal(4);
            res.body.contacts[0].id.should.equal("2");
            res.body.contacts[0].type.should.equal("Freund");
            res.body.contacts[0].name.should.equal("user2 Meier2");
            res.body.contacts[1].connected.should.equal("userToContact");
            res.body.contacts[3].id.should.equal("5");
            res.body.contacts[3].type.should.equal("Freund");
            res.body.contacts[3].name.should.equal("user5 Meier5");
            res.body.contacts[3].connected.should.equal("both");

            //statistic
            res.body.statistic.length.should.equal(2);
            res.body.statistic[0].type.should.equal("Freund");
            res.body.statistic[0].count.should.equal(3);
            res.body.statistic[1].type.should.equal("Familie");
            res.body.statistic[1].count.should.equal(1);

            //
            res.body.numberOfContacts.should.equal(4);
        });
    });

    it('Getting only the user of a category back - Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/contact', {
                contactIds: ['2', '3', '5'],
                mode: 'addContact',
                description: 'Freund'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return requestHandler.post('/api/user/contact', {
                contactIds: ['4'],
                mode: 'addContact',
                description: 'Familie'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return requestHandler.getWithData('/api/user/contact', {
                itemsPerPage: 5,
                skip: 0,
                types: 'Freund'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.contacts.length.should.equal(3);
            res.body.contacts[0].connected.should.equal('userToContact');
            res.body.contacts[1].connected.should.equal('userToContact');
            res.body.contacts[2].connected.should.equal('both');
            res.body.contactsForPagination.should.equal(3);
            return requestHandler.getWithData('/api/user/contact', {
                itemsPerPage: 5,
                skip: 0,
                types: 'Familie'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.contacts.length.should.equal(1);
            res.body.contactsForPagination.should.equal(1);
            return requestHandler.getWithData('/api/user/contact', {
                itemsPerPage: 5,
                skip: 0,
                types: 'Freund,Familie'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.contacts.length.should.equal(4);
            res.body.contactsForPagination.should.equal(4);
        });
    });

    it('Adding multiple contacts and get only subset of the contacts back - Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/contact', {
                contactIds: ['2', '3', '4', '5'],
                mode: 'addContact',
                description: 'Freund'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return requestHandler.getWithData('/api/user/contact', {
                itemsPerPage: 2,
                skip: 2
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.contacts.length.should.equal(2);
            res.body.contacts[0].id.should.equal("4");
            res.body.contacts[0].type.should.equal("Freund");
            res.body.contacts[0].name.should.equal("user4 Meier4");

            //statistic
            res.body.statistic.length.should.equal(1);
            res.body.statistic[0].type.should.equal("Freund");
            res.body.statistic[0].count.should.equal(4);

            //number of contacts
            res.body.numberOfContacts.should.equal(4);
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
                .end({
                    userId: '1',
                    contact: '2'
                })
                .send();
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
                .end({
                    userId: '1',
                    contact: '2'
                })
                .send();
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
                .end({
                    userId: '1',
                    contact: '2'
                })
                .send();
        }).then(function (rel) {
            rel.length.should.equals(0);
            return db.cypher().match('(u:User {userId: {userId}})-[r:IS_CONTACT]->(u2:User {userId: {contact}})')
                .return('r')
                .end({
                    userId: '1',
                    contact: '2'
                })
                .send();
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
                .end({
                    userId: '1',
                    contact: '2'
                })
                .send();
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
                .end({
                    userId: '1',
                    contact: '2'
                })
                .send();
        }).then(function (rel) {
            rel.length.should.equals(0);
            return db.cypher().match('(u:User {userId: {userId}})-[r:IS_BLOCKED]->(u2:User {userId: {contact}})')
                .return('r')
                .end({
                    userId: '1',
                    contact: '2'
                })
                .send();
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
                .end({
                    userId: '1',
                    contact: '2'
                })
                .send();
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
                .end({
                    userId: '1',
                    contact: '2'
                })
                .send();
        }).then(function (rel) {
            rel.length.should.equals(0);
            return db.cypher().match('(u:User {userId: {userId}})-[r:IS_BLOCKED]->(u2:User {userId: {contact}})')
                .return('r')
                .end({
                    userId: '1',
                    contact: '2'
                })
                .send();
        }).then(function (rel) {
            rel.length.should.equals(1);
        });
    });

    it('Delete two contact relationships- Return 200', function () {

        return db.cypher().match("(a:User {userId:'1'}), (b:User)")
            .where('b.userId IN {contactIds}')
            .create("(a)-[r:IS_CONTACT {type: 'Familie'}]->(b)")
            .end({contactIds: ['2', '3', '5']})
            .send()
            .then(function () {
                return requestHandler.login(users.validUser);
            })
            .then(function (agent) {
                requestAgent = agent;
                return requestHandler.del('/api/user/contact', {
                    contactIds: ['2', '3']
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.statistic.length.should.equals(1);
                res.body.statistic[0].type.should.equals('Familie');
                res.body.statistic[0].count.should.equals(1);
                res.body.numberOfContacts.should.equals(1);
                return db.cypher().match("(u:User {userId: '1'})-[:IS_CONTACT]->(u2:User)")
                    .return('u2.userId AS id')
                    .send();
            }).then(function (user) {
                user.length.should.equals(1);
                user[0].id.should.equals('5');
            });
    });
});
