'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let should = require('chai').should();

describe('Integration Tests for getting blog details', function () {

    beforeEach(function () {
        return dbDsl.init(4);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting detail for blog not written by the user- Return 200', function () {

        dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(null, 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(null, 'Bekannter', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createContactConnection('1', '2', 'Freund', 500);
        dbDsl.createBlog('1', {blogWriterUserId: '4', language: ['en'], topic: ['health'], created: 5077, visible: ['Freund', 'Bekannter'], pictureHeight: 250, modified: 5078});
        dbDsl.crateRecommendationsForBlog('1', [{userId: '1', created: 508}, {userId: '2', created: 509}, {userId: '3', created: 510}]);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function () {
                return requestHandler.get('/api/page/detail', {
                    pageId: '1',
                    label: 'Blog'
                });
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.page.pageId.should.equals('1');
                res.body.page.name.should.equals('user Meier4');
                res.body.page.userId.should.equals('4');
                res.body.page.profileUrl.should.equals('profileImage/4/thumbnail.jpg');
                res.body.page.recommendedByUser.should.equals(true);
                res.body.page.created.should.equals(5077);
                res.body.page.modified.should.equals(5078);
                res.body.page.url.should.equals('blog/1/normal.jpg');
                res.body.page.title.should.equals('blog1Title');
                res.body.page.text.should.equals('blog1Text');
                res.body.page.isAdmin.should.equals(false);
                res.body.page.isPublic.should.equals(false);
                res.body.page.visible.length.should.equals(2);
                res.body.page.visible[0].should.equals('Freund');
                res.body.page.visible[1].should.equals('Bekannter');
                res.body.page.language.length.should.equals(1);
                res.body.page.language[0].should.equals('en');

                res.body.page.topic.length.should.equals(1);
                res.body.page.topic[0].should.equals('health');

                res.body.recommendation.user.created.should.equals(508);
                res.body.recommendation.user.recommendationId.should.equals('0');

                res.body.recommendation.summary.contact.numberOfRecommendations.should.equals(1);
                res.body.recommendation.summary.all.numberOfRecommendations.should.equals(3);
            });
        });
    });

    it('Getting detail for blog written by the user- Return 200', function () {

        dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createBlog('1', {blogWriterUserId: '1', language: ['en'], topic: ['health'], created: 5077});
        dbDsl.crateRecommendationsForBlog('1', [{userId: '2', created: 509}, {userId: '3', created: 510}]);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function () {
                return requestHandler.get('/api/page/detail', {
                    pageId: '1',
                    label: 'Blog'
                });
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.page.pageId.should.equals('1');
                res.body.page.name.should.equals('user Meier');
                res.body.page.userId.should.equals('1');
                res.body.page.profileUrl.should.equals('profileImage/1/thumbnail.jpg');
                res.body.page.recommendedByUser.should.equals(false);
                res.body.page.created.should.equals(5077);
                should.not.exist(res.body.page.url);
                res.body.page.title.should.equals('blog1Title');
                res.body.page.text.should.equals('blog1Text');
                res.body.page.isAdmin.should.equals(true);
                res.body.page.isPublic.should.equals(true);
                res.body.page.topic.length.should.equals(1);
                res.body.page.topic[0].should.equals('health');
                res.body.page.language.length.should.equals(1);
                res.body.page.language[0].should.equals('en');

                res.body.recommendation.summary.contact.numberOfRecommendations.should.equals(0);
                res.body.recommendation.summary.all.numberOfRecommendations.should.equals(2);
            });
        });
    });
});