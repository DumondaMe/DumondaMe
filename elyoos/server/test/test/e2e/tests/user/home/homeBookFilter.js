'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for filtering book recommendation on home screen', function () {

    let requestAgent;

    beforeEach(function () {
        return dbDsl.init(6).then(function () {

            dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

            dbDsl.createBookPage('0', ['de'], ['health', 'personalDevelopment'], 501, 'HansMuster', 1000);
            dbDsl.createBookPage('1', ['fr'], ['socialDevelopment'], 502, 'HansMuster2', 1001);
            dbDsl.createBookPage('2', ['en'], ['personalDevelopment'], 503, 'HansMuster3', 1002);
            dbDsl.createLinkPage('10', ['de'], ['health', 'personalDevelopment'], 511, 'www.host.com/test', 200, 'linkPageTitle');
            dbDsl.createYoutubePage('11', ['de'], ['health', 'personalDevelopment'], 512, 'https://www.youtube.com/watch?v=hTarMdJub0M',
                'https://www.youtube.com/embed/hTarMdJub0M', 'youtubePage2Title');
            dbDsl.createBlog('12', {
                blogWriterUserId: '2',
                language: ['en'],
                topic: ['health', 'personalDevelopment'],
                created: 533,
                pictureHeight: 400
            });
            dbDsl.createGenericPage('13', '2', ['de'], ['health', 'personalDevelopment'], 100, 'Test1Place', [{
                description: 'Zuerich',
                lat: 47.376887,
                lng: 8.541694
            }]);

            dbDsl.crateRecommendationsForPage('0', [{userId: '2', created: 503}]);
            dbDsl.crateRecommendationsForPage('1', [{userId: '2', created: 504}]);
            dbDsl.crateRecommendationsForPage('2', [{userId: '2', created: 504}]);
            dbDsl.crateRecommendationsForPage('10', [{userId: '2', created: 504}]);
            dbDsl.crateRecommendationsForPage('11', [{userId: '2', created: 504}]);
            dbDsl.crateRecommendationsForPage('13', [{userId: '2', created: 504}]);
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Language and recommendation type filter for book page', function () {

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: false,
                order: 'new',
                language: ['de'],
                recommendationType: ['Book']
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equals(1);
            res.body.pinwall[0].pageId.should.equals('0');
        });
    });

    it('Topic and recommendation type filter for book page', function () {

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: false,
                order: 'new',
                topic: ['health', 'socialDevelopment'],
                recommendationType: ['Book']
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equals(2);
            res.body.pinwall[0].pageId.should.equals('1');
            res.body.pinwall[1].pageId.should.equals('0');
        });
    });

    it('Do not show page of a user how has blocked actual user', function () {

        dbDsl.blockUser('2', '1');
        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: false,
                order: 'new',
                topic: ['health', 'socialDevelopment'],
                recommendationType: ['Book']
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equals(0);
        });
    });
});
