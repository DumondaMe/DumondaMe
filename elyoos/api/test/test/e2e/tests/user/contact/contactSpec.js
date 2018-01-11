'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');

describe('Integration Tests for handling contacts', function () {

    let startTime;

    beforeEach(function () {

        startTime = Math.floor(moment.utc().valueOf() / 1000);

        return dbDsl.init(6).then(function () {
            dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
            dbDsl.createPrivacy(['1'], 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
            dbDsl.createPrivacy(['1', '5'], 'Familie', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
            dbDsl.createPrivacy(['1'], 'Bekannter', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

            dbDsl.createContactConnection('5', '1', 'Familie', startTime);
            dbDsl.inviteUser('6', '1');
            return dbDsl.sendToDb();
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Adding a contact - Return 200', function () {

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.post('/api/user/contact', {
                contactIds: ['5'],
                mode: 'addContact',
                description: 'Freund'
            });
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.statistic.length.should.equals(3);
            res.body.statistic[0].group.should.equals('Freund');
            res.body.statistic[0].count.should.equals(1);
            res.body.statistic[1].group.should.equals('Bekannter');
            res.body.statistic[1].count.should.equals(0);
            res.body.statistic[2].group.should.equals('Familie');
            res.body.statistic[2].count.should.equals(0);
            res.body.numberOfContacts.should.equals(1);
            return db.cypher().match("(u:User {userId: '1'})-[r:IS_CONTACT]->(u2:User {userId: '5'})")
                .return('r.type as type, r.contactAdded as contactAdded')
                .end().send();
        }).then(function (user) {
            user.length.should.equals(1);
            user[0].type.should.equals('Freund');
            user[0].contactAdded.should.least(startTime);
        });
    });

    it('Adding a contact and remove invitations- Return 200', function () {

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.post('/api/user/contact', {
                contactIds: ['6'],
                mode: 'addContact',
                description: 'Freund'
            });
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(u:User {userId: '1'})<-[:HAS_INVITED]->(:User {userId: '6'})")
                .return('u')
                .end().send();
        }).then(function (user) {
            user.length.should.equals(0);
            return db.cypher().match("(u:User {userId: '1'})-[r:IS_CONTACT]->(u2:User {userId: '6'})")
                .return('r.type as type, r.contactAdded as contactAdded')
                .end().send();
        }).then(function (user) {
            user.length.should.equals(1);
            user[0].type.should.equals('Freund');
            user[0].contactAdded.should.least(startTime);
        });
    });

    it('Invalid Adding a contact because missing type - Return 400', function () {

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.post('/api/user/contact', {
                contactIds: ['5'],
                mode: 'addContact'
            });
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(u:User {userId: '1'})-[r:IS_CONTACT]->(u2:User {userId: '5'})")
                .return('r.type as type, r.contactAdded as contactAdded')
                .end().send();
        }).then(function (user) {
            user.length.should.equals(0);
        });
    });

    it('Invalid Adding a contact because type does not exist - Return 400', function () {

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.post('/api/user/contact', {
                contactIds: ['5'],
                mode: 'addContact',
                description: 'Freund1'
            });
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(u:User {userId: '1'})-[r:IS_CONTACT]->(u2:User {userId: '5'})")
                .return('r.type as type, r.contactAdded as contactAdded')
                .end().send();
        }).then(function (user) {
            user.length.should.equals(0);
        });
    });

    it('Adding multiple contacts and get all contacts of the user - Return 200', function () {

        let now = Math.floor(moment.utc().valueOf() / 1000) - 1;
        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.post('/api/user/contact', {
                contactIds: ['2', '3', '5'],
                mode: 'addContact',
                description: 'Freund'
            });
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.statistic.length.should.equals(3);
            res.body.statistic[0].group.should.equals('Freund');
            res.body.statistic[0].count.should.equals(3);
            res.body.statistic[1].group.should.equals('Bekannter');
            res.body.statistic[1].count.should.equals(0);
            res.body.statistic[2].group.should.equals('Familie');
            res.body.statistic[2].count.should.equals(0);
            res.body.numberOfContacts.should.equals(3);
            return requestHandler.post('/api/user/contact', {
                contactIds: ['4'],
                mode: 'addContact',
                description: 'Familie'
            });
        }).then(function (res) {
            res.body.statistic.length.should.equals(3);
            res.body.statistic[0].group.should.equals('Freund');
            res.body.statistic[0].count.should.equals(3);
            res.body.statistic[1].group.should.equals('Familie');
            res.body.statistic[1].count.should.equals(1);
            res.body.statistic[2].group.should.equals('Bekannter');
            res.body.statistic[2].count.should.equals(0);
            res.body.numberOfContacts.should.equals(4);
            res.status.should.equal(200);
            return requestHandler.get('/api/user/contact', {
                maxItems: 5,
                skip: 0
            });
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.contacts.length.should.equal(4);
            res.body.contacts[0].userId.should.equal("2");
            res.body.contacts[0].type.should.equal("Freund");
            res.body.contacts[0].name.should.equal("user Meier2");
            res.body.contacts[0].contactAdded.should.least(now);
            res.body.contacts[3].userId.should.equal("5");
            res.body.contacts[3].type.should.equal("Freund");
            res.body.contacts[3].name.should.equal("user Meier5");
            res.body.contacts[3].contactAdded.should.least(now);
            res.body.contacts[3].userAdded.should.least(now);

            //statistic
            res.body.statistic.length.should.equal(3);
            res.body.statistic[0].group.should.equal("Freund");
            res.body.statistic[0].count.should.equal(3);
            res.body.statistic[1].group.should.equal("Familie");
            res.body.statistic[1].count.should.equal(1);

            //
            res.body.numberOfContacts.should.equal(4);

            //Privacy settings
            res.body.privacySettings.length.should.equal(3);
            res.body.privacySettings[0].type.should.equal('Bekannter');
            res.body.privacySettings[1].type.should.equal('Familie');
            res.body.privacySettings[2].type.should.equal('Freund');
        });
    });

    it('Getting only the user of a category back - Return 200', function () {

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.post('/api/user/contact', {
                contactIds: ['2', '3', '5'],
                mode: 'addContact',
                description: 'Freund'
            });
        }).then(function (res) {
            res.status.should.equal(200);
            return requestHandler.post('/api/user/contact', {
                contactIds: ['4'],
                mode: 'addContact',
                description: 'Familie'
            });
        }).then(function (res) {
            res.status.should.equal(200);
            return requestHandler.get('/api/user/contact', {
                maxItems: 5,
                skip: 0,
                types: 'Freund'
            });
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.contacts.length.should.equal(3);
            res.body.numberOfContacts.should.equal(3);
            return requestHandler.get('/api/user/contact', {
                maxItems: 5,
                skip: 0,
                types: 'Familie'
            });
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.contacts.length.should.equal(1);
            res.body.numberOfContacts.should.equal(1);
            return requestHandler.get('/api/user/contact', {
                maxItems: 5,
                skip: 0,
                types: 'Freund,Familie'
            });
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.contacts.length.should.equal(4);
            res.body.numberOfContacts.should.equal(4);
        });
    });

    it('Adding multiple contacts and get only subset of the contacts back - Return 200', function () {

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.post('/api/user/contact', {
                contactIds: ['2', '3', '4', '5'],
                mode: 'addContact',
                description: 'Freund'
            });
        }).then(function (res) {
            res.status.should.equal(200);
            return requestHandler.get('/api/user/contact', {
                maxItems: 2,
                skip: 2
            });
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.contacts.length.should.equal(2);
            res.body.contacts[0].userId.should.equal("4");
            res.body.contacts[0].type.should.equal("Freund");
            res.body.contacts[0].name.should.equal("user Meier4");

            //statistic
            res.body.statistic.length.should.equal(3);
            res.body.statistic[0].group.should.equal("Freund");
            res.body.statistic[0].count.should.equal(4);
            res.body.statistic[1].group.should.equals('Bekannter');
            res.body.statistic[1].count.should.equals(0);
            res.body.statistic[2].group.should.equals('Familie');
            res.body.statistic[2].count.should.equals(0);

            //number of contacts
            res.body.numberOfContacts.should.equal(4);
        });
    });


    it('Add the same User two times as contact should result in one contact connection- Return 200', function () {

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.post('/api/user/contact', {
                contactIds: ['2'],
                mode: 'addContact',
                description: 'Freund'
            });
        }).then(function (res) {
            res.status.should.equal(200);
            return requestHandler.post('/api/user/contact', {
                contactIds: ['2'],
                mode: 'addContact',
                description: 'Bekannter'
            });
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

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.post('/api/user/contact', {
                contactIds: ['2'],
                mode: 'blockContact'
            });
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
                mode: 'addContact',
                description: 'Freund'
            });
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
            return db.cypher().match("(u:User {userId: {userId}})-[r:IS_CONTACT {type: 'Freund'}]->(u2:User {userId: {contact}})")
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

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.post('/api/user/contact', {
                contactIds: ['2'],
                mode: 'addContact',
                description: 'Freund'
            });
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
            });
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

    it('Blocking of user removes invitation - Return 200', function () {

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.post('/api/user/contact', {
                contactIds: ['6'],
                mode: 'blockContact',
                description: 'Freund'
            });
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(user:User {userId: '1'})<-[:HAS_INVITED]-(:User {userId: '6'})")
                .return('user').end().send();
        }).then(function (user) {
            user.length.should.equals(0);
        });
    });

    it('Contact are unblocked - Return 200', function () {

        return db.cypher().match("(a:User {userId:'1'}), (b:User)")
            .where('b.userId IN {contactIds}')
            .create("(a)-[r:IS_CONTACT {type: 'Familie'}]->(b)")
            .end({contactIds: ['2', '3', '5']})
            .send()
            .then(function () {
                return requestHandler.login(users.validUser);
            })
            .then(function () {
                return requestHandler.post('/api/user/contact', {
                    contactIds: ['2'],
                    mode: 'blockContact'
                });
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.statistic.length.should.equals(3);
                res.body.statistic[0].group.should.equals('Familie');
                res.body.statistic[0].count.should.equals(2);
                res.body.statistic[1].group.should.equals('Bekannter');
                res.body.statistic[1].count.should.equals(0);
                res.body.statistic[2].group.should.equals('Freund');
                res.body.statistic[2].count.should.equals(0);
                res.body.numberOfContacts.should.equals(2);
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
                    mode: 'unblockContact'
                });
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.statistic.length.should.equals(3);
                res.body.statistic[0].group.should.equals('Familie');
                res.body.statistic[0].count.should.equals(2);
                res.body.statistic[1].group.should.equals('Bekannter');
                res.body.statistic[1].count.should.equals(0);
                res.body.statistic[2].group.should.equals('Freund');
                res.body.statistic[2].count.should.equals(0);
                res.body.numberOfContacts.should.equals(2);
                return db.cypher().match('(u:User {userId: {userId}})-[r:IS_BLOCKED]->(u2:User {userId: {contact}})')
                    .return('r')
                    .end({
                        userId: '1',
                        contact: '2'
                    })
                    .send();
            }).then(function (rel) {
                rel.length.should.equals(0);
            });
    });

    it('Change State after adding contact - Return 200', function () {

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.post('/api/user/contact', {
                contactIds: ['2'],
                mode: 'addContact',
                description: 'Bekannter'
            });
        }).then(function (res) {
            res.status.should.equal(200);
            return requestHandler.post('/api/user/contact', {
                contactIds: ['2'],
                mode: 'changeState',
                description: 'Freund'
            });
        }).then(function (res) {
            res.status.should.equal(200);
            //statistic
            res.body.statistic.length.should.equal(3);
            res.body.statistic[0].group.should.equal("Freund");
            res.body.statistic[0].count.should.equal(1);
            res.body.statistic[1].group.should.equals('Bekannter');
            res.body.statistic[1].count.should.equals(0);
            res.body.statistic[2].group.should.equals('Familie');
            res.body.statistic[2].count.should.equals(0);
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

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.post('/api/user/contact', {
                contactIds: ['2'],
                mode: 'blockContact'
            });
        }).then(function (res) {
            res.status.should.equal(200);
            return requestHandler.post('/api/user/contact', {
                contactIds: ['2'],
                mode: 'changeState',
                description: 'Freund'
            });
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
            .then(function () {
                return requestHandler.del('/api/user/contact', {
                    contactIds: ['2', '3']
                });
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.statistic.length.should.equals(3);
                res.body.statistic[0].group.should.equals('Familie');
                res.body.statistic[0].count.should.equals(1);
                res.body.statistic[1].group.should.equals('Bekannter');
                res.body.statistic[1].count.should.equals(0);
                res.body.statistic[2].group.should.equals('Freund');
                res.body.statistic[2].count.should.equals(0);
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
