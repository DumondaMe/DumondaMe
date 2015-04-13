'use strict';

var app = require('../../../../../server');
var users = require('../util/user');
var db = require('../util/db');
var requestHandler = require('../util/request');
var should = require('chai').should();
var moment = require('moment');

describe('Integration Tests for getting page detail', function () {

    var requestAgent, startTime;

    beforeEach(function () {

        var commands = [];
        return db.clearDatabase().then(function () {
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', surname: 'Meier', forename:'user', userId: '1'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier2', userId: '2'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier3', userId: '3'})").end().getCommand());
            commands.push(db.cypher().create("(:BookPage {title: 'bookPage1Title', description: 'bookPage1', created: 501, pageId: '0'," +
            "author: 'Hans Muster'})").end().getCommand());
            commands.push(db.cypher().create("(:VideoPage {title: 'page2Title', description: 'page2', created: 500, pageId: '0'})").end().getCommand());
            commands.push(db.cypher().create("(:SchoolPage {title: 'page3Title', description: 'page3', created: 502, pageId: '0'})").end().getCommand());
            commands.push(db.cypher().create("(:CoursePage {title: 'page4Title', description: 'page4', created: 503, pageId: '0'})").end().getCommand());
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
                .end().send(commands)
                .catch(function (err) {
                    var error = err;
                });

        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting the detail of the page for a book store with linked authors in elyoos', function () {

        var commands = [];

        commands.push(db.cypher().match("(a:BookPage {pageId: '0'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_AUTHOR]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:BookPage {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_AUTHOR]->(a)")
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
                res.body.page.author.length.should.equals(3);
                res.body.page.author[0].name.should.equals('Hans Muster');
                should.not.exist(res.body.page.author[0].userId);
                res.body.page.author[1].name.should.equals('user Meier');
                res.body.page.author[1].userId.should.equals('1');
                res.body.page.author[2].name.should.equals('user Meier2');
                res.body.page.author[2].userId.should.equals('2');
                res.body.administrators.length.should.equals(1);
                res.body.administrators[0].name.should.equals('user Meier2');
                res.body.administrators[0].userId.should.equals('2');
            });
    });
});
