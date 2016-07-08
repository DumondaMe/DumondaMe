'use strict';

var users = require('../../util/user');
var db = require('../../util/db');
var requestHandler = require('../../util/request');
var moment = require('moment');
var stubCDN = require('../../util/stubCDN');
var sinon = require('sinon');

describe('Integration Tests for editing link pages', function () {

    var requestAgent, startTime;

    beforeEach(function () {

        var commands = [];
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return db.clearDatabase().then(function () {
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', surname: 'Meier', forename:'user', userId: '1'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier2', userId: '2'})").end().getCommand());

            commands.push(db.cypher().create("(:Page {title: 'title', label: 'Link', title: 'title', description: 'description', topic: {topic}, created: 501, modified: 502, pageId: '0'," +
                "hostname: 'www.test.com', link: 'www.test.com/test', language: {language}})").end({topic: ['health', 'spiritual'], language: ['de', 'fr']}).getCommand());
            commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '1'})")
                .create("(b)-[:IS_ADMIN]->(a)")
                .end().getCommand());

            commands.push(db.cypher().create("(:Page {title: 'title', label: 'Link', title: 'title2', description: 'description2', topic: {topic}, created: 503, modified: 504, pageId: '1'," +
                "hostname: 'www.test2.com', link: 'www.test2.com/test', language: {language}})").end({topic: ['health', 'environmental'], language: ['de', 'fr']}).getCommand());
            commands.push(db.cypher().match("(a:Page {pageId: '2'}), (b:User {userId: '2'})")
                .create("(b)-[:IS_ADMIN]->(a)")
                .end().getCommand());

            return db.cypher().create("(:User {name: 'user Meier5', userId: '3'})")
                .end().send(commands);
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Edit a link page - Return 200', function () {
        var editPage = {
            linkPage: {
                pageId: '0',
                topic: ['health', 'socialDevelopment'],
                description: 'description2',
                language: ['en', 'es']
            }
        };
        stubCDN.uploadFile.reset();

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/edit', editPage, requestAgent, './test/test/e2e/tests/user/page/test.jpg');
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(page:Page {pageId: '0'})")
                .return(`page.pageId AS pageId, page.topic AS topic, page.title AS title, page.description AS description, 
                page.modified AS modified, page.created AS created, page.label AS label, page.link AS link, page.hostname AS hostname,
                page.language AS language`)
                .end().send();
        }).then(function (page) {
            page.length.should.equals(1);
            page[0].created.should.equals(501);
            page[0].modified.should.be.at.least(startTime);
            page[0].pageId.should.equals('0');
            page[0].title.should.equals("title");
            page[0].description.should.equals("description2");
            page[0].link.should.equals("www.test.com/test");
            page[0].hostname.should.equals("www.test.com");
            page[0].label.should.equals("Link");
            
            stubCDN.uploadFile.calledWith(sinon.match.any, "pages/0/preview.jpg").should.be.true;
            stubCDN.uploadFile.calledWith(sinon.match.any, "pages/0/normal.jpg").should.be.true;

            page[0].topic.length.should.equals(2);
            page[0].topic[0].should.equals('health');
            page[0].topic[1].should.equals('socialDevelopment');
            page[0].language.length.should.equals(2);
            page[0].language[0].should.equals('en');
            page[0].language[1].should.equals('es');
        });
    });

    it('Edit of link page without being administrator - Return 400', function () {
        var editPage = {
            linkPage: {
                pageId: '1',
                topic: ['health', 'socialDevelopment'],
                description: 'description2',
                language: ['en', 'es']
            }
        };
        stubCDN.uploadFile.reset();

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/edit', editPage, requestAgent, './test/test/e2e/tests/user/page/test.jpg');
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(page:Page {pageId: '1'})")
                .return(`page.pageId AS pageId, page.topic AS topic, page.title AS title, page.description AS description,
                    page.modified AS modified, page.created AS created, page.label AS label, page.link AS link, page.hostname AS hostname, 
                    page.language AS language`)
                .end().send();
        }).then(function (page) {
            page.length.should.equals(1);
            page[0].created.should.equals(503);
            page[0].modified.should.equals(504);
            page[0].pageId.should.equals('1');
            page[0].title.should.equals("title2");
            page[0].description.should.equals("description2");
            page[0].link.should.equals("www.test2.com/test");
            page[0].hostname.should.equals("www.test2.com");
            page[0].label.should.equals("Link");

            stubCDN.uploadFile.called.should.be.false;

            page[0].topic.length.should.equals(2);
            page[0].topic[0].should.equals('health');
            page[0].topic[1].should.equals('environmental');
            page[0].language.length.should.equals(2);
            page[0].language[0].should.equals('de');
            page[0].language[1].should.equals('fr');
        });
    });

    it('Edit of link page with to small width image - Return 400', function () {
        var editPage = {
            linkPage: {
                pageId: '0',
                topic: ['health', 'socialDevelopment'],
                description: 'description2',
                language: ['en', 'es']
            }
        };
        stubCDN.uploadFile.reset();

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/edit', editPage, requestAgent, './test/test/e2e/tests/user/page/toSmallWidth.jpg');
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(page:Page {pageId: '0'})")
                .return('page.pageId AS pageId, page.topic AS topic, page.title AS title, page.description AS description, page.language AS language,' +
                    'page.modified AS modified, page.created AS created, page.label AS label, page.link AS link, page.hostname AS hostname')
                .end().send();
        }).then(function (page) {
            page.length.should.equals(1);
            page[0].created.should.equals(501);
            page[0].modified.should.equals(502);
            page[0].pageId.should.equals('0');
            page[0].title.should.equals("title");
            page[0].description.should.equals("description");
            page[0].link.should.equals("www.test.com/test");
            page[0].hostname.should.equals("www.test.com");
            page[0].label.should.equals("Link");

            stubCDN.uploadFile.called.should.be.false;

            page[0].topic.length.should.equals(2);
            page[0].topic[0].should.equals('health');
            page[0].topic[1].should.equals('spiritual');
            page[0].language.length.should.equals(2);
            page[0].language[0].should.equals('de');
            page[0].language[1].should.equals('fr');
        });
    });

    it('Edit of link page with to small height image - Return 400', function () {
        var editPage = {
            linkPage: {
                pageId: '0',
                topic: ['health', 'socialDevelopment'],
                description: 'description2',
                language: ['en', 'es']
            }
        };
        stubCDN.uploadFile.reset();

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/edit', editPage, requestAgent, './test/test/e2e/tests/user/page/toSmallHeight.jpg');
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(page:Page {pageId: '0'})")
                .return('page.pageId AS pageId, page.topic AS topic, page.title AS title, page.description AS description, page.language AS language,' +
                    'page.modified AS modified, page.created AS created, page.label AS label, page.link AS link, page.hostname AS hostname')
                .end().send();
        }).then(function (page) {
            page.length.should.equals(1);
            page[0].created.should.equals(501);
            page[0].modified.should.equals(502);
            page[0].pageId.should.equals('0');
            page[0].title.should.equals("title");
            page[0].description.should.equals("description");
            page[0].link.should.equals("www.test.com/test");
            page[0].hostname.should.equals("www.test.com");
            page[0].label.should.equals("Link");

            stubCDN.uploadFile.called.should.be.false;

            page[0].topic.length.should.equals(2);
            page[0].topic[0].should.equals('health');
            page[0].topic[1].should.equals('spiritual');
            page[0].language.length.should.equals(2);
            page[0].language[0].should.equals('de');
            page[0].language[1].should.equals('fr');
        });
    });
});
