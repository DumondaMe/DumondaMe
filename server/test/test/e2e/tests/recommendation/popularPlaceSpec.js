'use strict';

var users = require('../util/user');
var dbDsl = require('../util/dbDSL');
var requestHandler = require('../util/request');

describe('Integration Tests for getting popular place recommendations', function () {

    var requestAgent;

    beforeEach(function () {
        return dbDsl.init(8);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting most popular place recommendations for a area - Return 200', function () {

        dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createContactConnection('1', '2');
        dbDsl.createContactConnection('1', '3');

        dbDsl.createPlacePage('1', '1', 5072, 'Test1', [{description: 'Zuerich', lat: 47.376887, lng: 8.541694}, {
            description: 'Zuerich Paradeplatz',
            lat: 47.369890,
            lng: 8.539127
        }]);
        dbDsl.createPlacePage('2', '1', 5073, 'Test2', [{description: 'Urdorf', lat: 47.386707, lng: 8.420693}]);
        dbDsl.createPlacePage('3', '1', 5074, 'Test3', [{description: 'Altstetten', lat: 47.388237, lng: 8.483051}]);
        dbDsl.createPlacePage('4', '1', 5075, 'Test4', [{description: 'Bern', lat: 46.947974, lng: 7.447447}]);
        dbDsl.createPlacePage('5', '1', 5076, 'Test5', [{description: 'Genf', lat: 46.204391, lng: 6.143158}]);

        dbDsl.crateRecommendationsForPage('2', [{userId: '2', created: 500}, {userId: '3', created: 501}]);
        dbDsl.crateRecommendationsForPage('3', [{userId: '3', created: 502}, {userId: '4', created: 503}, {userId: '5', created: 504}]);
        dbDsl.crateRecommendationsForPage('4', [{userId: '3', created: 504}, {userId: '4', created: 505},
            {userId: '5', created: 506}, {userId: '6', created: 507}]);
        dbDsl.crateRecommendationsForPage('5', [{userId: '3', created: 508}, {userId: '4', created: 509}, {userId: '7', created: 510}]);


        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/recommendation/popularPlace', {
                    skip: '0',
                    maxItems: 10,
                    centerLat: 47.376887,
                    centerLng: 8.541694,
                    radius: 20
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.recommendations.length.should.equals(3);
                res.body.recommendations[0].pageId.should.equals('3');
                res.body.recommendations[0].title.should.equals('Test3');
                res.body.recommendations[0].places.length.should.equals(1);
                res.body.recommendations[0].places[0].description.should.equals('Altstetten');
                res.body.recommendations[0].places[0].latitude.should.equals(47.388237);
                res.body.recommendations[0].places[0].longitude.should.equals(8.483051);
                res.body.recommendations[0].numberOfRecommendations.should.equals(3);

                res.body.recommendations[1].pageId.should.equals('2');
                res.body.recommendations[1].title.should.equals('Test2');
                res.body.recommendations[1].places.length.should.equals(1);
                res.body.recommendations[1].places[0].description.should.equals('Urdorf');
                res.body.recommendations[1].places[0].latitude.should.equals(47.386707);
                res.body.recommendations[1].places[0].longitude.should.equals(8.420693);
                res.body.recommendations[1].numberOfRecommendations.should.equals(2);

                res.body.recommendations[2].pageId.should.equals('1');
                res.body.recommendations[2].title.should.equals('Test1');
                res.body.recommendations[2].places.length.should.equals(2);
                res.body.recommendations[2].places[0].description.should.equals('Zuerich Paradeplatz');
                res.body.recommendations[2].places[0].latitude.should.equals(47.369890);
                res.body.recommendations[2].places[0].longitude.should.equals(8.539127);
                res.body.recommendations[2].places[1].description.should.equals('Zuerich');
                res.body.recommendations[2].places[1].latitude.should.equals(47.376887);
                res.body.recommendations[2].places[1].longitude.should.equals(8.541694);
                res.body.recommendations[2].numberOfRecommendations.should.equals(0);
            });
        });
    });
});
