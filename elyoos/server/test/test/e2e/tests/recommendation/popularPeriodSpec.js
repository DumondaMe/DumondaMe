'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');

describe('Integration Tests for getting popular recommendations filtered by period', function () {

    let requestAgent, startTime, twoWeeks;

    beforeEach(function () {
        return dbDsl.init(8).then(function () {
            startTime = Math.floor(moment.utc().valueOf() / 1000);
            twoWeeks = startTime - 1209600;
            dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting most popular recommendations in the last two weeks - Return 200', function () {

        dbDsl.createContactConnection('1', '2');
        dbDsl.createContactConnection('1', '3');

        dbDsl.createBookPage('1', ['en'], ['health'], 5072, 'HansMuster1', 1000);
        dbDsl.createBookPage('2', ['de'], ['personalDevelopment'], 5071, 'HansMuster2', 1001);
        dbDsl.createYoutubePage('3', ['fr'], ['personalDevelopment'], 5073, 'www.youtube.com', 'www.youtube.com/embed');
        dbDsl.createLinkPage('4', ['fr'], ['personalDevelopment'], 5074, 'www.link.com/link', 200);

        dbDsl.createBlog('5', '5', ['en'], ['health'], 5077, null, 250);
        dbDsl.createBlog('6', '1', ['en'], ['spiritual'], 5077, null, null);

        dbDsl.crateRecommendationsForPage('2', [{userId: '2', created: startTime}, {userId: '3', created: twoWeeks - 1}]);
        dbDsl.crateRecommendationsForPage('3', [{userId: '3', created: twoWeeks - 2}, {userId: '4', created: twoWeeks - 3}]);
        dbDsl.crateRecommendationsForPage('4', [{userId: '3', created: twoWeeks + 5}, {userId: '4', created: twoWeeks + 10},
            {userId: '5', created: twoWeeks - 4}, {userId: '6', created: twoWeeks - 5}]);
        dbDsl.crateRecommendationsForBlog('5', [{userId: '3', created: twoWeeks - 6}, {userId: '4', created: twoWeeks - 7}, {
            userId: '7', created: twoWeeks - 8}]);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/recommendation/popular', {
                    skip: '0',
                    maxItems: 10,
                    onlyContact: false,
                    period: 'twoWeeks'
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.recommendations.length.should.equals(2);
                res.body.recommendations[0].label.should.equals('Link');
                res.body.recommendations[0].pageId.should.equals('4');
                res.body.recommendations[0].numberOfRecommendations.should.equals(2);

                res.body.recommendations[1].label.should.equals('Book');
                res.body.recommendations[1].pageId.should.equals('2');
                res.body.recommendations[1].numberOfRecommendations.should.equals(1);
            });
        });
    });
});
