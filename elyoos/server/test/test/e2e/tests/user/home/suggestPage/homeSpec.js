'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');

describe('Integration Tests for getting page suggestion on the home screen for the user', function () {

    beforeEach(function () {
        return dbDsl.init(12).then(function () {
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    /**
     * - Contacts with the most equal recommendations, sorted by most recent date
     * - Not contacts with the most equal recommendations, sorted by most recent date
     * - Most popular pages within the last month
     */
    it('Getting for pages for all possibilities', function () {

        let startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createContactConnection('1', '2', 'Freund', 500);
        dbDsl.createContactConnection('1', '3', 'Freund', 500);
        dbDsl.createContactConnection('1', '4', 'Freund', 500);
        dbDsl.createContactConnection('1', '5', 'Freund', 500);

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
        dbDsl.createBookPage('15', {adminId: '3', language: ['de'], topic: ['personalDevelopment'], created: 502, author: 'HansMuster', publishDate: 1000});
        dbDsl.createBookPage('16', {adminId: '3', language: ['de'], topic: ['personalDevelopment'], created: 502, author: 'HansMuster', publishDate: 1000});


        dbDsl.crateRecommendationsForPage('1', [{userId: '1', created: 500},{userId: '2', created: 500},
            {userId: '5', created: 500},
            {userId: '6', created: 500},
            {userId: '7', created: 500}]);

        //Used for algorithm
        dbDsl.crateRecommendationsForPage('2', [{userId: '1', created: 500}, {userId: '2', created: 500}]);
        dbDsl.crateRecommendationsForPage('3', [{userId: '1', created: 500}, {userId: '3', created: 500}]);
        dbDsl.crateRecommendationsForPage('4', [{userId: '1', created: 500}, {userId: '3', created: 500}, {userId: '6', created: 500}]);
        dbDsl.crateRecommendationsForPage('5', [{userId: '1', created: 500}, {userId: '4', created: 500}, {userId: '6', created: 500}]);
        dbDsl.crateRecommendationsForPage('6', [{userId: '1', created: 500}, {userId: '7', created: 500}]);
        dbDsl.crateRecommendationsForPage('7', [{userId: '1', created: 500}, {userId: '8', created: 500}]);
        //Recommended pages
        dbDsl.crateRecommendationsForPage('8', [{userId: '2', created: startTime}]);
        dbDsl.crateRecommendationsForPage('9', [{userId: '3', created: startTime - 1}, {userId: '12', created: 500}]);
        dbDsl.crateRecommendationsForPage('10', [{userId: '4', created: startTime}, {userId: '5', created: startTime}]);
        dbDsl.crateRecommendationsForPage('11', [{userId: '6', created: startTime}]);
        dbDsl.crateRecommendationsForPage('12', [{userId: '7', created: startTime},
            {userId: '9', created: 500},
            {userId: '10', created: 500},
            {userId: '11', created: 500}]);
        dbDsl.crateRecommendationsForPage('13', [{userId: '8', created: startTime - 1},
            {userId: '10', created: 500},
            {userId: '11', created: 500}]);
        dbDsl.crateRecommendationsForPage('14', [
            {userId: '10', created: startTime},
            {userId: '11', created: startTime - 1}]);
        dbDsl.crateRecommendationsForPage('15', [{userId: '11', created: startTime},
            {userId: '9', created: startTime - 2419203},
            {userId: '12', created: startTime - 2419204}]);
        dbDsl.crateRecommendationsForPage('16', [
            {userId: '10', created: startTime - 2419201},
            {userId: '11', created: startTime - 2419202},
            {userId: '12', created: startTime - 2419203}]);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.get('/api/user/home/', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 15,
                onlyContact: true,
                order: 'suggestPage'
            });
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equals(8);
            res.body.skipRecommendation.should.equals(8);
            res.body.skipBlog.should.equals(0);

            res.body.pinwall[0].pinwallType.should.equals('Recommendation');
            res.body.pinwall[0].label.should.equals("Youtube");
            res.body.pinwall[0].pageId.should.equals("8");
            res.body.pinwall[0].title.should.equals("page8Title");
            res.body.pinwall[0].description.should.equals("page8Description");
            res.body.pinwall[0].link.should.equals("https://www.youtube.com/watch?v=hTarMdJub0M");
            res.body.pinwall[0].linkEmbed.should.equals("https://www.youtube.com/embed/hTarMdJub0M");
            res.body.pinwall[0].recommendedByUser.should.equals(false);
            res.body.pinwall[0].thisRecommendationByUser.should.equals(false);
            res.body.pinwall[0].totalNumberOfRecommendations.should.equals(1);
            res.body.pinwall[0].topic.length.should.equals(2);
            res.body.pinwall[0].topic[0].should.equals('health');
            res.body.pinwall[0].topic[1].should.equals('personalDevelopment');

            res.body.pinwall[1].pinwallType.should.equals('Recommendation');
            res.body.pinwall[1].label.should.equals("Link");
            res.body.pinwall[1].pageId.should.equals("9");
            res.body.pinwall[1].title.should.equals("page9Title");
            res.body.pinwall[1].description.should.equals("page9Description");
            res.body.pinwall[1].link.should.equals("www.host.com/test2");
            res.body.pinwall[1].recommendedByUser.should.equals(false);
            res.body.pinwall[1].thisRecommendationByUser.should.equals(false);
            res.body.pinwall[1].totalNumberOfRecommendations.should.equals(2);
            res.body.pinwall[1].topic.length.should.equals(1);
            res.body.pinwall[1].topic[0].should.equals('health');

            res.body.pinwall[2].pinwallType.should.equals('Recommendation');
            res.body.pinwall[2].label.should.equals("Book");
            res.body.pinwall[2].pageId.should.equals("10");
            res.body.pinwall[2].title.should.equals("page10Title");
            res.body.pinwall[2].description.should.equals("page10Description");
            res.body.pinwall[2].previewUrl.should.equals("pages/10/pagePreview.jpg");
            res.body.pinwall[2].recommendedByUser.should.equals(false);
            res.body.pinwall[2].thisRecommendationByUser.should.equals(false);
            res.body.pinwall[2].totalNumberOfRecommendations.should.equals(2);
            res.body.pinwall[2].topic.length.should.equals(1);
            res.body.pinwall[2].topic[0].should.equals('personalDevelopment');

            res.body.pinwall[3].pinwallType.should.equals('Recommendation');
            res.body.pinwall[3].label.should.equals("Link");
            res.body.pinwall[3].pageId.should.equals("11");
            res.body.pinwall[3].title.should.equals("page11Title");
            res.body.pinwall[3].description.should.equals("page11Description");
            res.body.pinwall[3].link.should.equals("www.host.com/test3");
            res.body.pinwall[3].recommendedByUser.should.equals(false);
            res.body.pinwall[3].thisRecommendationByUser.should.equals(false);
            res.body.pinwall[3].totalNumberOfRecommendations.should.equals(1);
            res.body.pinwall[3].topic.length.should.equals(1);
            res.body.pinwall[3].topic[0].should.equals('health');

            res.body.pinwall[4].pinwallType.should.equals('Recommendation');
            res.body.pinwall[4].label.should.equals("Link");
            res.body.pinwall[4].pageId.should.equals("12");
            res.body.pinwall[4].title.should.equals("page12Title");
            res.body.pinwall[4].description.should.equals("page12Description");
            res.body.pinwall[4].link.should.equals("www.host.com/test4");
            res.body.pinwall[4].recommendedByUser.should.equals(false);
            res.body.pinwall[4].thisRecommendationByUser.should.equals(false);
            res.body.pinwall[4].totalNumberOfRecommendations.should.equals(4);
            res.body.pinwall[4].topic.length.should.equals(1);
            res.body.pinwall[4].topic[0].should.equals('health');

            res.body.pinwall[5].pinwallType.should.equals('Recommendation');
            res.body.pinwall[5].label.should.equals("Generic");
            res.body.pinwall[5].pageId.should.equals("13");
            res.body.pinwall[5].title.should.equals("generic13Title");
            res.body.pinwall[5].description.should.equals("page13Description");
            res.body.pinwall[5].previewUrl.should.equals("pages/13/preview.jpg");
            res.body.pinwall[5].recommendedByUser.should.equals(false);
            res.body.pinwall[5].thisRecommendationByUser.should.equals(false);
            res.body.pinwall[5].totalNumberOfRecommendations.should.equals(3);
            res.body.pinwall[5].topic.length.should.equals(2);
            res.body.pinwall[5].topic[0].should.equals('health');
            res.body.pinwall[5].topic[1].should.equals('personalDevelopment');

            res.body.pinwall[6].pinwallType.should.equals('Recommendation');
            res.body.pinwall[6].label.should.equals("Book");
            res.body.pinwall[6].pageId.should.equals("14");
            res.body.pinwall[6].title.should.equals("page14Title");
            res.body.pinwall[6].description.should.equals("page14Description");
            res.body.pinwall[6].previewUrl.should.equals("pages/14/pagePreview.jpg");
            res.body.pinwall[6].recommendedByUser.should.equals(false);
            res.body.pinwall[6].thisRecommendationByUser.should.equals(false);
            res.body.pinwall[6].totalNumberOfRecommendations.should.equals(2);
            res.body.pinwall[6].topic.length.should.equals(1);
            res.body.pinwall[6].topic[0].should.equals('personalDevelopment');

            res.body.pinwall[7].pinwallType.should.equals('Recommendation');
            res.body.pinwall[7].label.should.equals("Book");
            res.body.pinwall[7].pageId.should.equals("15");
            res.body.pinwall[7].title.should.equals("page15Title");
            res.body.pinwall[7].description.should.equals("page15Description");
            res.body.pinwall[7].previewUrl.should.equals("pages/15/pagePreview.jpg");
            res.body.pinwall[7].recommendedByUser.should.equals(false);
            res.body.pinwall[7].thisRecommendationByUser.should.equals(false);
            res.body.pinwall[7].totalNumberOfRecommendations.should.equals(3);
            res.body.pinwall[7].topic.length.should.equals(1);
            res.body.pinwall[7].topic[0].should.equals('personalDevelopment');
        });
    });

    it('Do not show pages where user is admin, (algorithm recommendation of contact)', function () {

        dbDsl.createContactConnection('1', '2', 'Freund', 500);

        dbDsl.createBookPage('1', {language: ['de'], topic: ['health', 'personalDevelopment'], created: 500, author: 'HansMuster', publishDate: 1000});
        dbDsl.createBookPage('2', {adminId: '1', language: ['de'], topic: ['spiritual', 'personalDevelopment'], created: 501, author: 'HansMuster', publishDate: 1000});

        //Used for algorithm
        dbDsl.crateRecommendationsForPage('1', [{userId: '1', created: 500}, {userId: '2', created: 500}]);

        //Recommended pages
        dbDsl.crateRecommendationsForPage('2', [{userId: '2', created: 500}]);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function () {
                return requestHandler.get('/api/user/home/', {
                    skipBlog: 0,
                    skipRecommendation: 0,
                    maxItems: 15,
                    onlyContact: true,
                    order: 'suggestPage'
                });
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(0);
                res.body.skipRecommendation.should.equals(0);
                res.body.skipBlog.should.equals(0);
            });
        });
    });

    it('Do not show pages where user is admin, (algorithm recommendation of other user)', function () {

        dbDsl.createBookPage('1', {language: ['de'], topic: ['health', 'personalDevelopment'], created: 500, author: 'HansMuster', publishDate: 1000});
        dbDsl.createBookPage('2', {adminId: '1', language: ['de'], topic: ['spiritual', 'personalDevelopment'], created: 501, author: 'HansMuster', publishDate: 1000});

        //Used for algorithm
        dbDsl.crateRecommendationsForPage('1', [{userId: '1', created: 500}, {userId: '2', created: 500}]);

        //Recommended pages
        dbDsl.crateRecommendationsForPage('2', [{userId: '2', created: 500}]);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function () {
                return requestHandler.get('/api/user/home/', {
                    skipBlog: 0,
                    skipRecommendation: 0,
                    maxItems: 15,
                    onlyContact: true,
                    order: 'suggestPage'
                });
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(0);
                res.body.skipRecommendation.should.equals(0);
                res.body.skipBlog.should.equals(0);
            });
        });
    });

    it('Do not show pages where user is admin, (algorithm recent most popular)', function () {

        let startTime = Math.floor(moment.utc().valueOf() / 1000);
        dbDsl.createBookPage('1', {adminId: '1', language: ['de'], topic: ['health', 'personalDevelopment'], created: 500, author: 'HansMuster', publishDate: 1000});
        dbDsl.createBookPage('2', {adminId: '3', language: ['de'], topic: ['spiritual', 'personalDevelopment'], created: 501, author: 'HansMuster', publishDate: 1000});

        //Used for algorithm
        dbDsl.crateRecommendationsForPage('1', [{userId: '2', created: startTime - 1}, {userId: '3', created: startTime - 2}]);
        dbDsl.crateRecommendationsForPage('2', [{userId: '2', created: startTime - 2419300}]);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function () {
                return requestHandler.get('/api/user/home/', {
                    skipBlog: 0,
                    skipRecommendation: 0,
                    maxItems: 15,
                    onlyContact: true,
                    order: 'suggestPage'
                });
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(0);
                res.body.skipRecommendation.should.equals(0);
                res.body.skipBlog.should.equals(0);
            });
        });
    });

    it('Do not show pages already recommended by the user, (algorithm recommendation of contact)', function () {

        dbDsl.createContactConnection('1', '2', 'Freund', 500);

        dbDsl.createBookPage('1', {language: ['de'], topic: ['health', 'personalDevelopment'], created: 500, author: 'HansMuster', publishDate: 1000});
        dbDsl.createBookPage('2', {adminId: '1', language: ['de'], topic: ['spiritual', 'personalDevelopment'], created: 501, author: 'HansMuster', publishDate: 1000});

        //Used for algorithm
        dbDsl.crateRecommendationsForPage('1', [{userId: '1', created: 500}, {userId: '2', created: 500}]);

        //Recommended pages
        dbDsl.crateRecommendationsForPage('2', [{userId: '1', created: 500}, {userId: '2', created: 500}]);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function () {
                return requestHandler.get('/api/user/home/', {
                    skipBlog: 0,
                    skipRecommendation: 0,
                    maxItems: 15,
                    onlyContact: true,
                    order: 'suggestPage'
                });
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(0);
                res.body.skipRecommendation.should.equals(0);
                res.body.skipBlog.should.equals(0);
            });
        });
    });

    it('Do not show pages already recommended by the user, (algorithm recommendation of other user)', function () {

        dbDsl.createBookPage('1', {language: ['de'], topic: ['health', 'personalDevelopment'], created: 500, author: 'HansMuster', publishDate: 1000});
        dbDsl.createBookPage('2', {adminId: '1', language: ['de'], topic: ['spiritual', 'personalDevelopment'], created: 501, author: 'HansMuster', publishDate: 1000});

        //Used for algorithm
        dbDsl.crateRecommendationsForPage('1', [{userId: '1', created: 500}, {userId: '2', created: 500}]);

        //Recommended pages
        dbDsl.crateRecommendationsForPage('2', [{userId: '1', created: 500}, {userId: '2', created: 500}]);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function () {
                return requestHandler.get('/api/user/home/', {
                    skipBlog: 0,
                    skipRecommendation: 0,
                    maxItems: 15,
                    onlyContact: true,
                    order: 'suggestPage'
                });
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(0);
                res.body.skipRecommendation.should.equals(0);
                res.body.skipBlog.should.equals(0);
            });
        });
    });

    it('Do not show pages recommended only by blocked users, (algorithm recommendation of other user)', function () {

        dbDsl.blockUser('1', '2');

        dbDsl.createBookPage('1', {adminId: '3', language: ['de'], topic: ['health', 'personalDevelopment'], created: 500, author: 'HansMuster', publishDate: 1000});
        dbDsl.createBookPage('2', {adminId: '3', language: ['de'], topic: ['spiritual', 'personalDevelopment'], created: 501, author: 'HansMuster', publishDate: 1000});

        //Used for algorithm
        dbDsl.crateRecommendationsForPage('1', [{userId: '1', created: 500}, {userId: '2', created: 500}]);

        //Recommended pages
        dbDsl.crateRecommendationsForPage('2', [{userId: '2', created: 500}]);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function () {
                return requestHandler.get('/api/user/home/', {
                    skipBlog: 0,
                    skipRecommendation: 0,
                    maxItems: 15,
                    onlyContact: true,
                    order: 'suggestPage'
                });
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(0);
                res.body.skipRecommendation.should.equals(0);
                res.body.skipBlog.should.equals(0);
            });
        });
    });

    it('Do not show pages recommended only by blocked users, (algorithm recent most popular)', function () {

        let startTime = Math.floor(moment.utc().valueOf() / 1000);
        dbDsl.blockUser('1', '2');

        dbDsl.createBookPage('1', {adminId: '3', language: ['de'], topic: ['health', 'personalDevelopment'], created: 500, author: 'HansMuster', publishDate: 1000});

        //Recommended pages
        dbDsl.crateRecommendationsForPage('1', [{userId: '2', created: startTime}]);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function () {
                return requestHandler.get('/api/user/home/', {
                    skipBlog: 0,
                    skipRecommendation: 0,
                    maxItems: 15,
                    onlyContact: true,
                    order: 'suggestPage'
                });
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(0);
                res.body.skipRecommendation.should.equals(0);
                res.body.skipBlog.should.equals(0);
            });
        });
    });

});
