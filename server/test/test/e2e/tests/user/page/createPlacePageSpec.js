'use strict';

var users = require('../../util/user');
var db = require('../../util/db');
var requestHandler = require('../../util/request');
var moment = require('moment');
var stubCDN = require('../../util/stubCDN');
var sinon = require('sinon');

describe('Integration Tests for creating new place pages', function () {

    var requestAgent, startTime;

    beforeEach(function () {

        var commands = [];
        stubCDN.uploadFile.reset();
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

    it('Create a new place page - Return 200', function () {

        var createPage = {
            placePage: {
                topic: ['health', 'spiritual'],
                title: 'title',
                description: 'description',
                longitude: -5.00,
                latitude: 6.00,
                language: 'de'
            }
        }, pageId;

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/create', createPage, requestAgent, './test/test/e2e/tests/user/page/test.jpg');
        }).then(function (res) {
            res.status.should.equal(200);
            pageId = res.body.pageId;
            res.body.placePreviewUrl.should.equals(`pages/${pageId}/pagePreview.jpg`);
            return db.cypher().match("(page:Page {title: 'title'})<-[:IS_ADMIN]-(:User {userId: '1'})")
                .return('page.pageId AS pageId, page.label AS label, page.topic AS topic, page.description AS description, page.author AS author, ' +
                'page.modified AS modified, page.created AS created, page.publishDate AS publishDate, page.language AS language')
                .end().send();
        }).then(function (page) {
            page.length.should.equals(1);
            page[0].created.should.be.at.least(startTime);
            page[0].modified.should.be.at.least(startTime);
            page[0].label.should.equals("Place");
            page[0].pageId.should.equals(pageId);
            page[0].description.should.equals("description");
            page[0].author.should.equals("Hans Muster");
            page[0].publishDate.should.equals(500);

            page[0].topic.length.should.equals(2);
            page[0].topic[0].should.equals('health');
            page[0].topic[1].should.equals('spiritual');
            page[0].language.length.should.equals(1);
            page[0].language[0].should.equals('de');

            stubCDN.uploadFile.calledWith(sinon.match.any, `pages/${pageId}/pagePreview.jpg`).should.be.true;
            stubCDN.uploadFile.calledWith(sinon.match.any, `pages/${pageId}/pageTitlePicture.jpg`).should.be.true;
            stubCDN.uploadFile.calledWith(sinon.match.any, `pages/${pageId}/original.jpg`).should.be.true;
        });
    });
});
