'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');
let should = require('chai').should();

describe('Integration Tests for creating new youtube pages', function () {

    let startTime;

    beforeEach(function () {

        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return dbDsl.init(1).then(function () {
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Create a new youtube page - Return 200', function () {

        let createPage = {
            youtubePage: {
                topic: ['environmental', 'education'],
                title: 'title',
                description: 'description',
                link: 'https://www.youtube.com/watch?v=hTarMdJub0M',
                language: ['en', 'de']
            }
        }, pageId;

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.post('/api/user/page/create', createPage);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.linkEmbed.should.equals('https://www.youtube.com/embed/hTarMdJub0M');
            pageId = res.body.pageId;
            return db.cypher().match(`(:User {userId: '1'})-[:RECOMMENDS]->(recommendation:Recommendation:PinwallElement)-[:RECOMMENDS]->
                                      (page:Page {title: 'title'})<-[:IS_ADMIN]-(:User {userId: '1'})`)
                .optionalMatch(`(recommendation)-[pinwallData:PINWALL_DATA]->(page)`)
                .return(`page.pageId AS pageId, page.topic AS topic, page.description AS description, page.link AS link, page.linkEmbed AS linkEmbed,
                         page.modified AS modified, page.created AS created, page.label AS label, page.language AS language,
                         page.linkHistory AS linkHistory, page.linkHistoryDate AS linkHistoryDate, recommendation, pinwallData`)
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

            page[0].recommendation.created.should.be.at.least(startTime);
            should.exist(page[0].recommendation.recommendationId);
            should.exist(page[0].pinwallData);

            page[0].linkHistory.length.should.equals(0);
            page[0].linkHistoryDate.length.should.equals(0);
        });
    });

    it('Create a new mobile youtube page - Return 200', function () {

        let createPage = {
            youtubePage: {
                topic: ['environmental', 'education'],
                title: 'title',
                description: 'description',
                link: 'https://m.youtube.com/watch?v=Lhku7ZBWEK8',
                language: ['en', 'de']
            }
        }, pageId;

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.post('/api/user/page/create', createPage);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.linkEmbed.should.equals('https://www.youtube.com/embed/Lhku7ZBWEK8');
            pageId = res.body.pageId;
            return db.cypher().match(`(:User {userId: '1'})-[:RECOMMENDS]->(recommendation:Recommendation:PinwallElement)-[:RECOMMENDS]->
                                      (page:Page {title: 'title'})<-[:IS_ADMIN]-(:User {userId: '1'})`)
                .optionalMatch(`(recommendation)-[pinwallData:PINWALL_DATA]->(page)`)
                .return(`page.pageId AS pageId, page.topic AS topic, page.description AS description, page.link AS link, page.linkEmbed AS linkEmbed,
                         page.modified AS modified, page.created AS created, page.label AS label, page.language AS language,
                         page.linkHistory AS linkHistory, page.linkHistoryDate AS linkHistoryDate, recommendation, pinwallData`)
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

            page[0].recommendation.created.should.be.at.least(startTime);
            should.exist(page[0].recommendation.recommendationId);
            should.exist(page[0].pinwallData);

            page[0].linkHistory.length.should.equals(0);
            page[0].linkHistoryDate.length.should.equals(0);
        });
    });

    it('Create a new youtube page (playlist)- Return 200', function () {

        let createPage = {
            youtubePage: {
                topic: ['environmental', 'education'],
                title: 'title',
                description: 'description',
                link: 'https://www.youtube.com/watch?v=Vhl6oskxrs0&index=1&list=PL8027E1CE6CF2BA5F',
                language: ['en', 'de']
            }
        }, pageId;

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.post('/api/user/page/create', createPage);
        }).then(function (res) {
            res.status.should.equal(200);
            pageId = res.body.pageId;
            return db.cypher().match(`(:User {userId: '1'})-[:RECOMMENDS]->(recommendation:Recommendation:PinwallElement)-[:RECOMMENDS]->
                                      (page:Page {title: 'title'})<-[:IS_ADMIN]-(:User {userId: '1'})`)
                .optionalMatch(`(recommendation)-[pinwallData:PINWALL_DATA]->(page)`)
                .return(`page.pageId AS pageId, page.topic AS topic, page.description AS description, page.link AS link, page.linkEmbed AS linkEmbed,
                         page.modified AS modified, page.created AS created, page.label AS label, page.language AS language,
                         page.linkHistory AS linkHistory, page.linkHistoryDate AS linkHistoryDate, recommendation, pinwallData`)
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

            page[0].recommendation.created.should.be.at.least(startTime);
            should.exist(page[0].recommendation.recommendationId);
            should.exist(page[0].pinwallData);

            page[0].linkHistory.length.should.equals(0);
            page[0].linkHistoryDate.length.should.equals(0);
        });
    });

    it('Create a new mobile youtube page (playlist)- Return 200', function () {

        let createPage = {
            youtubePage: {
                topic: ['environmental', 'education'],
                title: 'title',
                description: 'description',
                link: 'https://m.youtube.com/watch?v=Vhl6oskxrs0&index=1&list=PL8027E1CE6CF2BA5F',
                language: ['en', 'de']
            }
        }, pageId;

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.post('/api/user/page/create', createPage);
        }).then(function (res) {
            res.status.should.equal(200);
            pageId = res.body.pageId;
            return db.cypher().match(`(:User {userId: '1'})-[:RECOMMENDS]->(recommendation:Recommendation:PinwallElement)-[:RECOMMENDS]->
                                      (page:Page {title: 'title'})<-[:IS_ADMIN]-(:User {userId: '1'})`)
                .optionalMatch(`(recommendation)-[pinwallData:PINWALL_DATA]->(page)`)
                .return(`page.pageId AS pageId, page.topic AS topic, page.description AS description, page.link AS link, page.linkEmbed AS linkEmbed,
                         page.modified AS modified, page.created AS created, page.label AS label, page.language AS language,
                         page.linkHistory AS linkHistory, page.linkHistoryDate AS linkHistoryDate, recommendation, pinwallData`)
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

            page[0].recommendation.created.should.be.at.least(startTime);
            should.exist(page[0].recommendation.recommendationId);
            should.exist(page[0].pinwallData);

            page[0].linkHistory.length.should.equals(0);
            page[0].linkHistoryDate.length.should.equals(0);
        });
    });

    it('Invalid youtube link - Return 400', function () {

        let createPage = {
            youtubePage: {
                topic: ['environmental', 'education'],
                title: 'title',
                description: 'description',
                link: 'https://www.youtube.com/embed/hTarMdJub0M',
                language: ['en', 'de']
            }
        };

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.post('/api/user/page/create', createPage);
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(page:Page {title: 'title'})").return("page").end().send();
        }).then(function (page) {
            page.length.should.equals(0);
        });
    });
});
