'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for filtering link recommendation on home screen', function () {

    let requestAgent;

    beforeEach(function () {
        return dbDsl.init(6).then(function () {

            dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

            dbDsl.createLinkPage('0', {language: ['de'], topic: ['health', 'personalDevelopment'], modified: 501, link: 'www.host.com/test', heightPreviewImage: 200});
            dbDsl.createLinkPage('1', {language: ['fr'], topic: ['socialDevelopment'], modified: 502, link: 'www.host.com/test1', heightPreviewImage: 200});
            dbDsl.createLinkPage('2', {language: ['en'], topic: ['personalDevelopment'], modified: 503, link: 'www.host.com/test2', heightPreviewImage: 200});
            dbDsl.createBookPage('10', {language: ['en'], topic: ['personalDevelopment'], modified: 504, author: 'HansMuster3', publishDate: 1002});
            dbDsl.createYoutubePage('11', {
                language: ['de'], topic: ['health', 'personalDevelopment'], modified: 512, link: 'https://www.youtube.com/watch?v=hTarMdJub0M',
                linkEmbed: 'https://www.youtube.com/embed/hTarMdJub0M'
            });

            dbDsl.createBlog('12', {blogWriterUserId: '2', language: ['en'], topic: ['health', 'personalDevelopment'], created: 533, pictureHeight: 400});
            dbDsl.createGenericPage('13', {adminId: '2', language: ['de'], topic: ['health', 'personalDevelopment'], modified: 100}, [{
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

    it('Language and recommendation type filter for link page', function () {

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
                recommendationType: ['Link']
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equals(1);
            res.body.pinwall[0].pageId.should.equals('0');
        });
    });

    it('Topic and recommendation type filter for link page', function () {

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
                recommendationType: ['Link']
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equals(2);
            res.body.pinwall[0].pageId.should.equals('1');
            res.body.pinwall[1].pageId.should.equals('0');
        });
    });

    it('Do not show link page of a user how has blocked actual user', function () {

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
                recommendationType: ['Link']
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equals(0);
        });
    });
});
