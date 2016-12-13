'use strict';

var users = require('elyoos-server-test-util').user;
var db = require('elyoos-server-test-util').db;
var requestHandler = require('elyoos-server-test-util').requestHandler;
var moment = require('moment');

describe('Integration Tests for creating new youtube pages', function () {

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

    it('Create a new youtube page - Return 200', function () {

        var createPage = {
            youtubePage: {
                topic: ['environmental', 'education'],
                title: 'title',
                description: 'description',
                link: 'https://www.youtube.com/watch?v=hTarMdJub0M',
                language: ['en', 'de']
            }
        }, pageId;

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/create', createPage, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.linkEmbed.should.equals('https://www.youtube.com/embed/hTarMdJub0M');
            pageId = res.body.pageId;
            return db.cypher().match("(page:Page {title: 'title'})<-[:IS_ADMIN]-(:User {userId: '1'})")
                .return(`page.pageId AS pageId, page.topic AS topic, page.description AS description, page.link AS link, page.linkEmbed AS linkEmbed,
                         page.modified AS modified, page.created AS created, page.label AS label, page.language AS language,
                         page.linkHistory AS linkHistory, page.linkHistoryDate AS linkHistoryDate`)
                .end().send();
        }).then(function (page) {
            page.length.should.equals(1);
            page[0].modified.should.at.least(startTime);
            page[0].created.should.at.least(startTime);
            page[0].pageId.should.equals(pageId);
            page[0].description.should.equals("description");
            page[0].link.should.equals("https://www.youtube.com/watch?v=hTarMdJub0M");
            page[0].linkEmbed.should.equals("https://www.youtube.com/embed/hTarMdJub0M");
            page[0].label.should.equals("Youtube");

            page[0].topic.length.should.equals(2);
            page[0].topic[0].should.equals('environmental');
            page[0].topic[1].should.equals('education');
            page[0].language.length.should.equals(2);
            page[0].language[0].should.equals('en');
            page[0].language[1].should.equals('de');

            page[0].linkHistory.length.should.equals(0);
            page[0].linkHistoryDate.length.should.equals(0);
        });
    });

    it('Create a new mobile youtube page - Return 200', function () {

        var createPage = {
            youtubePage: {
                topic: ['environmental', 'education'],
                title: 'title',
                description: 'description',
                link: 'https://m.youtube.com/watch?v=Lhku7ZBWEK8',
                language: ['en', 'de']
            }
        }, pageId;

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/create', createPage, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.linkEmbed.should.equals('https://www.youtube.com/embed/Lhku7ZBWEK8');
            pageId = res.body.pageId;
            return db.cypher().match("(page:Page {title: 'title'})<-[:IS_ADMIN]-(:User {userId: '1'})")
                .return(`page.pageId AS pageId, page.topic AS topic, page.description AS description, page.link AS link, page.linkEmbed AS linkEmbed,
                         page.modified AS modified, page.created AS created, page.label AS label, page.language AS language,
                         page.linkHistory AS linkHistory, page.linkHistoryDate AS linkHistoryDate`)
                .end().send();
        }).then(function (page) {
            page.length.should.equals(1);
            page[0].modified.should.at.least(startTime);
            page[0].created.should.at.least(startTime);
            page[0].pageId.should.equals(pageId);
            page[0].description.should.equals("description");
            page[0].link.should.equals("https://m.youtube.com/watch?v=Lhku7ZBWEK8");
            page[0].linkEmbed.should.equals("https://www.youtube.com/embed/Lhku7ZBWEK8");
            page[0].label.should.equals("Youtube");

            page[0].topic.length.should.equals(2);
            page[0].topic[0].should.equals('environmental');
            page[0].topic[1].should.equals('education');
            page[0].language.length.should.equals(2);
            page[0].language[0].should.equals('en');
            page[0].language[1].should.equals('de');

            page[0].linkHistory.length.should.equals(0);
            page[0].linkHistoryDate.length.should.equals(0);
        });
    });

    it('Create a new youtube page (playlist)- Return 200', function () {

        var createPage = {
            youtubePage: {
                topic: ['environmental', 'education'],
                title: 'title',
                description: 'description',
                link: 'https://www.youtube.com/watch?v=Vhl6oskxrs0&index=1&list=PL8027E1CE6CF2BA5F',
                language: ['en', 'de']
            }
        }, pageId;

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/create', createPage, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            pageId = res.body.pageId;
            return db.cypher().match("(page:Page {title: 'title'})<-[:IS_ADMIN]-(:User {userId: '1'})")
                .return(`page.pageId AS pageId, page.topic AS topic, page.description AS description, page.link AS link, page.linkEmbed AS linkEmbed,
                         page.modified AS modified, page.created AS created, page.label AS label, page.language AS language,
                         page.linkHistory AS linkHistory, page.linkHistoryDate AS linkHistoryDate`)
                .end().send();
        }).then(function (page) {
            page.length.should.equals(1);
            page[0].modified.should.at.least(startTime);
            page[0].created.should.at.least(startTime);
            page[0].pageId.should.equals(pageId);
            page[0].description.should.equals("description");
            page[0].link.should.equals("https://www.youtube.com/watch?v=Vhl6oskxrs0&index=1&list=PL8027E1CE6CF2BA5F");
            page[0].linkEmbed.should.equals("https://www.youtube.com/embed/Vhl6oskxrs0?list=PL8027E1CE6CF2BA5F");
            page[0].label.should.equals("Youtube");

            page[0].topic.length.should.equals(2);
            page[0].topic[0].should.equals('environmental');
            page[0].topic[1].should.equals('education');
            page[0].language.length.should.equals(2);
            page[0].language[0].should.equals('en');
            page[0].language[1].should.equals('de');

            page[0].linkHistory.length.should.equals(0);
            page[0].linkHistoryDate.length.should.equals(0);
        });
    });

    it('Create a new mobile youtube page (playlist)- Return 200', function () {

        var createPage = {
            youtubePage: {
                topic: ['environmental', 'education'],
                title: 'title',
                description: 'description',
                link: 'https://m.youtube.com/watch?v=Vhl6oskxrs0&index=1&list=PL8027E1CE6CF2BA5F',
                language: ['en', 'de']
            }
        }, pageId;

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/create', createPage, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            pageId = res.body.pageId;
            return db.cypher().match("(page:Page {title: 'title'})<-[:IS_ADMIN]-(:User {userId: '1'})")
                .return(`page.pageId AS pageId, page.topic AS topic, page.description AS description, page.link AS link, page.linkEmbed AS linkEmbed,
                         page.modified AS modified, page.created AS created, page.label AS label, page.language AS language,
                         page.linkHistory AS linkHistory, page.linkHistoryDate AS linkHistoryDate`)
                .end().send();
        }).then(function (page) {
            page.length.should.equals(1);
            page[0].modified.should.at.least(startTime);
            page[0].created.should.at.least(startTime);
            page[0].pageId.should.equals(pageId);
            page[0].description.should.equals("description");
            page[0].link.should.equals("https://m.youtube.com/watch?v=Vhl6oskxrs0&index=1&list=PL8027E1CE6CF2BA5F");
            page[0].linkEmbed.should.equals("https://www.youtube.com/embed/Vhl6oskxrs0?list=PL8027E1CE6CF2BA5F");
            page[0].label.should.equals("Youtube");

            page[0].topic.length.should.equals(2);
            page[0].topic[0].should.equals('environmental');
            page[0].topic[1].should.equals('education');
            page[0].language.length.should.equals(2);
            page[0].language[0].should.equals('en');
            page[0].language[1].should.equals('de');

            page[0].linkHistory.length.should.equals(0);
            page[0].linkHistoryDate.length.should.equals(0);
        });
    });

    it('Invalid youtube link - Return 400', function () {

        var createPage = {
            youtubePage: {
                topic: ['environmental', 'education'],
                title: 'title',
                description: 'description',
                link: 'https://www.youtube.com/embed/hTarMdJub0M',
                language: ['en', 'de']
            }
        };

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/create', createPage, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(page:Page {title: 'title'})").return("page").end().send();
        }).then(function (page) {
            page.length.should.equals(0);
        });
    });
});
