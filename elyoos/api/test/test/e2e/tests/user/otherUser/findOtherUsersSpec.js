'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let should = require('chai').should();
let moment = require('moment');

describe('Integration Tests for finding other users', function () {

    let startTime;

    before(function () {
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return db.clearDatabase().then(function () {

            let commands = [];
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', emailNormalized: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', userId: '1'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user2 Meier2', forename: 'user2', surname: 'Meier2', userId: '2'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user2 Meier3', forename: 'user2', surname: 'Meier3', userId: '3'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier4', forename: 'user', surname: 'Meier4', userId: '4'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier5', forename: 'user', surname: 'Meier5', userId: '5'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier6', forename: 'user', surname: 'Meier6', userId: '6'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'ruser rmeier', forename: 'ruser', surname: 'rmeier', userId: '7'})").end().getCommand());

            commands.push(db.cypher().match("(u:User {userId: '2'})")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: false})").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '3'})")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: false})").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '4'})")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: false})").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '5'})")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: true})").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '5'})")
                .create("(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: false})").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '6'})")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: false})").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '6'})")
                .create("(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '7'})")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: false})").end().getCommand());

            commands.push(db.cypher().match("(a:User {userId:'1'}), (b:User {userId:'2'})")
                .create("(a)-[r:IS_CONTACT {type: 'Familie', contactAdded: {contactAdded}}]->(b)").end({contactAdded: startTime}).getCommand());
            commands.push(db.cypher().match("(a:User {userId:'1'}), (b:User {userId:'6'})")
                .create("(a)-[r:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(b)").end({contactAdded: startTime}).getCommand());
            commands.push(db.cypher().match("(a:User {userId:'6'}), (b:User {userId:'1'})")
                .create("(a)-[r:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(b)").end({contactAdded: startTime}).getCommand());
            return db.cypher().match("(a:User {userId:'5'}), (b:User {userId:'1'})")
                .create("(a)-[r:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(b)").end({contactAdded: startTime}).send(commands);

        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Request only with forename - Return correct sorted list (Contacts first)', function () {

            /*return requestHandler.login(users.validUser).then(function () {
                return requestHandler.get('/api/user/contact/search', {
                    search: 'User',
                    maxItems: 10,
                    isSuggestion: false
                });
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.length.should.equal(5);
                res.body[0].userId.should.equal('6');
                res.body[0].name.should.equal('user Meier6');
                res.body[0].type.should.equal('Freund');
                res.body[0].contactAdded.should.least(startTime);
                res.body[0].userAdded.should.least(startTime);
                res.body[0].profileUrl.should.equal('profileImage/6/thumbnail.jpg');

                res.body[1].userId.should.equal('2');
                res.body[1].name.should.equal('user2 Meier2');
                res.body[1].type.should.equal('Familie');
                should.not.exist(res.body[1].userAdded);
                res.body[1].contactAdded.should.least(startTime);
                res.body[1].profileUrl.should.equal('profileImage/default/thumbnail.jpg');

                res.body[2].userId.should.equal('4');
                res.body[2].name.should.equal('user Meier4');
                should.not.exist(res.body[2].type);
                res.body[2].profileUrl.should.equal('profileImage/default/thumbnail.jpg');

                res.body[3].name.should.equal('user Meier5');
                should.not.exist(res.body[3].contactAdded);
                res.body[3].userAdded.should.least(startTime);
                should.not.exist(res.body[3].type);
                res.body[3].profileUrl.should.equal('profileImage/default/thumbnail.jpg');

                res.body[4].name.should.equal('user2 Meier3');
                should.not.exist(res.body[4].contactAdded);
                should.not.exist(res.body[4].type);
                res.body[4].profileUrl.should.equal('profileImage/default/thumbnail.jpg');
            });*/
    });

    it('Request only with forename in suggestion mode- Return correct sorted list (Contacts first)', function () {

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.get('/api/user/otherUser/search', {
                search: 'User',
                maxItems: 10,
                isSuggestion: true
            });
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.length.should.equal(5);
            res.body[0].name.should.equal('user Meier6');
            res.body[1].name.should.equal('user2 Meier2');
            res.body[2].name.should.equal('user Meier4');
            res.body[3].name.should.equal('user Meier5');
            res.body[4].name.should.equal('user2 Meier3');
        });
    });

    it('Request with forename and surname - Return correct sorted list', function () {

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.get('/api/user/otherUser/search', {
                search: 'User2 meier',
                maxItems: 5,
                isSuggestion: false
            });
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.length.should.equal(2);
            res.body[0].userId.should.equal('2');
            res.body[0].name.should.equal('user2 Meier2');
            res.body[0].type.should.equal('Familie');
            should.exist(res.body[0].profileUrl);
            res.body[1].userId.should.equal('3');
            res.body[1].name.should.equal('user2 Meier3');
            should.not.exist(res.body[1].type);
            should.exist(res.body[1].profileUrl);
        });
    });

    it('Request with forename and surname in suggestion mode- Return correct sorted list', function () {

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.get('/api/user/otherUser/search', {
                search: 'User2 meier',
                maxItems: 5,
                isSuggestion: true
            });
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.length.should.equal(2);
            res.body[0].name.should.equal('user2 Meier2');
            res.body[1].name.should.equal('user2 Meier3');
        });
    });

    it('Request with only surname - Return correct sorted list', function () {

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.get('/api/user/otherUser/search', {
                search: 'meier',
                maxItems: 3,
                isSuggestion: false
            });
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.length.should.equal(3);
            res.body[0].userId.should.equal('6');
            res.body[0].name.should.equal('user Meier6');
            res.body[0].type.should.equal('Freund');
            should.exist(res.body[0].profileUrl);
            res.body[1].userId.should.equal('2');
            res.body[1].name.should.equal('user2 Meier2');
            res.body[1].type.should.equal('Familie');
            should.exist(res.body[1].profileUrl);
            res.body[2].userId.should.equal('4');
            res.body[2].name.should.equal('user Meier4');
            should.not.exist(res.body[2].type);
            should.exist(res.body[2].profileUrl);
        });
    });

    it('Request with only surname in suggestion mode - Return correct sorted list', function () {

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.get('/api/user/otherUser/search', {
                search: 'meier',
                maxItems: 3,
                isSuggestion: true
            });
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.length.should.equal(3);
            res.body[0].name.should.equal('user Meier6');
            res.body[1].name.should.equal('user2 Meier2');
            res.body[2].name.should.equal('user Meier4');
        });
    });

    it('Request only with forename - Return correct sorted list in suggestion mode (Contacts first)', function () {

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.get('/api/user/otherUser/search', {
                search: 'user',
                maxItems: 4,
                isSuggestion: true
            });
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.length.should.equal(4);
            res.body[0].name.should.equal('user Meier6');
            res.body[1].name.should.equal('user2 Meier2');
            res.body[2].name.should.equal('user Meier4');
            res.body[3].name.should.equal('user Meier5');
        });
    });

    it('Block a user and afterwards search the user - Return blocked user', function () {

        /*return requestHandler.login(users.validUser).then(function () {
            return requestHandler.post('/api/user/contact', {
                contactIds: ['2'],
                mode: 'blockContact'
            });
        }).then(function () {
            return requestHandler.get('/api/user/contact/search', {
                search: 'user2 Meier2',
                maxItems: 3,
                isSuggestion: false
            });
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.length.should.equal(1);
            res.body[0].userId.should.equal('2');
            res.body[0].name.should.equal('user2 Meier2');
            should.not.exist(res.body[0].type);
            res.body[0].blocked.should.be.true;
            should.exist(res.body[0].profileUrl);
        });*/
    });
});
