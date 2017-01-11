'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');

describe('Integration Tests for getting blogs on home screen for a user', function () {

    let requestAgent;

    beforeEach(function () {

        let commands = [];
        return db.clearDatabase().then(function () {
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', surname: 'Meier', forename:'user', userId: '1'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier2', forename: 'user2', userId: '2'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier3', forename: 'user3', userId: '3'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier4', forename: 'user4', userId: '4'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier5', forename: 'user5', userId: '5'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier5', forename: 'user6', userId: '6'})").end().getCommand());
            commands.push(db.cypher().create("(:Page {title: 'bookPage1Title', label: 'Book', description: 'bookPage1', language: 'de', created: 501, pageId: '0'," +
                "author: 'Hans Muster', publishDate: 1000, topic: {topic}})").end({topic: ['health', 'personalDevelopment']}).getCommand());
            commands.push(db.cypher().create("(:Page {title: 'linkPageTitle', label: 'Link', description: 'linkPage', language: 'de', created: 501, pageId: '2'," +
                "topic: {topic}, link: 'www.host.com/test', hostname: 'www.host.com', heightPreviewImage: 200})").end({topic: ['health', 'personalDevelopment']}).getCommand());
            return db.cypher().create("(:Page {title: 'bookPage2Title', label: 'Youtube', description: 'bookPage2', language: 'de', created: 501, pageId: '1'," +
                "author: 'Hans Muster', publishDate: 1000, link: 'www.test.ch', topic: {topic}})").end({topic: ['health', 'personalDevelopment']}).send(commands);

        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Showing blog which has correct visible for contact type', function () {

        let commands = [], startTime = Math.floor(moment.utc().valueOf() / 1000);

        commands.push(db.cypher().create("(:Blog:PinwallElement {title: 'blogTitle1', text: 'blogText1', created: 501, pageId: '1', visible: {visible}})")
            .end({visible: ['Freund']}).getCommand());
        commands.push(db.cypher().match("(a:Blog {pageId: '1'}), (b:User {userId: '2'})")
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
                    maxItems: 10,
                    onlyContact: true,
                    order: 'new'
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(1);
            });
    });

    it('Showing blog which is set to public', function () {

        let commands = [], startTime = Math.floor(moment.utc().valueOf() / 1000);

        commands.push(db.cypher().create("(:Blog:PinwallElement {title: 'blogTitle1', text: 'blogText1', created: 501, pageId: '1'})").end().getCommand());
        commands.push(db.cypher().match("(a:Blog {pageId: '1'}), (b:User {userId: '2'})")
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
                    maxItems: 10,
                    onlyContact: true,
                    order: 'new'
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(1);
            });
    });

    it('Not showing blog which has incorrect visible for contact', function () {

        let commands = [], startTime = Math.floor(moment.utc().valueOf() / 1000);

        commands.push(db.cypher().create("(:Blog:PinwallElement {title: 'blogTitle1', text: 'blogText1', created: 501, pageId: '1', visible:{visible}})")
            .end({visible: ['Familie']}).getCommand());
        commands.push(db.cypher().match("(a:Blog {pageId: '1'}), (b:User {userId: '2'})")
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
                    maxItems: 10,
                    onlyContact: true,
                    order: 'new'
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(0);
            });
    });

    it('Not showing blog because contact has user blocked', function () {

        let commands = [], startTime = Math.floor(moment.utc().valueOf() / 1000);

        commands.push(db.cypher().create("(:Blog:PinwallElement {title: 'blogTitle1', text: 'blogText1', created: 501, pageId: '1'})").end().getCommand());
        commands.push(db.cypher().match("(a:Blog {pageId: '1'}), (b:User {userId: '2'})")
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
                    maxItems: 10,
                    onlyContact: true,
                    order: 'new'
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(0);
            });
    });

});
