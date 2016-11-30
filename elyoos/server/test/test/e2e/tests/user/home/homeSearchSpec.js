'use strict';

var users = require('../../util/user');
var db = require('../../util/db');
var dbDsl = require('../../util/dbDSL');
var requestHandler = require('../../util/request');
var should = require('chai').should();

describe('Integration Tests for searching people or pages', function () {

    var requestAgent;

    beforeEach(function () {

        return db.clearDatabase().then(function () {
            return dbDsl.init(0).then(function () {
                dbDsl.createUser('2', 'user?', 'Meier2');
                dbDsl.createUser('3', 'tuser', 'Meier3');
                dbDsl.createUser('4', 'luser', 'tMeier4');
                dbDsl.createUser('5', 'user?', 'uMeier5');
                dbDsl.createUser('6', 'user?', 'sMeier6');
                dbDsl.createContactConnection('1', '5', 'Freund');
                dbDsl.createContactConnection('1', '3', 'Freund');
                dbDsl.createBookPage('0', ['de'], ['health', 'personalDevelopment'], 501, 'Hans Muster', 1000, 'book written by user?');
                dbDsl.createBookPage('1', ['de'], ['health', 'personalDevelopment'], 502, 'Hans Muster', 1000, 'book written by Meier');
                dbDsl.createBookPage('2', ['de'], ['health', 'personalDevelopment'], 500, 'Hans Muster', 1000, 'y written by user?');
                dbDsl.createYoutubePage('3', ['de'], ['health', 'personalDevelopment'], 503, 'www.test.ch', 'www.test.ch/embed', 'youtube movie by user?');
                dbDsl.createYoutubePage('4', ['de'], ['health', 'personalDevelopment'], 504, 'www.test2.ch', 'www.test.ch2/embed', 'youtube movie by Meier');
                dbDsl.createYoutubePage('5', ['de'], ['health', 'personalDevelopment'], 499, 'www.test3.ch', 'www.test.ch3/embed', 'y movie by Meier');
                dbDsl.createLinkPage('6', ['de'], ['health', 'personalDevelopment'], 508, 'www.test4.ch', 200, 'link by user?');
                dbDsl.createLinkPage('7', ['de'], ['health', 'personalDevelopment'], 510, 'www.test5.ch', null, 'ly by user?');
                dbDsl.createLinkPage('8', ['de'], ['health', 'personalDevelopment'], 509, 'www.test6.ch', null, 'Irgendas mit Meier');
                dbDsl.createBlog('9', '2', ['de'], ['health', 'personalDevelopment'], 511, null, 200, "zuser?");
            });
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Search with forename pages and people in suggestion mode - Return 200', function () {

        dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(['1'], 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

        dbDsl.crateRecommendationsForPage('0', [{userId: '3', created: 507}, {userId: '4', created: 508}, {userId: '5', created: 509}]);
        dbDsl.crateRecommendationsForPage('2', [{userId: '1', created: 507}, {userId: '2', created: 508}]);
        dbDsl.crateRecommendationsForPage('5', [{userId: '1', created: 509}]);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/home/search', {
                    search: 'user?',
                    maxItems: 10,
                    isSuggestion: true
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.length.should.equal(9);
                res.body[0].name.should.equal("user? uMeier5");
                res.body[0].userId.should.equal("5");
                res.body[0].type.should.equal('Freund');
                res.body[0].profileUrl.should.equal('profileImage/5/thumbnail.jpg');

                res.body[1].name.should.equal("user? Meier2");
                res.body[1].userId.should.equal("2");
                should.not.exist(res.body[1].type);
                res.body[1].profileUrl.should.equal('profileImage/2/thumbnail.jpg');

                res.body[2].name.should.equal("user? sMeier6");
                res.body[2].userId.should.equal("6");
                should.not.exist(res.body[2].type);
                res.body[2].profileUrl.should.equal('profileImage/6/thumbnail.jpg');

                res.body[3].title.should.equal("y written by user?");
                res.body[3].pageId.should.equal("2");
                res.body[3].url.should.equal("pages/2/thumbnail.jpg");
                res.body[3].recommendation.summary.numberOfRecommendations.should.equal(2);
                res.body[3].label.should.equal("Book");

                res.body[4].title.should.equal("book written by user?");
                res.body[4].pageId.should.equal("0");
                res.body[4].url.should.equal("pages/0/thumbnail.jpg");
                res.body[4].recommendation.summary.numberOfRecommendations.should.equal(3);
                res.body[4].label.should.equal("Book");

                res.body[5].title.should.equal("link by user?");
                res.body[5].pageId.should.equal("6");
                res.body[5].url.should.equal("pages/6/thumbnail.jpg");
                res.body[5].recommendation.summary.numberOfRecommendations.should.equal(0);
                res.body[5].label.should.equal("Link");

                res.body[6].title.should.equal("ly by user?");
                res.body[6].pageId.should.equal("7");
                should.not.exist(res.body[6].url);
                res.body[6].recommendation.summary.numberOfRecommendations.should.equal(0);
                res.body[6].label.should.equal("Link");

                res.body[7].title.should.equal("youtube movie by user?");
                res.body[7].pageId.should.equal("3");
                res.body[7].linkEmbed.should.equal("www.test.ch/embed");
                res.body[7].recommendation.summary.numberOfRecommendations.should.equal(0);
                res.body[7].label.should.equal("Youtube");

                res.body[8].title.should.equal("zuser?");
                res.body[8].text.should.equal("blog9Text");
                res.body[8].writerName.should.equal("user? Meier2");
                res.body[8].userId.should.equal("2");
                res.body[8].pageId.should.equal("9");
                res.body[8].profileUrl.should.equal('profileImage/2/thumbnail.jpg');
                res.body[8].recommendation.summary.numberOfRecommendations.should.equal(0);
                res.body[8].label.should.equal("Blog");
            });
        });
    });

    it('Search with forename pages and people - Return 200', function () {

        dbDsl.createPrivacyNoContact(null, {profile: false, image: false, profileData: false, contacts: false, pinwall: false});
        dbDsl.createPrivacy(['1'], 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

        dbDsl.crateRecommendationsForPage('2', [{userId: '1', created: 507}]);
        dbDsl.crateRecommendationsForPage('5', [{userId: '1', created: 508}]);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/home/search', {
                    search: 'user?',
                    maxItems: 10,
                    isSuggestion: false
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.length.should.equal(9);
                res.body[0].name.should.equal("user? uMeier5");
                res.body[0].userId.should.equal("5");
                res.body[0].type.should.equal('Freund');
                res.body[0].profileUrl.should.equal('profileImage/default/thumbnail.jpg');

                res.body[1].name.should.equal("user? Meier2");
                res.body[1].userId.should.equal("2");
                should.not.exist(res.body[1].type);
                res.body[1].profileUrl.should.equal('profileImage/default/thumbnail.jpg');

                res.body[2].name.should.equal("user? sMeier6");
                res.body[2].userId.should.equal("6");
                should.not.exist(res.body[2].type);
                res.body[2].profileUrl.should.equal('profileImage/default/thumbnail.jpg');

                res.body[3].title.should.equal("y written by user?");
                res.body[3].pageId.should.equal("2");
                res.body[3].label.should.equal("Book");
                res.body[3].url.should.equal("pages/2/pagePreview.jpg");
                res.body[3].topic.length.should.equals(2);
                res.body[3].topic[0].should.equals('health');
                res.body[3].topic[1].should.equals('personalDevelopment');

                res.body[4].title.should.equal("book written by user?");
                res.body[4].pageId.should.equal("0");
                res.body[4].label.should.equal("Book");
                res.body[4].url.should.equal("pages/0/pagePreview.jpg");
                res.body[4].topic.length.should.equals(2);
                res.body[4].topic[0].should.equals('health');
                res.body[4].topic[1].should.equals('personalDevelopment');

                res.body[5].title.should.equal("link by user?");
                res.body[5].pageId.should.equal("6");
                res.body[5].label.should.equal("Link");
                res.body[5].link.should.equal("www.test4.ch");
                res.body[5].url.should.equal("pages/6/preview.jpg");
                res.body[5].topic.length.should.equals(2);
                res.body[5].topic[0].should.equals('health');
                res.body[5].topic[1].should.equals('personalDevelopment');

                res.body[6].title.should.equal("ly by user?");
                res.body[6].pageId.should.equal("7");
                res.body[6].label.should.equal("Link");
                res.body[6].link.should.equal("www.test5.ch");
                should.not.exist(res.body[6].url);
                res.body[6].recommendation.summary.numberOfRecommendations.should.equal(0);
                res.body[6].topic.length.should.equals(2);
                res.body[6].topic[0].should.equals('health');
                res.body[6].topic[1].should.equals('personalDevelopment');

                res.body[7].title.should.equal("youtube movie by user?");
                res.body[7].pageId.should.equal("3");
                res.body[7].label.should.equal("Youtube");
                res.body[7].linkEmbed.should.equal("www.test.ch/embed");
                res.body[7].topic.length.should.equals(2);
                res.body[7].topic[0].should.equals('health');
                res.body[7].topic[1].should.equals('personalDevelopment');

                res.body[8].title.should.equal("zuser?");
                res.body[8].text.should.equal("blog9Text");
                res.body[8].writerName.should.equal("user? Meier2");
                res.body[8].userId.should.equal("2");
                res.body[8].pageId.should.equal("9");
                res.body[8].profileUrl.should.equal('profileImage/default/thumbnail.jpg');
                res.body[8].recommendation.summary.numberOfRecommendations.should.equal(0);
                res.body[8].label.should.equal("Blog");
            });
        });
    });

    it('Hide user image in contact search, no contact and profile set to false - Return 200', function () {

        dbDsl.createPrivacyNoContact(null, {profile: false, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(['1'], 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/home/search', {
                    search: 'luser tMeier4',
                    maxItems: 10,
                    isSuggestion: true
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.length.should.equal(1);

                res.body[0].name.should.equal("luser tMeier4");
                res.body[0].userId.should.equal("4");
                should.not.exist(res.body[0].type);
                res.body[0].profileUrl.should.equal('profileImage/default/thumbnail.jpg');
            });
        });
    });

    it('Hide user image in contact search, no contact and image set to false - Return 200', function () {

        dbDsl.createPrivacyNoContact(null, {profile: true, image: false, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(['1'], 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/home/search', {
                    search: 'luser tMeier4',
                    maxItems: 10,
                    isSuggestion: true
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.length.should.equal(1);

                res.body[0].name.should.equal("luser tMeier4");
                res.body[0].userId.should.equal("4");
                should.not.exist(res.body[0].type);
                res.body[0].profileUrl.should.equal('profileImage/default/thumbnail.jpg');
            });
        });
    });

    it('Hide user image in contact search, is contact and profile is set to false - Return 200', function () {

        dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(['3'], 'Freund', {profile: false, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createContactConnection('3', '1', 'Freund');

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/home/search', {
                    search: 'tuser Meier3',
                    maxItems: 10,
                    isSuggestion: true
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.length.should.equal(1);

                res.body[0].name.should.equal("tuser Meier3");
                res.body[0].userId.should.equal("3");
                res.body[0].type.should.equal('Freund');
                res.body[0].profileUrl.should.equal('profileImage/default/thumbnail.jpg');
            });
        });
    });

    it('Hide user image in contact search, is contact and image is set to false - Return 200', function () {

        dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(['3'], 'Freund', {profile: true, image: false, profileData: true, contacts: true, pinwall: true});
        dbDsl.createContactConnection('3', '1', 'Freund');

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/home/search', {
                    search: 'tuser Meier3',
                    maxItems: 10,
                    isSuggestion: true
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.length.should.equal(1);

                res.body[0].name.should.equal("tuser Meier3");
                res.body[0].userId.should.equal("3");
                res.body[0].type.should.equal('Freund');
                res.body[0].profileUrl.should.equal('profileImage/default/thumbnail.jpg');
            });
        });
    });

    it('Hide user image in blog search, no contact and profile set to false - Return 200', function () {

        dbDsl.createPrivacyNoContact(null, {profile: false, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(['1'], 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/home/search', {
                    search: 'zuser?',
                    maxItems: 10,
                    isSuggestion: true
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.length.should.equal(1);

                res.body[0].title.should.equal("zuser?");
                res.body[0].pageId.should.equal("9");
                res.body[0].profileUrl.should.equal('profileImage/default/thumbnail.jpg');
                res.body[0].recommendation.summary.numberOfRecommendations.should.equal(0);
                res.body[0].label.should.equal("Blog");
            });
        });
    });

    it('Hide user image in blog search, no contact and image set to false - Return 200', function () {

        dbDsl.createPrivacyNoContact(null, {profile: true, image: false, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(['1'], 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/home/search', {
                    search: 'zuser?',
                    maxItems: 10,
                    isSuggestion: true
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.length.should.equal(1);

                res.body[0].title.should.equal("zuser?");
                res.body[0].pageId.should.equal("9");
                res.body[0].profileUrl.should.equal('profileImage/default/thumbnail.jpg');
                res.body[0].recommendation.summary.numberOfRecommendations.should.equal(0);
                res.body[0].label.should.equal("Blog");
            });
        });
    });

    it('Hide user image in blog search, is contact and profile is set to false - Return 200', function () {

        dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(['2'], 'Freund', {profile: false, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createContactConnection('2', '1', 'Freund');

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/home/search', {
                    search: 'zuser?',
                    maxItems: 10,
                    isSuggestion: true
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.length.should.equal(1);

                res.body[0].title.should.equal("zuser?");
                res.body[0].pageId.should.equal("9");
                res.body[0].profileUrl.should.equal('profileImage/default/thumbnail.jpg');
                res.body[0].recommendation.summary.numberOfRecommendations.should.equal(0);
                res.body[0].label.should.equal("Blog");
            });
        });
    });

    it('Hide user image in blog search, is contact and image is set to false - Return 200', function () {

        dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(['2'], 'Freund', {profile: true, image: false, profileData: true, contacts: true, pinwall: true});
        dbDsl.createContactConnection('2', '1', 'Freund');

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/home/search', {
                    search: 'zuser?',
                    maxItems: 10,
                    isSuggestion: true
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.length.should.equal(1);

                res.body[0].title.should.equal("zuser?");
                res.body[0].pageId.should.equal("9");
                res.body[0].profileUrl.should.equal('profileImage/default/thumbnail.jpg');
                res.body[0].recommendation.summary.numberOfRecommendations.should.equal(0);
                res.body[0].label.should.equal("Blog");
            });
        });
    });
});
