'use strict';

var users = require('../../util/user');
var db = require('../../util/db');
var requestHandler = require('../../util/request');
var should = require('chai').should();

describe('Integration Tests for getting the pages administrated by the user', function () {

    var requestAgent;

    beforeEach(function () {

        var commands = [];
        return db.clearDatabase().then(function () {
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', surname: 'Meier', forename:'user', userId: '1'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier2', userId: '2'})").end().getCommand());

            commands.push(db.cypher().match("(u:User {userId: '1'})")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: true, profileData: true, contacts: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})")
                .end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '2'})")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: true, profileData: true, contacts: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: false, image: false})")
                .end().getCommand());

            return db.cypher().create("(:User {name: 'user Meier5', userId: '5'})")
                .end().send(commands);
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    // Sorted by when the page was modified
    it('Getting all pages administrated by user- Return 200', function () {

        var commands = [];

        commands.push(db.cypher().create("(:Page {title: 'page1Title', label: 'Book', description: 'page1', modified: 5090, pageId: '0'})").end().getCommand());
        commands.push(db.cypher().create("(:Page {title: 'page2Title', label: 'Book', description: 'page2', modified: 5091, pageId: '1'})").end().getCommand());
        commands.push(db.cypher().create("(:Page {title: 'page2Title', label: 'Youtube', description: 'page2', modified: 5080, pageId: '2'})").end().getCommand());

        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_ADMIN]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '1'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_ADMIN]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '2'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_ADMIN]->(a)").end().getCommand());

        //Not returned Pages because user does not administrate pages
        commands.push(db.cypher().create("(:Page {title: 'page3Title', label: 'Book', description: 'page3', modified: 5070, pageId: '3'})").end().getCommand());
        commands.push(db.cypher().create("(:Page {title: 'page4Title', label: 'Youtube', description: 'page4', modified: 5080, pageId: '4'})").end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '3'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_ADMIN]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '4'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_ADMIN]->(a)").end().getCommand());

        return db.cypher().create("(:Page {title: 'page5Title', label: 'VideoPage', description: 'page5', modified: 5090, pageId: '5'})")
            .end().send(commands).then(function () {
                return requestHandler.login(users.validUser).then(function (agent) {
                    requestAgent = agent;
                    return requestHandler.getWithData('/api/user/page/administrator', {
                        skip: '0',
                        maxItems: 50
                    }, requestAgent);
                }).then(function (res) {
                    res.status.should.equal(200);
                    res.body.pages.length.should.equals(3);
                    res.body.pages[0].pageId.should.equals('1');
                    res.body.pages[0].label.should.equals('Book');

                    res.body.pages[1].pageId.should.equals('0');
                    res.body.pages[1].label.should.equals('Book');

                    res.body.pages[2].pageId.should.equals('2');
                    res.body.pages[2].label.should.equals('Youtube');

                    res.body.totalNumberOfPages.should.equals(3);
                });
            });
    });

    it('Getting a book page administrated by the user- Return 200', function () {

        var commands = [];

        commands.push(db.cypher().create("(:Page {title: 'page1Title', label: 'Book', language: 'de', description: 'page1', modified: 5090, pageId: '0'})").end().getCommand());
        commands.push(db.cypher().create("(:Page {title: 'page2Title', label: 'Book', description: 'page2', modified: 5091, pageId: '1'})").end().getCommand());
        commands.push(db.cypher().create("(:Page {title: 'page2Title', label: 'Youtube', description: 'page3', modified: 5080, pageId: '2'})").end().getCommand());

        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '1'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 507, recommendationId: '1', rating: 4})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_ADMIN]->(a)").end().getCommand());

        return db.cypher().create("(:Page {title: 'page5Title', label: 'Youtube', description: 'page5', modified: 5090, pageId: '5'})")
            .end().send(commands).then(function () {
                return requestHandler.login(users.validUser).then(function (agent) {
                    requestAgent = agent;
                    return requestHandler.getWithData('/api/user/page/administrator', {
                        skip: '0',
                        maxItems: 50
                    }, requestAgent);
                }).then(function (res) {
                    res.status.should.equal(200);
                    res.body.pages.length.should.equals(1);

                    res.body.pages[0].pageId.should.equals('0');
                    res.body.pages[0].label.should.equals('Book');
                    res.body.pages[0].title.should.equals('page1Title');
                    res.body.pages[0].language.should.equals('de');
                    res.body.pages[0].url.should.equals('pages/Book/0/pagePreview.jpg');
                    should.not.exist(res.body.pages[0].recommendation.contact.comment);
                    res.body.pages[0].recommendation.contact.rating.should.equals(4);
                    res.body.pages[0].recommendation.contact.url.should.equals('profileImage/1/thumbnail.jpg');
                    res.body.pages[0].recommendation.contact.name.should.equals('user Meier');

                    res.body.totalNumberOfPages.should.equals(1);
                });
            });
    });

    it('Getting only youtube recommendations of user- Return 200', function () {

        var commands = [];

        commands.push(db.cypher().create("(:Page {title: 'page1Title', label: 'Book', language: 'de', description: 'page1', modified: 5070, pageId: '0'})").end().getCommand());
        commands.push(db.cypher().create("(:Page {title: 'page3Title', label: 'Youtube', link: 'www.youtube.com', language: 'de', description: 'page2', modified: 5080, pageId: '2'})").end().getCommand());

        commands.push(db.cypher().match("(a:Page {pageId: '2'}), (b:User {userId: '1'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 509, recommendationId: '3', rating: 4})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '2'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_ADMIN]->(a)").end().getCommand());

        return db.cypher().create("(:Page {title: 'page5Title', label: 'Book', description: 'page5', modified: 5090, pageId: '5'})")
            .end().send(commands).then(function () {
                return requestHandler.login(users.validUser).then(function (agent) {
                    requestAgent = agent;
                    return requestHandler.getWithData('/api/user/page/administrator', {
                        skip: '0',
                        maxItems: 50
                    }, requestAgent);
                }).then(function (res) {
                    res.status.should.equal(200);
                    res.body.pages.length.should.equals(1);
                    res.body.pages[0].pageId.should.equals('2');
                    res.body.pages[0].label.should.equals('Youtube');
                    res.body.pages[0].title.should.equals('page3Title');
                    res.body.pages[0].language.should.equals('de');
                    res.body.pages[0].link.should.equals('www.youtube.com');
                    should.not.exist(res.body.pages[0].url);
                    should.not.exist(res.body.pages[0].recommendation.contact.comment);
                    res.body.pages[0].recommendation.contact.rating.should.equals(4);
                    res.body.pages[0].recommendation.contact.url.should.equals('profileImage/1/thumbnail.jpg');
                    res.body.pages[0].recommendation.contact.name.should.equals('user Meier');

                    res.body.totalNumberOfPages.should.equals(1);
                });
            });
    });
});
