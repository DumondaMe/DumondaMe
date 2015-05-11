'use strict';

var app = require('../../../../../server');
var users = require('../util/user');
var db = require('../util/db');
var requestHandler = require('../util/request');
var should = require('chai').should();
var moment = require('moment');

describe('Integration Tests for getting the page overview', function () {

    var requestAgent;

    beforeEach(function () {

        var commands = [];
        return db.clearDatabase().then(function () {
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', surname: 'Meier', forename:'user', userId: '1'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier2', userId: '2'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier3', userId: '3'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier4', userId: '4'})").end().getCommand());

            return db.cypher().create("(:User {name: 'user Meier5', userId: '5'})")
                .end().send(commands)
                .catch(function (err) {
                    var error = err;
                });
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    // Sorted by when the recommendation was added
    it('Getting all pages contacts has recommended - Return 200', function () {

        var commands = [];

        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '2'})")
            .create("(a)-[:IS_CONTACT]->(b)")
            .end().getCommand());

        commands.push(db.cypher().create("(:BookPage {title: 'page1Title', description: 'page1', created: 5070, pageId: '0'})").end().getCommand());
        commands.push(db.cypher().create("(:VideoPage {title: 'page2Title', description: 'page2', created: 5080, pageId: '1'})").end().getCommand());
        commands.push(db.cypher().create("(:SchoolPage {title: 'page3Title', description: 'page3', created: 506, pageId: '2'})").end().getCommand());
        commands.push(db.cypher().create("(:CoursePage {title: 'page4Title', description: 'page4', created: 5050, pageId: '3'})").end().getCommand());
        commands.push(db.cypher().create("(:CoursePage {title: 'page5Title', description: 'page5', created: 5040, pageId: '4'})").end().getCommand());
        commands.push(db.cypher().create("(:PracticePage {title: 'page6Title', description: 'page6', created: 503, pageId: '5'})").end().getCommand());
        commands.push(db.cypher().create("(:EventPage {title: 'page7Title', description: 'page7', created: 5020, pageId: '6'})").end().getCommand());
        commands.push(db.cypher().create("(:BlogPage {title: 'page8Title', description: 'page8', created: 5010, pageId: '7'})").end().getCommand());
        commands.push(db.cypher().create("(:StorePage {title: 'page9Title', description: 'page9', created: 5000, pageId: '8'})").end().getCommand());

        commands.push(db.cypher().match("(a:BookPage {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 507, recommendationId: '1'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:VideoPage {pageId: '1'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 508, recommendationId: '2'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:SchoolPage {pageId: '2'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 506, recommendationId: '3'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:CoursePage {pageId: '3'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 505, recommendationId: '4'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:CoursePage {pageId: '4'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 504, recommendationId: '5'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:PracticePage {pageId: '5'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 503, recommendationId: '6'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:EventPage {pageId: '6'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 502, recommendationId: '7'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:BlogPage {pageId: '7'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 501, recommendationId: '8'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:StorePage {pageId: '8'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 500, recommendationId: '9'})-[:RECOMMENDS]->(a)").end().getCommand());

        //Not returned Pages because no contact recommendation or not created by a contact
        commands.push(db.cypher().create("(:BookPage {title: 'page10Title', description: 'page10', created: 5070, pageId: '10'})").end().getCommand());
        commands.push(db.cypher().create("(:VideoPage {title: 'page20Title', description: 'page20', created: 5080, pageId: '11'})").end().getCommand());
        commands.push(db.cypher().create("(:SchoolPage {title: 'page30Title', description: 'page30', created: 5060, pageId: '12'})").end().getCommand());
        commands.push(db.cypher().create("(:CoursePage {title: 'page40Title', description: 'page40', created: 5050, pageId: '13'})").end().getCommand());
        commands.push(db.cypher().create("(:CoursePage {title: 'page50Title', description: 'page50', created: 5040, pageId: '14'})").end().getCommand());
        commands.push(db.cypher().create("(:PracticePage {title: 'page60Title', description: 'page60', created: 5030, pageId: '15'})").end().getCommand());
        commands.push(db.cypher().create("(:EventPage {title: 'page70Title', description: 'page70', created: 5020, pageId: '16'})").end().getCommand());
        commands.push(db.cypher().create("(:BlogPage {title: 'page80Title', description: 'page80', created: 5010, pageId: '17'})").end().getCommand());

        return db.cypher().create("(:StorePage {title: 'page90Title', description: 'page90', created: 5011, pageId: '18'})")
            .end().send(commands).then(function () {
                return requestHandler.login(users.validUser).then(function (agent) {
                    requestAgent = agent;
                    return requestHandler.getWithData('/api/page', {
                        skip: '0',
                        maxItems: 50
                    }, requestAgent);
                }).then(function (res) {
                    res.status.should.equal(200);
                    res.body.pages.length.should.equals(9);
                    res.body.pages[0].description.should.equals('page2');
                    res.body.pages[0].pageId.should.equals('1');
                    res.body.pages[0].label.should.equals('VideoPage');

                    res.body.pages[1].description.should.equals('page1');
                    res.body.pages[1].pageId.should.equals('0');
                    res.body.pages[1].label.should.equals('BookPage');

                    res.body.pages[2].description.should.equals('page3');
                    res.body.pages[2].pageId.should.equals('2');
                    res.body.pages[2].label.should.equals('SchoolPage');

                    res.body.pages[3].description.should.equals('page4');
                    res.body.pages[3].pageId.should.equals('3');
                    res.body.pages[3].label.should.equals('CoursePage');

                    res.body.pages[4].description.should.equals('page5');
                    res.body.pages[4].pageId.should.equals('4');
                    res.body.pages[4].label.should.equals('CoursePage');

                    res.body.pages[5].description.should.equals('page6');
                    res.body.pages[5].pageId.should.equals('5');
                    res.body.pages[5].label.should.equals('PracticePage');

                    res.body.pages[6].description.should.equals('page7');
                    res.body.pages[6].pageId.should.equals('6');
                    res.body.pages[6].label.should.equals('EventPage');

                    res.body.pages[7].description.should.equals('page8');
                    res.body.pages[7].pageId.should.equals('7');
                    res.body.pages[7].label.should.equals('BlogPage');

                    res.body.pages[8].description.should.equals('page9');
                    res.body.pages[8].pageId.should.equals('8');
                    res.body.pages[8].label.should.equals('StorePage');
                });
            });
    });

    // Sorted by when the recommendation was added
    it('Getting only book pages contacts has recommended - Return 200', function () {

        var commands = [];

        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '2'})")
            .create("(a)-[:IS_CONTACT]->(b)")
            .end().getCommand());

        commands.push(db.cypher().create("(:BookPage {title: 'page1Title', description: 'page1', created: 5070, pageId: '0'})").end().getCommand());
        commands.push(db.cypher().create("(:VideoPage {title: 'page2Title', description: 'page2', created: 5080, pageId: '1'})").end().getCommand());
        commands.push(db.cypher().create("(:SchoolPage {title: 'page3Title', description: 'page3', created: 506, pageId: '2'})").end().getCommand());
        commands.push(db.cypher().create("(:CoursePage {title: 'page4Title', description: 'page4', created: 5050, pageId: '3'})").end().getCommand());
        commands.push(db.cypher().create("(:CoursePage {title: 'page5Title', description: 'page5', created: 5040, pageId: '4'})").end().getCommand());
        commands.push(db.cypher().create("(:PracticePage {title: 'page6Title', description: 'page6', created: 503, pageId: '5'})").end().getCommand());
        commands.push(db.cypher().create("(:EventPage {title: 'page7Title', description: 'page7', created: 5020, pageId: '6'})").end().getCommand());
        commands.push(db.cypher().create("(:BlogPage {title: 'page8Title', description: 'page8', created: 5010, pageId: '7'})").end().getCommand());
        commands.push(db.cypher().create("(:StorePage {title: 'page9Title', description: 'page9', created: 5000, pageId: '8'})").end().getCommand());

        commands.push(db.cypher().match("(a:BookPage {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 507, recommendationId: '1'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:VideoPage {pageId: '1'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 508, recommendationId: '2'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:SchoolPage {pageId: '2'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 506, recommendationId: '3'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:CoursePage {pageId: '3'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 505, recommendationId: '4'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:CoursePage {pageId: '4'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 504, recommendationId: '5'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:PracticePage {pageId: '5'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 503, recommendationId: '6'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:EventPage {pageId: '6'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 502, recommendationId: '7'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:BlogPage {pageId: '7'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 501, recommendationId: '8'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:StorePage {pageId: '8'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 500, recommendationId: '9'})-[:RECOMMENDS]->(a)").end().getCommand());

        return db.cypher().create("(:StorePage {title: 'page90Title', description: 'page90', created: 5011, pageId: '18'})")
            .end().send(commands).then(function () {
                return requestHandler.login(users.validUser).then(function (agent) {
                    requestAgent = agent;
                    return requestHandler.getWithData('/api/page', {
                        skip: '0',
                        maxItems: 50,
                        filters: 'BookPage'
                    }, requestAgent);
                }).then(function (res) {
                    res.status.should.equal(200);
                    res.body.pages.length.should.equals(1);

                    res.body.pages[0].description.should.equals('page1');
                    res.body.pages[0].pageId.should.equals('0');
                    res.body.pages[0].label.should.equals('BookPage');
                });
            });
    });

    it('Getting a book page in the overview because contact has made a recommendation- Return 200', function () {

        var commands = [];

        commands.push(db.cypher().create("(:BookPage {title: 'page1Title', language: 'de', description: 'page1', created: 501, pageId: '0'})").end().getCommand());

        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '2'})")
            .create("(a)-[:IS_CONTACT]->(b)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:BookPage {pageId: '0'}), (b:User {userId: '1'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 500, rating: 5, comment: 'irgendwas', recommendationId: '0'})-[:RECOMMENDS]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:BookPage {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 500, rating: 2, comment: 'irgendwas2', recommendationId: '1'})-[:RECOMMENDS]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:BookPage {pageId: '0'}), (b:User {userId: '3'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 500, rating: 5, recommendationId: '1'})-[:RECOMMENDS]->(a)")
            .end().getCommand());

        return db.cypher().match("(a:User {userId: '1'}), (b:BookPage {pageId: '0'})")
            .create("(a)-[:IS_ADMIN]->(b)")
            .end().send(commands).then(function () {
                return requestHandler.login(users.validUser).then(function (agent) {
                    requestAgent = agent;
                    return requestHandler.getWithData('/api/page', {
                        skip: '0',
                        maxItems: 50
                    }, requestAgent);
                }).then(function (res) {
                    res.status.should.equal(200);

                    res.body.pages.length.should.equals(1);
                    res.body.pages[0].description.should.equals('page1');
                    res.body.pages[0].title.should.equals('page1Title');
                    res.body.pages[0].pageId.should.equals('0');
                    res.body.pages[0].label.should.equals('BookPage');
                    res.body.pages[0].language.should.equals('de');
                    res.body.pages[0].url.should.equals('pages/BookPage/0/pagePreview.jpg');
                    res.body.pages[0].lastModified.should.equals(501);

                    res.body.pages[0].recommendation.summary.all.numberOfRatings.should.equals(3);
                    res.body.pages[0].recommendation.summary.all.rating.should.equals(4);
                    res.body.pages[0].recommendation.summary.contact.numberOfRatings.should.equals(1);
                    res.body.pages[0].recommendation.summary.contact.rating.should.equals(2);
                    res.body.pages[0].recommendation.user.recommendationId.should.equals('0');
                    res.body.pages[0].recommendation.user.comment.should.equals('irgendwas');
                    res.body.pages[0].recommendation.user.rating.should.equals(5);
                    res.body.pages[0].recommendation.contact.comment.should.equals('irgendwas2');
                    res.body.pages[0].recommendation.contact.rating.should.equals(2);

                });
            });
    });
});
