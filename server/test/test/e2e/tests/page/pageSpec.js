'use strict';

var app = require('../../../../../server');
var users = require('../util/user');
var db = require('../util/db');
var requestHandler = require('../util/request');
var should = require('chai').should();
var moment = require('moment');

describe('Integration Tests for getting pages', function () {

    var requestAgent;

    beforeEach(function () {

        var commands = [];
        return db.clearDatabase().then(function () {
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', surname: 'Meier', forename:'user', userId: '1'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier2', userId: '2'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier3', userId: '3'})").end().getCommand());
            commands.push(db.cypher().create("(:BookPage {title: 'page1Title', description: 'page1', created: 501, pageId: '0'})").end().getCommand());
            commands.push(db.cypher().create("(:VideoPage {title: 'page2Title', description: 'page2', created: 500, pageId: '1'})").end().getCommand());
            commands.push(db.cypher().create("(:SchoolPage {title: 'page3Title', description: 'page3', created: 502, pageId: '2'})").end().getCommand());
            commands.push(db.cypher().create("(:CoursePage {title: 'page4Title', description: 'page4', created: 503, pageId: '3'})").end().getCommand());
            commands.push(db.cypher().create("(:CoursePage {title: 'page5Title', description: 'page5', created: 504, pageId: '4'})").end().getCommand());
            commands.push(db.cypher().create("(:PracticePage {title: 'page6Title', description: 'page6', created: 505, pageId: '5'})").end().getCommand());
            commands.push(db.cypher().create("(:EventPage {title: 'page7Title', description: 'page7', created: 506, pageId: '6'})").end().getCommand());
            commands.push(db.cypher().create("(:BlogPage {title: 'page8Title', description: 'page8', created: 507, pageId: '7'})").end().getCommand());
            commands.push(db.cypher().create("(:StorePage {title: 'page9Title', description: 'page9', created: 508, pageId: '8'})").end().getCommand());

            commands.push(db.cypher().match("(a:BookPage {pageId: '0'}), (b:VideoPage {pageId: '1'})")
                .create("(a)-[:HAS_FILM_VERSION]->(b)")
                .end().getCommand());
            commands.push(db.cypher().match("(a:User {userId: '2'}), (b:VideoPage {pageId: '1'})")
                .create("(a)-[:IS_ADMIN]->(b)")
                .end().getCommand());

            commands.push(db.cypher().match("(a:SchoolPage {pageId: '2'}), (b:CoursePage {pageId: '3'})")
                .create("(a)-[:HAS_COURSE]->(b)")
                .end().getCommand());
            return db.cypher().match("(a:SchoolPage {pageId: '2'}), (b:CoursePage {pageId: '4'})")
                .create("(a)-[:HAS_COURSE]->(b)")
                .end().send(commands)
                .catch(function (err) {
                    var error = err;
                });
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting all pages unfiltered sorted by creation date - Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/page', {
                skip: '0',
                maxItems: 50,
                isSuggestion: false
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.pages.length.should.equals(9);
            res.body.pages[0].description.should.equals('page2');
            res.body.pages[0].title.should.equals('page2Title');
            res.body.pages[0].pageId.should.equals('1');
            res.body.pages[0].label.should.equals('VideoPage');
            res.body.pages[0].url.should.equals('app/img/page/default/pagePreview.png');
            res.body.pages[1].description.should.equals('page1');
            res.body.pages[1].title.should.equals('page1Title');
            res.body.pages[1].pageId.should.equals('0');
            res.body.pages[1].label.should.equals('BookPage');
            res.body.pages[1].url.should.equals('app/img/page/default/pagePreview.png');
            res.body.pages[2].description.should.equals('page3');
            res.body.pages[2].title.should.equals('page3Title');
            res.body.pages[2].pageId.should.equals('2');
            res.body.pages[2].label.should.equals('SchoolPage');
            res.body.pages[2].url.should.equals('app/img/page/default/pagePreview.png');
            res.body.pages[3].description.should.equals('page4');
            res.body.pages[3].title.should.equals('page4Title');
            res.body.pages[3].pageId.should.equals('3');
            res.body.pages[3].label.should.equals('CoursePage');
            res.body.pages[3].url.should.equals('app/img/page/default/pagePreview.png');
            res.body.pages[4].description.should.equals('page5');
            res.body.pages[4].title.should.equals('page5Title');
            res.body.pages[4].pageId.should.equals('4');
            res.body.pages[4].label.should.equals('CoursePage');
            res.body.pages[4].url.should.equals('app/img/page/default/pagePreview.png');
            res.body.pages[5].description.should.equals('page6');
            res.body.pages[5].title.should.equals('page6Title');
            res.body.pages[5].pageId.should.equals('5');
            res.body.pages[5].label.should.equals('PracticePage');
            res.body.pages[5].url.should.equals('app/img/page/default/pagePreview.png');
            res.body.pages[6].description.should.equals('page7');
            res.body.pages[6].title.should.equals('page7Title');
            res.body.pages[6].pageId.should.equals('6');
            res.body.pages[6].label.should.equals('EventPage');
            res.body.pages[6].url.should.equals('app/img/page/default/pagePreview.png');
            res.body.pages[7].description.should.equals('page8');
            res.body.pages[7].title.should.equals('page8Title');
            res.body.pages[7].pageId.should.equals('7');
            res.body.pages[7].label.should.equals('BlogPage');
            res.body.pages[7].url.should.equals('app/img/page/default/pagePreview.png');
            res.body.pages[8].description.should.equals('page9');
            res.body.pages[8].title.should.equals('page9Title');
            res.body.pages[8].pageId.should.equals('8');
            res.body.pages[8].label.should.equals('StorePage');
            res.body.pages[8].url.should.equals('app/img/page/default/pagePreview.png');
        });
    });
});
