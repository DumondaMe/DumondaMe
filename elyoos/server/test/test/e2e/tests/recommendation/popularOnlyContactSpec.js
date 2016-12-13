'use strict';

var users = require('elyoos-server-test-util').user;
var dbDsl = require('elyoos-server-test-util').dbDSL;
var requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for getting popular recommendations filtered by contacts', function () {

    var requestAgent;

    beforeEach(function () {
        return dbDsl.init(8).then(function () {
            dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting only recommendations of contacts - Return 200', function () {

        dbDsl.createContactConnection('1', '2');
        dbDsl.createContactConnection('1', '3');

        dbDsl.createBookPage('1', ['en'], ['health'], 5072, 'HansMuster1', 1000);
        dbDsl.createBookPage('2', ['de'], ['personalDevelopment'], 5071, 'HansMuster2', 1001);
        dbDsl.createYoutubePage('3', ['fr'], ['personalDevelopment'], 5073, 'www.youtube.com', 'www.youtube.com/embed');
        dbDsl.createLinkPage('4', ['fr'], ['personalDevelopment'], 5074, 'www.link.com/link', 200);

        dbDsl.createBlog('5', '5', ['en'], ['health'], 5077, null, 250);
        dbDsl.createBlog('6', '1', ['en'], ['spiritual'], 5077, null, null);

        dbDsl.crateRecommendationsForPage('2', [{userId: '2', created: 500}, {userId: '3', created: 501}]);
        dbDsl.crateRecommendationsForPage('3', [{userId: '3', created: 502}, {userId: '4', created: 503}]);
        dbDsl.crateRecommendationsForPage('4', [{userId: '3', created: 504}, {userId: '4', created: 505},
            {userId: '5', created: 506}, {userId: '6', created: 507}]);
        dbDsl.crateRecommendationsForBlog('5', [{userId: '4', created: 508}, {userId: '5', created: 509}, {userId: '7', created: 510}]);


        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/recommendation/popular', {
                    skip: '0',
                    maxItems: 10,
                    onlyContact: true,
                    period: 'all',
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.recommendations.length.should.equals(3);

                res.body.recommendations[0].label.should.equals('Book');
                res.body.recommendations[0].pageId.should.equals('2');
                res.body.recommendations[0].numberOfRecommendations.should.equals(2);

                res.body.recommendations[1].label.should.equals('Link');
                res.body.recommendations[1].pageId.should.equals('4');
                res.body.recommendations[1].numberOfRecommendations.should.equals(1);

                res.body.recommendations[2].label.should.equals('Youtube');
                res.body.recommendations[2].pageId.should.equals('3');
                res.body.recommendations[2].numberOfRecommendations.should.equals(1);

            });
        });
    });
});
