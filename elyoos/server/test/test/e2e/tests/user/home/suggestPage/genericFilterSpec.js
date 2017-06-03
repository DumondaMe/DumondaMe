'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');

describe('Integration Tests for getting generic page suggestion on the home screen for the user', function () {

    beforeEach(function () {
        return dbDsl.init(3).then(function () {
            dbDsl.createGenericPage('0', {adminId: '3', language: ['de'], topic: ['health', 'personalDevelopment'], created: 501}, [{
                description: 'Zuerich',
                lat: 47.376887,
                lng: 8.541694
            }]);
            dbDsl.createGenericPage('1', {adminId: '3', language: ['de'], topic: ['health', 'personalDevelopment'], created: 501}, [{
                description: 'Zuerich',
                lat: 47.376887,
                lng: 8.541694
            }]);
            dbDsl.createBookPage('2', {adminId: '3', language: ['de'], topic: ['health', 'personalDevelopment'], created: 500, author: 'HansMuster', publishDate: 1000});
            dbDsl.createLinkPage('3', {adminId: '3', language: ['de'], topic: ['health'], created: 505, link: 'www.host.com/test'});
            dbDsl.createBlog('4', {blogWriterUserId: '3', language: ['de'], topic: ['health', 'personalDevelopment'], created: 501, pictureHeight: 400});
            dbDsl.createYoutubePage('5', {
                adminId: '3', language: ['de'], topic: ['health', 'personalDevelopment'], created: 501, link: 'https://www.youtube.com/watch?v=hTarMdJub0M',
                linkEmbed: 'https://www.youtube.com/embed/hTarMdJub0M'
            });
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });



    it('Getting all generic recommendations, (algorithm recommendation of contact)', function () {

        dbDsl.createContactConnection('1', '2', 'Freund', 500);

        //Used for algorithm
        dbDsl.crateRecommendationsForPage('0', [{userId: '1', created: 500}, {userId: '2', created: 500}]);

        //Recommended pages
        dbDsl.crateRecommendationsForPage('1', [{userId: '2', created: 500}]);
        dbDsl.crateRecommendationsForPage('2', [{userId: '2', created: 500}]);
        dbDsl.crateRecommendationsForPage('3', [{userId: '2', created: 500}]);
        dbDsl.crateRecommendationsForPage('4', [{userId: '2', created: 500}]);
        dbDsl.crateRecommendationsForPage('5', [{userId: '2', created: 500}]);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function () {
                return requestHandler.get('/api/user/home/', {
                    skipBlog: 0,
                    skipRecommendation: 0,
                    maxItems: 15,
                    onlyContact: true,
                    order: 'suggestPage',
                    recommendationType: ['Generic']
                });
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(1);
                res.body.skipRecommendation.should.equals(1);
                res.body.skipBlog.should.equals(0);

                res.body.pinwall[0].pageId.should.equals('1');
            });
        });
    });

    it('Getting all generic recommendations, (algorithm recommendation of other user)', function () {

        //Used for algorithm
        dbDsl.crateRecommendationsForPage('0', [{userId: '1', created: 500}, {userId: '2', created: 500}]);

        //Recommended pages
        dbDsl.crateRecommendationsForPage('1', [{userId: '2', created: 500}]);
        dbDsl.crateRecommendationsForPage('2', [{userId: '2', created: 500}]);
        dbDsl.crateRecommendationsForPage('3', [{userId: '2', created: 500}]);
        dbDsl.crateRecommendationsForPage('4', [{userId: '2', created: 500}]);
        dbDsl.crateRecommendationsForPage('5', [{userId: '2', created: 500}]);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function () {
                return requestHandler.get('/api/user/home/', {
                    skipBlog: 0,
                    skipRecommendation: 0,
                    maxItems: 15,
                    onlyContact: true,
                    order: 'suggestPage',
                    recommendationType: ['Generic']
                });
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(1);
                res.body.skipRecommendation.should.equals(1);
                res.body.skipBlog.should.equals(0);

                res.body.pinwall[0].pageId.should.equals('1');
            });
        });
    });

    it('Getting all generic recommendations, (algorithm recent most popular)', function () {

        let startTime = Math.floor(moment.utc().valueOf() / 1000);

        //Used for algorithm
        dbDsl.crateRecommendationsForPage('0', [{userId: '2', created: startTime}]);

        //Recommended pages
        dbDsl.crateRecommendationsForPage('1', [{userId: '2', created: startTime - 2419300}]);
        dbDsl.crateRecommendationsForPage('2', [{userId: '2', created: startTime}]);
        dbDsl.crateRecommendationsForPage('3', [{userId: '2', created: startTime}]);
        dbDsl.crateRecommendationsForPage('4', [{userId: '2', created: startTime}]);
        dbDsl.crateRecommendationsForPage('5', [{userId: '2', created: startTime}]);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function () {
                return requestHandler.get('/api/user/home/', {
                    skipBlog: 0,
                    skipRecommendation: 0,
                    maxItems: 15,
                    onlyContact: true,
                    order: 'suggestPage',
                    recommendationType: ['Generic']
                });
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(1);
                res.body.skipRecommendation.should.equals(1);
                res.body.skipBlog.should.equals(0);

                res.body.pinwall[0].pageId.should.equals('0');
            });
        });
    });
});
