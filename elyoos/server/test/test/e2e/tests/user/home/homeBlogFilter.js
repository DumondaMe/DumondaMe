'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for filtering blog on home screen', function () {

    let requestAgent;

    beforeEach(function () {
        return dbDsl.init(6).then(function () {

            dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

            dbDsl.createBlog('0', {
                blogWriterUserId: '2',
                language: ['de'],
                topic: ['health', 'personalDevelopment'],
                created: 501,
                pictureHeight: 400
            });
            dbDsl.createBlog('1', {blogWriterUserId: '3', language: ['fr'], topic: ['socialDevelopment'], created: 502, pictureHeight: 400});
            dbDsl.createBlog('2', {blogWriterUserId: '3', language: ['en'], topic: ['personalDevelopment'], created: 503, pictureHeight: 400});
            dbDsl.createLinkPage('0', {language: ['de'], topic: ['health', 'personalDevelopment'], modified: 511, link: 'www.host.com/test', heightPreviewImage: 200});
            dbDsl.createYoutubePage('11', {
                language: ['de'], topic: ['health', 'personalDevelopment'], modified: 512, link: 'https://www.youtube.com/watch?v=hTarMdJub0M',
                linkEmbed: 'https://www.youtube.com/embed/hTarMdJub0M'
            });
            dbDsl.createBookPage('12', {language: ['en'], topic: ['health', 'personalDevelopment'], modified: 533, author: 'HansMuster', publishDate: 1000});
            dbDsl.createGenericPage('13', {adminId: '2', language: ['de'], topic: ['health', 'personalDevelopment'], modified: 100}, [{
                description: 'Zuerich',
                lat: 47.376887,
                lng: 8.541694
            }]);

            dbDsl.crateRecommendationsForPage('1', [{userId: '2', created: 504}]);
            dbDsl.crateRecommendationsForPage('2', [{userId: '2', created: 505}]);
            dbDsl.crateRecommendationsForPage('10', [{userId: '2', created: 506}]);
            dbDsl.crateRecommendationsForPage('11', [{userId: '2', created: 507}]);
            dbDsl.crateRecommendationsForPage('13', [{userId: '2', created: 508}]);
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Language and recommendation type filter for blog page', function () {

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
                recommendationType: ['Blog']
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equals(1);
            res.body.pinwall[0].pageId.should.equals('0');
        });
    });

    it('Topic and recommendation type filter for blog', function () {

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
                recommendationType: ['Blog']
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equals(3);
            res.body.pinwall[0].pageId.should.equals('1');
            res.body.pinwall[0].pinwallType.should.equals('Recommendation');
            res.body.pinwall[1].pageId.should.equals('1');
            res.body.pinwall[1].pinwallType.should.equals('Blog');
            res.body.pinwall[2].pageId.should.equals('0');
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
                topic: ['health'],
                recommendationType: ['Blog']
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equals(0);
        });
    });
});
