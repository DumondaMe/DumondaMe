'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for getting similar pages for a page', function () {

    beforeEach(function () {
        return dbDsl.init(12);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Similar pages recommended by the contacts of the user, all cases', function () {

        dbDsl.createContactConnection('1', '2', 'Freund', 500);
        dbDsl.createContactConnection('1', '3', 'Freund', 500);
        dbDsl.createContactConnection('1', '4', 'Freund', 500);

        dbDsl.createBookPage('1', {language: ['de'], topic: ['health', 'personalDevelopment'], created: 500, author: 'HansMuster', publishDate: 1000});
        dbDsl.createBookPage('2', {language: ['de'], topic: ['spiritual', 'personalDevelopment'], created: 501, author: 'HansMuster', publishDate: 1000});
        dbDsl.createBookPage('3', {language: ['de'], topic: ['health'], created: 502, author: 'HansMuster', publishDate: 1000});
        dbDsl.createBookPage('4', {language: ['de'], topic: ['personalDevelopment'], created: 503, author: 'HansMuster', publishDate: 1000});
        dbDsl.createLinkPage('5', {language: ['de'], topic: ['personalDevelopment'], created: 504, link: 'www.host.com/test'});
        dbDsl.createLinkPage('6', {language: ['de'], topic: ['health'], created: 505, link: 'www.host.com/test'});
        dbDsl.createGenericPage('7', {adminId: '3', language: ['de'], topic: ['health', 'personalDevelopment'], created: 501}, [{
            description: 'Zuerich',
            lat: 47.376887,
            lng: 8.541694
        }]);
        dbDsl.createYoutubePage('8', {
            adminId: '3', language: ['de'], topic: ['health', 'personalDevelopment'], created: 501, link: 'https://www.youtube.com/watch?v=hTarMdJub0M',
            linkEmbed: 'https://www.youtube.com/embed/hTarMdJub0M'
        });
        dbDsl.createLinkPage('9', {adminId: '3', language: ['de'], topic: ['health'], created: 505, link: 'www.host.com/test2'});
        dbDsl.createBookPage('10', {adminId: '3', language: ['de'], topic: ['personalDevelopment'], created: 502, author: 'HansMuster', publishDate: 1000});
        dbDsl.createLinkPage('11', {adminId: '3', language: ['de'], topic: ['health'], created: 505, link: 'www.host.com/test3'});
        dbDsl.createLinkPage('12', {adminId: '3', language: ['de'], topic: ['health'], created: 505, link: 'www.host.com/test4'});
        dbDsl.createGenericPage('13', {adminId: '3', language: ['de'], topic: ['health', 'personalDevelopment'], created: 501}, [{
            description: 'Zuerich2',
            lat: 47.3768,
            lng: 8.54169
        }]);
        dbDsl.createBookPage('14', {adminId: '3', language: ['de'], topic: ['personalDevelopment'], created: 502, author: 'HansMuster', publishDate: 1000});


        dbDsl.crateRecommendationsForPage('1', [{userId: '2', created: 500},
            {userId: '3', created: 500},
            {userId: '5', created: 500},
            {userId: '6', created: 500},
            {userId: '7', created: 500}]);

        //Used for algorithm
        dbDsl.crateRecommendationsForPage('2', [{userId: '1', created: 500}, {userId: '2', created: 500}]);
        dbDsl.crateRecommendationsForPage('3', [{userId: '1', created: 500}, {userId: '2', created: 500}]);
        dbDsl.crateRecommendationsForPage('4', [{userId: '1', created: 500}, {userId: '3', created: 500}]);
        dbDsl.crateRecommendationsForPage('5', [{userId: '1', created: 500}, {userId: '5', created: 500}]);
        dbDsl.crateRecommendationsForPage('6', [{userId: '1', created: 500}, {userId: '5', created: 500}]);
        dbDsl.crateRecommendationsForPage('7', [{userId: '1', created: 500}, {userId: '6', created: 500}]);
        //Recommended pages
        dbDsl.crateRecommendationsForPage('8', [{userId: '2', created: 500}]);
        dbDsl.crateRecommendationsForPage('9', [{userId: '3', created: 500}]);
        dbDsl.crateRecommendationsForPage('10', [{userId: '5', created: 500}]);
        dbDsl.crateRecommendationsForPage('11', [{userId: '6', created: 500}]);
        dbDsl.crateRecommendationsForPage('12', [{userId: '8', created: 500},
            {userId: '9', created: 500},
            {userId: '10', created: 500},
            {userId: '11', created: 500}]);
        dbDsl.crateRecommendationsForPage('13', [{userId: '9', created: 500},
            {userId: '10', created: 500},
            {userId: '11', created: 500}]);
        dbDsl.crateRecommendationsForPage('14', [{userId: '7', created: 500}]);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function () {
                return requestHandler.get('/api/recommendation/similarPage', {
                    pageId: '1',
                    skip: 0,
                    maxItems: 10
                });
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pages.length.should.equals(6);

                res.body.pages[0].label.should.equals("Youtube");
                res.body.pages[0].pageId.should.equals("8");
                res.body.pages[0].title.should.equals("page8Title");
                res.body.pages[0].description.should.equals("page8Description");
                res.body.pages[0].link.should.equals("https://www.youtube.com/watch?v=hTarMdJub0M");
                res.body.pages[0].linkEmbed.should.equals("https://www.youtube.com/embed/hTarMdJub0M");
                res.body.pages[0].topic.length.should.equals(2);
                res.body.pages[0].topic[0].should.equals('health');
                res.body.pages[0].topic[1].should.equals('personalDevelopment');

                res.body.pages[1].label.should.equals("Link");
                res.body.pages[1].pageId.should.equals("9");
                res.body.pages[1].title.should.equals("page9Title");
                res.body.pages[1].description.should.equals("page9Description");
                res.body.pages[1].link.should.equals("www.host.com/test2");
                res.body.pages[1].topic.length.should.equals(1);
                res.body.pages[1].topic[0].should.equals('health');

                res.body.pages[2].label.should.equals("Book");
                res.body.pages[2].pageId.should.equals("10");
                res.body.pages[2].title.should.equals("page10Title");
                res.body.pages[2].description.should.equals("page10Description");
                res.body.pages[2].url.should.equals("pages/10/pagePreview.jpg");
                res.body.pages[2].topic.length.should.equals(1);
                res.body.pages[2].topic[0].should.equals('personalDevelopment');

                res.body.pages[3].label.should.equals("Link");
                res.body.pages[3].pageId.should.equals("11");
                res.body.pages[3].title.should.equals("page11Title");
                res.body.pages[3].description.should.equals("page11Description");
                res.body.pages[3].link.should.equals("www.host.com/test3");
                res.body.pages[3].topic.length.should.equals(1);
                res.body.pages[3].topic[0].should.equals('health');

                res.body.pages[4].label.should.equals("Link");
                res.body.pages[4].pageId.should.equals("12");
                res.body.pages[4].title.should.equals("page12Title");
                res.body.pages[4].description.should.equals("page12Description");
                res.body.pages[4].link.should.equals("www.host.com/test4");
                res.body.pages[4].topic.length.should.equals(1);
                res.body.pages[4].topic[0].should.equals('health');

                res.body.pages[5].label.should.equals("Generic");
                res.body.pages[5].pageId.should.equals("13");
                res.body.pages[5].title.should.equals("generic13Title");
                res.body.pages[5].description.should.equals("page13Description");
                res.body.pages[5].url.should.equals("pages/13/preview.jpg");
                res.body.pages[5].topic.length.should.equals(2);
                res.body.pages[5].topic[0].should.equals('health');
                res.body.pages[5].topic[1].should.equals('personalDevelopment');
            });
        });
    }).timeout(10000);

    it('Do not show pages where user is admin, (algorithm similar likes)', function () {

        dbDsl.createContactConnection('1', '2', 'Freund', 500);

        dbDsl.createBookPage('1', {language: ['de'], topic: ['health', 'personalDevelopment'], created: 500, author: 'HansMuster', publishDate: 1000});
        dbDsl.createBookPage('2', {adminId: '3', language: ['de'], topic: ['spiritual', 'personalDevelopment'], created: 501, author: 'HansMuster', publishDate: 1000});
        dbDsl.createBookPage('3', {adminId: '1', language: ['de'], topic: ['health'], created: 502, author: 'HansMuster', publishDate: 1000});


        dbDsl.crateRecommendationsForPage('1', [{userId: '2', created: 500}]);

        //Used for algorithm
        dbDsl.crateRecommendationsForPage('2', [{userId: '1', created: 500}, {userId: '2', created: 500}]);
        //Recommended pages
        dbDsl.crateRecommendationsForPage('3', [{userId: '2', created: 500}]);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function () {
                return requestHandler.get('/api/recommendation/similarPage', {
                    pageId: '1',
                    skip: 0,
                    maxItems: 10
                });
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pages.length.should.equals(0);
            });
        });
    });

    it('Do not show pages where user is admin, (algorithm no similar likes, most popular)', function () {

        dbDsl.createContactConnection('1', '2', 'Freund', 500);

        dbDsl.createBookPage('1', {language: ['de'], topic: ['health', 'personalDevelopment'], created: 500, author: 'HansMuster', publishDate: 1000});
        dbDsl.createBookPage('3', {adminId: '1', language: ['de'], topic: ['health'], created: 502, author: 'HansMuster', publishDate: 1000});

        //Recommended pages
        dbDsl.crateRecommendationsForPage('3', [{userId: '2', created: 500}]);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function () {
                return requestHandler.get('/api/recommendation/similarPage', {
                    pageId: '1',
                    skip: 0,
                    maxItems: 10
                });
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pages.length.should.equals(0);
            });
        });
    });

    it('Do not show pages already recommended by the user, (algorithm similar likes)', function () {

        dbDsl.createContactConnection('1', '2', 'Freund', 500);

        dbDsl.createBookPage('1', {language: ['de'], topic: ['health', 'personalDevelopment'], created: 500, author: 'HansMuster', publishDate: 1000});
        dbDsl.createBookPage('2', {adminId: '3', language: ['de'], topic: ['spiritual', 'personalDevelopment'], created: 501, author: 'HansMuster', publishDate: 1000});
        dbDsl.createBookPage('3', {adminId: '3', language: ['de'], topic: ['health'], created: 502, author: 'HansMuster', publishDate: 1000});


        dbDsl.crateRecommendationsForPage('1', [{userId: '2', created: 500}]);

        //Used for algorithm
        dbDsl.crateRecommendationsForPage('2', [{userId: '1', created: 500}, {userId: '2', created: 500}]);
        //Recommended pages
        dbDsl.crateRecommendationsForPage('3', [{userId: '1', created: 500}]);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function () {
                return requestHandler.get('/api/recommendation/similarPage', {
                    pageId: '1',
                    skip: 0,
                    maxItems: 10
                });
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pages.length.should.equals(0);
            });
        });
    });

    it('Do not show pages already recommended by the user, (algorithm no similar likes, most popular)', function () {

        dbDsl.createContactConnection('1', '2', 'Freund', 500);

        dbDsl.createBookPage('1', {language: ['de'], topic: ['health', 'personalDevelopment'], created: 500, author: 'HansMuster', publishDate: 1000});
        dbDsl.createBookPage('3', {adminId: '3', language: ['de'], topic: ['health'], created: 502, author: 'HansMuster', publishDate: 1000});

        //Recommended pages
        dbDsl.crateRecommendationsForPage('3', [{userId: '1', created: 500}, {userId: '2', created: 500}]);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function () {
                return requestHandler.get('/api/recommendation/similarPage', {
                    pageId: '1',
                    skip: 0,
                    maxItems: 10
                });
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pages.length.should.equals(0);
            });
        });
    });

    it('Do not show pages with no equal topic, (algorithm similar likes)', function () {

        dbDsl.createContactConnection('1', '2', 'Freund', 500);

        dbDsl.createBookPage('1', {language: ['de'], topic: ['health', 'personalDevelopment'], created: 500, author: 'HansMuster', publishDate: 1000});
        dbDsl.createBookPage('2', {adminId: '3', language: ['de'], topic: ['personalDevelopment'], created: 501, author: 'HansMuster', publishDate: 1000});
        dbDsl.createBookPage('3', {adminId: '3', language: ['de'], topic: ['education'], created: 502, author: 'HansMuster', publishDate: 1000});


        dbDsl.crateRecommendationsForPage('1', [{userId: '2', created: 500}]);

        //Used for algorithm
        dbDsl.crateRecommendationsForPage('2', [{userId: '1', created: 500}, {userId: '2', created: 500}]);
        //Recommended pages
        dbDsl.crateRecommendationsForPage('3', [{userId: '2', created: 500}]);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function () {
                return requestHandler.get('/api/recommendation/similarPage', {
                    pageId: '1',
                    skip: 0,
                    maxItems: 10
                });
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pages.length.should.equals(0);
            });
        });
    });

    it('Do not show pages with no equal topic, (algorithm no similar likes, most popular)', function () {

        dbDsl.createContactConnection('1', '2', 'Freund', 500);

        dbDsl.createBookPage('1', {language: ['de'], topic: ['health', 'personalDevelopment'], created: 500, author: 'HansMuster', publishDate: 1000});
        dbDsl.createBookPage('3', {adminId: '3', language: ['de'], topic: ['education'], created: 502, author: 'HansMuster', publishDate: 1000});

        //Recommended pages
        dbDsl.crateRecommendationsForPage('3', [{userId: '3', created: 500}]);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function () {
                return requestHandler.get('/api/recommendation/similarPage', {
                    pageId: '1',
                    skip: 0,
                    maxItems: 10
                });
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pages.length.should.equals(0);
            });
        });
    });

    it('Do not show pages with no equal language, (algorithm similar likes)', function () {

        dbDsl.createContactConnection('1', '2', 'Freund', 500);

        dbDsl.createBookPage('1', {language: ['de'], topic: ['health', 'personalDevelopment'], created: 500, author: 'HansMuster', publishDate: 1000});
        dbDsl.createBookPage('2', {adminId: '3', language: ['de'], topic: ['personalDevelopment'], created: 501, author: 'HansMuster', publishDate: 1000});
        dbDsl.createBookPage('3', {adminId: '3', language: ['en'], topic: ['personalDevelopment'], created: 502, author: 'HansMuster', publishDate: 1000});


        dbDsl.crateRecommendationsForPage('1', [{userId: '2', created: 500}]);

        //Used for algorithm
        dbDsl.crateRecommendationsForPage('2', [{userId: '1', created: 500}, {userId: '2', created: 500}]);
        //Recommended pages
        dbDsl.crateRecommendationsForPage('3', [{userId: '2', created: 500}]);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function () {
                return requestHandler.get('/api/recommendation/similarPage', {
                    pageId: '1',
                    skip: 0,
                    maxItems: 10
                });
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pages.length.should.equals(0);
            });
        });
    });

    it('Do not show pages with no equal language, (algorithm no similar likes, most popular)', function () {

        dbDsl.createContactConnection('1', '2', 'Freund', 500);

        dbDsl.createBookPage('1', {language: ['de'], topic: ['health', 'personalDevelopment'], created: 500, author: 'HansMuster', publishDate: 1000});
        dbDsl.createBookPage('3', {adminId: '3', language: ['en'], topic: ['personalDevelopment'], created: 502, author: 'HansMuster', publishDate: 1000});

        //Recommended pages
        dbDsl.crateRecommendationsForPage('3', [{userId: '3', created: 500}]);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function () {
                return requestHandler.get('/api/recommendation/similarPage', {
                    pageId: '1',
                    skip: 0,
                    maxItems: 10
                });
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pages.length.should.equals(0);
            });
        });
    });
});
