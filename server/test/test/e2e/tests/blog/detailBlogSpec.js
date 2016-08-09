'use strict';

var users = require('../util/user');
var dbDsl = require('../util/dbDSL');
var requestHandler = require('../util/request');
var should = require('chai').should();

describe('Integration Tests for getting blog details', function () {

    var requestAgent;

    beforeEach(function () {
        return dbDsl.init(4);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting detail for blog not written by the user- Return 200', function () {

        dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createBlog('1', '4', ['en'], ['health'], 5077, ['Freund'], 250);
        dbDsl.crateRecommendationsForBlog('1', [{userId: '1', created: 508}, {userId: '2', created: 509}, {userId: '3', created: 510}]);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/blog/detail', {
                    pageId: '1'
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.name.should.equals('user Meier4');
                res.body.userId.should.equals('4');
                res.body.profileUrl.should.equals('profileImage/4/thumbnail.jpg');
                res.body.recommendedByUser.should.equals(true);
                res.body.created.should.equals(5077);
                res.body.url.should.equals('blog/1/normal.jpg');
                res.body.title.should.equals('blog1Title');
                res.body.text.should.equals('blog1Text');
                res.body.isAdmin.should.equals(false);
                res.body.isPublic.should.equals(false);
                res.body.topic.length.should.equals(1);
                res.body.topic[0].should.equals('health');
                res.body.numberOfRecommendations.should.equals(3);
            });
        });
    });

    it('Getting detail for blog written by the user- Return 200', function () {

        dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createBlog('1', '1', ['en'], ['health'], 5077, null, null);
        dbDsl.crateRecommendationsForBlog('1', [{userId: '2', created: 509}, {userId: '3', created: 510}]);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/blog/detail', {
                    pageId: '1'
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.name.should.equals('user Meier');
                res.body.userId.should.equals('1');
                res.body.profileUrl.should.equals('profileImage/1/thumbnail.jpg');
                res.body.recommendedByUser.should.equals(false);
                res.body.created.should.equals(5077);
                should.not.exist(res.body.url);
                res.body.title.should.equals('blog1Title');
                res.body.text.should.equals('blog1Text');
                res.body.isAdmin.should.equals(true);
                res.body.isPublic.should.equals(true);
                res.body.topic.length.should.equals(1);
                res.body.topic[0].should.equals('health');
                res.body.numberOfRecommendations.should.equals(2);
            });
        });
    });
});
