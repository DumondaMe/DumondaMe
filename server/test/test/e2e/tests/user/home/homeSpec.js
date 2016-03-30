'use strict';

var users = require('../../util/user');
var db = require('../../util/db');
var requestHandler = require('../../util/request');
var should = require('chai').should();
var moment = require('moment');

describe('Integration Tests for getting home screen information for a user', function () {

    var requestAgent;

    beforeEach(function () {

        var commands = [];
        return db.clearDatabase().then(function () {
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', surname: 'Meier', forename:'user', userId: '1'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier2', forename: 'user2', userId: '2'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier3', forename: 'user3', userId: '3'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier4', forename: 'user4', userId: '4'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier5', forename: 'user5', userId: '5'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier5', forename: 'user6', userId: '6'})").end().getCommand());
            commands.push(db.cypher().create("(:Page {title: 'bookPage1Title', label: 'Book', description: 'bookPage1', language: 'de', created: 501, pageId: '0'," +
                "author: 'Hans Muster', publishDate: 1000, category: {category}})").end({category: ['health', 'personalDevelopment']}).getCommand());
            return db.cypher().create("(:Page {title: 'bookPage2Title', label: 'Youtube', description: 'bookPage2', language: 'de', created: 501, pageId: '1'," +
                "author: 'Hans Muster', publishDate: 1000, link: 'www.test.ch', category: {category}})").end({category: ['health', 'personalDevelopment']}).send(commands);

        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });
    

    it('Getting the contacts who have added user since last login', function () {

        var commands = [], startTime = Math.floor(moment.utc().valueOf() / 1000);

        commands.push(db.cypher().match("(u:User {userId: '1'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false, profileData: true, contacts: true})")
            .end().getCommand());
        commands.push(db.cypher().match("(u:User {userId: '1'})")
            .set("u", {lastLogin: startTime - 604700})
            .end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(a)")
            .end({contactAdded: startTime - 1000}).getCommand());
        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '3'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(a)")
            .end({contactAdded: startTime - 604500}).getCommand());
        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '4'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(a)")
            .end({contactAdded: startTime - 604600}).getCommand());
        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '5'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(a)")
            .end({contactAdded: startTime - 604700}).getCommand());
        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '6'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(a)")
            .end({contactAdded: startTime - 604800}).getCommand());
        commands.push(db.cypher().match("(u:User {userId: '2'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: true, profileData: true, contacts: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})")
            .end().getCommand());
        commands.push(db.cypher().match("(u:User {userId: '3'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: false, profileData: true, contacts: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: false})").end().getCommand());
        commands.push(db.cypher().match("(u:User {userId: '4'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: false, profileData: true, contacts: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: false, image: true})").end().getCommand());
        commands.push(db.cypher().match("(u:User {userId: '5'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: false, profileData: true, contacts: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: false, image: true})").end().getCommand());
        commands.push(db.cypher().match("(u:User {userId: '6'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: false, profileData: true, contacts: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})").end().getCommand());

        return db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_ADMIN]->(a)")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).
            then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/home', {
                    skipBlog: 0,
                    skipRecommendation: 0,
                    maxItems: 10
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.contacting.users.length.should.equals(3);
                res.body.contacting.users[0].userId.should.equals('2');
                res.body.contacting.users[0].name.should.equals('user Meier2');
                res.body.contacting.users[0].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
                res.body.contacting.users[0].contactAdded.should.equals(startTime - 1000);

                res.body.contacting.users[1].userId.should.equals('3');
                res.body.contacting.users[1].name.should.equals('user Meier3');
                res.body.contacting.users[1].profileUrl.should.equals('profileImage/default/thumbnail.jpg');
                res.body.contacting.users[1].contactAdded.should.equals(startTime - 604500);

                res.body.contacting.users[2].userId.should.equals('4');
                res.body.contacting.users[2].name.should.equals('user Meier4');
                res.body.contacting.users[2].profileUrl.should.equals('profileImage/default/thumbnail.jpg');
                res.body.contacting.users[2].contactAdded.should.equals(startTime - 604600);

                res.body.contacting.numberOfContacting.should.equals(4);
            });
    });
    

    it('Showing recommendations which has correct visible for contact type', function () {

        var commands = [], startTime = Math.floor(moment.utc().valueOf() / 1000);

        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {created: 503, rating: 1, comment: 'irgendwas', recommendationId: '0'})-[:RECOMMENDS]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:Recommendation {recommendationId: '0'})")
            .create("(b)-[:PINWALL_DATA]->(a)")
            .end().getCommand());

        commands.push(db.cypher().match("(u:User)")
            .where("u.userId IN ['1','2']")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false, profileData: true, contacts: true, pinwall: false}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true, pinwall: true})," +
                "(u)-[:HAS_PRIVACY {type: 'Bekannter'}]->(:Privacy {profile: true, image: true, pinwall: false})")
            .end().getCommand());

        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(a)")
            .end({contactAdded: startTime}).getCommand());
        commands.push(db.cypher().match("(a:User {userId: '2'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(a)")
            .end({contactAdded: startTime}).getCommand());


        return db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_ADMIN]->(a)")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).
            then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/home', {
                    skipBlog: 0,
                    skipRecommendation: 0,
                    maxItems: 10
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(1);
            });
    });

    it('Showing recommendations which has correct visible for no contact visible setting', function () {

        var commands = [], startTime = Math.floor(moment.utc().valueOf() / 1000);

        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {created: 503, rating: 1, comment: 'irgendwas', recommendationId: '0'})-[:RECOMMENDS]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:Recommendation {recommendationId: '0'})")
            .create("(b)-[:PINWALL_DATA]->(a)")
            .end().getCommand());

        commands.push(db.cypher().match("(u:User)")
            .where("u.userId IN ['1','2']")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: false, profileData: true, contacts: true, pinwall: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true, pinwall: false})")
            .end().getCommand());

        commands.push(db.cypher().match("(a:User {userId: '2'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(a)")
            .end({contactAdded: startTime}).getCommand());


        return db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_ADMIN]->(a)")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).
            then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/home', {
                    skipBlog: 0,
                    skipRecommendation: 0,
                    maxItems: 10
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(1);
            });
    });

    it('Not showing recommendations which has incorrect visible for contact', function () {

        var commands = [];

        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {created: 503, rating: 1, comment: 'irgendwas', recommendationId: '0'})-[:RECOMMENDS]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:Recommendation {recommendationId: '0'})")
            .create("(b)-[:PINWALL_DATA]->(a)")
            .end().getCommand());

        commands.push(db.cypher().match("(u:User)")
            .where("u.userId IN ['1','2']")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false, profileData: true, contacts: true, pinwall: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true, pinwall: false})," +
                "(u)-[:HAS_PRIVACY {type: 'Bekannter'}]->(:Privacy {profile: true, image: true, pinwall: true})")
            .end().getCommand());

        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund', contactAdded: 500}]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '2'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund', contactAdded: 500}]->(a)")
            .end().getCommand());


        return db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_ADMIN]->(a)")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).
            then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/home', {
                    skipBlog: 0,
                    skipRecommendation: 0,
                    maxItems: 10
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(0);
            });
    });

    it('Not showing recommendation because contact has user blocked', function () {

        var commands = [];

        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {created: 503, rating: 1, comment: 'irgendwas', recommendationId: '0'})-[:RECOMMENDS]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:Recommendation {recommendationId: '0'})")
            .create("(b)-[:PINWALL_DATA]->(a)")
            .end().getCommand());

        commands.push(db.cypher().match("(u:User)")
            .where("u.userId IN ['1','2']")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false, profileData: true, contacts: true, pinwall: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true, pinwall: true})")
            .end().getCommand());

        commands.push(db.cypher().match("(b:User {userId: '1'}), (a:User {userId: '2'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund', contactAdded: 500}]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_BLOCKED]->(a)")
            .end().getCommand());

        return db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_ADMIN]->(a)")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).
            then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/home', {
                    skipBlog: 0,
                    skipRecommendation: 0,
                    maxItems: 10
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(0);
            });
    });

    it('Not showing recommendation because visible profile setting is false', function () {

        var commands = [];

        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {created: 503, rating: 1, comment: 'irgendwas', recommendationId: '0'})-[:RECOMMENDS]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:Recommendation {recommendationId: '0'})")
            .create("(b)-[:PINWALL_DATA]->(a)")
            .end().getCommand());

        commands.push(db.cypher().match("(u:User)")
            .where("u.userId IN ['1','2']")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: false, profileData: true, contacts: true, pinwall: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: false, image: true, pinwall: true})")
            .end().getCommand());

        commands.push(db.cypher().match("(b:User {userId: '1'}), (a:User {userId: '2'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund', contactAdded: 500}]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(b:User {userId: '2'}), (a:User {userId: '1'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund', contactAdded: 500}]->(a)")
            .end().getCommand());


        return db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_ADMIN]->(a)")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).
            then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/home', {
                    skipBlog: 0,
                    skipRecommendation: 0,
                    maxItems: 10
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(0);
            });
    });

    it('Not showing recommendation because visible no contact profile setting is false', function () {

        var commands = [];

        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {created: 503, rating: 1, comment: 'irgendwas', recommendationId: '0'})-[:RECOMMENDS]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:Recommendation {recommendationId: '0'})")
            .create("(b)-[:PINWALL_DATA]->(a)")
            .end().getCommand());

        commands.push(db.cypher().match("(u:User)")
            .where("u.userId IN ['1','2']")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false, profileData: true, contacts: true, pinwall: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true, pinwall: true})")
            .end().getCommand());

        commands.push(db.cypher().match("(b:User {userId: '1'}), (a:User {userId: '2'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund', contactAdded: 500}]->(a)")
            .end().getCommand());


        return db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_ADMIN]->(a)")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).
            then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/home', {
                    skipBlog: 0,
                    skipRecommendation: 0,
                    maxItems: 10
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(0);
            });
    });

    it('Showing blog which has correct visible for contact type', function () {

        var commands = [], startTime = Math.floor(moment.utc().valueOf() / 1000);

        commands.push(db.cypher().create("(:Blog:PinwallElement {title: 'blogTitle1', text: 'blogText1', created: 501, blogId: '1', visible: {visible}})")
            .end({visible: ['Freund']}).getCommand());
        commands.push(db.cypher().match("(a:Blog {blogId: '1'}), (b:User {userId: '2'})")
            .createUnique("(b)-[:WRITTEN]->(a)")
            .end({contactAdded: startTime}).getCommand());

        commands.push(db.cypher().match("(u:User)")
            .where("u.userId IN ['1','2']")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false, profileData: true, contacts: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})," +
                "(u)-[:HAS_PRIVACY {type: 'Bekannter'}]->(:Privacy {profile: true, image: true})")
            .end().getCommand());

        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(a)")
            .end({contactAdded: startTime}).getCommand());
        commands.push(db.cypher().match("(a:User {userId: '2'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(a)")
            .end({contactAdded: startTime}).getCommand());


        return db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_ADMIN]->(a)")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).
            then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/home', {
                    skipBlog: 0,
                    skipRecommendation: 0,
                    maxItems: 10
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(1);
            });
    });

    it('Showing blog which is set to public', function () {

        var commands = [], startTime = Math.floor(moment.utc().valueOf() / 1000);

        commands.push(db.cypher().create("(:Blog:PinwallElement {title: 'blogTitle1', text: 'blogText1', created: 501, blogId: '1'})").end().getCommand());
        commands.push(db.cypher().match("(a:Blog {blogId: '1'}), (b:User {userId: '2'})")
            .createUnique("(b)-[:WRITTEN]->(a)")
            .end({contactAdded: startTime}).getCommand());

        commands.push(db.cypher().match("(u:User)")
            .where("u.userId IN ['1','2']")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false, profileData: true, contacts: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})," +
                "(u)-[:HAS_PRIVACY {type: 'Bekannter'}]->(:Privacy {profile: true, image: true})")
            .end().getCommand());

        commands.push(db.cypher().match("(a:User {userId: '2'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(a)")
            .end({contactAdded: startTime}).getCommand());


        return db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_ADMIN]->(a)")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).
            then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/home', {
                    skipBlog: 0,
                    skipRecommendation: 0,
                    maxItems: 10
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(1);
            });
    });

    it('Not showing blog which has incorrect visible for contact', function () {

        var commands = [], startTime = Math.floor(moment.utc().valueOf() / 1000);

        commands.push(db.cypher().create("(:Blog:PinwallElement {title: 'blogTitle1', text: 'blogText1', created: 501, blogId: '1', visible:{visible}})")
            .end({visible: ['Familie']}).getCommand());
        commands.push(db.cypher().match("(a:Blog {blogId: '1'}), (b:User {userId: '2'})")
            .createUnique("(b)-[:WRITTEN]->(a)")
            .end({contactAdded: startTime}).getCommand());

        commands.push(db.cypher().match("(u:User)")
            .where("u.userId IN ['1','2']")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false, profileData: true, contacts: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})," +
                "(u)-[:HAS_PRIVACY {type: 'Bekannter'}]->(:Privacy {profile: true, image: true})")
            .end().getCommand());

        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(a)")
            .end({contactAdded: startTime}).getCommand());
        commands.push(db.cypher().match("(a:User {userId: '2'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(a)")
            .end({contactAdded: startTime}).getCommand());


        return db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_ADMIN]->(a)")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).
            then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/home', {
                    skipBlog: 0,
                    skipRecommendation: 0,
                    maxItems: 10
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(0);
            });
    });

    it('Not showing blog because contact has user blocked', function () {

        var commands = [], startTime = Math.floor(moment.utc().valueOf() / 1000);

        commands.push(db.cypher().create("(:Blog:PinwallElement {title: 'blogTitle1', text: 'blogText1', created: 501, blogId: '1'})").end().getCommand());
        commands.push(db.cypher().match("(a:Blog {blogId: '1'}), (b:User {userId: '2'})")
            .createUnique("(b)-[:WRITTEN]->(a)")
            .end({contactAdded: startTime}).getCommand());

        commands.push(db.cypher().match("(u:User)")
            .where("u.userId IN ['1','2']")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false, profileData: true, contacts: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})," +
                "(u)-[:HAS_PRIVACY {type: 'Bekannter'}]->(:Privacy {profile: true, image: true})")
            .end().getCommand());

        commands.push(db.cypher().match("(a:User {userId: '2'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(a)")
            .end({contactAdded: startTime}).getCommand());
        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_BLOCKED]->(a)")
            .end({contactAdded: startTime}).getCommand());


        return db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_ADMIN]->(a)")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).
            then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/home', {
                    skipBlog: 0,
                    skipRecommendation: 0,
                    maxItems: 10
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(0);
            });
    });

    it('Getting user blogs, contact blogs and recommendations', function () {

        var commands = [], startTime = Math.floor(moment.utc().valueOf() / 1000);

        commands.push(db.cypher().create("(:Blog:PinwallElement {title: 'blogTitle1', text: 'blogText1', created: 501, blogId: '1', heightPreviewImage: 400, visible: {visible}, category: {category}})")
            .end({visible: ['Freund'], category: ['health', 'personalDevelopment']}).getCommand());
        commands.push(db.cypher().create("(:Blog:PinwallElement {title: 'blogTitle2', text: 'blogText2', created: 502, blogId: '2', category: {category}, visible: {visible}})").end({category: ['health', 'personalDevelopment'], visible: ['Freund']}).getCommand());
        commands.push(db.cypher().create("(:Blog:PinwallElement {title: 'blogTitle3', text: 'blogText3', created: 505, blogId: '3', category: {category}})").end({category: ['health', 'personalDevelopment']}).getCommand());
        commands.push(db.cypher().create("(:Blog:PinwallElement {title: 'blogTitle4', text: 'blogText4', created: 506, blogId: '4', category: {category}})").end({category: ['health', 'personalDevelopment']}).getCommand());
        commands.push(db.cypher().create("(:Blog:PinwallElement {title: 'blogTitle5', text: 'blogText5', created: 507, blogId: '5', category: {category}, visible: {visible}})").end({category: ['health', 'personalDevelopment'], visible: ['Freund']}).getCommand());

        //Recommendations
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '1'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {created: 503, rating: 1, comment: 'irgendwas', recommendationId: '0'})-[:RECOMMENDS]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:Recommendation {recommendationId: '0'})")
            .create("(b)-[:PINWALL_DATA]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '1'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {created: 504, rating: 4, comment: 'irgendwas2', recommendationId: '1'})-[:RECOMMENDS]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '1'}), (b:Recommendation {recommendationId: '1'})")
            .create("(b)-[:PINWALL_DATA]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {created: 502, rating: 4, comment: 'irgendwas2', recommendationId: '2'})-[:RECOMMENDS]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:Recommendation {recommendationId: '2'})")
            .create("(b)-[:PINWALL_DATA]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '1'}), (b:User {userId: '3'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {created: 504, rating: 4, comment: 'irgendwas2', recommendationId: '3'})-[:RECOMMENDS]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '1'}), (b:Recommendation {recommendationId: '3'})")
            .create("(b)-[:PINWALL_DATA]->(a)")
            .end().getCommand());

        //Privacy settings
        commands.push(db.cypher().match("(u:User)")
            .where("u.userId IN ['1','2','3']")
            .createUnique("(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true, pinwall: true})")
            .end().getCommand());
        commands.push(db.cypher().match("(u:User)")
            .where("u.userId IN ['1']")
            .createUnique("(u)-[:HAS_PRIVACY {type: 'Bekannter'}]->(:Privacy {profile: true, image: true})")
            .end().getCommand());
        commands.push(db.cypher().match("(u:User)")
            .where("u.userId IN ['1', '2']")
            .createUnique("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false, profileData: true, contacts: true})")
            .end().getCommand());
        commands.push(db.cypher().match("(u:User)")
            .where("u.userId IN ['3']")
            .createUnique("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: true, profileData: true, contacts: true, pinwall: false})")
            .end().getCommand());
        commands.push(db.cypher().match("(u:User {userId: '1'})")
            .set("u", {lastLogin: startTime + 100})
            .end().getCommand());

        //Contact connections
        commands.push(db.cypher().match("(b:User {userId: '1'}), (a:User {userId: '2'})")
            .createUnique("(b)-[:IS_CONTACT {contactAdded: {contactAdded}, type: 'Freund'}]->(a)")
            .end({contactAdded: startTime}).getCommand());
        commands.push(db.cypher().match("(b:User {userId: '1'}), (a:User {userId: '3'})")
            .createUnique("(b)-[:IS_CONTACT {contactAdded: {contactAdded}, type: 'Bekannter'}]->(a)")
            .end({contactAdded: startTime}).getCommand());
        commands.push(db.cypher().match("(b:User {userId: '2'}), (a:User {userId: '1'})")
            .createUnique("(b)-[:IS_CONTACT {contactAdded: {contactAdded}, type: 'Freund'}]->(a)")
            .end({contactAdded: startTime}).getCommand());

        //Blogs
        commands.push(db.cypher().match("(a:Blog {blogId: '1'}), (b:User {userId: '2'})")
            .createUnique("(b)-[:WRITTEN]->(a)")
            .end({contactAdded: startTime}).getCommand());
        commands.push(db.cypher().match("(a:Blog {blogId: '2'}), (b:User {userId: '2'}) ")
            .createUnique("(b)-[:WRITTEN]->(a)")
            .end({contactAdded: startTime}).getCommand());
        commands.push(db.cypher().match("(a:Blog {blogId: '3'}), (b:User {userId: '1'}) ")
            .createUnique("(b)-[:WRITTEN]->(a)")
            .end({contactAdded: startTime}).getCommand());
        commands.push(db.cypher().match("(a:Blog {blogId: '4'}), (b:User {userId: '3'}) ")
            .createUnique("(b)-[:WRITTEN]->(a)")
            .end({contactAdded: startTime}).getCommand());
        commands.push(db.cypher().match("(a:Blog {blogId: '5'}), (b:User {userId: '3'}) ")
            .createUnique("(b)-[:WRITTEN]->(a)")
            .end({contactAdded: startTime}).getCommand());

        return db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_ADMIN]->(a)")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).
            then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/home', {
                    skipBlog: 0,
                    skipRecommendation: 0,
                    maxItems: 10
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(6);
                res.body.pinwall[0].pinwallType.should.equals('Blog');
                res.body.pinwall[0].blogId.should.equals('4');
                res.body.pinwall[0].name.should.equals('user Meier3');
                res.body.pinwall[0].forename.should.equals('user3');
                res.body.pinwall[0].userId.should.equals('3');
                res.body.pinwall[0].title.should.equals('blogTitle4');
                res.body.pinwall[0].created.should.equals(506);
                res.body.pinwall[0].profileUrl.should.equals('profileImage/3/thumbnail.jpg');
                should.not.exist(res.body.pinwall[0].url);
                should.not.exist(res.body.pinwall[0].urlFull);
                res.body.pinwall[0].text.should.equals('blogText4');
                res.body.pinwall[0].isAdmin.should.equals(false);
                res.body.pinwall[0].isPublic.should.equals(true);
                res.body.pinwall[0].category.length.should.equals(2);
                res.body.pinwall[0].category[0].should.equals('health');
                res.body.pinwall[0].category[1].should.equals('personalDevelopment');

                res.body.pinwall[1].pinwallType.should.equals('Blog');
                res.body.pinwall[1].blogId.should.equals('3');
                res.body.pinwall[1].name.should.equals('user Meier');
                res.body.pinwall[1].forename.should.equals('user');
                res.body.pinwall[1].userId.should.equals('1');
                res.body.pinwall[1].title.should.equals('blogTitle3');
                res.body.pinwall[1].created.should.equals(505);
                res.body.pinwall[1].profileUrl.should.equals('profileImage/1/thumbnail.jpg');
                should.not.exist(res.body.pinwall[1].url);
                should.not.exist(res.body.pinwall[1].urlFull);
                res.body.pinwall[1].text.should.equals('blogText3');
                res.body.pinwall[1].isAdmin.should.equals(true);
                res.body.pinwall[1].isPublic.should.equals(true);
                res.body.pinwall[1].category.length.should.equals(2);
                res.body.pinwall[1].category[0].should.equals('health');
                res.body.pinwall[1].category[1].should.equals('personalDevelopment');

                res.body.pinwall[2].pinwallType.should.equals('Recommendation');
                res.body.pinwall[2].label.should.equals('Youtube');
                res.body.pinwall[2].pageId.should.equals('1');
                res.body.pinwall[2].name.should.equals('user Meier2');
                res.body.pinwall[2].forename.should.equals('user2');
                res.body.pinwall[2].userId.should.equals('2');
                res.body.pinwall[2].title.should.equals('bookPage2Title');
                res.body.pinwall[2].rating.should.equals(4);
                res.body.pinwall[2].created.should.equals(504);
                res.body.pinwall[2].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
                res.body.pinwall[2].comment.should.equals('irgendwas2');
                res.body.pinwall[2].description.should.equals('bookPage2');
                res.body.pinwall[2].userHasRecommended.should.equals(false);
                res.body.pinwall[2].thisRecommendationByUser.should.equals(false);
                res.body.pinwall[2].numberOfSamePinwallData.should.equals(1);
                res.body.pinwall[2].category.length.should.equals(2);
                res.body.pinwall[2].category[0].should.equals('health');
                res.body.pinwall[2].category[1].should.equals('personalDevelopment');

                res.body.pinwall[3].pinwallType.should.equals('Recommendation');
                res.body.pinwall[3].label.should.equals('Book');
                res.body.pinwall[3].pageId.should.equals('0');
                res.body.pinwall[3].name.should.equals('user Meier');
                res.body.pinwall[3].forename.should.equals('user');
                res.body.pinwall[3].userId.should.equals('1');
                res.body.pinwall[3].title.should.equals('bookPage1Title');
                res.body.pinwall[3].rating.should.equals(1);
                res.body.pinwall[3].created.should.equals(503);
                res.body.pinwall[3].profileUrl.should.equals('profileImage/1/thumbnail.jpg');
                res.body.pinwall[3].comment.should.equals('irgendwas');
                res.body.pinwall[3].description.should.equals('bookPage1');
                res.body.pinwall[3].userHasRecommended.should.equals(true);
                res.body.pinwall[3].thisRecommendationByUser.should.equals(true);
                res.body.pinwall[3].numberOfSamePinwallData.should.equals(2);
                res.body.pinwall[3].category.length.should.equals(2);
                res.body.pinwall[3].category[0].should.equals('health');
                res.body.pinwall[3].category[1].should.equals('personalDevelopment');

                res.body.pinwall[4].pinwallType.should.equals('Blog');
                res.body.pinwall[4].blogId.should.equals('2');
                res.body.pinwall[4].name.should.equals('user Meier2');
                res.body.pinwall[4].forename.should.equals('user2');
                res.body.pinwall[4].userId.should.equals('2');
                res.body.pinwall[4].title.should.equals('blogTitle2');
                res.body.pinwall[4].created.should.equals(502);
                res.body.pinwall[4].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
                should.not.exist(res.body.pinwall[4].url);
                should.not.exist(res.body.pinwall[4].urlFull);
                res.body.pinwall[4].text.should.equals('blogText2');
                res.body.pinwall[4].isAdmin.should.equals(false);
                res.body.pinwall[4].isPublic.should.equals(false);
                res.body.pinwall[4].category.length.should.equals(2);
                res.body.pinwall[4].category[0].should.equals('health');
                res.body.pinwall[4].category[1].should.equals('personalDevelopment');

                res.body.pinwall[5].pinwallType.should.equals('Blog');
                res.body.pinwall[5].blogId.should.equals('1');
                res.body.pinwall[5].name.should.equals('user Meier2');
                res.body.pinwall[5].forename.should.equals('user2');
                res.body.pinwall[5].userId.should.equals('2');
                res.body.pinwall[5].title.should.equals('blogTitle1');
                res.body.pinwall[5].created.should.equals(501);
                res.body.pinwall[5].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
                res.body.pinwall[5].url.should.equals('blog/1/preview.jpg');
                res.body.pinwall[5].urlFull.should.equals('blog/1/normal.jpg');
                res.body.pinwall[5].text.should.equals('blogText1');
                res.body.pinwall[5].isAdmin.should.equals(false);
                res.body.pinwall[5].isPublic.should.equals(false);
                res.body.pinwall[5].category.length.should.equals(2);
                res.body.pinwall[5].category[0].should.equals('health');
                res.body.pinwall[5].category[1].should.equals('personalDevelopment');
            });
    });
});
