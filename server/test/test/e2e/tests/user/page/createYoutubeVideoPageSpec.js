'use strict';

var users = require('../../util/user');
var db = require('../../util/db');
var requestHandler = require('../../util/request');
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
                language: 'de',
                title: 'title',
                description: 'description',
                link: 'https://www.youtube.com/embed/Test',
            }
        }, pageId;

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/create', createPage, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            pageId = res.body.pageId;
            return db.cypher().match("(page:Page {title: 'title'})<-[:IS_ADMIN]-(:User {userId: '1'})")
                .return('page.pageId AS pageId, page.language AS language, page.description AS description, page.link AS link, ' +
                'page.modified AS modified, page.created AS created, page.label AS label')
                .end().send();
        }).then(function (page) {
            page.length.should.equals(1);
            page[0].modified.should.at.least(startTime);
            page[0].created.should.at.least(startTime);
            page[0].language.should.equals("de");
            page[0].pageId.should.equals(pageId);
            page[0].description.should.equals("description");
            page[0].link.should.equals("https://www.youtube.com/embed/Test");
            page[0].label.should.equals("Youtube");
        });
    });
});
