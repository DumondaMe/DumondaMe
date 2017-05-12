'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let should = require('chai').should();
let moment = require('moment');
let stubCDN = require('elyoos-server-test-util').stubCDN();
let sinon = require('sinon');

describe('Integration Tests for editing book pages', function () {

    let requestAgent, startTime;

    beforeEach(function () {

        let commands = [];
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return db.clearDatabase().then(function () {
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', emailNormalized: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', surname: 'Meier', forename:'user', userId: '1'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier2', userId: '2'})").end().getCommand());

            commands.push(db.cypher().create("(:Page {title: 'title', label: 'Book', description: 'description', topic: {topic}, created: 501, modified: 502, pageId: '0'," +
                "author: 'Hans Muster', publishDate: 1000, language: {language}})").end({topic: ['health', 'spiritual'], language: ['de']}).getCommand());
            commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '1'})")
                .create("(b)-[:IS_ADMIN]->(a)")
                .end().getCommand());

            commands.push(db.cypher().create("(:Page {title: 'title', label: 'Book', description: 'description', topic: {topic}, created: 501, modified: 502, pageId: '1'," +
                "author: 'Hans Muster', publishDate: 1000, language: {language}})").end({topic: ['health', 'spiritual'], language: ['de']}).getCommand());
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

    it('Edit a book page without publish date - Return 200', function () {
        let editPage = {
            bookPage: {
                pageId: '0',
                topic: ['health', 'socialDevelopment'],
                description: 'description2',
                author: 'Hans Muster2',
                language: 'en'
            }
        };
        stubCDN.uploadFile.reset();

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/edit', editPage, requestAgent, './test/test/e2e/tests/user/page/test.jpg');
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(page:Page {pageId: '0'})")
                .return(`page.pageId AS pageId, page.topic AS topic, page.description AS description, page.author AS author,
                         page.modified AS modified, page.created AS created, page.publishDate AS publishDate, page.title AS title, 
                         page.label AS label, page.language AS language`)
                .end().send();
        }).then(function (page) {
            page.length.should.equals(1);
            page[0].created.should.equals(501);
            page[0].modified.should.be.at.least(startTime);
            page[0].pageId.should.equals('0');
            page[0].description.should.equals("description2");
            page[0].author.should.equals("Hans Muster2");
            page[0].title.should.equals("title");
            page[0].label.should.equals("Book");
            should.not.exist(page[0].publishDate);

            stubCDN.uploadFile.calledWith(sinon.match.any, "pages/0/pagePreview.jpg").should.be.true;
            stubCDN.uploadFile.calledWith(sinon.match.any, "pages/0/pageTitlePicture.jpg").should.be.true;
            stubCDN.uploadFile.calledWith(sinon.match.any, "pages/0/original.jpg").should.be.true;

            page[0].topic.length.should.equals(2);
            page[0].topic[0].should.equals('health');
            page[0].topic[1].should.equals('socialDevelopment');
            page[0].language.length.should.equals(1);
            page[0].language[0].should.equals('en');
        });
    });

    it('Edit of book page without being administrator - Return 400', function () {
        let editPage = {
            bookPage: {
                pageId: '1',
                topic: ['health', 'socialDevelopment'],
                description: 'description2',
                author: 'Hans Muster2',
                language: 'en'
            }
        };
        stubCDN.uploadFile.reset();

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/edit', editPage, requestAgent, './test/test/e2e/tests/user/page/test.jpg');
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(page:Page {pageId: '1'})")
                .return(`page.pageId AS pageId, page.topic AS topic, page.description AS description, page.author AS author,
                page.modified AS modified, page.created AS created, page.publishDate AS publishDate, page.title AS title, page.label AS label,
                page.language AS language`)
                .end().send();
        }).then(function (page) {
            page.length.should.equals(1);
            page[0].created.should.equals(501);
            page[0].modified.should.equals(502);
            page[0].pageId.should.equals('1');
            page[0].description.should.equals("description");
            page[0].author.should.equals("Hans Muster");
            page[0].title.should.equals("title");
            page[0].label.should.equals("Book");
            page[0].publishDate.should.equals(1000);

            stubCDN.uploadFile.called.should.be.false;

            page[0].topic.length.should.equals(2);
            page[0].topic[0].should.equals('health');
            page[0].topic[1].should.equals('spiritual');
            page[0].language.length.should.equals(1);
            page[0].language[0].should.equals('de');
        });
    });

    it('Edit a book page with to small width image - Return 400', function () {
        let editPage = {
            bookPage: {
                pageId: '0',
                topic: ['health', 'socialDevelopment'],
                description: 'description',
                author: 'Hans Muster',
                language: 'en'
            }
        };
        stubCDN.uploadFile.reset();

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/edit', editPage, requestAgent, './test/test/e2e/tests/user/page/toSmallWidth.jpg');
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(page:Page {pageId: '0'})")
                .return('page')
                .end().send();
        }).then(function (page) {
            page.length.should.equals(1);
            page[0].page.created.should.equals(501);
            page[0].page.modified.should.equals(502);
            page[0].page.pageId.should.equals('0');
            page[0].page.description.should.equals("description");
            page[0].page.author.should.equals("Hans Muster");
            page[0].page.label.should.equals("Book");
            page[0].page.publishDate.should.equals(1000);

            stubCDN.uploadFile.called.should.be.false;

            page[0].page.topic.length.should.equals(2);
            page[0].page.topic[0].should.equals('health');
            page[0].page.topic[1].should.equals('spiritual');
        });
    });

    it('Edit a book page with to small height image - Return 400', function () {
        let editPage = {
            bookPage: {
                pageId: '0',
                topic: ['health', 'socialDevelopment'],
                description: 'description',
                author: 'Hans Muster',
                language: 'en'
            }
        };
        stubCDN.uploadFile.reset();

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/edit', editPage, requestAgent, './test/test/e2e/tests/user/page/toSmallHeight.jpg');
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(page:Page {pageId: '0'})")
                .return('page')
                .end().send();
        }).then(function (page) {
            page.length.should.equals(1);
            page[0].page.created.should.be.equals(501);
            page[0].page.modified.should.be.equals(502);
            page[0].page.pageId.should.be.equals('0');
            page[0].page.description.should.be.equals("description");
            page[0].page.author.should.be.equals("Hans Muster");
            page[0].page.label.should.equals("Book");
            page[0].page.publishDate.should.be.equals(1000);

            stubCDN.uploadFile.called.should.be.false;

            page[0].page.topic.length.should.equals(2);
            page[0].page.topic[0].should.equals('health');
            page[0].page.topic[1].should.equals('spiritual');
        });
    });
});
