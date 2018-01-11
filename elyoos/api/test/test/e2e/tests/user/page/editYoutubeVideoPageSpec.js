'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');

describe('Integration Tests for editing youtube pages', function () {

    let startTime;

    beforeEach(function () {

        let commands = [];
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return db.clearDatabase().then(function () {
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', emailNormalized: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', surname: 'Meier', forename:'user', userId: '1'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier2', userId: '2'})").end().getCommand());

            commands.push(db.cypher().create("(:Page {title: 'title', label: 'Youtube', description: 'description', created: 501, modified: 501, pageId: '0'," +
                "link: 'https://www.youtube.com/watch?v=hTarMdJub0M', linkEmbed: 'https://www.youtube.com/embed/hTarMdJub0M', topic: {topic}, language: {language}, linkHistory: {emptyArray}, linkHistoryDate: {emptyArray}})").end({topic: ["health", "environmental"], language: ['de', 'fr'], emptyArray: []}).getCommand());
            commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '1'})")
                .create("(b)-[:IS_ADMIN]->(a)")
                .end().getCommand());

            commands.push(db.cypher().create("(:Page {title: 'title', label: 'Youtube', description: 'description', created: 501, modified: 502, pageId: '1'," +
                "link: 'https://www.youtube.com/watch?v=hTarMdJub0M', linkEmbed: 'https://www.youtube.com/embed/hTarMdJub0M', topic: {topic}, language: {language}, linkHistory: {emptyArray}, linkHistoryDate: {emptyArray}})").end({topic: ["health", "environmental"], language: ['de', 'fr'], emptyArray: []}).getCommand());
            commands.push(db.cypher().match("(a:Page {pageId: '1'}), (b:User {userId: '2'})")
                .create("(b)-[:IS_ADMIN]->(a)")
                .end().getCommand());

            commands.push(db.cypher().create("(:Page {title: 'title', label: 'Youtube', description: 'description', created: 501, modified: 502, pageId: '2'," +
                "link: 'https://www.youtube.com/watch?v=hTarMdJub02', linkEmbed: 'https://www.youtube.com/embed/hTarMdJub02', topic: {topic}, language: {language}, linkHistory: {linkHistory}, linkHistoryDate: {linkHistoryDate}})")
                .end({topic: ["health", "environmental"], language: ['de', 'fr'], linkHistory: ['https://www.youtube.com/embed/Test'], linkHistoryDate: [501]}).getCommand());
            commands.push(db.cypher().match("(a:Page {pageId: '2'}), (b:User {userId: '1'})")
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

        let page = {
            youtubePage: {
                pageId: '0',
                topic: ["environmental","spiritual"],
                description: 'description2',
                language: ['en', 'es'],
                link: 'https://www.youtube.com/watch?v=hTarMdJub02'
            }
        };

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.post('/api/user/page/edit', page);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.linkEmbed.should.equals("https://www.youtube.com/embed/hTarMdJub02");
            res.body.linkHistory.length.should.equals(1);
            res.body.linkHistory[0].should.equals("https://www.youtube.com/embed/hTarMdJub0M");
            res.body.linkHistoryDate.length.should.equals(1);
            res.body.linkHistoryDate[0].should.equals(501);
            return db.cypher().match("(page:Page {pageId: '0'})")
                .return(`page.pageId AS pageId, page.topic AS topic, page.description AS description, page.link AS link, page.linkEmbed AS linkEmbed,
                         page.modified AS modified, page.created AS created, page.label AS label, page.title AS title, page.language AS language,
                         page.linkHistory AS linkHistory, page.linkHistoryDate AS linkHistoryDate`)
                .end().send();
        }).then(function (page) {
            page.length.should.equals(1);
            page[0].created.should.equals(501);
            page[0].modified.should.be.at.least(startTime);
            page[0].pageId.should.equals('0');
            page[0].description.should.equals("description2");
            page[0].link.should.equals("https://www.youtube.com/watch?v=hTarMdJub02");
            page[0].linkEmbed.should.equals("https://www.youtube.com/embed/hTarMdJub02");
            page[0].title.should.equals("title");
            page[0].label.should.equals("Youtube");

            page[0].topic.length.should.equals(2);
            page[0].topic[0].should.equals('environmental');
            page[0].topic[1].should.equals('spiritual');
            page[0].language.length.should.equals(2);
            page[0].language[0].should.equals('en');
            page[0].language[1].should.equals('es');

            page[0].linkHistory.length.should.equals(1);
            page[0].linkHistory[0].should.equals("https://www.youtube.com/embed/hTarMdJub0M");
            page[0].linkHistoryDate.length.should.equals(1);
            page[0].linkHistoryDate[0].should.equals(501);
        });
    });

    it('Edit a youtube video page (playlist)- Return 200', function () {

        let page = {
            youtubePage: {
                pageId: '0',
                topic: ["environmental","spiritual"],
                description: 'description2',
                language: ['en', 'es'],
                link: 'https://www.youtube.com/watch?v=Vhl6oskxrs0&index=1&list=PL8027E1CE6CF2BA5F'
            }
        };

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.post('/api/user/page/edit', page);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(page:Page {pageId: '0'})")
                .return(`page.pageId AS pageId, page.topic AS topic, page.description AS description, page.link AS link, page.linkEmbed AS linkEmbed,
                         page.modified AS modified, page.created AS created, page.label AS label, page.title AS title, page.language AS language,
                         page.linkHistory AS linkHistory, page.linkHistoryDate AS linkHistoryDate`)
                .end().send();
        }).then(function (page) {
            page.length.should.equals(1);
            page[0].created.should.equals(501);
            page[0].modified.should.be.at.least(startTime);
            page[0].pageId.should.equals('0');
            page[0].description.should.equals("description2");
            page[0].link.should.equals("https://www.youtube.com/watch?v=Vhl6oskxrs0&index=1&list=PL8027E1CE6CF2BA5F");
            page[0].linkEmbed.should.equals("https://www.youtube.com/embed/Vhl6oskxrs0?list=PL8027E1CE6CF2BA5F");
            page[0].title.should.equals("title");
            page[0].label.should.equals("Youtube");

            page[0].topic.length.should.equals(2);
            page[0].topic[0].should.equals('environmental');
            page[0].topic[1].should.equals('spiritual');
            page[0].language.length.should.equals(2);
            page[0].language[0].should.equals('en');
            page[0].language[1].should.equals('es');

            page[0].linkHistory.length.should.equals(1);
            page[0].linkHistory[0].should.equals("https://www.youtube.com/embed/hTarMdJub0M");
            page[0].linkHistoryDate.length.should.equals(1);
            page[0].linkHistoryDate[0].should.equals(501);
        });
    });

    it('Edit link of a youtube video page the second time- Return 200', function () {

        let page = {
            youtubePage: {
                pageId: '2',
                topic: ["environmental","spiritual"],
                description: 'description2',
                language: ['en', 'es'],
                link: 'https://www.youtube.com/watch?v=hTarMdJub03'
            }
        };

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.post('/api/user/page/edit', page);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(page:Page {pageId: '2'})")
                .return(`page.linkHistory AS linkHistory, page.linkHistoryDate AS linkHistoryDate`)
                .end().send();
        }).then(function (page) {
            page.length.should.equals(1);

            page[0].linkHistory.length.should.equals(2);
            page[0].linkHistory[0].should.equals("https://www.youtube.com/embed/Test");
            page[0].linkHistory[1].should.equals("https://www.youtube.com/embed/hTarMdJub02");
            page[0].linkHistoryDate.length.should.equals(2);
            page[0].linkHistoryDate[0].should.equals(501);
            page[0].linkHistoryDate[1].should.equals(502);
        });
    });

    it('Edit a youtube video page and do not change link history when link is the same- Return 200', function () {

        let page = {
            youtubePage: {
                pageId: '0',
                topic: ["environmental","spiritual"],
                description: 'description2',
                language: ['en', 'es'],
                link: 'https://www.youtube.com/watch?v=hTarMdJub0M'
            }
        };

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.post('/api/user/page/edit', page);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(page:Page {pageId: '0'})")
                .return(`page.pageId AS pageId, page.topic AS topic, page.description AS description, page.link AS link, page.linkEmbed AS linkEmbed,
                         page.modified AS modified, page.created AS created, page.label AS label, page.title AS title, page.language AS language,
                         page.linkHistory AS linkHistory, page.linkHistoryDate AS linkHistoryDate`)
                .end().send();
        }).then(function (page) {
            page.length.should.equals(1);
            page[0].created.should.equals(501);
            page[0].modified.should.be.at.least(startTime);
            page[0].pageId.should.equals('0');
            page[0].description.should.equals("description2");
            page[0].link.should.equals("https://www.youtube.com/watch?v=hTarMdJub0M");
            page[0].linkEmbed.should.equals("https://www.youtube.com/embed/hTarMdJub0M");
            page[0].title.should.equals("title");
            page[0].label.should.equals("Youtube");

            page[0].topic.length.should.equals(2);
            page[0].topic[0].should.equals('environmental');
            page[0].topic[1].should.equals('spiritual');
            page[0].language.length.should.equals(2);
            page[0].language[0].should.equals('en');
            page[0].language[1].should.equals('es');

            page[0].linkHistory.length.should.equals(0);
            page[0].linkHistoryDate.length.should.equals(0);
        });
    });

    it('Edit of video page without being administrator - Return 400', function () {

        let page = {
            youtubePage: {
                pageId: '1',
                topic: ["environmental","spiritual"],
                description: 'description2',
                language: ['en', 'es'],
                link: 'https://www.youtube.com/watch?v=hTarMdJub02'
            }
        };

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.post('/api/user/page/edit', page);
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(page:Page {pageId: '1'})")
                .return(`page.pageId AS pageId, page.topic AS topic, page.description AS description, page.link AS link, page.linkEmbed AS linkEmbed,
                         page.modified AS modified, page.created AS created, page.title AS title, page.label AS label, page.language AS language,
                         page.linkHistory AS linkHistory, page.linkHistoryDate AS linkHistoryDate`)
                .end().send();
        }).then(function (page) {
            page.length.should.equals(1);
            page[0].created.should.equals(501);
            page[0].modified.should.equals(502);
            page[0].pageId.should.equals('1');
            page[0].description.should.equals("description");
            page[0].link.should.equals("https://www.youtube.com/watch?v=hTarMdJub0M");
            page[0].linkEmbed.should.equals("https://www.youtube.com/embed/hTarMdJub0M");
            page[0].title.should.equals("title");
            page[0].label.should.equals("Youtube");

            page[0].topic.length.should.equals(2);
            page[0].topic[0].should.equals('health');
            page[0].topic[1].should.equals('environmental');
            page[0].language.length.should.equals(2);
            page[0].language[0].should.equals('de');
            page[0].language[1].should.equals('fr');

            page[0].linkHistory.length.should.equals(0);
            page[0].linkHistoryDate.length.should.equals(0);
        });
    });
});
