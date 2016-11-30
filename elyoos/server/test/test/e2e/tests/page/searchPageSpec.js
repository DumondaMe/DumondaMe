'use strict';

var users = require('../util/user');
var db = require('../util/db');
var requestHandler = require('../util/request');

describe('Integration Tests for searching Pages', function () {

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

    it('Searching for a book title and ignore other categories- Return 200', function () {

        var commands = [];

        commands.push(db.cypher().create("(:Page {title: 'page?1Title', label: 'Book', description: 'page1', modified: 501, pageId: '0'})").end().getCommand());
        commands.push(db.cypher().create("(:Page {title: 'page?2Title', label: 'Book', description: 'page2', modified: 502, pageId: '1'})").end().getCommand());
        commands.push(db.cypher().create("(:Page {title: 'page?3Title', label: 'Book', description: 'page1', modified: 503, pageId: '2'})").end().getCommand());
        commands.push(db.cypher().create("(:Page {title: 'page?1Title', label: 'Youtube', description: 'page1', modified: 504, pageId: '3'})").end().getCommand());

        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '2'})")
            .create("(a)-[:IS_CONTACT]->(b)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '3'})")
            .create("(a)-[:IS_CONTACT]->(b)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '1'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 500, comment: 'irgendwas', recommendationId: '0'})-[:RECOMMENDS]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 506, recommendationId: '1'})-[:RECOMMENDS]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '1'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 502, recommendationId: '2'})-[:RECOMMENDS]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '3'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 503, recommendationId: '3'})-[:RECOMMENDS]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '4'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 504, recommendationId: '4'})-[:RECOMMENDS]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '3'}), (b:User {userId: '3'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 505, recommendationId: '5'})-[:RECOMMENDS]->(a)")
            .end().getCommand());

        return db.cypher().match("(a:User {userId: '1'}), (b:BookPage {pageId: '0'})")
            .create("(a)-[:IS_ADMIN]->(b)")
            .end().send(commands).then(function () {
                return requestHandler.login(users.validUser).then(function (agent) {
                    requestAgent = agent;
                    return requestHandler.getWithData('/api/page/search', {
                        search: 'page?1',
                        filterType: 'Book',
                        isSuggestion: false,
                        skip: 0,
                        maxItems: 10
                    }, requestAgent);
                }).then(function (res) {
                    res.status.should.equal(200);

                    res.body.pages.length.should.equals(1);
                    res.body.pages[0].title.should.equals('page?1Title');
                    res.body.pages[0].description.should.equals('page1');
                    res.body.pages[0].pageId.should.equals('0');
                    res.body.pages[0].label.should.equals('Book');
                    res.body.pages[0].url.should.equals('pages/0/pagePreview.jpg');

                    res.body.pages[0].recommendation.summary.numberOfRecommendations.should.equals(4);

                    res.body.totalNumberOfPages.should.equals(1);

                });
            });
    });

    it('Searching for a title without filters- Return 200', function () {

        var commands = [];

        commands.push(db.cypher().create("(:Page {title: 'page1Title', label: 'Book', description: 'page1', modified: 503, pageId: '0'})").end().getCommand());
        commands.push(db.cypher().create("(:Page {title: 'page2Title', label: 'Book', description: 'page2', modified: 501, pageId: '1'})").end().getCommand());
        commands.push(db.cypher().create("(:Page {title: 'page1Title', label: 'Book', description: 'page3', modified: 502, pageId: '2'})").end().getCommand());
        commands.push(db.cypher().create("(:Page {title: 'page1Title', label: 'Youtube', language: 'de', link: 'www.youtube.com', description: 'page4', modified: 501, pageId: '3'})").end().getCommand());

        return db.cypher().match("(a:User {userId: '1'}), (b:Page {pageId: '3'})")
            .create("(a)-[:IS_ADMIN]->(b)")
            .end().send(commands).then(function () {
                return requestHandler.login(users.validUser).then(function (agent) {
                    requestAgent = agent;
                    return requestHandler.getWithData('/api/page/search', {
                        search: 'page1',
                        isSuggestion: false,
                        skip: 0,
                        maxItems: 10
                    }, requestAgent);
                }).then(function (res) {
                    res.status.should.equal(200);

                    res.body.pages.length.should.equals(3);
                    res.body.pages[0].title.should.equals('page1Title');
                    res.body.pages[0].description.should.equals('page1');
                    res.body.pages[0].pageId.should.equals('0');
                    res.body.pages[0].label.should.equals('Book');
                    res.body.pages[0].url.should.equals('pages/0/pagePreview.jpg');

                    res.body.pages[1].title.should.equals('page1Title');
                    res.body.pages[1].description.should.equals('page3');
                    res.body.pages[1].pageId.should.equals('2');
                    res.body.pages[1].label.should.equals('Book');
                    res.body.pages[1].url.should.equals('pages/2/pagePreview.jpg');

                    res.body.pages[2].title.should.equals('page1Title');
                    res.body.pages[2].description.should.equals('page4');
                    res.body.pages[2].pageId.should.equals('3');
                    res.body.pages[2].label.should.equals('Youtube');
                    res.body.pages[2].link.should.equals('www.youtube.com');

                    res.body.totalNumberOfPages.should.equals(3);
                });
            });
    });

    it('Searching for a link in youtube Pages without filters- Return 200', function () {

        var commands = [];

        commands.push(db.cypher().create("(:Page {title: 'page1Title', label: 'Book', description: 'page1', modified: 503, pageId: '0'})").end().getCommand());
        commands.push(db.cypher().create("(:Page {title: 'page2Title', label: 'Book', description: 'page2', modified: 501, pageId: '1'})").end().getCommand());
        commands.push(db.cypher().create("(:Page {title: 'page1Title', label: 'Book', description: 'page3', modified: 502, pageId: '2'})").end().getCommand());
        commands.push(db.cypher().create("(:Page {title: 'page5Title', label: 'Youtube', language: 'de', link: 'https://www.youtube.com/embed/c0_TPaLP2Ko', description: 'page4', modified: 501, pageId: '3'})").end().getCommand());

        return db.cypher().match("(a:User {userId: '1'}), (b:Page {pageId: '0'})")
            .create("(a)-[:IS_ADMIN]->(b)")
            .end().send(commands).then(function () {
                return requestHandler.login(users.validUser).then(function (agent) {
                    requestAgent = agent;
                    return requestHandler.getWithData('/api/page/search', {
                        search: 'https://www.youtube.com/embed/c0_TPaLP2Ko',
                        isSuggestion: false,
                        skip: 0,
                        maxItems: 10
                    }, requestAgent);
                }).then(function (res) {
                    res.status.should.equal(200);

                    res.body.pages.length.should.equals(1);
                    res.body.pages[0].title.should.equals('page5Title');
                    res.body.pages[0].description.should.equals('page4');
                    res.body.pages[0].pageId.should.equals('3');
                    res.body.pages[0].label.should.equals('Youtube');
                    res.body.pages[0].link.should.equals('https://www.youtube.com/embed/c0_TPaLP2Ko');

                    res.body.totalNumberOfPages.should.equals(1);
                });
            });
    });

    it('Searching for a link in youtube Pages with filters- Return 200', function () {

        var commands = [];

        commands.push(db.cypher().create("(:Page {title: 'page1Title', label: 'Book', description: 'page1', modified: 503, pageId: '0'})").end().getCommand());
        commands.push(db.cypher().create("(:Page {title: 'page2Title', label: 'Book', description: 'page2', modified: 501, pageId: '1'})").end().getCommand());
        commands.push(db.cypher().create("(:Page {title: 'page1Title', label: 'Book', description: 'page3', modified: 502, pageId: '2'})").end().getCommand());
        commands.push(db.cypher().create("(:Page {title: 'page5Title', label: 'Youtube', language: 'de', link: 'https://www.youtube.com/embed/c0_TPaLP2Ko', description: 'page4', modified: 501, pageId: '3'})").end().getCommand());

        return db.cypher().match("(a:User {userId: '1'}), (b:Page {pageId: '3'})")
            .create("(a)-[:IS_ADMIN]->(b)")
            .end().send(commands).then(function () {
                return requestHandler.login(users.validUser).then(function (agent) {
                    requestAgent = agent;
                    return requestHandler.getWithData('/api/page/search', {
                        search: 'https://www.youtube.com/embed/c0_TPaLP2K',
                        isSuggestion: false,
                        skip: 0,
                        maxItems: 10,
                        filterType: 'Youtube'
                    }, requestAgent);
                }).then(function (res) {
                    res.status.should.equal(200);

                    res.body.pages.length.should.equals(1);
                    res.body.pages[0].title.should.equals('page5Title');
                    res.body.pages[0].description.should.equals('page4');
                    res.body.pages[0].pageId.should.equals('3');
                    res.body.pages[0].label.should.equals('Youtube');
                    res.body.pages[0].link.should.equals('https://www.youtube.com/embed/c0_TPaLP2Ko');

                    res.body.totalNumberOfPages.should.equals(1);
                });
            });
    });

    it('Searching for a Link Page without filters. Search link - Return 200', function () {

        var commands = [];

        commands.push(db.cypher().create("(:Page {title: 'page1Title', label: 'Book', description: 'page1', modified: 503, pageId: '0'})").end().getCommand());
        commands.push(db.cypher().create("(:Page {title: 'page2Title', label: 'Book', description: 'page2', modified: 501, pageId: '1'})").end().getCommand());
        commands.push(db.cypher().create("(:Page {title: 'page3Title', label: 'Link', description: 'page3', heightPreviewImage: 200, modified: 502, pageId: '2', link: 'www.test.com/test', hostname:'www.test.com'})").end().getCommand());
        commands.push(db.cypher().create("(:Page {title: 'page5Title', label: 'Youtube', language: 'de', link: 'https://www.youtube.com/embed/c0_TPaLP2Ko', description: 'page4', modified: 501, pageId: '3'})").end().getCommand());

        return db.cypher().match("(a:User {userId: '1'}), (b:Page {pageId: '0'})")
            .create("(a)-[:IS_ADMIN]->(b)")
            .end().send(commands).then(function () {
                return requestHandler.login(users.validUser).then(function (agent) {
                    requestAgent = agent;
                    return requestHandler.getWithData('/api/page/search', {
                        search: 'www.test.com/test',
                        isSuggestion: false,
                        skip: 0,
                        maxItems: 10
                    }, requestAgent);
                }).then(function (res) {
                    res.status.should.equal(200);

                    res.body.pages.length.should.equals(1);
                    res.body.pages[0].title.should.equals('page3Title');
                    res.body.pages[0].description.should.equals('page3');
                    res.body.pages[0].pageId.should.equals('2');
                    res.body.pages[0].label.should.equals('Link');
                    res.body.pages[0].link.should.equals('www.test.com/test');
                    res.body.pages[0].hostname.should.equals('www.test.com');
                    res.body.pages[0].url.should.equals('pages/2/preview.jpg');

                    res.body.totalNumberOfPages.should.equals(1);
                });
            });
    });

    it('Searching for a Link Page without filters. Search title - Return 200', function () {

        var commands = [];

        commands.push(db.cypher().create("(:Page {title: 'page1Title', label: 'Book', description: 'page1', modified: 503, pageId: '0'})").end().getCommand());
        commands.push(db.cypher().create("(:Page {title: 'page2Title', label: 'Book', description: 'page2', modified: 501, pageId: '1'})").end().getCommand());
        commands.push(db.cypher().create("(:Page {title: 'page3Title', label: 'Link', description: 'page3', modified: 502, heightPreviewImage: 200, pageId: '2', link: 'www.test.com/test', hostname:'www.test.com'})").end().getCommand());
        commands.push(db.cypher().create("(:Page {title: 'page5Title', label: 'Youtube', language: 'de', link: 'https://www.youtube.com/embed/c0_TPaLP2Ko', description: 'page4', modified: 501, pageId: '3'})").end().getCommand());

        return db.cypher().match("(a:User {userId: '1'}), (b:Page {pageId: '0'})")
            .create("(a)-[:IS_ADMIN]->(b)")
            .end().send(commands).then(function () {
                return requestHandler.login(users.validUser).then(function (agent) {
                    requestAgent = agent;
                    return requestHandler.getWithData('/api/page/search', {
                        search: 'page3Title',
                        isSuggestion: false,
                        skip: 0,
                        maxItems: 10
                    }, requestAgent);
                }).then(function (res) {
                    res.status.should.equal(200);

                    res.body.pages.length.should.equals(1);
                    res.body.pages[0].title.should.equals('page3Title');
                    res.body.pages[0].description.should.equals('page3');
                    res.body.pages[0].pageId.should.equals('2');
                    res.body.pages[0].label.should.equals('Link');
                    res.body.pages[0].link.should.equals('www.test.com/test');
                    res.body.pages[0].hostname.should.equals('www.test.com');
                    res.body.pages[0].url.should.equals('pages/2/preview.jpg');

                    res.body.totalNumberOfPages.should.equals(1);
                });
            });
    });

    it('Searching for a Link Page with filter. Search link - Return 200', function () {

        var commands = [];

        commands.push(db.cypher().create("(:Page {title: 'page1Title', label: 'Book', description: 'page1', modified: 503, pageId: '0'})").end().getCommand());
        commands.push(db.cypher().create("(:Page {title: 'page2Title', label: 'Book', description: 'page2', modified: 501, pageId: '1'})").end().getCommand());
        commands.push(db.cypher().create("(:Page {title: 'page3Title', label: 'Link', description: 'page3', heightPreviewImage: 200, modified: 502, pageId: '2', link: 'www.test.com/test', hostname:'www.test.com'})").end().getCommand());
        commands.push(db.cypher().create("(:Page {title: 'page5Title', label: 'Youtube', language: 'de', link: 'https://www.youtube.com/embed/c0_TPaLP2Ko', description: 'page4', modified: 501, pageId: '3'})").end().getCommand());

        return db.cypher().match("(a:User {userId: '1'}), (b:Page {pageId: '0'})")
            .create("(a)-[:IS_ADMIN]->(b)")
            .end().send(commands).then(function () {
                return requestHandler.login(users.validUser).then(function (agent) {
                    requestAgent = agent;
                    return requestHandler.getWithData('/api/page/search', {
                        search: 'www.test.com/test',
                        isSuggestion: false,
                        skip: 0,
                        maxItems: 10,
                        filterType: 'Link'
                    }, requestAgent);
                }).then(function (res) {
                    res.status.should.equal(200);

                    res.body.pages.length.should.equals(1);
                    res.body.pages[0].title.should.equals('page3Title');
                    res.body.pages[0].description.should.equals('page3');
                    res.body.pages[0].pageId.should.equals('2');
                    res.body.pages[0].label.should.equals('Link');
                    res.body.pages[0].link.should.equals('www.test.com/test');
                    res.body.pages[0].hostname.should.equals('www.test.com');
                    res.body.pages[0].url.should.equals('pages/2/preview.jpg');

                    res.body.totalNumberOfPages.should.equals(1);
                });
            });
    });
});
