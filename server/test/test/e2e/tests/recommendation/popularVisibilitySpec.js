'use strict';

var users = require('../util/user');
var dbDsl = require('../util/dbDSL');
var requestHandler = require('../util/request');

describe('Integration Tests for checking visibility elements of popular recommendations', function () {

    var requestAgent;

    beforeEach(function () {
        return dbDsl.init(8);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting most popular recommendations ever but ignore recommendations of blocked user - Return 200', function () {

        dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createContactConnection('1', '2');
        dbDsl.createContactConnection('1', '3');
        dbDsl.blockUser('1', '4');

        dbDsl.createBookPage('1', ['en'], ['health'], 5072, 'HansMuster1', 1000);
        dbDsl.createBookPage('2', ['de'], ['personalDevelopment'], 5071, 'HansMuster2', 1001);
        dbDsl.createYoutubePage('3', ['fr'], ['personalDevelopment'], 5073, 'www.youtube.com', 'www.youtube.com/embed');
        dbDsl.createLinkPage('4', ['fr'], ['personalDevelopment'], 5074, 'www.link.com/link', 200);

        dbDsl.createBlog('1', '5', ['en'], ['health'], 5077, null, 250);
        dbDsl.createBlog('2', '1', ['en'], ['spiritual'], 5077, null, null);

        dbDsl.crateRecommendationsForPage('2', [{userId: '4', created: 500}]);
        dbDsl.crateRecommendationsForPage('3', [{userId: '3', created: 502}, {userId: '4', created: 503}]);
        dbDsl.crateRecommendationsForPage('4', [{userId: '3', created: 504}, {userId: '4', created: 505},
            {userId: '5', created: 506}, {userId: '6', created: 507}]);
        dbDsl.crateRecommendationsForBlog('1', [{userId: '3', created: 508}, {userId: '4', created: 509}, {userId: '7', created: 510}]);


        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/recommendation/popular', {
                    skip: '0',
                    maxItems: 10,
                    onlyContact: false,
                    period: 'all'
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.recommendations.length.should.equals(3);
                res.body.recommendations[0].label.should.equals('Link');
                res.body.recommendations[0].pageId.should.equals('4');
                res.body.recommendations[0].numberOfRecommendations.should.equals(3);

                res.body.recommendations[1].label.should.equals('Blog');
                res.body.recommendations[1].pageId.should.equals('1');
                res.body.recommendations[1].numberOfRecommendations.should.equals(2);

                res.body.recommendations[2].label.should.equals('Youtube');
                res.body.recommendations[2].pageId.should.equals('3');
                res.body.recommendations[2].numberOfRecommendations.should.equals(1);
            });
        });
    });

    it('Getting most popular blog recommendations and show blogger image ((user)<-[:IS_CONTACT]-(otherUser)) - Return 200', function () {

        dbDsl.createContactConnection('2', '1', 'Freund');
        dbDsl.createContactConnection('4', '1', 'Freund');
        dbDsl.createPrivacy(['2', '4'], 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

        dbDsl.createBlog('1', '2', ['en'], ['health'], 5077, null, 250);
        dbDsl.createBlog('2', '4', ['en'], ['health'], 5078, null, 250);

        dbDsl.crateRecommendationsForBlog('1', [{userId: '3', created: 508}]);
        dbDsl.crateRecommendationsForBlog('2', [{userId: '3', created: 509}]);


        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/recommendation/popular', {
                    skip: '0',
                    maxItems: 10,
                    onlyContact: false,
                    period: 'all'
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.recommendations.length.should.equals(2);

                res.body.recommendations[0].label.should.equals('Blog');
                res.body.recommendations[0].pageId.should.equals('2');
                res.body.recommendations[0].url.should.equals('profileImage/4/thumbnail.jpg');

                res.body.recommendations[1].label.should.equals('Blog');
                res.body.recommendations[1].pageId.should.equals('1');
                res.body.recommendations[1].url.should.equals('profileImage/2/thumbnail.jpg');
            });
        });
    });

    it('Getting most popular blog recommendations and show blogger image ((user) no contact (otherUser)) - Return 200', function () {

        dbDsl.createPrivacyNoContact(['2', '4'], {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

        dbDsl.createBlog('1', '2', ['en'], ['health'], 5077, null, 250);
        dbDsl.createBlog('2', '4', ['en'], ['health'], 5078, null, 250);

        dbDsl.crateRecommendationsForBlog('1', [{userId: '3', created: 508}]);
        dbDsl.crateRecommendationsForBlog('2', [{userId: '3', created: 509}]);


        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/recommendation/popular', {
                    skip: '0',
                    maxItems: 10,
                    onlyContact: false,
                    period: 'all'
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.recommendations.length.should.equals(2);

                res.body.recommendations[0].label.should.equals('Blog');
                res.body.recommendations[0].pageId.should.equals('2');
                res.body.recommendations[0].url.should.equals('profileImage/4/thumbnail.jpg');

                res.body.recommendations[1].label.should.equals('Blog');
                res.body.recommendations[1].pageId.should.equals('1');
                res.body.recommendations[1].url.should.equals('profileImage/2/thumbnail.jpg');
            });
        });
    });

    it('Getting most popular blog recommendations but hide blogger image ((user)<-[:IS_CONTACT]-(otherUser)) - Return 200', function () {

        dbDsl.createContactConnection('2', '1', 'Freund');
        dbDsl.createPrivacy(['2'], 'Freund', {profile: true, image: false, profileData: true, contacts: true, pinwall: true});
        dbDsl.createContactConnection('4', '1', 'Freund');
        dbDsl.createPrivacy(['4'], 'Freund', {profile: false, image: true, profileData: true, contacts: true, pinwall: true});

        dbDsl.createBlog('1', '2', ['en'], ['health'], 5077, null, 250);
        dbDsl.createBlog('2', '4', ['en'], ['health'], 5078, null, 250);

        dbDsl.crateRecommendationsForBlog('1', [{userId: '3', created: 508}]);
        dbDsl.crateRecommendationsForBlog('2', [{userId: '3', created: 509}]);


        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/recommendation/popular', {
                    skip: '0',
                    maxItems: 10,
                    onlyContact: false,
                    period: 'all'
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.recommendations.length.should.equals(2);

                res.body.recommendations[0].label.should.equals('Blog');
                res.body.recommendations[0].pageId.should.equals('2');
                res.body.recommendations[0].url.should.equals('profileImage/default/thumbnail.jpg');

                res.body.recommendations[1].label.should.equals('Blog');
                res.body.recommendations[1].pageId.should.equals('1');
                res.body.recommendations[1].url.should.equals('profileImage/default/thumbnail.jpg');
            });
        });
    });

    it('Getting most popular blog recommendations but hide blogger image ((user) no contact (otherUser)) - Return 200', function () {

        dbDsl.createPrivacyNoContact(['2'], {profile: true, image: false, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacyNoContact(['4'],  {profile: false, image: true, profileData: true, contacts: true, pinwall: true});

        dbDsl.createBlog('1', '2', ['en'], ['health'], 5077, null, 250);
        dbDsl.createBlog('2', '4', ['en'], ['health'], 5078, null, 250);

        dbDsl.crateRecommendationsForBlog('1', [{userId: '3', created: 508}]);
        dbDsl.crateRecommendationsForBlog('2', [{userId: '3', created: 509}]);


        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/recommendation/popular', {
                    skip: '0',
                    maxItems: 10,
                    onlyContact: false,
                    period: 'all'
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.recommendations.length.should.equals(2);

                res.body.recommendations[0].label.should.equals('Blog');
                res.body.recommendations[0].pageId.should.equals('2');
                res.body.recommendations[0].url.should.equals('profileImage/default/thumbnail.jpg');

                res.body.recommendations[1].label.should.equals('Blog');
                res.body.recommendations[1].pageId.should.equals('1');
                res.body.recommendations[1].url.should.equals('profileImage/default/thumbnail.jpg');
            });
        });
    });

    it('Getting most popular blog recommendations but hide blogger image because user is blocked - Return 200', function () {

        dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.blockUser('2', '1');

        dbDsl.createBlog('1', '2', ['en'], ['health'], 5077, null, 250);

        dbDsl.crateRecommendationsForBlog('1', [{userId: '3', created: 508}]);


        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/recommendation/popular', {
                    skip: '0',
                    maxItems: 10,
                    onlyContact: false,
                    period: 'all'
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.recommendations.length.should.equals(1);

                res.body.recommendations[0].label.should.equals('Blog');
                res.body.recommendations[0].pageId.should.equals('1');
                res.body.recommendations[0].url.should.equals('profileImage/default/thumbnail.jpg');
            });
        });
    });
});
