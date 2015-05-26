'use strict';

var app = require('../../../../../../server');
var users = require('../../util/user');
var db = require('../../util/db');
var requestHandler = require('../../util/request');
var should = require('chai').should();
var moment = require('moment');

describe('Integration Tests for editing video pages', function () {

    var requestAgent, startTime;

    beforeEach(function () {

        var commands = [];
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return db.clearDatabase().then(function () {
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', surname: 'Meier', forename:'user', userId: '1'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier2', userId: '2'})").end().getCommand());

            commands.push(db.cypher().create("(:VideoPage {title: 'title', description: 'description', language: 'de', created: 501, modified: 502, pageId: '0'," +
                "link: 'https://www.youtube.com/embed/Test', subCategory: 'Youtube'})").end().getCommand());
            commands.push(db.cypher().match("(a:VideoPage {pageId: '0'}), (b:User {userId: '1'})")
                .create("(b)-[:IS_ADMIN]->(a)")
                .end().getCommand());

            commands.push(db.cypher().create("(:VideoPage {title: 'title', description: 'description', language: 'de', created: 501, modified: 502, pageId: '1'," +
                "link: 'https://www.youtube.com/embed/Test', subCategory: 'Youtube'})").end().getCommand());
            commands.push(db.cypher().match("(a:BookPage {pageId: '1'}), (b:User {userId: '2'})")
                .create("(b)-[:IS_ADMIN]->(a)")
                .end().getCommand());

            return db.cypher().create("(:User {name: 'user Meier5', userId: '3'})")
                .end().send(commands);
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Edit a youtube video page- Return 200', function () {

        var page = {
            videoPage: {
                pageId: '0',
                language: 'en',
                title: 'title2',
                description: 'description2',
                link: 'https://www.youtube.com/embed/Test2'
            }
        };

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/edit', page, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(page:VideoPage {pageId: '0'})")
                .return('page.pageId AS pageId, page.language AS language, page.description AS description, page.link AS link, ' +
                'page.modified AS modified, page.created AS created, page.subCategory AS subCategory, page.title AS title')
                .end().send();
        }).then(function (page) {
            page.length.should.equals(1);
            page[0].created.should.be.equals(501);
            page[0].modified.should.be.at.least(startTime);
            page[0].language.should.be.equals("en");
            page[0].pageId.should.be.equals('0');
            page[0].description.should.be.equals("description2");
            page[0].link.should.be.equals("https://www.youtube.com/embed/Test2");
            page[0].title.should.be.equals("title2");
            page[0].subCategory.should.be.equals("Youtube");
        });
    });

    it('Edit of video page without being administrator - Return 400', function () {

        var page = {
            videoPage: {
                pageId: '1',
                language: 'en',
                title: 'title2',
                description: 'description2',
                link: 'https://www.youtube.com/embed/Test2'
            }
        };

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/edit', page, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(page:VideoPage {pageId: '1'})")
                .return('page.pageId AS pageId, page.language AS language, page.description AS description, page.link AS link, ' +
                'page.modified AS modified, page.created AS created, page.subCategory AS subCategory, page.title AS title')
                .end().send();
        }).then(function (page) {
            page.length.should.equals(1);
            page[0].created.should.be.equals(501);
            page[0].modified.should.be.equals(502);
            page[0].language.should.be.equals("de");
            page[0].pageId.should.be.equals('1');
            page[0].description.should.be.equals("description");
            page[0].link.should.be.equals("https://www.youtube.com/embed/Test");
            page[0].title.should.be.equals("title");
            page[0].subCategory.should.be.equals("Youtube");
        });
    });
});
