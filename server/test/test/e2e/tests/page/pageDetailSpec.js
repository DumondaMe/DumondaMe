'use strict';

var app = require('../../../../../server');
var users = require('../util/user');
var db = require('../util/db');
var requestHandler = require('../util/request');
var should = require('chai').should();
var moment = require('moment');

describe('Integration Tests for getting page detail', function () {

    var requestAgent;

    beforeEach(function () {

        var commands = [];
        return db.clearDatabase().then(function () {
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', surname: 'Meier', forename:'user', userId: '1'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier2', userId: '2'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier3', userId: '3'})").end().getCommand());
            commands.push(db.cypher().create("(:BookPage {title: 'bookPage1Title', description: 'bookPage1', language: 'de', created: 501, pageId: '0'," +
                "author: 'Hans Muster', publishDate: 1000})").end().getCommand());
            commands.push(db.cypher().create("(:VideoPage {title: 'page2Title', description: 'page2', link: 'www.link.com', duration: 10, created: 500, pageId: '0', actor: 'Hans Muster'})").end().getCommand());
            commands.push(db.cypher().create("(:SchoolPage {title: 'page3Title', description: 'page3', link: 'www.link.com', created: 502, pageId: '0'})").end().getCommand());
            commands.push(db.cypher().create("(:CoursePage {title: 'page4Title', description: 'page4', link: 'www.link.com', created: 503, pageId: '0'})").end().getCommand());
            commands.push(db.cypher().create("(:PracticePage {title: 'page6Title', description: 'page6', created: 505, pageId: '0'})").end().getCommand());
            commands.push(db.cypher().create("(:EventPage {title: 'page7Title', description: 'page7', created: 506, pageId: '0'})").end().getCommand());
            commands.push(db.cypher().create("(:BlogPage {title: 'page8Title', description: 'page8', created: 507, pageId: '0'})").end().getCommand());


            commands.push(db.cypher().match("(a:BookPage {pageId: '1'}), (b:User {userId: '1'})")
                .create("(b)-[:IS_AUTHOR]->(a)")
                .end().getCommand());
            commands.push(db.cypher().match("(a:BookPage {pageId: '1'}), (b:User {userId: '2'})")
                .create("(b)-[:IS_AUTHOR]->(a)")
                .end().getCommand());

            return db.cypher().create("(:StorePage {title: 'page9Title', description: 'page9', created: 508, pageId: '0', " +
                "webLink: 'www.irgenwas.com', street: 'Strasse', houseNumber: 50, place: 'Zürich', postalCode: '8008'})")
                .end().send(commands);

        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting the detail of the page for a book with linked authors in elyoos', function () {

        var commands = [];

        commands.push(db.cypher().match("(u:User {userId: '1'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false, profileData: true, contacts: true}), " +
            "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true}), " +
            "(u)-[:HAS_PRIVACY {type: 'Bekannter'}]->(:Privacy {profile: false, image: false})")
            .end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '3'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund'}]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '3'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund'}]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '2'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_CONTACT {type: 'Bekannter'}]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(u:User {userId: '2'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: true, profileData: true, contacts: true}), " +
            "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true}), " +
            "(u)-[:HAS_PRIVACY {type: 'Bekannter'}]->(:Privacy {profile: true, image: true})")
            .end().getCommand());
        commands.push(db.cypher().match("(a:BookPage {pageId: '0'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_AUTHOR]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:BookPage {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_AUTHOR]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:BookPage {pageId: '0'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_ADMIN]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:BookPage {pageId: '0'}), (b:User {userId: '1'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 500, rating: 1, comment: 'irgendwas', recommendationId: '0'})-[:RECOMMENDS]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:BookPage {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 500, rating: 4, comment: 'irgendwas2', recommendationId: '1'})-[:RECOMMENDS]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:BookPage {pageId: '0'}), (b:User {userId: '3'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 501, rating: 4, comment: 'irgendwas3', recommendationId: '2'})-[:RECOMMENDS]->(a)")
            .end().getCommand());

        return db.cypher().match("(a:BookPage {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_ADMIN]->(a)")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).
            then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/page/detail', {
                    pageId: '0',
                    label: 'BookPage'
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.page.title.should.equals('bookPage1Title');
                res.body.page.description.should.equals('bookPage1');
                res.body.page.language.should.equals('de');
                res.body.page.created.should.equals(501);
                res.body.page.publishDate.should.equals(1000);
                res.body.page.titleUrl.should.equals('pages/BookPage/0/pageTitlePicture.jpg');

                res.body.page.author.length.should.equals(3);
                res.body.page.author[0].name.should.equals('Hans Muster');
                res.body.page.author[0].isLoggedInUser.should.be.false;
                should.not.exist(res.body.page.author[0].userId);
                res.body.page.author[1].name.should.equals('user Meier');
                res.body.page.author[1].userId.should.equals('1');
                res.body.page.author[1].isLoggedInUser.should.be.true;
                res.body.page.author[2].name.should.equals('user Meier2');
                res.body.page.author[2].userId.should.equals('2');
                res.body.page.author[2].isLoggedInUser.should.be.false;

                res.body.administrators.list.length.should.equals(2);
                res.body.administrators.list[0].name.should.equals('user Meier');
                res.body.administrators.list[0].userId.should.equals('1');
                res.body.administrators.list[0].profileUrl.should.equals('profileImage/1/profilePreview.jpg');
                res.body.administrators.list[1].name.should.equals('user Meier2');
                res.body.administrators.list[1].userId.should.equals('2');
                res.body.administrators.list[1].profileUrl.should.equals('profileImage/default/profilePreview.jpg');
                res.body.administrators.isAdmin.should.be.true;

                res.body.recommendation.user.profileUrl.should.equals('profileImage/1/thumbnail.jpg');
                res.body.recommendation.user.rating.should.equals(1);
                res.body.recommendation.user.comment.should.equals('irgendwas');
                res.body.recommendation.user.recommendationId.should.equals('0');

                res.body.recommendation.summary.contact.rating.should.equals(4);
                res.body.recommendation.summary.contact.numberOfRatings.should.equals(2);
                res.body.recommendation.summary.all.rating.should.equals(3);
                res.body.recommendation.summary.all.numberOfRatings.should.equals(3);
            });
    });

    it('Getting the detail of the page for a book without user recommendation', function () {

        var commands = [];

        return db.cypher().match("(a:BookPage {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_ADMIN]->(a)")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).
            then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/page/detail', {
                    pageId: '0',
                    label: 'BookPage'
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);
            });
    });
});
