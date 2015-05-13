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
            commands.push(db.cypher().create("(:BookPage {title: 'bookPage1Title', description: 'bookPage1', created: 501, pageId: '0'," +
                "author: 'Hans Muster'})").end().getCommand());
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

        commands.push(db.cypher().match("(a:User {userId: '3'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_CONTACT]->(a)")
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
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 500, rating: 5, comment: 'irgendwas', recommendationId: '0'})-[:RECOMMENDS]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:BookPage {pageId: '0'}), (b:User {userId: '3'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 500, rating: 4, comment: 'irgendwas2', recommendationId: '1'})-[:RECOMMENDS]->(a)")
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
                res.body.page.created.should.equals(501);
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
                res.body.administrators.list[1].name.should.equals('user Meier2');
                res.body.administrators.list[1].userId.should.equals('2');
                res.body.administrators.isAdmin.should.be.true;

                res.body.recommendation.user.profileUrl.should.equals('profileImage/1/thumbnail.jpg');
                res.body.recommendation.user.rating.should.equals(5);
                res.body.recommendation.user.comment.should.equals('irgendwas');
                res.body.recommendation.user.recommendationId.should.equals('0');

                res.body.recommendation.users.length.should.equals(1);
                res.body.recommendation.users[0].profileUrl.should.equals('profileImage/3/thumbnail.jpg');
                res.body.recommendation.users[0].name.should.equals('user Meier3');
                res.body.recommendation.users[0].userId.should.equals('3');
                res.body.recommendation.users[0].rating.should.equals(4);
                res.body.recommendation.users[0].comment.should.equals('irgendwas2');
                res.body.recommendation.users[0].recommendationId.should.equals('1');

                res.body.recommendation.summary.contact.rating.should.equals(4);
                res.body.recommendation.summary.contact.numberOfRatings.should.equals(1);
                res.body.recommendation.summary.all.rating.should.equals(4.5);
                res.body.recommendation.summary.all.numberOfRatings.should.equals(2);
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

    it('Getting the detail of the page for a video with linked actors in elyoos', function () {

        var commands = [];

        commands.push(db.cypher().match("(a:VideoPage {pageId: '0'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_ACTOR]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:VideoPage {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_ACTOR]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:VideoPage {pageId: '0'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_ADMIN]->(a)")
            .end().getCommand());

        return db.cypher().match("(a:VideoPage {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_ADMIN]->(a)")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).
            then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/page/detail', {
                    pageId: '0',
                    label: 'VideoPage'
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.page.title.should.equals('page2Title');
                res.body.page.description.should.equals('page2');
                res.body.page.link.should.equals('www.link.com');
                res.body.page.duration.should.equals(10);
                res.body.page.created.should.equals(500);
                res.body.page.titleUrl.should.equals('pages/VideoPage/0/pageTitlePicture.jpg');
                res.body.page.actor.length.should.equals(3);
                res.body.page.actor[0].name.should.equals('Hans Muster');
                res.body.page.actor[0].isLoggedInUser.should.be.false;
                should.not.exist(res.body.page.actor[0].userId);
                res.body.page.actor[1].name.should.equals('user Meier');
                res.body.page.actor[1].userId.should.equals('1');
                res.body.page.actor[1].isLoggedInUser.should.be.true;
                res.body.page.actor[2].name.should.equals('user Meier2');
                res.body.page.actor[2].userId.should.equals('2');
                res.body.page.actor[2].isLoggedInUser.should.be.false;
                res.body.administrators.list.length.should.equals(2);
                res.body.administrators.list[0].name.should.equals('user Meier');
                res.body.administrators.list[0].userId.should.equals('1');
                res.body.administrators.list[0].userIsAdmin.should.be.true;
                res.body.administrators.list[1].name.should.equals('user Meier2');
                res.body.administrators.list[1].userId.should.equals('2');
                res.body.administrators.list[1].userIsAdmin.should.be.false;
            });
    });

    it('Getting the detail of the page for a course', function () {

        var commands = [];

        commands.push(db.cypher().match("(a:CoursePage {pageId: '0'}), (b:User {userId: '1'})")
            .create("(b)-[:INSTRUCTOR]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:CoursePage {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:INSTRUCTOR]->(a)")
            .end().getCommand());

        return db.cypher().match("(a:CoursePage {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_ADMIN]->(a)")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).
            then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/page/detail', {
                    pageId: '0',
                    label: 'CoursePage'
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.page.title.should.equals('page4Title');
                res.body.page.description.should.equals('page4');
                res.body.page.link.should.equals('www.link.com');
                res.body.page.created.should.equals(503);
                res.body.page.titleUrl.should.equals('pages/CoursePage/0/pageTitlePicture.jpg');
                res.body.page.instructor.length.should.equals(2);
                res.body.page.instructor[0].name.should.equals('user Meier');
                res.body.page.instructor[0].userId.should.equals('1');
                res.body.page.instructor[0].isLoggedInUser.should.be.true;
                res.body.page.instructor[1].name.should.equals('user Meier2');
                res.body.page.instructor[1].userId.should.equals('2');
                res.body.page.instructor[1].isLoggedInUser.should.be.false;
                res.body.administrators.list.length.should.equals(1);
                res.body.administrators.list[0].name.should.equals('user Meier2');
                res.body.administrators.list[0].userId.should.equals('2');
                res.body.administrators.list[0].userIsAdmin.should.be.false;
            });
    });

    it('Getting the detail of the page for a school', function () {

        var commands = [];

        commands.push(db.cypher().match("(a:SchoolPage {pageId: '0'}), (b:User {userId: '1'})")
            .create("(b)-[:PRINCIPAL]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:SchoolPage {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:PRINCIPAL]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:CoursePage {pageId: '0'}), (b:SchoolPage {pageId: '0'})")
            .create("(b)-[:OFFER]->(a)")
            .end().getCommand());

        return db.cypher().match("(a:SchoolPage {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_ADMIN]->(a)")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).
            then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/page/detail', {
                    pageId: '0',
                    label: 'SchoolPage'
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.page.title.should.equals('page3Title');
                res.body.page.description.should.equals('page3');
                res.body.page.link.should.equals('www.link.com');
                res.body.page.created.should.equals(502);
                res.body.page.titleUrl.should.equals('pages/SchoolPage/0/pageTitlePicture.jpg');
                res.body.page.principal.length.should.equals(2);
                res.body.page.principal[0].name.should.equals('user Meier');
                res.body.page.principal[0].userId.should.equals('1');
                res.body.page.principal[0].isLoggedInUser.should.be.true;
                res.body.page.principal[1].name.should.equals('user Meier2');
                res.body.page.principal[1].userId.should.equals('2');
                res.body.page.principal[1].isLoggedInUser.should.be.false;
                res.body.page.pageReference.length.should.equals(1);
                res.body.page.pageReference[0].title.should.equals('page4Title');
                res.body.page.pageReference[0].previewUrl.should.equals('pages/CoursePage/0/pageTitlePicturePreview.jpg');
                res.body.administrators.list.length.should.equals(1);
                res.body.administrators.list[0].name.should.equals('user Meier2');
                res.body.administrators.list[0].userId.should.equals('2');
                res.body.administrators.list[0].userIsAdmin.should.be.false;
            });
    });
});
