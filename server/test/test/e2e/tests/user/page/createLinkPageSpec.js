'use strict';

var users = require('../../util/user');
var db = require('../../util/db');
var requestHandler = require('../../util/request');
var moment = require('moment');

describe('Integration Tests for creating new link pages', function () {

    var requestAgent, startTime;

    beforeEach(function () {

        var commands = [];
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return db.clearDatabase().then(function () {
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', surname: 'Meier', forename:'user', userId: '1'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier2', userId: '2'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier3', userId: '3'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier4', userId: '4'})").end().getCommand());

            return db.cypher().create("(:User {name: 'user Meier5', userId: '5'})")
                .end().send(commands);
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Create a new link page - Return 200', function () {

        var createPage = {
            linkPage: {
                category: ['health', 'spiritual'],
                title: 'title',
                description: 'description',
                link: 'www.example.com/weiter/link'
            }
        }, pageId;

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/create', createPage, requestAgent, './test/test/e2e/tests/user/page/test.jpg');
        }).then(function (res) {
            res.status.should.equal(200);
            pageId = res.body.pageId;
            return db.cypher().match("(page:Page {pageId: {pageId}})<-[:IS_ADMIN]-(:User {userId: '1'})")
                .return(`page.pageId AS pageId, page.label AS label, page.category AS category, page.description AS description, page.title AS title, 
                         page.modified AS modified, page.link AS link, page.hostname AS hostname`)
                .end({pageId: pageId}).send();
        }).then(function (page) {
            page.length.should.equals(1);
            page[0].modified.should.be.at.least(startTime);
            page[0].label.should.equals("Link");
            page[0].pageId.should.equals(pageId);
            page[0].description.should.equals("description");
            page[0].title.should.equals("title");
            page[0].link.should.equals("www.example.com/weiter/link");
            page[0].hostname.should.equals("www.example.com");

            page[0].category.length.should.equals(2);
            page[0].category[0].should.equals('health');
            page[0].category[1].should.equals('spiritual');

        });
    });

    it('Create a new link page without a uploaded image- Return 200', function () {

        var createPage = {
            linkPage: {
                category: ['health', 'spiritual'],
                title: 'title',
                description: 'description',
                link: 'www.example.com/weiter/link'
            }
        }, pageId;

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/create', createPage, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            pageId = res.body.pageId;
            return db.cypher().match("(page:Page {pageId: {pageId}})<-[:IS_ADMIN]-(:User {userId: '1'})")
                .return(`page.pageId AS pageId, page.label AS label, page.category AS category, page.description AS description, page.title AS title, 
                         page.modified AS modified, page.link AS link, page.hostname AS hostname`)
                .end({pageId: pageId}).send();
        }).then(function (page) {
            page.length.should.equals(1);
            page[0].modified.should.be.at.least(startTime);
            page[0].label.should.equals("Link");
            page[0].pageId.should.equals(pageId);
            page[0].description.should.equals("description");
            page[0].title.should.equals("title");
            page[0].link.should.equals("www.example.com/weiter/link");
            page[0].hostname.should.equals("www.example.com");

            page[0].category.length.should.equals(2);
            page[0].category[0].should.equals('health');
            page[0].category[1].should.equals('spiritual');
        });
    });

    it('Create a new Link page with to small width image - Return 400', function () {

        var createPage = {
            linkPage: {
                category: ['health', 'spiritual'],
                title: 'title',
                description: 'description',
                link: 'www.example.com/weiter/link'
            }
        }, pageId;

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/create', createPage, requestAgent, './test/test/e2e/tests/user/page/toSmallWidth.jpg');
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(page:Page {title: 'title'})")
                .return('page.pageId AS pageId')
                .end().send();
        }).then(function (page) {
            page.length.should.equals(0);
        });
    });

    it('Create a new book page with to small height image - Return 400', function () {

        var createPage = {
            linkPage: {
                category: ['health', 'spiritual'],
                title: 'title',
                description: 'description',
                link: 'www.example.com/weiter/link'
            }
        }, pageId;

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/create', createPage, requestAgent, './test/test/e2e/tests/user/page/toSmallHeight.jpg');
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(page:Page {title: 'title'})")
                .return('page.pageId AS pageId')
                .end().send();
        }).then(function (page) {
            page.length.should.equals(0);
        });
    });
});
