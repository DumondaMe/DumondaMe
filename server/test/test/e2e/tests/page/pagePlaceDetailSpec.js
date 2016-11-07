'use strict';

var users = require('../util/user');
var dbDsl = require('../util/dbDSL');
var requestHandler = require('../util/request');

describe('Integration Tests for getting place page detail', function () {

    var requestAgent;

    beforeEach(function () {
        return dbDsl.init(3).then(function () {
            dbDsl.createPlacePage('1', '2', ['en', 'de'], ['environmental', 'spiritual'], 100, 'Test1Place', [{
                description: 'Zuerich',
                lat: 47.376887,
                lng: 8.541694
            }]);
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Getting the detail of a place page', function () {

        dbDsl.createPrivacyNoContact(null, {profile: true, image: false, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(['1', '2', '3'], 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

        dbDsl.crateRecommendationsForPage('1', [{userId: '1', created: 500, comment: 'irgendwas'},
            {userId: '2', created: 502, comment: 'irgendwas2'}, {userId: '3', created: 501, comment: 'irgendwas3'}]);

        dbDsl.createContactConnection('1', '2', 'Freund', 500);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/page/detail', {
                pageId: '1',
                label: 'Place'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.page.pageId.should.equals('1');
            res.body.page.title.should.equals('Test1Place');
            res.body.page.description.should.equals('page1Description');
            res.body.page.created.should.equals(100);
            res.body.page.modified.should.equals(100);
            res.body.page.label.should.equals('Place');
            res.body.page.imagePreview.should.equals('pages/1/preview.jpg');
            res.body.page.imageNormal.should.equals('pages/1/normal.jpg');

            res.body.page.topic.length.should.equals(2);
            res.body.page.topic[0].should.equals('environmental');
            res.body.page.topic[1].should.equals('spiritual');
            res.body.page.language.length.should.equals(2);
            res.body.page.language[0].should.equals('en');
            res.body.page.language[1].should.equals('de');
            res.body.page.addresses.length.should.equals(1);
            res.body.page.addresses[0].description.should.equals('Zuerich');
            res.body.page.addresses[0].latitude.should.equals(47.376887);
            res.body.page.addresses[0].longitude.should.equals(8.541694);

            res.body.administrators.list.length.should.equals(1);
            res.body.administrators.list[0].name.should.equals('user Meier2');
            res.body.administrators.list[0].userId.should.equals('2');
            res.body.administrators.list[0].profileUrl.should.equals('profileImage/default/profilePreview.jpg');
            res.body.administrators.isAdmin.should.be.false;

            res.body.recommendation.user.profileUrl.should.equals('profileImage/1/thumbnail.jpg');
            res.body.recommendation.user.comment.should.equals('irgendwas');
            res.body.recommendation.user.recommendationId.should.equals('0');

            res.body.recommendation.summary.contact.numberOfRecommendations.should.equals(1);
            res.body.recommendation.summary.all.numberOfRecommendations.should.equals(3);
        });
    });
});
