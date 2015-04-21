'use strict';

var app = require('../../../../../../server');
var users = require('../../util/user');
var db = require('../../util/db');
var requestHandler = require('../../util/request');
var should = require('chai').should();
var moment = require('moment');

describe('Integration Tests for getting user recommendations', function () {

    var requestAgent;

    beforeEach(function () {

        var commands = [];
        return db.clearDatabase().then(function () {
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', surname: 'Meier', forename:'user', userId: '1'})").end().getCommand());
            commands.push(db.cypher().create("(:BookPage {title: 'bookPage1Title', description: 'bookPage1', created: 501, pageId: '0'," +
            "author: 'Hans Muster'})").end().getCommand());
            commands.push(db.cypher().create("(:VideoPage {title: 'page2Title', description: 'page2', link: 'www.link.com', duration: 10, created: 500, pageId: '0', actor: 'Hans Muster'})").end().getCommand());
            commands.push(db.cypher().create("(:SchoolPage {title: 'page3Title', description: 'page3', link: 'www.link.com', created: 502, pageId: '0'})").end().getCommand());
            commands.push(db.cypher().create("(:CoursePage {title: 'page4Title', description: 'page4', link: 'www.link.com', created: 503, pageId: '0'})").end().getCommand());
            commands.push(db.cypher().create("(:PracticePage {title: 'page6Title', description: 'page6', created: 505, pageId: '0'})").end().getCommand());
            commands.push(db.cypher().create("(:EventPage {title: 'page7Title', description: 'page7', created: 506, pageId: '0'})").end().getCommand());
            commands.push(db.cypher().create("(:BlogPage {title: 'page8Title', description: 'page8', created: 507, pageId: '0'})").end().getCommand());


            commands.push(db.cypher().create("(:StorePage {title: 'page9Title', description: 'page9', created: 508, pageId: '0', " +
            "webLink: 'www.irgenwas.com', street: 'Strasse', houseNumber: 50, place: 'Zürich', postalCode: '8008'})")
                .end().getCommand());

            commands.push(db.cypher().create("(:Recommendation {created: 500, rating: 5, comment: 'irgendwas', recommendationId: '0'})")
                .end().getCommand());
            commands.push(db.cypher().match("(a:BookPage {pageId: '0'}), (b:Recommendation {recommendationId: '0'}), (c:User {userId: '1'})")
                .create("(c)-[:RECOMMENDS]->(b)-[:RECOMMENDS]->(a)")
                .end().getCommand());

            commands.push(db.cypher().create("(:Recommendation {created: 499, rating: 4, comment: 'irgendwas2', recommendationId: '1'})")
                .end().getCommand());
            return db.cypher().match("(a:VideoPage {pageId: '0'}), (b:Recommendation {recommendationId: '1'}), (c:User {userId: '1'})")
                .create("(c)-[:RECOMMENDS]->(b)-[:RECOMMENDS]->(a)")
                .end().send(commands);

        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting the recommendation of a user - Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/recommendation', {
                itemsPerPage: 10,
                skip: 0
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.recommendations.length.should.equals(2);
            res.body.recommendations[0].created.should.equals(500);
            res.body.recommendations[0].rating.should.equals(5);
            res.body.recommendations[0].comment.should.equals('irgendwas');
            res.body.recommendations[0].label.should.equals('BookPage');
            res.body.recommendations[0].previewUrl.should.equals('pages/BookPage/0/pageTitlePicturePreview.jpg');
            res.body.recommendations[0].title.should.equals('bookPage1Title');
            res.body.recommendations[0].description.should.equals('bookPage1');
            res.body.recommendations[0].recommendationId.should.equals('0');

            res.body.recommendations[1].created.should.equals(499);
            res.body.recommendations[1].rating.should.equals(4);
            res.body.recommendations[1].comment.should.equals('irgendwas2');
            res.body.recommendations[1].label.should.equals('VideoPage');
            res.body.recommendations[1].previewUrl.should.equals('pages/VideoPage/0/pageTitlePicturePreview.jpg');
            res.body.recommendations[1].title.should.equals('page2Title');
            res.body.recommendations[1].description.should.equals('page2');
            res.body.recommendations[1].recommendationId.should.equals('1');

        });
    });
});
