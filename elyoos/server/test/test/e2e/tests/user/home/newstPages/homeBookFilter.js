'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for filtering book pages on home screen', function () {

    beforeEach(function () {
        return dbDsl.init(6).then(function () {

            dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

            dbDsl.createBookPage('0', {adminId: '3', language: ['de'], topic: ['health', 'personalDevelopment'], created: 501, author: 'HansMuster', publishDate: 1000});
            dbDsl.createBookPage('1', {language: ['fr'], topic: ['socialDevelopment'], created: 502, author: 'HansMuster2', publishDate: 1001});
            dbDsl.createBookPage('2', {adminId: '2', language: ['en'], topic: ['personalDevelopment'], created: 503, author: 'HansMuster3', publishDate: 1002});
            dbDsl.createLinkPage('10', {language: ['de'], topic: ['health', 'personalDevelopment'], created: 511, link: 'www.host.com/test', heightPreviewImage: 200});
            dbDsl.createYoutubePage('11', {
                language: ['de'], topic: ['health', 'personalDevelopment'], created: 512, link: 'https://www.youtube.com/watch?v=hTarMdJub0M',
                linkEmbed: 'https://www.youtube.com/embed/hTarMdJub0M'
            });

            dbDsl.createBlog('12', {
                blogWriterUserId: '2',
                language: ['en'],
                topic: ['health', 'personalDevelopment'],
                created: 533,
                pictureHeight: 400
            });
            dbDsl.createGenericPage('13', {adminId: '2', language: ['de'], topic: ['health', 'personalDevelopment'], created: 100}, [{
                description: 'Zuerich',
                lat: 47.376887,
                lng: 8.541694
            }]);

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

    it('Language and page type filter for book page', function () {

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.get('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: false,
                order: 'new',
                language: ['de'],
                pageType: ['Book']
            });
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equals(1);
            res.body.pinwall[0].pageId.should.equals('0');
            res.body.pinwall[0].userId.should.equals('3');
        });
    });

    it('Topic and page type filter for book page', function () {

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.get('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: false,
                order: 'new',
                topic: ['health', 'socialDevelopment'],
                pageType: ['Book']
            });
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equals(2);
            res.body.pinwall[0].pageId.should.equals('1');
            res.body.pinwall[0].userId.should.equals('1');
            res.body.pinwall[1].pageId.should.equals('0');
            res.body.pinwall[1].userId.should.equals('3');
        });
    });

    it('Do not show page of a user which has blocked actual user', function () {

        dbDsl.blockUser('2', '1');
        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.get('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: false,
                order: 'new',
                language: ['en'],
                pageType: ['Book']
            });
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equals(0);
        });
    });
});
