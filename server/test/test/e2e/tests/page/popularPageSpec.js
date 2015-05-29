'use strict';

var app = require('../../../../../server');
var users = require('../util/user');
var db = require('../util/db');
var requestHandler = require('../util/request');
var should = require('chai').should();
var moment = require('moment');

describe('Integration Tests for getting popular pages', function () {

    var requestAgent;

    beforeEach(function () {

        var commands = [];
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

    // Sorted by when the recommendation was added
    it('Getting only most popular books recommended by users contact - Return 200', function () {

        var commands = [];

        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '2'})")
            .create("(a)-[:IS_CONTACT]->(b)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '3'})")
            .create("(a)-[:IS_CONTACT]->(b)")
            .end().getCommand());

        commands.push(db.cypher().create("(:BookPage {title: 'page1Title', language: 'de', description: 'page1', modified: 5072, pageId: '0'})").end().getCommand());
        commands.push(db.cypher().create("(:BookPage {title: 'page2Title', language: 'de', description: 'page2', modified: 5071, pageId: '1'})").end().getCommand());
        commands.push(db.cypher().create("(:BookPage {title: 'page3Title', language: 'de', description: 'page3', modified: 5073, pageId: '2'})").end().getCommand());
        commands.push(db.cypher().create("(:BookPage {title: 'page4Title', language: 'de', description: 'page4', modified: 5074, pageId: '3'})").end().getCommand());
        commands.push(db.cypher().create("(:BookPage {title: 'page5Title', language: 'de', description: 'page5', modified: 5075, pageId: '4'})").end().getCommand());

        //Best rated book by contact
        commands.push(db.cypher().match("(a:BookPage {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 507, rating: 5, recommendationId: '0'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:BookPage {pageId: '0'}), (b:User {userId: '3'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 508, rating: 4, recommendationId: '1'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:BookPage {pageId: '0'}), (b:User {userId: '4'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 508, rating: 1, recommendationId: '2'})-[:RECOMMENDS]->(a)").end().getCommand());
        //Second best rated book by contact
        commands.push(db.cypher().match("(a:BookPage {pageId: '1'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 507, rating: 4, recommendationId: '3'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:BookPage {pageId: '1'}), (b:User {userId: '3'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 508, rating: 4, recommendationId: '4'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:BookPage {pageId: '1'}), (b:User {userId: '4'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 508, rating: 5, recommendationId: '5'})-[:RECOMMENDS]->(a)").end().getCommand());
        //like second best rated book by contact but less recommendations
        commands.push(db.cypher().match("(a:BookPage {pageId: '2'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 507, rating: 4, recommendationId: '6'})-[:RECOMMENDS]->(a)").end().getCommand());
        //forth best rated book by contact
        commands.push(db.cypher().match("(a:BookPage {pageId: '4'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 507, rating: 3, recommendationId: '7'})-[:RECOMMENDS]->(a)").end().getCommand());
        //Book only rated by no contacts
        commands.push(db.cypher().match("(a:BookPage {pageId: '3'}), (b:User {userId: '4'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 508, rating: 5, recommendationId: '8'})-[:RECOMMENDS]->(a)").end().getCommand());


        return db.cypher().create("(:VideoPage {title: 'page2Title', description: 'page2', modified: 5080, pageId: '1'})")
            .end().send(commands).then(function () {
                return requestHandler.login(users.validUser).then(function (agent) {
                    requestAgent = agent;
                    return requestHandler.getWithData('/api/page/popularPages', {
                        skip: '0',
                        maxItems: 3,
                        onlyContacts: true,
                        category: 'BookPage'
                    }, requestAgent);
                }).then(function (res) {
                    res.status.should.equal(200);
                    res.body.pages.length.should.equals(3);
                    res.body.pages[0].title.should.equals('page1Title');
                    res.body.pages[0].pageId.should.equals('0');
                    res.body.pages[0].label.should.equals('BookPage');
                    res.body.pages[0].language.should.equals('de');
                    res.body.pages[0].url.should.equals('pages/BookPage/0/pagePreview.jpg');
                    res.body.pages[0].isAdmin.should.be.false;
                    res.body.pages[0].recommendation.summary.numberOfRatings.should.equals(2);
                    res.body.pages[0].recommendation.summary.rating.should.equals(4.5);

                    res.body.pages[1].title.should.equals('page2Title');
                    res.body.pages[1].pageId.should.equals('1');
                    res.body.pages[1].label.should.equals('BookPage')
                    res.body.pages[1].language.should.equals('de');
                    res.body.pages[1].url.should.equals('pages/BookPage/1/pagePreview.jpg');
                    res.body.pages[1].isAdmin.should.be.false;
                    res.body.pages[1].recommendation.summary.numberOfRatings.should.equals(2);
                    res.body.pages[1].recommendation.summary.rating.should.equals(4);

                    res.body.pages[2].title.should.equals('page3Title');
                    res.body.pages[2].pageId.should.equals('2');
                    res.body.pages[2].label.should.equals('BookPage');
                    res.body.pages[2].language.should.equals('de');
                    res.body.pages[2].url.should.equals('pages/BookPage/2/pagePreview.jpg');
                    res.body.pages[2].isAdmin.should.be.false;
                    res.body.pages[2].recommendation.summary.numberOfRatings.should.equals(1);
                    res.body.pages[2].recommendation.summary.rating.should.equals(4);

                    res.body.totalNumberOfPages.should.equals(4);
                });
            });
    });

    // Sorted by when the recommendation was added
    it('Getting most popular books overall- Return 200', function () {

        var commands = [];

        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '2'})")
            .create("(a)-[:IS_CONTACT]->(b)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '3'})")
            .create("(a)-[:IS_CONTACT]->(b)")
            .end().getCommand());

        commands.push(db.cypher().create("(:BookPage {title: 'page1Title', language: 'de', description: 'page1', modified: 5072, pageId: '0'})").end().getCommand());
        commands.push(db.cypher().create("(:BookPage {title: 'page2Title', language: 'de', description: 'page2', modified: 5071, pageId: '1'})").end().getCommand());
        commands.push(db.cypher().create("(:BookPage {title: 'page3Title', language: 'de', description: 'page3', modified: 5073, pageId: '2'})").end().getCommand());
        commands.push(db.cypher().create("(:BookPage {title: 'page4Title', language: 'de', description: 'page4', modified: 5074, pageId: '3'})").end().getCommand());
        commands.push(db.cypher().create("(:BookPage {title: 'page5Title', language: 'de', description: 'page5', modified: 5075, pageId: '4'})").end().getCommand());

        //Best rated book
        commands.push(db.cypher().match("(a:BookPage {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 507, rating: 2, recommendationId: '0'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:BookPage {pageId: '0'}), (b:User {userId: '3'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 508, rating: 3, recommendationId: '1'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:BookPage {pageId: '0'}), (b:User {userId: '4'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 508, rating: 5, recommendationId: '2'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:BookPage {pageId: '0'}), (b:User {userId: '5'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 508, rating: 6, recommendationId: '3'})-[:RECOMMENDS]->(a)").end().getCommand());
        //Second best rated book
        commands.push(db.cypher().match("(a:BookPage {pageId: '1'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 507, rating: 3, recommendationId: '4'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:BookPage {pageId: '1'}), (b:User {userId: '3'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 508, rating: 3, recommendationId: '5'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:BookPage {pageId: '1'}), (b:User {userId: '4'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 508, rating: 3, recommendationId: '6'})-[:RECOMMENDS]->(a)").end().getCommand());
        //like second best rated book but less recommendations
        commands.push(db.cypher().match("(a:BookPage {pageId: '4'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 507, rating: 3, recommendationId: '7'})-[:RECOMMENDS]->(a)").end().getCommand());
        //forth best rated book
        commands.push(db.cypher().match("(a:BookPage {pageId: '3'}), (b:User {userId: '4'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 508, rating: 1, recommendationId: '8'})-[:RECOMMENDS]->(a)").end().getCommand());


        return db.cypher().create("(:VideoPage {title: 'page2Title', description: 'page2', modified: 5080, pageId: '1'})")
            .end().send(commands).then(function () {
                return requestHandler.login(users.validUser).then(function (agent) {
                    requestAgent = agent;
                    return requestHandler.getWithData('/api/page/popularPages', {
                        skip: '0',
                        maxItems: 3,
                        onlyContacts: false,
                        category: 'BookPage'
                    }, requestAgent);
                }).then(function (res) {
                    res.status.should.equal(200);
                    res.body.pages.length.should.equals(3);
                    res.body.pages[0].title.should.equals('page1Title');
                    res.body.pages[0].pageId.should.equals('0');
                    res.body.pages[0].label.should.equals('BookPage');
                    res.body.pages[0].language.should.equals('de');
                    res.body.pages[0].url.should.equals('pages/BookPage/0/pagePreview.jpg');
                    res.body.pages[0].isAdmin.should.be.false;
                    res.body.pages[0].recommendation.summary.numberOfRatings.should.equals(4);
                    res.body.pages[0].recommendation.summary.rating.should.equals(4);

                    res.body.pages[1].title.should.equals('page2Title');
                    res.body.pages[1].pageId.should.equals('1');
                    res.body.pages[1].label.should.equals('BookPage');
                    res.body.pages[1].language.should.equals('de');
                    res.body.pages[1].url.should.equals('pages/BookPage/1/pagePreview.jpg');
                    res.body.pages[1].isAdmin.should.be.false;
                    res.body.pages[1].recommendation.summary.numberOfRatings.should.equals(3);
                    res.body.pages[1].recommendation.summary.rating.should.equals(3);

                    res.body.pages[2].title.should.equals('page5Title');
                    res.body.pages[2].pageId.should.equals('4');
                    res.body.pages[2].label.should.equals('BookPage');
                    res.body.pages[2].language.should.equals('de');
                    res.body.pages[2].url.should.equals('pages/BookPage/4/pagePreview.jpg');
                    res.body.pages[2].isAdmin.should.be.false;
                    res.body.pages[2].recommendation.summary.numberOfRatings.should.equals(1);
                    res.body.pages[2].recommendation.summary.rating.should.equals(3);

                    res.body.totalNumberOfPages.should.equals(4);
                });
            });
    });

    // Sorted by when the recommendation was added
    it('Getting only most popular youtube videos recommended by users contact - Return 200', function () {

        var commands = [];

        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '2'})")
            .create("(a)-[:IS_CONTACT]->(b)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '3'})")
            .create("(a)-[:IS_CONTACT]->(b)")
            .end().getCommand());

        commands.push(db.cypher().create("(:VideoPage {title: 'page1Title', subCategory: 'Youtube', link: 'www.link.com', language: 'de', description: 'page1', modified: 5072, pageId: '0'})").end().getCommand());
        commands.push(db.cypher().create("(:VideoPage {title: 'page2Title', subCategory: 'Youtube', link: 'www.link2.com', language: 'de', description: 'page2', modified: 5071, pageId: '1'})").end().getCommand());
        commands.push(db.cypher().create("(:VideoPage {title: 'page3Title', subCategory: 'Youtube', link: 'www.link3.com', language: 'de', description: 'page3', modified: 5073, pageId: '2'})").end().getCommand());
        commands.push(db.cypher().create("(:VideoPage {title: 'page4Title', language: 'de', description: 'page4', modified: 5074, pageId: '3'})").end().getCommand());
        commands.push(db.cypher().create("(:VideoPage {title: 'page5Title', language: 'de', description: 'page5', modified: 5075, pageId: '4'})").end().getCommand());

        //Best rated book by contact
        commands.push(db.cypher().match("(a:VideoPage {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 507, rating: 5, recommendationId: '0'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:VideoPage {pageId: '0'}), (b:User {userId: '3'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 508, rating: 4, recommendationId: '1'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:VideoPage {pageId: '0'}), (b:User {userId: '4'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 508, rating: 1, recommendationId: '2'})-[:RECOMMENDS]->(a)").end().getCommand());
        //Second best rated book by contact
        commands.push(db.cypher().match("(a:VideoPage {pageId: '1'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 507, rating: 4, recommendationId: '3'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:VideoPage {pageId: '1'}), (b:User {userId: '3'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 508, rating: 4, recommendationId: '4'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:VideoPage {pageId: '1'}), (b:User {userId: '4'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 508, rating: 5, recommendationId: '5'})-[:RECOMMENDS]->(a)").end().getCommand());
        //like second best rated book by contact but less recommendations
        commands.push(db.cypher().match("(a:VideoPage {pageId: '2'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 507, rating: 4, recommendationId: '6'})-[:RECOMMENDS]->(a)").end().getCommand());
        //forth best rated book by contact
        commands.push(db.cypher().match("(a:VideoPage {pageId: '4'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 507, rating: 3, recommendationId: '7'})-[:RECOMMENDS]->(a)").end().getCommand());
        //Book only rated by no contacts
        commands.push(db.cypher().match("(a:VideoPage {pageId: '3'}), (b:User {userId: '4'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 508, rating: 5, recommendationId: '8'})-[:RECOMMENDS]->(a)").end().getCommand());


        return db.cypher().create("(:VideoPage {title: 'page2Title', description: 'page2', modified: 5080, pageId: '5'})")
            .end().send(commands).then(function () {
                return requestHandler.login(users.validUser).then(function (agent) {
                    requestAgent = agent;
                    return requestHandler.getWithData('/api/page/popularPages', {
                        skip: '0',
                        maxItems: 5,
                        onlyContacts: true,
                        category: 'VideoPage',
                        subCategory: 'Youtube'
                    }, requestAgent);
                }).then(function (res) {
                    res.status.should.equal(200);
                    res.body.pages.length.should.equals(3);
                    res.body.pages[0].title.should.equals('page1Title');
                    res.body.pages[0].pageId.should.equals('0');
                    res.body.pages[0].label.should.equals('VideoPage');
                    res.body.pages[0].link.should.equals('www.link.com');
                    res.body.pages[0].subCategory.should.equals('Youtube');
                    res.body.pages[0].language.should.equals('de');
                    should.not.exist(res.body.pages[0].url);
                    res.body.pages[0].isAdmin.should.be.false;
                    res.body.pages[0].recommendation.summary.numberOfRatings.should.equals(2);
                    res.body.pages[0].recommendation.summary.rating.should.equals(4.5);

                    res.body.pages[1].title.should.equals('page2Title');
                    res.body.pages[1].pageId.should.equals('1');
                    res.body.pages[1].label.should.equals('VideoPage');
                    res.body.pages[1].link.should.equals('www.link2.com');
                    res.body.pages[1].subCategory.should.equals('Youtube');
                    res.body.pages[1].language.should.equals('de');
                    should.not.exist(res.body.pages[1].url);
                    res.body.pages[1].isAdmin.should.be.false;
                    res.body.pages[1].recommendation.summary.numberOfRatings.should.equals(2);
                    res.body.pages[1].recommendation.summary.rating.should.equals(4);

                    res.body.pages[2].title.should.equals('page3Title');
                    res.body.pages[2].pageId.should.equals('2');
                    res.body.pages[2].label.should.equals('VideoPage');
                    res.body.pages[2].link.should.equals('www.link3.com');
                    res.body.pages[2].subCategory.should.equals('Youtube');
                    res.body.pages[2].language.should.equals('de');
                    should.not.exist(res.body.pages[2].url);
                    res.body.pages[2].isAdmin.should.be.false;
                    res.body.pages[2].recommendation.summary.numberOfRatings.should.equals(1);
                    res.body.pages[2].recommendation.summary.rating.should.equals(4);

                    res.body.totalNumberOfPages.should.equals(3);
                });
            });
    });
});
