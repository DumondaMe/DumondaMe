'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for getting generic page detail', function () {

    let requestAgent;

    beforeEach(function () {
        return dbDsl.init(3).then(function () {
            dbDsl.createGenericPage('1', '2', ['en', 'de'], ['environmental', 'spiritual'], 100, 'Test1Place', [{
                address: 'Zuerich',
                lat: 47.376887,
                lng: 8.541694,
                addressId: '11'
            }], 'www.elyoos.org');
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Getting the detail of a generic page', function () {

        dbDsl.createPrivacyNoContact(null, {profile: true, image: false, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(['1', '2', '3'], 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

        dbDsl.crateRecommendationsForPage('1', [{userId: '1', created: 500},
            {userId: '2', created: 502}, {userId: '3', created: 501}]);

        dbDsl.createContactConnection('1', '2', 'Freund', 500);

        dbDsl.createPageEventNewAddress('1', {
            eventId: '1', title: 'Event', description: 'Super Event',
            startDate: 500, endDate: 600
        }, {addressId: '13', address: 'Urdorf', lat: 48.05642, lng: 8.36542});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/page/detail', {
                pageId: '1',
                label: 'Generic'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.page.pageId.should.equals('1');
            res.body.page.title.should.equals('Test1Place');
            res.body.page.description.should.equals('page1Description');
            res.body.page.website.should.equals('www.elyoos.org');
            res.body.page.created.should.equals(100);
            res.body.page.modified.should.equals(100);
            res.body.page.label.should.equals('Generic');
            res.body.page.imagePreview.should.equals('pages/1/preview.jpg');
            res.body.page.imageNormal.should.equals('pages/1/normal.jpg');

            res.body.page.topic.length.should.equals(2);
            res.body.page.topic[0].should.equals('environmental');
            res.body.page.topic[1].should.equals('spiritual');
            res.body.page.language.length.should.equals(2);
            res.body.page.language[0].should.equals('en');
            res.body.page.language[1].should.equals('de');
            res.body.page.addresses.length.should.equals(1);
            res.body.page.addresses[0].address.should.equals('Zuerich');
            res.body.page.addresses[0].latitude.should.equals(47.376887);
            res.body.page.addresses[0].longitude.should.equals(8.541694);
            res.body.page.addresses[0].addressId.should.equals('11');

            res.body.administrators.list.length.should.equals(1);
            res.body.administrators.list[0].name.should.equals('user Meier2');
            res.body.administrators.list[0].userId.should.equals('2');
            res.body.administrators.list[0].profileUrl.should.equals('profileImage/default/profilePreview.jpg');
            res.body.administrators.isAdmin.should.be.false;
            res.body.hasEvents.should.be.true;

            res.body.recommendation.user.profileUrl.should.equals('profileImage/1/thumbnail.jpg');
            res.body.recommendation.user.recommendationId.should.equals('0');

            res.body.recommendation.summary.contact.numberOfRecommendations.should.equals(1);
            res.body.recommendation.summary.all.numberOfRecommendations.should.equals(3);
        });
    });
});
