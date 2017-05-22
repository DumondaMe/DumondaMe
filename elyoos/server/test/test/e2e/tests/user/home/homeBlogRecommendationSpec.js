'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for getting recommended blogs on home screen for a user', function () {

    let requestAgent;

    beforeEach(function () {

        return dbDsl.init(4);
    });

    afterEach(function () {
        return requestHandler.logout();
    });
    

    it('Showing latest blog recommendation of contact when user is writer of blog', function () {

        dbDsl.createPrivacyNoContact(['1', '2', '3'], {profile: true, image: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(['1', '2', '3'], 'Freund', {profile: true, image: true, contacts: true, pinwall: true});
        dbDsl.createContactConnection('1', '2', 'Freund', 400);
        dbDsl.createContactConnection('2', '1', 'Freund', 400);
        dbDsl.createBlog('1', {blogWriterUserId: '1', language: ['de'], topic: ['health', 'personalDevelopment'], created: 501, pictureHeight: 200});
        dbDsl.crateRecommendationsForBlog('1', [{userId: '2', created: 503}, {userId: '3', created: 502}, {userId: '4', created: 502}]);

        return dbDsl.sendToDb().then(function () {
                return requestHandler.login(users.validUser);
            }).then(function (agent) {
                requestAgent = agent;
                return requestHandler.get('/api/user/home', {
                    skipBlog: 0,
                    skipRecommendation: 0,
                    maxItems: 10,
                    onlyContact: false,
                    order: 'new'
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(2);
                res.body.pinwall[0].pinwallType.should.equals('Recommendation');
                res.body.pinwall[0].label.should.equals('Blog');
                res.body.pinwall[0].pageId.should.equals('1');
                res.body.pinwall[0].writerName.should.equals('user Meier');
                res.body.pinwall[0].writerUserId.should.equals('1');
                res.body.pinwall[0].name.should.equals('user Meier2');
                res.body.pinwall[0].userId.should.equals('2');
                res.body.pinwall[0].recommendedByUser.should.equals(false);
                res.body.pinwall[0].thisRecommendationByUser.should.equals(false);
                res.body.pinwall[0].created.should.equals(503);
                res.body.pinwall[0].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
                res.body.pinwall[0].heightPreviewImage.should.equals(200);
                res.body.pinwall[0].previewUrl.should.equals('blog/1/preview.jpg');
                res.body.pinwall[0].title.should.equals('blog1Title');
                res.body.pinwall[0].text.should.equals('blog1Text');
                res.body.pinwall[0].isAdmin.should.equals(true);
                res.body.pinwall[0].topic.length.should.equals(2);
                res.body.pinwall[0].topic[0].should.equals('health');
                res.body.pinwall[0].topic[1].should.equals('personalDevelopment');
                res.body.pinwall[0].totalNumberOfRecommendations.should.equals(3);

                res.body.pinwall[1].pinwallType.should.equals('Blog');
                res.body.pinwall[1].pageId.should.equals('1');
                res.body.pinwall[1].name.should.equals('user Meier');
                res.body.pinwall[1].forename.should.equals('user');
                res.body.pinwall[1].userId.should.equals('1');
                res.body.pinwall[1].created.should.equals(501);
                res.body.pinwall[1].profileUrl.should.equals('profileImage/1/thumbnail.jpg');
                res.body.pinwall[1].heightPreviewImage.should.equals(200);
                res.body.pinwall[1].previewUrl.should.equals('blog/1/preview.jpg');
                res.body.pinwall[1].title.should.equals('blog1Title');
                res.body.pinwall[1].text.should.equals('blog1Text');
                res.body.pinwall[1].isAdmin.should.equals(true);
                res.body.pinwall[1].isPublic.should.equals(true);
                res.body.pinwall[1].topic.length.should.equals(2);
                res.body.pinwall[1].topic[0].should.equals('health');
                res.body.pinwall[1].topic[1].should.equals('personalDevelopment');
                res.body.pinwall[1].totalNumberOfRecommendations.should.equals(3);
                res.body.pinwall[1].recommendedByUser.should.equals(false);
            });
    });

    it('Showing latest blog recommendation of contact when user is not writer of blog', function () {

        dbDsl.createPrivacyNoContact(['1', '2', '3'], {profile: true, image: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(['1', '2', '3'], 'Freund', {profile: true, image: true, contacts: true, pinwall: true});
        dbDsl.createContactConnection('1', '2', 'Freund', 400);
        dbDsl.createContactConnection('1', '3', 'Freund', 400);
        dbDsl.createBlog('1', {blogWriterUserId: '2', language: ['de'], topic: ['health', 'personalDevelopment'], created: 501, pictureHeight: 200});
        dbDsl.crateRecommendationsForBlog('1', [{userId: '1', created: 503}, {userId: '3', created: 504}]);

        return dbDsl.sendToDb().then(function () {
                return requestHandler.login(users.validUser);
            }).then(function (agent) {
                requestAgent = agent;
                return requestHandler.get('/api/user/home', {
                    skipBlog: 0,
                    skipRecommendation: 0,
                    maxItems: 10,
                    onlyContact: true,
                    order: 'new'
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(2);
                res.body.pinwall[0].pinwallType.should.equals('Recommendation');
                res.body.pinwall[0].label.should.equals('Blog');
                res.body.pinwall[0].pageId.should.equals('1');
                res.body.pinwall[0].writerName.should.equals('user Meier2');
                res.body.pinwall[0].writerUserId.should.equals('2');
                res.body.pinwall[0].name.should.equals('user Meier3');
                res.body.pinwall[0].userId.should.equals('3');
                res.body.pinwall[0].recommendedByUser.should.equals(true);
                res.body.pinwall[0].thisRecommendationByUser.should.equals(false);
                res.body.pinwall[0].userRecommendationId.should.equals('0');
                res.body.pinwall[0].created.should.equals(504);
                res.body.pinwall[0].profileUrl.should.equals('profileImage/3/thumbnail.jpg');
                res.body.pinwall[0].heightPreviewImage.should.equals(200);
                res.body.pinwall[0].previewUrl.should.equals('blog/1/preview.jpg');
                res.body.pinwall[0].text.should.equals('blog1Text');
                res.body.pinwall[0].title.should.equals('blog1Title');
                res.body.pinwall[0].isAdmin.should.equals(false);
                res.body.pinwall[0].topic.length.should.equals(2);
                res.body.pinwall[0].topic[0].should.equals('health');
                res.body.pinwall[0].topic[1].should.equals('personalDevelopment');
                res.body.pinwall[0].totalNumberOfRecommendations.should.equals(2);

                res.body.pinwall[1].pinwallType.should.equals('Blog');
                res.body.pinwall[1].pageId.should.equals('1');
                res.body.pinwall[1].name.should.equals('user Meier2');
                res.body.pinwall[1].forename.should.equals('user');
                res.body.pinwall[1].userId.should.equals('2');
                res.body.pinwall[1].created.should.equals(501);
                res.body.pinwall[1].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
                res.body.pinwall[1].heightPreviewImage.should.equals(200);
                res.body.pinwall[1].previewUrl.should.equals('blog/1/preview.jpg');
                res.body.pinwall[1].title.should.equals('blog1Title');
                res.body.pinwall[1].text.should.equals('blog1Text');
                res.body.pinwall[1].isAdmin.should.equals(false);
                res.body.pinwall[1].isPublic.should.equals(true);
                res.body.pinwall[1].topic.length.should.equals(2);
                res.body.pinwall[1].topic[0].should.equals('health');
                res.body.pinwall[1].topic[1].should.equals('personalDevelopment');
                res.body.pinwall[1].totalNumberOfRecommendations.should.equals(2);
                res.body.pinwall[1].recommendedByUser.should.equals(true);
                res.body.pinwall[1].userRecommendationId.should.equals('0');
            });
    });

    it('Not showing blog recommended by user', function () {

        dbDsl.createPrivacyNoContact(['1', '2', '3'], {profile: true, image: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(['1', '2', '3'], 'Freund', {profile: true, image: true, contacts: true, pinwall: true});

        dbDsl.createBlog('1', {blogWriterUserId: '2', language: ['de'], topic: ['health', 'personalDevelopment'], created: 501, pictureHeight: 200});
        dbDsl.crateRecommendationsForBlog('1', [{userId: '1', created: 503}]);

        return dbDsl.sendToDb().then(function () {
                return requestHandler.login(users.validUser);
            }).then(function (agent) {
                requestAgent = agent;
                return requestHandler.get('/api/user/home', {
                    skipBlog: 0,
                    skipRecommendation: 0,
                    maxItems: 10,
                    onlyContact: true,
                    order: 'new'
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(0);
            });
    });

    it('Not showing blog recommendation when user is not included in privacy group', function () {

        dbDsl.createPrivacyNoContact(['1', '2', '3'], {profile: true, image: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(['1', '2', '3'], 'Freund', {profile: true, image: true, contacts: true, pinwall: true});
        dbDsl.createContactConnection('1', '2', 'Freund', 400);
        dbDsl.createContactConnection('2', '3', 'Freund', 400);
        dbDsl.createBlog('1', {blogWriterUserId: '3', language: ['de'], topic: ['health', 'personalDevelopment'], created: 501, visible: ['Freund'], pictureHeight: 200});
        dbDsl.crateRecommendationsForBlog('1', [{userId: '2', created: 503}]);

        return dbDsl.sendToDb().then(function () {
                return requestHandler.login(users.validUser);
            }).
            then(function (agent) {
                requestAgent = agent;
                return requestHandler.get('/api/user/home', {
                    skipBlog: 0,
                    skipRecommendation: 0,
                    maxItems: 10,
                    onlyContact: true,
                    order: 'new'
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(0);
            });
    });

    it('Not showing blog recommendation when contact HAS_PRIVACY_NO_CONTACT pinwall is set to false', function () {

        dbDsl.createPrivacyNoContact(['1', '2', '3'], {profile: true, image: true, contacts: true, pinwall: false});
        dbDsl.createPrivacy(['1', '2', '3'], 'Freund', {profile: true, image: true, contacts: true, pinwall: true});
        dbDsl.createContactConnection('1', '2', 'Freund', 400);
        dbDsl.createContactConnection('2', '3', 'Freund', 400);
        dbDsl.createBlog('1', {blogWriterUserId: '3', language: ['de'], topic: ['health', 'personalDevelopment'], created: 501, pictureHeight: 200});
        dbDsl.crateRecommendationsForBlog('1', [{userId: '2', created: 503}]);

        return dbDsl.sendToDb().then(function () {
                return requestHandler.login(users.validUser);
            }).
            then(function (agent) {
                requestAgent = agent;
                return requestHandler.get('/api/user/home', {
                    skipBlog: 0,
                    skipRecommendation: 0,
                    maxItems: 10,
                    onlyContact: true,
                    order: 'new'
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(0);
            });
    });

    it('Not showing blog recommendation when contact HAS_PRIVACY_NO_CONTACT profile is set to false', function () {

        dbDsl.createPrivacyNoContact(['1', '2', '3'], {profile: false, image: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(['1', '2', '3'], 'Freund', {profile: true, image: true, contacts: true, pinwall: true});
        dbDsl.createContactConnection('1', '2', 'Freund', 400);
        dbDsl.createContactConnection('2', '3', 'Freund', 400);
        dbDsl.createBlog('1', {blogWriterUserId: '3', language: ['de'], topic: ['health', 'personalDevelopment'], created: 501, pictureHeight: 200});
        dbDsl.crateRecommendationsForBlog('1', [{userId: '2', created: 503}]);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).
        then(function (agent) {
            requestAgent = agent;
            return requestHandler.get('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: true,
                order: 'new'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equals(0);
        });
    });


    it('Not showing blog recommendation when contact HAS_PRIVACY pinwall is set to false', function () {

        dbDsl.createPrivacyNoContact(['1', '2', '3'], {profile: true, image: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(['1', '2', '3'], 'Freund', {profile: true, image: true, contacts: true, pinwall: false});
        dbDsl.createContactConnection('1', '2', 'Freund', 400);
        dbDsl.createContactConnection('2', '1', 'Freund', 400);
        dbDsl.createContactConnection('2', '3', 'Freund', 400);
        dbDsl.createBlog('1', {blogWriterUserId: '3', language: ['de'], topic: ['health', 'personalDevelopment'], created: 501, pictureHeight: 200});
        dbDsl.crateRecommendationsForBlog('1', [{userId: '2', created: 503}]);

        return dbDsl.sendToDb().then(function () {
                return requestHandler.login(users.validUser);
            }).
            then(function (agent) {
                requestAgent = agent;
                return requestHandler.get('/api/user/home', {
                    skipBlog: 0,
                    skipRecommendation: 0,
                    maxItems: 10,
                    onlyContact: true,
                    order: 'new'
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(0);
            });
    });

    it('Not showing blog recommendation when user is blocked by contact', function () {

        dbDsl.createPrivacyNoContact(['1', '2', '3'], {profile: true, image: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(['1', '2', '3'], 'Freund', {profile: true, image: true, contacts: true, pinwall: true});
        dbDsl.createContactConnection('1', '2', 'Freund', 400);
        dbDsl.createContactConnection('2', '3', 'Freund', 400);
        dbDsl.createBlog('1', {blogWriterUserId: '3', language: ['de'], topic: ['health', 'personalDevelopment'], created: 501, pictureHeight: 200});
        dbDsl.crateRecommendationsForBlog('1', [{userId: '2', created: 503}]);
        dbDsl.blockUser('2', '1');

        return dbDsl.sendToDb().then(function () {
                return requestHandler.login(users.validUser);
            }).
            then(function (agent) {
                requestAgent = agent;
                return requestHandler.get('/api/user/home', {
                    skipBlog: 0,
                    skipRecommendation: 0,
                    maxItems: 10,
                    onlyContact: true,
                    order: 'new'
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(0);
            });
    });

    it('Not showing blog recommendation when user is blocked by writer of the blog', function () {

        dbDsl.createPrivacyNoContact(['1', '2', '3'], {profile: true, image: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(['1', '2', '3'], 'Freund', {profile: true, image: true, contacts: true, pinwall: true});
        dbDsl.createContactConnection('1', '2', 'Freund', 400);
        dbDsl.createContactConnection('2', '3', 'Freund', 400);
        dbDsl.createBlog('1', {blogWriterUserId: '3', language: ['de'], topic: ['health', 'personalDevelopment'], created: 501, pictureHeight: 200});
        dbDsl.crateRecommendationsForBlog('1', [{userId: '2', created: 503}]);
        dbDsl.blockUser('3', '1');

        return dbDsl.sendToDb().then(function () {
                return requestHandler.login(users.validUser);
            }).
            then(function (agent) {
                requestAgent = agent;
                return requestHandler.get('/api/user/home', {
                    skipBlog: 0,
                    skipRecommendation: 0,
                    maxItems: 10,
                    onlyContact: true,
                    order: 'new'
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(0);
            });
    });
});
