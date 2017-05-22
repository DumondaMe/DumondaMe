'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for filtering generic recommendation on home screen', function () {

    let requestAgent;

    beforeEach(function () {
        return dbDsl.init(6).then(function () {

            dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

            dbDsl.createGenericPage('0', {adminId: '3', language: ['de'], topic: ['health', 'personalDevelopment'], created: 501}, [{
                description: 'Zuerich',
                lat: 47.376887,
                lng: 8.541694
            }]);
            dbDsl.createGenericPage('1', {adminId: '3', language: ['fr'], topic: ['socialDevelopment'], created: 502}, [{
                description: 'Zuerich',
                lat: 47.376887,
                lng: 8.541694
            }]);
            dbDsl.createGenericPage('2', {adminId: '3', language: ['en'], topic: ['personalDevelopment'], created: 503}, [{
                description: 'Zuerich',
                lat: 47.376887,
                lng: 8.541694
            }]);

            dbDsl.createLinkPage('10', {language: ['de'], topic: ['health', 'personalDevelopment'], created: 511, link: 'www.host.com/test', heightPreviewImage: 200});
            dbDsl.createBookPage('11', {language: ['de'], topic: ['health', 'personalDevelopment'], created: 512, author: 'HansMuster', publishDate: 1000});
            dbDsl.createBlog('12', {blogWriterUserId: '2', language: ['en'], topic: ['health', 'personalDevelopment'], created: 533, pictureHeight: 400});
            dbDsl.createYoutubePage('13', {
                language: ['de'], topic: ['health', 'personalDevelopment'], created: 501, link: 'https://www.youtube.com/watch?v=hTarMdJub0M',
                linkEmbed: 'https://www.youtube.com/embed/hTarMdJub0M'
            });

            dbDsl.crateRecommendationsForPage('0', [{userId: '1', created: 510}, {userId: '2', created: 503}]);
            dbDsl.crateRecommendationsForPage('1', [{userId: '1', created: 510}, {userId: '2', created: 504}]);
            dbDsl.crateRecommendationsForPage('2', [{userId: '1', created: 510}, {userId: '2', created: 504}]);
            dbDsl.crateRecommendationsForPage('10', [{userId: '1', created: 510}, {userId: '2', created: 504}]);
            dbDsl.crateRecommendationsForPage('11', [{userId: '1', created: 510}, {userId: '2', created: 504}]);
            dbDsl.crateRecommendationsForPage('13', [{userId: '1', created: 510}, {userId: '2', created: 504}]);
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Language and recommendation type filter for generic page', function () {

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.get('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: false,
                order: 'new',
                language: ['de'],
                recommendationType: ['Generic']
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equals(1);
            res.body.pinwall[0].pageId.should.equals('0');
            res.body.pinwall[0].userId.should.equals('2');
        });
    });

    it('Topic and recommendation type filter for generic page', function () {

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.get('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: false,
                order: 'new',
                topic: ['health', 'socialDevelopment'],
                recommendationType: ['Generic']
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equals(2);
            res.body.pinwall[0].pageId.should.equals('1');
            res.body.pinwall[0].userId.should.equals('2');
            res.body.pinwall[1].pageId.should.equals('0');
            res.body.pinwall[1].userId.should.equals('2');
        });
    });

    it('Do not show page of a user how has blocked actual user', function () {

        dbDsl.blockUser('2', '1');
        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.get('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: false,
                order: 'new',
                topic: ['health', 'socialDevelopment'],
                recommendationType: ['Generic']
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equals(0);
        });
    });
});
